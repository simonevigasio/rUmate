<script setup>
import { ref } from 'vue'

const publishAdTitle = ref('')
const publishAdDescription = ref('')
const publishAdPrice = ref('')
const publishAdRoom = ref('')
const publishAdSex = ref('')
const publishAdZone = ref('')
const publishAdExpiry_date = ref('')
const publishAdRoommate = ref('')

const roomOptions = ref([
    { text: 'Singola', value: 'Single' },
    { text: 'Doppia', value: 'Double' },
    { text: 'Tripla', value: 'Triple' }
]);

const sexOptions = ref([
    { text: 'Maschi', value: 'Male' },
    { text: 'Femmine', value: 'Female' },
    { text: 'Misto', value: 'Mixed' }
]);

const zoneOptions = ref([
    { text: 'Povo', value: 'Povo' },
    { text: 'Bondone', value: 'Bondone' },
    { text: 'Prezzo', value: 'Sardagna' },
    { text: 'Centro storico', value: 'Centro_storico_Piedicastello' },
    { text: 'Meano', value: 'Meano' },
    { text: 'Argentario', value: 'Argentario' },
    { text: 'San Giuseppe/Santa Chiara', value: 'San_Giuseppe_Santa_Chiara' },
    { text: 'Oltrefersina', value: 'Oltrefersina' },
    { text: 'Villazzano', value: 'Villazzano' },
    { text: 'Mattarello', value: 'Mattarello' },
    { text: 'Ravina/Romagnano', value: 'Ravina_romagnano' },
    { text: 'Oltrecastello', value: 'Oltrecastello' },
]);

async function publishAds() {
    const advertisement_config = {
        owner: localStorage.getItem("username"),
        title: publishAdTitle.value,
        description: publishAdDescription.value,
        price: publishAdPrice.value,
        room: publishAdRoom.value,
        flat_sex: publishAdSex.value,
        residence_zone: publishAdZone.value,
        expiry_date: publishAdExpiry_date.value,
        roommate: publishAdRoommate.value
    };

    try {
        const resp = await fetch("http://localhost:3000/advertisements/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Auth-Token": localStorage.getItem("token") },
            body: JSON.stringify(advertisement_config),
        })
        const json = await resp.json();
        console.log(json);
    }   
    catch (ex) {
        console.error(ex);
    }
}
</script>

<template>
    <h2><span class="green">Pubblica annuncio</span></h2>

    <form class="publishAdForm">
        <div class="inputGroup">
            <div class="input">
                <label class="tag" for="title">Titolo:</label>
                <input id="title" v-model="publishAdTitle.value" placeholder="Inserisci titolo qui"></input>
            </div>
            <div class="textarea">
                <label class="tag" for="description">Descrizione:</label><br>
                <textarea id="description" v-model="publishAdDescription.value" placeholder="Inserisci descrizione qui..."></textarea>
            </div>
            <div class="input">
                <label class="tag" for="price">Prezzo<br>(in euro):</label>
                <input id="price" v-model="publishAdPrice.value" placeholder="Inserisci prezzo qui"></input>
            </div>
            <div class="select">
                <label class="tag" for="room">Tipo di stanza:</label>
                <select class="room" v-model="publishAdRoom">
                    <option disabled value="--Seleziona tipo di stanza--">--Seleziona tipo di stanza--</option>
                    <option v-for="option in roomOptions" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>
            </div>
            <div class="select">
                <label class="tag" for="gender">Sesso inquilini:</label>
                <select class="gender" v-model="publishAdSex">
                    <option disabled value="--Seleziona sesso inquilini--">--Seleziona sesso inquilini--</option>
                    <option v-for="option in sexOptions" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>
            </div>
            <div class="select">
                <label class="tag" for="zone">Residenza:</label>
                <select class="zone" v-model="publishAdZone">
                    <option disabled value="--Seleziona zona di residenza--">--Seleziona zona di residenza--</option>
                    <option v-for="option in zoneOptions" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>
            </div>
            <div class="input">
                <label class="tag" for="date">Scadenza annuncio:</label>
                <input id="date" type="date" v-model="publishAdExpiry_date.value" placeholder="Inserisci scadenza qui"></input>
            </div>
            <div class="input">
                <label class="tag" for="roomates">Numero inquilini:</label>
                <input id="roomates" v-model="publishAdRoommate.value" placeholder="Inserisci numero inquilini qui"></input>
            </div>
        </div>

        <h2><button class="button" type="button" @click="publishAds()">Pubblica annuncio</button></h2>
    </form>
</template>

<style scoped>
    .placeholder-style::placeholder {
        color: #ccc;
    }
    h2 {
        font-weight: 500;
        font-size: 2.0rem;
        padding: 10px;
        margin-bottom: 10px;
    }
    .publishAdForm {
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
    .publishAdForm .tag {
        font-weight: 500;
        display: inline-block;
        width: 90px;
        margin-bottom: 5px;
        color: white;
    }
    .publishAdForm input,
    .publishAdForm select,
    .publishAdForm textarea {
        width: 200px;
        height: 40px;
        margin-bottom: 15px;
        margin-top: 15px;
        border-radius: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        outline: none;
    }
    .publishAdForm textarea {
        width: 300px;
        height: 100px;
    }
</style>