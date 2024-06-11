<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const title = ref('');
    const owner = ref('');
    const description = ref('');
    const price = ref('');
    const room = ref('');
    const flat_sex = ref('');
    const residence_zone = ref('');
    const expiry_date = ref('');
    const roommate = ref('');
    const user_id = ref('');

    function alreadyLogged(){
        return localStorage.getItem("username") !== null
    }

    async function getAdv(){
        try {
            let resp = await fetch(`http://localhost:${3000}/advertisements/${localStorage.getItem("adv")}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const json = await resp.json();

            resp = await fetch(`http://localhost:${3000}/users/${json.user_id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const user = await resp.json();
            
            user_id.value = json.user_id;
            title.value = json.title;
            owner.value = user.username;
            description.value = json.description;
            price.value = json.price;
            room.value = json.room;
            flat_sex.value = json.flat_sex;
            residence_zone.value = json.residence_zone;
            expiry_date.value = json.expiry_date.substring(0, 10);
            roommate.value = json.roommate;

        }
        catch (ex) {
            console.error(ex);
        }
    }

    getAdv();
    
    async function addPreferenceList(){
        let user = localStorage.getItem("username");
        const preference_config = {
            interested_user_id: null,
            advertisement_id: localStorage.getItem("adv"),
        };

        try {
            const resp = await fetch(`http://localhost:3000/preferences/`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Auth-Token": localStorage.getItem("token") },
                body: JSON.stringify(preference_config),
            });
            const json = await resp.json();  
            
            if (!(json.message == "The user has already signed the preference of this advertisement")) {
                await fetch("http://localhost:3000/notifications", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "X-Auth-Token": localStorage.getItem("token") },
                    body: JSON.stringify({
                        content: `l'utente ${localStorage.getItem("username")} ha aggiunto una preferenza a un tuo annuncio!`,
                        reciver_id: user_id.value,
                        type: 'Preference',
                    }),
                });
            }
        }
        catch (ex) {
            console.error(ex);
        }
    }

    async function startChat(){
        let user = localStorage.getItem("username");
        const chat_config = {
            senderId: user,
            receiverId: owner.value,
        };

        try {
            const resp = await fetch(`http://localhost:3000/chats/${user}/addChat/${owner.value}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "X-Auth-Token": localStorage.getItem("token") },
                body: JSON.stringify(chat_config),
            });
            const json = await resp.json();
            console.log(json);
        }
        catch (ex) {
            console.error(ex);
        }
        localStorage.setItem("chatUser", owner.value);
        router.push('/chat');
    }

    function backToHome(){
        router.push('/');
    }

</script>

<template>
    <div class="container">
        <h2><span class="green" v-html="title"></span></h2>

        <form class="Advertisement">
            <fieldset>
                <span>Proprietario: </span><p v-html="owner"></p>
                <span>Descrizione: </span><p v-html="description"></p>
                <span>Prezzo: </span><p v-html="price"></p>
                <span>Tipo di stanza: </span><p v-html="room"></p>
                <span>Sesso inquilini: </span><p v-html="flat_sex"></p>
                <span>Residenza: </span><p v-html="residence_zone"></p>
                <span>Scadenza annuncio: </span><p v-html="expiry_date"></p>
                <span>Numero inquilini: </span><p v-html="roommate"></p>

            </fieldset>
        </form>

        <template v-if="alreadyLogged()">
            <div class="buttons">
                <button class="button" type="button" @click="addPreferenceList()">Aggiungi preferenza annuncio</button>
                <button class="button" type="button" @click="startChat();">Avvia chat</button>
                <button class="button" type="button" @click="backToHome();">Torna alla lista annunci</button>
            </div>
        </template>

        <template v-else>
            <div class="singleButton">
                <button class="button" type="button" @click="backToHome();">Torna alla lista annunci</button>
            </div>
        </template>
    </div>
</template>

<style scoped>
    .container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    span{
        font-weight: 500;
        text-align: left;
        display: block;
        color: hsla(160, 100%, 37%, 1);
    }
    h2 {
        font-weight: 500;
        font-size: 2.0rem;
        padding: 10px;
        margin-bottom: 5px;
    }
    p {
        font-weight: 500;
        text-align: left;
        display: block;
        color: white;
    }
    .Advertisement{
        padding: 10px;
        outline: none;
        width: 1300px;
        margin-top: 5px;
    }
    .Advertisement fieldset{
        padding: 10px;
        outline: none;
        border-radius: 10px;
    }
    .buttons {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        width: 500px;
    }
    .buttons .button {
        flex: 1;
        font-size: 1.2rem;
        width: 130px;
        height: 80px;
        border-radius: 20px;
        border: none;
        margin-left: 15px;
        padding: 10px;
        outline: none;
        background-color: hsla(160, 100%, 37%, 1);
        color: white;
        cursor: pointer;
    }
    .singleButton .button {
        font-weight: 500;
        font-size: 1.2rem;
        padding: 10px;
        outline: none;
        width: auto;
        border-radius: 20px;
        border: none;
        background-color: hsla(160, 100%, 37%, 1);
        color: white;
        cursor: pointer;
        display: flex;
        margin-top: 15px;
        margin-left: 45px;
    }
    @media screen and (max-width: 1000px) {
        .Advertisement{
            padding: 10px;
            outline: none;
            width: 300px;
            margin-top: 5px;
            margin-left: 108px;
        }

        h2 {
            margin-left: 108px;
        }

        .singleButton{
            margin-left: 108px;
        }
    }
</style>