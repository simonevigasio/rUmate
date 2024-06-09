<script setup>
  import { ref, onMounted } from 'vue'

  const selectedSortOption = ref('');

  const sortOptions = ref([
      { text: 'Prezzo', value: 'Price' },
      { text: 'Data di scadenza', value: 'Expiry_date' }
  ]);

  const filterRoomSingle = ref({ checked: false, value: 'Single' });
  const filterRoomDouble = ref({ checked: false, value: 'Double' });
  const filterRoomTriple = ref({ checked: false, value: 'Triple' });
  const filterSexMale = ref({ checked: false, value: 'Male' });
  const filterSexFemale = ref({ checked: false, value: 'Female' });
  const filterSexMixed = ref({ checked: false, value: 'Mixed' });
  const filterResidencePovo = ref({ checked: false, value: 'Povo' });
  const filterResidenceBondone = ref({ checked: false, value: 'Bondone' });
  const filterResidenceSardagna = ref({ checked: false, value: 'Sardagna' });
  const filterResidenceCentro_storico_Piedicastello = ref({ checked: false, value: 'Centro_storico_Piedicastello' });
  const filterResidenceMeano = ref({ checked: false, value: 'Meano' });
  const filterResidenceArgentario = ref({ checked: false, value: 'Argentario' });
  const filterResidenceSan_Giuseppe_Santa_Chiara = ref({ checked: false, value: 'San_Giuseppe_Santa_Chiara' });
  const filterResidenceOltrefersina = ref({ checked: false, value: 'Oltrefersina' });
  const filterResidenceVillazzano = ref({ checked: false, value: 'Villazzano' });
  const filterResidenceMattarello = ref({ checked: false, value: 'Mattarello' });
  const filterResidenceRavina_romagnano = ref({ checked: false, value: 'Ravina_romagnano' });
  const filterResidenceOltrecastello = ref({ checked: false, value: 'Oltrecastello' });

  async function visualizeAdv() {
      
      const sort = selectedSortOption.value;

      const roomFilter = stringifyFilter([
          filterRoomSingle.value.checked ? filterRoomSingle.value.value : 'None',
          filterRoomDouble.value.checked ? filterRoomDouble.value.value : 'None',
          filterRoomTriple.value.checked ? filterRoomTriple.value.value : 'None',
      ]);

      const sexFilter = stringifyFilter([
          filterSexMale.value.checked ? filterSexMale.value.value : 'None',
          filterSexFemale.value.checked ? filterSexFemale.value.value : 'None',
          filterSexMixed.value.checked ? filterSexMixed.value.value : 'None',
      ]);

      const residenceFilter = stringifyFilter([
          filterResidencePovo.value.checked ? filterResidencePovo.value.value : 'None',
          filterResidenceBondone.value.checked ? filterResidenceBondone.value.value : 'None',
          filterResidenceSardagna.value.checked ? filterResidenceSardagna.value.value : 'None',
          filterResidenceCentro_storico_Piedicastello.value.checked ? filterResidenceCentro_storico_Piedicastello.value.value : 'None',
          filterResidenceMeano.value.checked ? filterResidenceMeano.value.value : 'None',
          filterResidenceArgentario.value.checked ? filterResidenceArgentario.value.value : 'None',
          filterResidenceSan_Giuseppe_Santa_Chiara.value.checked ? filterResidenceSan_Giuseppe_Santa_Chiara.value.value : 'None',
          filterResidenceOltrefersina.value.checked ? filterResidenceOltrefersina.value.value : 'None',
          filterResidenceVillazzano.value.checked ? filterResidenceVillazzano.value.value : 'None',
          filterResidenceMattarello.value.checked ? filterResidenceMattarello.value.value : 'None',
          filterResidenceRavina_romagnano.value.checked ? filterResidenceRavina_romagnano.value.value : 'None',
          filterResidenceOltrecastello.value.checked ? filterResidenceOltrecastello.value.value : 'None',
      ]);

      try {
          const form = document.getElementById('ads');
          let url = `http://localhost:3000/advertisements?sort=${sort}`;
          if (roomFilter[1]) url += `&roomFilter=${roomFilter[0]}`;
          if (sexFilter[1]) url += `&sexFilter=${sexFilter[0]}`;
          if (residenceFilter[1]) url += `&residenceFilter=${residenceFilter[0]}`;

          console.log(url);

          const resp = await fetch(url, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
          });

          while (form.firstChild) {
              form.removeChild(form.lastChild);
          }

          const ads = await resp.json();

          const owners = ads.map(async (adv) => {
              const userResp = await fetch(`http://localhost:3000/users/${adv.user_id}`);
              const user = await userResp.json();
              return { ...adv, username: user.username };
          });

          const adsWithUsers = await Promise.all(owners);

          adsWithUsers.forEach((adv) => {
            let fieldset = document.createElement('fieldset');
            fieldset.style.padding = "10px";
            fieldset.style.outline = "none";
            fieldset.style.width = "auto";
            fieldset.style.borderRadius = "10px";
            fieldset.style.marginTop = "5px";

            let a_title = document.createElement('a');
            let p_owner = document.createElement('p');
            let p_residence = document.createElement('p');

            a_title.style.fontWeight = "500";
            a_title.style.textAlign = "left";
            a_title.style.display = "block";
            a_title.style.color = "hsla(160, 100%, 37%, 1)";
            a_title.style.marginLeft = "20px";

            p_owner.style.fontWeight = "500";
            p_owner.style.textAlign = "left";
            p_owner.style.display = "block";
            p_owner.style.color = "white";
            p_owner.style.marginLeft = "20px";

            p_residence.style.fontWeight = "500";
            p_residence.style.textAlign = "left";
            p_residence.style.display = "block";
            p_residence.style.color = "white";
            p_residence.style.marginLeft = "20px";

            const node_title = document.createTextNode(adv.title);
            const node_owner = document.createTextNode("Proprietario: " + adv.username);
            const node_residence = document.createTextNode("Residenza: " + adv.residence_zone);

            if(adv.username === localStorage.getItem("username")){
                a_title.href = location.href + `personalSection`;
            } else {
                a_title.href = location.href + `advertisement`;
            }

            a_title.appendChild(node_title);
            a_title.onclick = function() { localStorage.setItem("adv", adv._id); };

            p_owner.appendChild(node_owner);
            p_residence.appendChild(node_residence);

            fieldset.appendChild(a_title);
            fieldset.appendChild(p_owner);
            fieldset.appendChild(p_residence);

            form.appendChild(fieldset);
        });
      }
      catch (ex) {
          console.error(ex);
      }
  }

  function stringifyFilter(filters) {
    let query = '[';
    let filterUsed = false;
    filters.map((filter, index) => {
      if (filter != 'None') {
        filterUsed = true;
      }
      query += ('"' + filter + '"');
      if (index != filters.length - 1) {
        query += ", ";
      }
    });
    return [query + "]", filterUsed];
  }

  async function sort_and_filter() {
      try {
          visualizeAdv()
      }   
      catch (ex) {
          console.error(ex);
      }
  }

  function clearAll() {
      showAll();

      filterRoomSingle.value.checked = false;
      filterRoomDouble.value.checked = false;
      filterRoomTriple.value.checked = false;
      filterSexMale.value.checked = false;
      filterSexFemale.value.checked = false;
      filterSexMixed.value.checked = false;
      filterResidencePovo.value.checked = false;
      filterResidenceBondone.value.checked = false;
      filterResidenceSardagna.value.checked = false;
      filterResidenceCentro_storico_Piedicastello.value.checked = false;
      filterResidenceMeano.value.checked = false;
      filterResidenceArgentario.value.checked = false;
      filterResidenceSan_Giuseppe_Santa_Chiara.value.checked = false;
      filterResidenceOltrefersina.value.checked = false;
      filterResidenceVillazzano.value.checked = false;
      filterResidenceMattarello.value.checked = false;
      filterResidenceRavina_romagnano.value.checked = false;
      filterResidenceOltrecastello.value.checked = false;
  }

  function showAll() {
      filterRoomSingle.value.checked = true;
      filterRoomDouble.value.checked = true;
      filterRoomTriple.value.checked = true;
      filterSexMale.value.checked = true;
      filterSexFemale.value.checked = true;
      filterSexMixed.value.checked = true;
      filterResidencePovo.value.checked = true;
      filterResidenceBondone.value.checked = true;
      filterResidenceSardagna.value.checked = true;
      filterResidenceCentro_storico_Piedicastello.value.checked = true;
      filterResidenceMeano.value.checked = true;
      filterResidenceArgentario.value.checked = true;
      filterResidenceSan_Giuseppe_Santa_Chiara.value.checked = true;
      filterResidenceOltrefersina.value.checked = true;
      filterResidenceVillazzano.value.checked = true;
      filterResidenceMattarello.value.checked = true;
      filterResidenceRavina_romagnano.value.checked = true;
      filterResidenceOltrecastello.value.checked = true;

      sort_and_filter();
  }

  onMounted(() =>{
    clearAll();
  })

</script>

<template>

  <div class="split-left">
    <form>
      <fieldset>
        <span> Scegli ordinamento:</span>
        <select class="select" v-model="selectedSortOption">
            <option disabled value="--Seleziona ordinamento--">--Seleziona ordinamento--</option>
            <option v-for="option in sortOptions" :value="option.value">
              {{ option.text }}
            </option>
        </select>
      </fieldset>

      <fieldset>
        <span>Filtra per il tipo di stanza:</span>
        <div class="checkbox-container">
          <label>
            <input type="checkbox" v-model="filterRoomSingle.checked"></input>
            Singola
        </label><br />
        <label>
            <input type="checkbox" v-model="filterRoomDouble.checked"></input>
            Doppia
        </label><br /> 
        <label>
            <input type="checkbox" v-model="filterRoomTriple.checked"></input>
            Tripla
        </label><br /> 
        </div>
      </fieldset>

      <fieldset>
        <span>Filtra per per la tipologia di componenti dell'appartamento:</span>
        <div class="checkbox-container">
          <label>
            <input type="checkbox" v-model="filterSexMale.checked"></input>
              Maschi
          </label><br />
          <label>
            <input type="checkbox" v-model="filterSexFemale.checked"></input>
              Femmine
          </label><br /> 
          <label>
            <input type="checkbox" v-model="filterSexMixed.checked"></input>
              Misto
          </label><br /> 
        </div>
      </fieldset>

      <fieldset>
        <span>Filtra per la residenza dell'appartamento:</span>
        <div class="checkbox-container">
          <label>
            <input type="checkbox" v-model="filterResidencePovo.checked"></input>
              Povo
          </label><br />
          <label>
            <input type="checkbox" v-model="filterResidenceBondone.checked"></input>
              Bondone
          </label><br /> 
          <label>
            <input type="checkbox" v-model="filterResidenceSardagna.checked"></input>
              Sardagna
          </label><br /> 
          <label>
            <input type="checkbox" v-model="filterResidenceCentro_storico_Piedicastello.checked"></input>
              Centro Storico
          </label><br />
          <label>
            <input type="checkbox" v-model="filterResidenceMeano.checked"></input>
              Meano
          </label><br /> 
          <label>
            <input type="checkbox" v-model="filterResidenceArgentario.checked"></input>
              Argentario
          </label><br /> 
          <label>
            <input type="checkbox" v-model="filterResidenceSan_Giuseppe_Santa_Chiara.checked"></input>
              San Giuseppe/Santa Chiara
          </label><br /> 
          <label>
            <input type="checkbox" v-model="filterResidenceOltrefersina.checked"></input>
              Oltrefersina
          </label><br />
          <label>
            <input type="checkbox" v-model="filterResidenceVillazzano.checked"></input>
              Villazzano
          </label><br />
          <label>
            <input type="checkbox" v-model="filterResidenceMattarello.checked"></input>
              Mattarello
          </label><br /> 
          <label>
            <input type="checkbox" v-model="filterResidenceRavina_romagnano.checked"></input>
              Ravina/Romagnano
          </label><br /> 
          <label>
            <input type="checkbox" v-model="filterResidenceOltrecastello.checked"></input>
              Oltrecastello
          </label><br />
        </div>
      </fieldset>
    </form>

    <div class="buttons">
      <button class="button" type="button" @click="showAll()">Mostra ogni annuncio</button>
      <button class="button" type="button" @click="sort_and_filter();">Applica filtri</button>
      <button class="button" type="button" @click="clearAll();">Rimuovi filtri</button>
    </div>
  </div>

  <div class="split-right">
    <h2><span>Lista Annunci</span></h2>
    <form id="ads"></form>
  </div>

</template>

<style scoped>
  .split-left {
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
  .split-left .tag {
        font-weight: 500;
        display: inline-block;
        width: 90px;
        margin-bottom: 5px;
        color: white;
  }
  .split-left label {
        font-weight: 500;
        display: inline;
        width: 100px;
        color: white;
  }
  .split-left select{
    width: 200px;
    height: 40px;
    margin-bottom: 20px;
    margin-top: 15px;
    border-radius: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    outline: none;
  }
  .split-left input {
    border-radius: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    outline: none;
    margin-bottom: 15px;
  }
  .split-left fieldset{
    padding: 10px;
    outline: none;
    width: auto;
    border-radius: 10px;
    margin-top: 5px;
  }
  .split-right {
    height: 100%;
    width: 70%;
    position: fixed;
    top: 30px;
    overflow-x: hidden;
    padding: 20px;
    right: 0;
    z-index: 0;
  }
  .split-right h2 {
    font-weight: 500;
    font-size: 2.0rem;
    padding: 10px;
    margin-bottom: 10px;
    text-align: center;
    width: 400px;
  }
  span {
    font-weight: 500;
    text-align: left;
    display: block;
    color: hsla(160, 100%, 37%, 1);
  }
  .button {
    flex: 1;
    font-size: 1.2rem;
    width: 130px;
    height: 80px;
    border-radius: 20px;
    border: none;
    padding: 10px;
    outline: none;
    background-color: hsla(160, 100%, 37%, 1);
    color: white;
    cursor: pointer;
    margin-right: 3px;
    margin-left: 3px;
    margin-bottom: 30px
  }
  .buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
  /* get rid the filter bar if the screen dimention is less than 1000px */
  @media screen and (max-width: 1000px) {
      .split-left {
        width: 100%;
        position: relative;
        overflow: hidden;
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
  }
</style>