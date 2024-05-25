<script setup>
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const title = ref('');
    const owner = ref('');
    const description = ref('');
    const prize = ref('');
    const room = ref('');
    const flat_sex = ref('');
    const residence_zone = ref('');
    const expiry_date = ref('');
    const roommate = ref('');

    function alreadyLogged(){
        return localStorage.getItem("username") !== null
    }

    async function getAdv(){
        try {
            const resp = await fetch(`http://localhost:${3000}/advertisements/${localStorage.getItem("adv")}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const json = await resp.json();

            title.value = json.title;
            owner.value = localStorage.getItem("username");
            description.value = json.description;
            prize.value = json.prize;
            room.value = json.room;
            flat_sex.value = json.flat_sex;
            residence_zone.value = json.residence_zone;
            expiry_date.value = json.expiry_date;
            roommate.value = json.roommate;

        }
        catch (ex) {
            console.error(ex);
        }
    }

    getAdv();
    
    function addPreferenceList(){

    }
    function startChat(){

    }
    function backToHome(){
        router.push('/');
    }

</script>

<template>
    <h2><span class="green" v-html="title"></span></h2>

    <form class="Advertisement">
        <fieldset>
            <span>Proprietario: </span><p v-html="owner"></p>
            <span>Descrizione: </span><p v-html="description"></p>
            <span>Prezzo: </span><p v-html="prize"></p>
            <span>Tipo di stanza: </span><p v-html="room"></p>
            <span>Sesso inquilini: </span><p v-html="flat_sex"></p>
            <span>Residenza: </span><p v-html="residence_zone"></p>
            <span>Scadenza annuncio: </span><p v-html="expiry_date"></p>
            <span>Numero inquilini: </span><p v-html="roommate"></p>

        </fieldset>
    </form>

    <div class="buttons">
        <template v-if="alreadyLogged()">
            <button class="button" type="button" @click="addPreferenceList()">Mostra preferenza annuncio</button>
            <button class="button" type="button" @click="startChat();">Avvia chat</button>
        </template>
        <button class="button" type="button" @click="backToHome();">Torna alla lista annunci</button>
    </div>

</template>

<style scoped>
    h2 {
        font-weight: 500;
        font-size: 2.0rem;
        padding: 10px;
        margin-bottom: 10px;
    }
    .Advertisement{
        padding: 10px;
        outline: none;
        width: auto;
        margin-top: 5px;
    }
    .Advertisement fieldset{
        padding: 10px;
        outline: none;
        width: 300px;
        border-radius: 10px;
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
</style>