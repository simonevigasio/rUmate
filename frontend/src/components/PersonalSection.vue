<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();

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

        const isButtonDisabled = computed(() => {
            return !publishAdTitle.value || !publishAdDescription.value || !publishAdPrice.value || !publishAdTitle.value || !publishAdRoom.value || !publishAdSex.value || !publishAdZone.value || !publishAdExpiry_date.value || !publishAdRoommate.value;
        })

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

        async function showPreferences() {
            try {
                const form = document.getElementById('prefs');
                const resp = await fetch(`http://localhost:3000/preferences/my-prefs`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json", 
                        "X-Auth-Token": localStorage.getItem("token") 
                    },
                });

                if (!resp.ok) throw new Error('Failed to fetch preferences');

                while (form.firstChild) {
                    form.removeChild(form.lastChild);
                }

                const pref = await resp.json();
                
                const ads = pref.map(async (preference) => {
                    const adResp = await fetch(`http://localhost:3000/advertisements/getById/${preference.advertisement_id}`);
                    const ad = await adResp.json();
                    return { ...preference, ad_name: ad.title, ad_owner: ad.user_id };
                });
                const prefWithAds = await Promise.all(ads);

                const owners = prefWithAds.map(async (preference) => {
                    const userResp = await fetch(`http://localhost:3000/users/${preference.ad_owner}`);
                    const user = await userResp.json();
                    return { ...preference, username: user.username };
                });
                const prefWithUsers = await Promise.all(owners);


                prefWithUsers.forEach((preference) => {
                    let fieldset = document.createElement('fieldset');
                    fieldset.style.padding = "10px";
                    fieldset.style.outline = "none";
                    fieldset.style.width = "auto";
                    fieldset.style.borderRadius = "10px";
                    fieldset.style.marginTop = "5px";

                    let a_ad = document.createElement('a');
                    let p_owner = document.createElement('p');

                    a_ad.style.fontWeight = "500";
                    a_ad.style.textAlign = "left";
                    a_ad.style.display = "block";
                    a_ad.style.color = "hsla(160, 100%, 37%, 1)";
                    a_ad.style.marginLeft = "20px";

                    p_owner.style.fontWeight = "500";
                    p_owner.style.textAlign = "left";
                    p_owner.style.display = "block";
                    p_owner.style.color = "white";
                    p_owner.style.marginLeft = "20px";

                    const node_title = document.createTextNode(preference.ad_name);
                    const node_owner = document.createTextNode("Proprietario: " + preference.username);
 
                    a_ad.appendChild(node_title);
                    a_ad.onclick = function() {                         
                        localStorage.setItem("adv", preference.advertisement_id); 
                        router.push('/advertisement');
                    };

                    p_owner.appendChild(node_owner);

                    fieldset.appendChild(a_ad);
                    fieldset.appendChild(p_owner);

                    form.appendChild(fieldset);
                });
            } catch (ex) {
                console.error(ex);
            }
        }


        onMounted(() => {
            hasAd();
            showPreferences();
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
            clearParameters,
            isButtonDisabled
        };
    }
}
</script>

<template>
    <div class="left-side">
        <template v-if="!adIsThere">
            <h2><span class="green">Pubblica annuncio</span></h2>

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

                <div class="singleButton">
                    <button class="button" type="button" @click="publishAds()" :disabled="isButtonDisabled">Pubblica annuncio</button>
                </div>
            </form>
        </template>

        <template v-else>
            <h2 class="green">Il mio annuncio: <span class="green" v-html="title"></span></h2>

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
        <h2><span class="green">Le mie preferenze:</span></h2>
        <form id="prefs"></form>
    </div>
</template>

<style scoped>
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
        width: 500px;
        border-radius: 10px;
    }
    .placeholder-style::placeholder {
        color: #ccc;
    }
    .left-side h2 {
        font-weight: 500;
        font-size: 2.0rem;
        padding: 10px;
        margin-bottom: 10px;
        margin-top: 10px;
    }
    .right-side h2 {
        font-weight: 500;
        font-size: 2.0rem;
        padding: 10px;
        margin-bottom: 10px;
        margin-top: 20px;
    }
    span{
        font-weight: 500;
        text-align: left;
        display: block;
        color: hsla(160, 100%, 37%, 1);
    }
    p {
        font-weight: 500;
        text-align: left;
        display: block;
        color: white;
    }
    .publishAdForm {
        border-radius: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        outline: none;
        width: 350px;
        margin-top: 5px;
        border-radius: 20px;
    }
    .singleButton {
        margin-left: 85px;
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
        width: 500px;
    }
    @media screen and (max-width: 1000px) {
        .left-side {
            width: 100%;
            position: relative;
            overflow: hidden;
            height: auto;
            top: 0;
            left: 0;
            padding-top: 20px;
        }
        .right-side  {
            width: 100%;
            position: relative;
            overflow: hidden;
            height: auto;
            top: 0;
            left: 0;
            padding-top: 20px;
        }
        .Advertisement{
            padding: 10px;
            outline: none;
            width: 300px;
            margin-top: 5px;
            margin-left: 98px;
        }

        .Advertisement fieldset {
            width: 300px;
        }

        h2 {
            margin-left: 98px;
        }
    }
</style>