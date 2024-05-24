<script>
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const user1 = localStorage.getItem("username")
        const user2 = ref('')
        const msgContent = ref('');
        const chatMessageLists = ref({});

        async function fetchChatsPeriodically() {
            await fetchChats();
            if(user2.value !== '') showChatMessages();
            setInterval(fetchChats, 10000);
        }

        async function fetchChats() {
            try {
                // GET request to visualize all chats corresponding to the user given in the front-end
                const ul = document.getElementById('chatsList');
                const resp = await fetch(`http://localhost:3000/chats/${user1}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                while (ul.firstChild) {
                    ul.removeChild(ul.lastChild);
                }

                const json = await resp.json();

                json.forEach(chat => {
                    let li = document.createElement('li');
                    let user2Id = (chat.receiverId === user1) ? chat.senderId : chat.receiverId;
                    li.textContent = user2Id;
                    ul.appendChild(li);

                    if (!chatMessageLists.value[user2Id]) {
                        chatMessageLists.value[user2Id] = chat.messageList;
                    }
                });
            } catch (ex) {
                // in case of exception from the backend request, log the error 
                console.error(ex);
            }
        }

        function showChatMessages() {
            const ul = document.getElementById('chat');

            if (chatMessageLists.value[user2]) {
                while (ul.firstChild) {
                    ul.removeChild(ul.lastChild);
                }
            
                chatMessageLists.value[user2].forEach(chat => {
                    let li = document.createElement('li');
                    li.textContent = chat.content;
                    ul.appendChild(li);
                });
            } else {
                fetchChatMessages();
            }
        }

        async function fetchChatMessages() {
            try {
                const ul = document.getElementById('chat');
                const resp = await fetch(`http://localhost:3000/chats/${user1}/${user2.value}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                while (ul.firstChild) {
                    ul.removeChild(ul.lastChild);
                }

                const json = await resp.json();
                json.forEach(message => {
                    let li = document.createElement('li');
                    li.textContent = message.content;
                    ul.appendChild(li);
                });

            } catch (ex) {
                // in case of exception from the backend request, log the error 
                console.error(ex);
            }
        }

        async function createChat() {
            const chat_config = {
                senderId: user1,
                receiverId: user2.value,
            };

            try {
                const resp = await fetch(`http://localhost:3000/chats/${user1}/addChat/${user2.value}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "X-Auth-Token": localStorage.getItem("token") },
                    body: JSON.stringify(chat_config),
                });
                const json = await resp.json();
                console.log(json);

                const ul = document.getElementById('chatsList');
                let li = document.createElement('li');
                li.textContent = chat_config.receiverId;
                ul.appendChild(li);

                chatMessageLists.value[chat_config.receiverId] = [];
            }   
            catch (ex) {
                console.error(ex);
            }
        }

        async function publishMessage() {
            const message_config = {
                senderId: user1,
                receiverId: user2.value,
                content: msgContent.value,
                timestamp: new Date().toISOString()
            };

            try {
                const resp = await fetch(`http://localhost:3000/chats/${user1}/addMessage/${user2.value}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "X-Auth-Token": localStorage.getItem("token") },
                    body: JSON.stringify(message_config),
                });
                const json = await resp.json();
                console.log(json);

                if(!chatMessageLists.value[message_config.receiverId]){
                    const ul = document.getElementById('chatsList');
                    let li = document.createElement('li');
                    li.textContent = chat_config.receiverId;
                    ul.appendChild(li);

                    chatMessageLists.value[message_config.receiverId] = [];
                }

                chatMessageLists.value[message_config.receiverId].push(message_config);

                showChatMessages();
            }   
            catch (ex) {
                console.error(ex);
            }
        }

        onMounted(fetchChatsPeriodically);

        return {
            user1,
            user2,
            msgContent,
            chatMessageLists,
            showChatMessages,
            fetchChatMessages,
            createChat,
            publishMessage,
        };
    }
}
</script>

<template>

<h2 class="green">Lista chat</h2>
<div class="UserChats">
    <li id="chatsList"></li>
</div><br><br>

<form class="visualizeChatForm">
    <h2 class="green">Visualizza chat</h2>
    <div class="input">
        <label class="tag" for="receiverAm">Utente:</label><br>
        <input id="receiverAm" v-model="user2" placeholder="Inserisci destinatario qui"></input>
    </div>

    <div class="buttons">
        <button class="button" type="button" @click="showChatMessages()">Visualizza chat</button>
        <button class="button" type="button" @click="createChat()">Crea chat</button>
    </div>

    <br><br><div class="chatMessages">
        <li id="chat"></li>
    </div>
</form>


<form class="visualizeChatForm">
    <h2 class="green">Pubblica messaggio</h2>
    <div class="inputGroup">
        <div class="textarea">
            <label class="tag" for="content">contenuto:</label><br>
            <textarea id="content" v-model="msgContent" placeholder="Inserisci contenuto qui..."></textarea>
        </div>
    </div>

    <h2><button class="button" type="button" @click="publishMessage()">Pubblica messaggio</button></h2>
</form>
</template>
  
<style>
  .placeholder-style::placeholder {
        color: #ccc;
    }
    h2 {
        font-weight: 500;
        font-size: 2.0rem;
        padding: 10px;
        margin-bottom: 10px;
    }
    .visualizeChatForm {
        border-radius: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        outline: none;
        width: 350px;
        margin-top: 15px;
        border-radius: 20px;
    }
    .buttons {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }
   .button {
        flex: 1;
        font-size: 1.2rem;
        width: 130px;
        height: auto;
        border-radius: 20px;
        border: none;
        margin-left: 15px;
        padding: 10px;
        outline: none;
        background-color: hsla(160, 100%, 37%, 1);
        color: white;
        cursor: pointer;
    }
    .button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    .inputGroup {
        text-align: left;
        margin-top: 15px;
    }
    .visualizeChatForm .tag {
        font-weight: 500;
        display: inline-block;
        width: 90px;
        margin-bottom: 5px;
        color: white;
    }
    .visualizeChatForm input,
    .visualizeChatForm select,
    .visualizeChatForm textarea {
        width: 200px;
        height: 40px;
        margin-bottom: 15px;
        margin-top: 15px;
        border-radius: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        outline: none;
    }
    .visualizeChatForm textarea {
        width: 300px;
        height: 100px;
    }
</style>