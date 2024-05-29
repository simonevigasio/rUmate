<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { io } from 'socket.io-client';
import { isNull } from 'lodash';

export default {
    setup() {
        const user1 = localStorage.getItem("username");
        const user2 = ref('');
        const msgContent = ref('');
        const chatMessageLists = ref({});
        const socket = io('http://localhost:3000');

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("receiveMessage", (message) => {
            console.log("Message received: ", message);
            if(message.senderId !== user1){
                if (!chatMessageLists.value[message.senderId]) {
                    const form = document.getElementById('chatsList');
                    let p = document.createElement('p');

                    p.style.fontWeight = "500";
                    p.style.textAlign = "left";
                    p.style.display = "block";
                    p.style.color = "white";
                    p.style.marginLeft = "20px";

                    const node_chat = document.createTextNode(message.senderId);
                    p.appendChild(node_chat);
                    form.appendChild(p);

                    chatMessageLists.value[message.senderId] = [];
                }
                chatMessageLists.value[message.senderId].push(message);
            }
            else if(message.receiverId !== user1){
                if (!chatMessageLists.value[message.receiverId]) {
                    const form = document.getElementById('chatsList');
                    let p = document.createElement('p');

                    p.style.fontWeight = "500";
                    p.style.textAlign = "left";
                    p.style.display = "block";
                    p.style.color = "white";
                    p.style.marginLeft = "20px";

                    const node_chat = document.createTextNode(message.receiverId);
                    p.appendChild(node_chat);
                    form.appendChild(p);

                    chatMessageLists.value[message.receiverId] = [];
                }
                chatMessageLists.value[message.receiverId].push(message);
            }

            if (user2.value === message.senderId || user2.value === message.receiverId) {
                showChatMessages();
            }
        });

        async function publishMessage() {
            const message_config = {
                senderId: user1,
                receiverId: user2.value,
                content: msgContent.value,
                timestamp: new Date().toISOString()
            };

            msgContent.value = '';

            try {
                const resp = await fetch(`http://localhost:3000/chats/${user1}/addMessage/${user2.value}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "X-Auth-Token": localStorage.getItem("token") },
                    body: JSON.stringify(message_config),
                });
                const json = await resp.json();
                console.log(json);

                if (!chatMessageLists.value[message_config.receiverId]) {
                    chatMessageLists.value[message_config.receiverId] = [];
                }

                socket.emit("sendMessage", message_config);

            } catch (ex) {
                console.error(ex);
            }
        }

        async function fetchChats() {
            try {
                const user = localStorage.getItem("username");
                user2.value = null;
                const form = document.getElementById('chatsList');
                const resp = await fetch(`http://localhost:3000/chats/${user}`, {
                            method: "GET",
                            headers: { "Content-Type": "application/json" },
                        });

                const json = await resp.json();
                
                while (form.firstChild) {
                    form.removeChild(form.lastChild);
                }

                json.map(function(chat) {
                    let user2Id = (chat.receiverId === user) ? chat.senderId : chat.receiverId;

                    let fieldset = document.createElement('fieldset');

                    fieldset.style.padding = "10px";
                    fieldset.style.outline = "none";
                    fieldset.style.width = "auto";
                    fieldset.style.borderRadius = "5px";

                    let a_chat = document.createElement('a');

                    a_chat.style.fontWeight = "500";
                    a_chat.style.textAlign = "left";
                    a_chat.style.display = "block";
                    a_chat.style.color = "hsla(160, 100%, 37%, 1)";
                    a_chat.style.marginLeft = "20px";

                    const node_chat = document.createTextNode(user2Id);

                    a_chat.appendChild(node_chat);
                    a_chat.onclick = function() { 
                        user2.value = user2Id;
                        showChatMessages();
                    };

                    fieldset.appendChild(a_chat);

                    form.appendChild(fieldset);
                    socket.emit("joinRoom", { user1, user2: user2Id });
                });
            }
            catch (ex) {
                console.error(ex);
            }
        }

        function showChatMessages() {
            if (chatMessageLists.value[user2.value]) {
                const form = document.getElementById('chatMessages');
                let h2_name = document.createElement('h2');

                h2_name.style.fontWeight = "500";
                h2_name.style.fontSize = "2.0rem";
                h2_name.style.padding = "10px";
                h2_name.style.marginBottom ="5px";

                let fieldset = document.createElement('fieldset');

                fieldset.style.padding = "10px";
                fieldset.style.outline = "none";
                fieldset.style.width = "auto";
                fieldset.style.borderRadius = "5px";

                while (form.firstChild) {
                    form.removeChild(form.lastChild);
                }
                const node_name = document.createTextNode(user2.value);
                h2_name.appendChild(node_name);
                h2_name.classList.add("green")
                form.appendChild(h2_name);

                chatMessageLists.value[user2.value].forEach(message => {
                    let p = document.createElement('p');

                    p.style.fontWeight = "500";
                    p.style.textAlign = "left";
                    p.style.display = "block";
                    p.style.color = "white";

                    const node_chat = document.createTextNode(message.content);
                    p.appendChild(node_chat);
                    let textStyle = (message.senderId === user1) ? "right" : "left";
                    p.style.textAlign = textStyle;
                    fieldset.appendChild(p);
                    fieldset.appendChild(p);
                });
                form.appendChild(fieldset);
            } else {
                fetchChatMessages();
            }
        }

        async function fetchChatMessages() {
            try {
                const form = document.getElementById('chatMessages');
                let h2_name = document.createElement('h2');

                h2_name.style.fontWeight = "500";
                h2_name.style.fontSize = "2.0rem";
                h2_name.style.padding = "10px";
                h2_name.style.marginBottom ="5px";
                
                let fieldset = document.createElement('fieldset');

                fieldset.style.padding = "10px";
                fieldset.style.outline = "none";
                fieldset.style.width = "auto";
                fieldset.style.borderRadius = "5px";

                const resp = await fetch(`http://localhost:3000/chats/${user1}/${user2.value}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const json = await resp.json();


                while (form.firstChild) {
                    form.removeChild(form.lastChild);
                }
                const node_name = document.createTextNode(user2.value);
                h2_name.appendChild(node_name);
                h2_name.classList.add("green")
                form.appendChild(h2_name);

                json.forEach(message => {
                    let p = document.createElement('p');
                    
                    p.style.fontWeight = "500";
                    p.style.textAlign = "left";
                    p.style.display = "block";
                    p.style.color = "white";

                    const node_chat = document.createTextNode(message.content);
                    p.appendChild(node_chat);
                    let textStyle = (message.senderId === user1) ? "right" : "left";
                    p.style.textAlign = textStyle;
                    fieldset.appendChild(p);

                    if (!chatMessageLists.value[user2.value]) {
                        chatMessageLists.value[user2.value] = [];
                    }
                    chatMessageLists.value[user2.value].push(message);
                });
                form.appendChild(fieldset);

            } catch (ex) {
                console.error(ex);
            }
        }
        function chatDisplayed() {
          return  isNull(user2.value);
        }

        onMounted(() =>{
            fetchChats();
        });

        onBeforeUnmount(() => {
            socket.disconnect();
        });

        return {
            user1,
            user2,
            msgContent,
            chatMessageLists,
            fetchChatMessages,
            showChatMessages,
            publishMessage,
            chatDisplayed,
        };
    }
}

</script>

<template>

  <div class="split-left">
    <h2><span>Lista Chat</span></h2>
    <form id="chatsList"></form>
  </div>

  <div class="split-right">    
    <form id="chatMessages"></form>
    <template v-if="!chatDisplayed()">
      <textarea id="content" v-model="msgContent" placeholder="Inserisci contenuto qui..."></textarea>
      <button class="button" type="button" @click="publishMessage()">Invia</button>
    </template>

  </div>

</template>

<style scoped>
  .split-left {
    height: 100%;
    width: 30%;
    position: fixed;
    top: 30px;
    overflow-x: hidden;
    padding-top: 20px;
    left: 0;
    z-index: 0;
  }
  .split-left .select {
    width: 200px;
    height: 40px;
    margin-bottom: 15px;
    margin-top: 15px;
    border-radius: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    outline: none;
    }

  .split-right {
    height: 100%;
    width: 70%;
    position: fixed;
    top: 40px;
    overflow-x: hidden;
    padding: 20px;
    right: 0;
    z-index: 0;
  }

  span {
    font-weight: 500;
    text-align: left;
    display: block;
    color: hsla(160, 100%, 37%, 1);
  }

  textarea {
    font-weight: 500;
    width: 85%;
    height: 80px;
    border-radius: 20px;
    text-align: left;
    margin-right: 3px;
    margin-left: 3px;
    margin-bottom: 30px;
    margin-top: 20px
  }

  button {
    flex: 1;
    font-size: 1.2rem;
    width: 10%;
    height: 80px;
    border-radius: 20px;
    border: none;
    padding: 10px;
    outline: none;
    background-color: hsla(160, 100%, 37%, 1);
    color: white;
    cursor: pointer;
    position: absolute;
    margin-top: 20px;
    margin-right: 3px;
    margin-bottom: 30px
  }

  @media screen and (max-width: 1000px) {
      .split-left {
      width: 100%;
      position: relative;
      height: auto;
      top: 0;
      left: 0;
      padding-top: 20px;
    }

    .split-right {
      width: 100%;
      position: relative;
      height: auto;
      top: 0;
      right: 0;
      padding: 20px;
      margin-top: 5px;
    }

    button {
      flex: 1;
      font-size: 1.2rem;
      width: 13%;
      height: 80px;
      border-radius: 20px;
      border: none;
      padding: 10px;
      outline: none;
      background-color: hsla(160, 100%, 37%, 1);
      color: white;
      cursor: pointer;
      position: absolute;
      margin-top: 20px;
      margin-right: 3px;
      margin-bottom: 30px
    }
  }

  h2 {
    font-weight: 500;
    font-size: 2.0rem;
    padding: 10px;
    margin-bottom: 5px;
  }
  p{
    font-weight: 500;
    text-align: left;
    display: block;
    color: white;
    margin-left: 20px;
  }
  a{
    font-weight: 500;
    text-align: left;
    display: block;
    color: hsla(160, 100%, 37%, 1);
  }
  .split-left {
    padding: 10px;
    outline: none;
    width: auto;
    margin-top: 5px;
  }

</style>