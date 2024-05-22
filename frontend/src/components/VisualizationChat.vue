<script>
import { ref, onMounted } from 'vue';

export default {
    setup() {
        const receiverVc = ref('');
        const receiverAm = ref('');
        const msgContent = ref('');

        async function visualizeChat() {
            const users = {
                sender: localStorage.getItem("username"),
                receiver: receiverVc.value,
            };

            try {
                // GET request to visualize the chat corresponding to the two users given in the front-end
                const ul = document.getElementById('chat');
                const queryString = new URLSearchParams(users).toString();
                const resp = await fetch(`http://localhost:3000/chats/messages?${queryString}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                while (ul.firstChild) {
                    ul.removeChild(ul.lastChild);
                }

                const json = await resp.json();
                json.forEach(chat => {
                    let li = document.createElement('li');
                    li.textContent = chat.content;
                    ul.appendChild(li);
                });

                showChats();
            } catch (ex) {
                // in case of exception from the backend request, log the error 
                console.error(ex);
            }
        }

        async function showChats() {
            const user = localStorage.getItem("username");

            try {
                // GET request to visualize all chats corresponding to the user given in the front-end
                const ul = document.getElementById('chatsList');
                const queryString = new URLSearchParams({ user }).toString();
                const resp = await fetch(`http://localhost:3000/chats/UserChats?${queryString}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                while (ul.firstChild) {
                    ul.removeChild(ul.lastChild);
                }

                const json = await resp.json();
                json.forEach(chat => {
                    let li = document.createElement('li');
                    if(chat.receiverId == user){
                        li.textContent = chat.senderId;
                    }else li.textContent = chat.receiverId;
                    ul.appendChild(li);
                });
            } catch (ex) {
                // in case of exception from the backend request, log the error 
                console.error(ex);
            }
        }

        async function publishMessage() {
            // create a new message, reading the input given by the user in the front-end
            const message_config = {
                senderId: localStorage.getItem("username"),
                receiverId: receiverAm.value,
                content: msgContent.value,
                timestamp: new Date().toISOString()
            };

            try {
                // POST request to upload the message on the Database
                const resp = await fetch("http://localhost:3000/chats/addMessage", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "X-Auth-Token": localStorage.getItem("token") },
                    body: JSON.stringify(message_config),
                });
                const json = await resp.json();
                console.log(json);

                // Refresh the chats after publishing a new message
                visualizeChat();
                showChats();
            }   
            catch (ex) {
                // in case of exception from the backend request, log the error 
                console.error(ex);
            }
        }

        onMounted(showChats);

        return {
            receiverVc,
            receiverAm,
            msgContent,
            visualizeChat,
            publishMessage,
        };
    }
}
</script>

<template>

<div class="UserChats">
    <li id="chatsList"></li>
</div>

<form class="visualizeChatForm">
    <h2 class="green">Visualizza chat</h2>
    <div class="inputGroup">
        <div class="input">
            <label class="tag" for="receiverVc">Destinatario:</label><br>
            <input id="receiverVc" v-model="receiverVc" placeholder="Inserisci destinatario qui"></input>
        </div>
    </div>

    <h2><button class="button" type="button" @click="visualizeChat()">Visualizza chat</button></h2>
</form>

<div class="chatMessages">
    <li id="chat"></li>
</div>

<form class="visualizeChatForm">
    <h2 class="green">Pubblica messaggio</h2>
    <div class="inputGroup">
        <div class="input">
            <label class="tag" for="receiverAm">Destinarario:</label><br>
            <input id="receiverAm" v-model="receiverAm" placeholder="Inserisci destinatario qui"></input>
        </div>
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
    .button{
        font-weight: 500;
        font-size: 1.2rem;
        padding: 10px;
        outline: none;
        width: auto;
        height: 50px;
        border-radius: 20px;
        border: none;
        margin-top: 30px;
        margin-bottom: 15px;
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