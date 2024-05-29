<script>
import { ref, onMounted } from 'vue'

export default {
    setup() {
        const publishAdTitle = ref('')
        const publishAdDescription = ref('')
        const publishAdPrice = ref('')
        const publishAdRoom = ref('')
        const publishAdSex = ref('')
        const publishAdZone = ref('')
        const publishAdExpiry_date = ref('')
        const publishAdRoommate = ref('')
        
        const userId = ref('');
        const title = ref('');
        const owner = ref('');
        const description = ref('');
        const price = ref('');
        const room = ref('');
        const flat_sex = ref('');
        const residence_zone = ref('');
        const expiry_date = ref('');
        const roommate = ref('');
        
        const adIsThere = ref(false);

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
            { text: 'Sardagna', value: 'Sardagna' },
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

        function transformDateFormat(dateString) {
            const parts = dateString.split("-");
            return parts.join(" ");
        }

        function clearParameters() {
            publishAdTitle.value = '';
            publishAdDescription.value = '';
            publishAdPrice.value = '';
            publishAdRoom.value = '';
            publishAdSex.value = '';
            publishAdZone.value = '';
            publishAdExpiry_date.value = '';
            publishAdRoommate.value = '';

            title.value = '';
            owner.value = '';
            description.value = '';
            price.value = '';
            room.value = '';
            flat_sex.value = '';
            residence_zone.value = '';
            expiry_date.value = '';
            roommate.value = '';
        }

        async function hasAd() {
            try {
                const username = localStorage.getItem("username");
                let resp = await fetch(`http://localhost:3000/users/getId/${username}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!resp.ok) throw new Error('Failed to fetch user data');

                userId.value = await resp.json();

                resp = await fetch(`http://localhost:${3000}/advertisements/getByUser/${userId.value}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!resp.ok) throw new Error('Failed to fetch advertisement data');

                const json = await resp.json();

                title.value = json.title;
                owner.value = localStorage.getItem("username");
                description.value = json.description;
                price.value = json.price;
                room.value = json.room;
                flat_sex.value = json.flat_sex;
                residence_zone.value = json.residence_zone;
                expiry_date.value = transformDateFormat(json.expiry_date).substring(0, 10);
                roommate.value = json.roommate;

                adIsThere.value = true;
            } catch (ex) {
                console.error(ex);
            }
        }

        async function publishAds() {
            const formattedExpiryDate = transformDateFormat(publishAdExpiry_date.value);

            const advertisement_config = {
                title: publishAdTitle.value,
                description: publishAdDescription.value,
                price: publishAdPrice.value,
                room: publishAdRoom.value,
                flat_sex: publishAdSex.value,
                residence_zone: publishAdZone.value,
                expiry_date: formattedExpiryDate,
                roommate: publishAdRoommate.value
            };

            try {
                const resp = await fetch("http://localhost:3000/advertisements/publish", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json", 
                        "X-Auth-Token": localStorage.getItem("token") 
                    },
                    body: JSON.stringify(advertisement_config),
                });

                if (!resp.ok) throw new Error('Failed to publish advertisement');

                const json = await resp.json();
                console.log(json);

                title.value = advertisement_config.title;
                owner.value = localStorage.getItem("username");
                description.value = advertisement_config.description;
                price.value = advertisement_config.price;
                room.value = advertisement_config.room;
                flat_sex.value = advertisement_config.flat_sex;
                residence_zone.value = advertisement_config.residence_zone;
                expiry_date.value = transformDateFormat(advertisement_config.expiry_date).substring(0, 10);
                roommate.value = advertisement_config.roommate;

                adIsThere.value = true;
            } catch (ex) {
                console.error(ex);
            }
        }

        async function deleteAd() {
            try {
                let resp = await fetch(`http://localhost:3000/advertisements/delete/${userId.value}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });

                if (!resp.ok) throw new Error('Failed to delete the advertisement');

                clearParameters();
                adIsThere.value = false;
            } catch (ex) {
                console.error(ex);
            }
        }

        function showInterested(){

        }

        function notifyInterested(){

        }

        async function showPreferences(){
            try {
                const resp = await fetch(`http://localhost:3000/preferences/my-prefs`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "X-Auth-Token": localStorage.getItem("token") },
                });
                const json = await resp.json();
                console.log(json);
            }
            catch (ex) {
                console.error(ex);
            }
        }

        onMounted(() => {
            hasAd();
        });

        return {
            publishAdTitle,
            publishAdDescription,
            publishAdPrice,
            publishAdRoom,
            publishAdSex,
            publishAdZone,
            publishAdExpiry_date,
            publishAdRoommate,
            userId,
            title,
            owner,
            description,
            price,
            room,
            flat_sex,
            residence_zone,
            expiry_date,
            roommate,
            adIsThere,
            roomOptions,
            sexOptions,
            zoneOptions,
            transformDateFormat,
            publishAds,
            deleteAd,
            showInterested,
            notifyInterested,
            showPreferences,
            clearParameters
        };
    }
}
</script>

<template>
    <div class="left-side">
        <template v-if="!adIsThere">
            <br><h2><span class="green">Pubblica annuncio</span></h2>

            <form class="publishAdForm">
                <div class="inputGroup">
                    <div class="input">
                        <label class="tag" for="title">Titolo:</label>
                        <input id="title" v-model="publishAdTitle" placeholder="Inserisci titolo qui"></input>
                    </div>
                    <div class="textarea">
                        <label class="tag" for="description">Descrizione:</label><br>
                        <textarea id="description" v-model="publishAdDescription" placeholder="Inserisci descrizione qui..."></textarea>
                    </div>
                    <div class="input">
                        <label class="tag" for="price">Prezzo<br>(in euro):</label>
                        <input id="price" v-model="publishAdPrice" placeholder="Inserisci prezzo qui"></input>
                    </div>
                    <div class="select">
                        <label class="tag" for="room">Tipo di stanza:</label>
                        <select class="room" v-model="publishAdRoom">
                            <option disabled value="--Seleziona tipo di stanza--">--Seleziona tipo di stanza--</option>
                            <option v-for="option in roomOptions" :key="option.value" :value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                    </div>
                    <div class="select">
                        <label class="tag" for="gender">Sesso inquilini:</label>
                        <select class="gender" v-model="publishAdSex">
                            <option disabled value="--Seleziona sesso inquilini--">--Seleziona sesso inquilini--</option>
                            <option v-for="option in sexOptions" :key="option.value" :value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                    </div>
                    <div class="select">
                        <label class="tag" for="zone">Residenza:</label>
                        <select class="zone" v-model="publishAdZone">
                            <option disabled value="--Seleziona zona di residenza--">--Seleziona zona di residenza--</option>
                            <option v-for="option in zoneOptions" :key="option.value" :value="option.value">
                                {{ option.text }}
                            </option>
                        </select>
                    </div>
                    <div class="input">
                        <label class="tag" for="date">Scadenza annuncio:</label>
                        <input id="date" type="date" v-model="publishAdExpiry_date" placeholder="Inserisci scadenza qui"></input>
                    </div>
                    <div class="input">
                        <label class="tag" for="roomates">Numero inquilini:</label>
                        <input id="roomates" v-model="publishAdRoommate" placeholder="Inserisci numero inquilini qui"></input>
                    </div>
                </div>

                <h2><button class="button" type="button" @click="publishAds()">Pubblica annuncio</button></h2>
            </form>
        </template>

        <template v-else>
            <br><h2 class="green">Il mio annuncio: <span class="green" v-html="title"></span></h2>

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

            <div class="buttons">
                <button class="button" type="button" @click="deleteAd()">Elimina annuncio</button>
                <button class="button" type="button" @click="showInterested()">Mostra interessati</button>
                <button class="button" type="button" @click="notifyInterested()">Notifica interessati</button>
            </div>
        </template>
    </div>

    <div class="right-side">
        <br><h2><span class="green">Le mie preferenze:</span></h2>

        <button class="button" type="button" @click="showPreferences()">Mostra preferenze</button>
    </div>
</template>

<style>
    .left-side {
        height: 100%;
        position: fixed;
        top: 30px;
        overflow-x: hidden;
        padding-top: 20px;
        left: 0;
        z-index: 0;
        padding: 10px;
        outline: none;
        width: auto;
        margin-top: 5px;
    }
    .right-side {
        height: 100%;
        width: 60%;
        position: fixed;
        top: 14px;
        overflow-x: hidden;
        padding: 20px;
        right: 0;
        z-index: 0;
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
    .buttons {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }
</style>