<script setup>
import { ref, onMounted } from 'vue'

const selectedSortOption = ref('None');

const sortOptions = ref([
    { text: 'Prezzo', value: 'Price' },
    { text: 'Data di scadenza', value: 'Expiry_date' }
]);

const filterRoomSingle = ref({ checked: true, value: 'Single' });
const filterRoomDouble = ref({ checked: true, value: 'Double' });
const filterRoomTriple = ref({ checked: true, value: 'Triple' });
const filterSexMale = ref({ checked: true, value: 'Male' });
const filterSexFemale = ref({ checked: true, value: 'Female' });
const filterSexMixed = ref({ checked: true, value: 'Mixed' });
const filterResidencePovo = ref({ checked: true, value: 'Povo' });
const filterResidenceBondone = ref({ checked: true, value: 'Bondone' });
const filterResidenceSardagna = ref({ checked: true, value: 'Sardagna' });
const filterResidenceCentro_storico_Piedicastello = ref({ checked: true, value: 'Centro_storico_Piedicastello' });
const filterResidenceMeano = ref({ checked: true, value: 'Meano' });
const filterResidenceArgentario = ref({ checked: true, value: 'Argentario' });
const filterResidenceSan_Giuseppe_Santa_Chiara = ref({ checked: true, value: 'San_Giuseppe_Santa_Chiara' });
const filterResidenceOltrefersina = ref({ checked: true, value: 'Oltrefersina' });
const filterResidenceVillazzano = ref({ checked: true, value: 'Villazzano' });
const filterResidenceMattarello = ref({ checked: true, value: 'Mattarello' });
const filterResidenceRavina_romagnano = ref({ checked: true, value: 'Ravina_romagnano' });
const filterResidenceOltrecastello = ref({ checked: true, value: 'Oltrecastello' });

async function visualizeAdv() {
    const parameter = {
        sort : selectedSortOption.value,
        roomFilter: {
            Single: filterRoomSingle.value.checked ? filterRoomSingle.value.value : 'None',
            Double: filterRoomDouble.value.checked ? filterRoomDouble.value.value : 'None',
            Triple: filterRoomTriple.value.checked ? filterRoomTriple.value.value : 'None',
        },
        sexFilter: {
            Male: filterSexMale.value.checked ? filterSexMale.value.value : 'None',
            Female: filterSexFemale.value.checked ? filterSexFemale.value.value : 'None',
            Mixed: filterSexMixed.value.checked ? filterSexMixed.value.value : 'None',
        },
        residenceFilter: {
            Povo: filterResidencePovo.value.checked ? filterResidencePovo.value.value : 'None',
            Bondone: filterResidenceBondone.value.checked ? filterResidenceBondone.value.value : 'None',
            Sardagna: filterResidenceSardagna.value.checked ? filterResidenceSardagna.value.value : 'None',
            Centro_storico_Piedicastello: filterResidenceCentro_storico_Piedicastello.value.checked ? filterResidenceCentro_storico_Piedicastello.value.value : 'None',
            Meano: filterResidenceMeano.value.checked ? filterResidenceMeano.value.value : 'None',
            Argentario: filterResidenceArgentario.value.checked ? filterResidenceArgentario.value.value : 'None',
            San_Giuseppe_Santa_Chiara: filterResidenceSan_Giuseppe_Santa_Chiara.value.checked ? filterResidenceSan_Giuseppe_Santa_Chiara.value.value : 'None',
            Oltrefersina: filterResidenceOltrefersina.value.checked ? filterResidenceOltrefersina.value.value : 'None',
            Villazzano: filterResidenceVillazzano.value.checked ? filterResidenceVillazzano.value.value : 'None',
            Mattarello: filterResidenceMattarello.value.checked ? filterResidenceMattarello.value.value : 'None',
            Ravina_romagnano: filterResidenceRavina_romagnano.value.checked ? filterResidenceRavina_romagnano.value.value : 'None',
            Oltrecastello: filterResidenceOltrecastello.value.checked ? filterResidenceOltrecastello.value.value : 'None',
        }
    };

    try {
        const ul = document.getElementById('ads');
        const resp = await fetch("http://localhost:3000/advertisement", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parameter),
        });

        while (ul.firstChild) {
            ul.removeChild(ul.lastChild);
        }

        const json = await resp.json();
        json.map(function(adv) {
            let li = document.createElement('li');
            let span = document.createElement('span');
            let a = document.createElement('a');
            a.href = `http://localhost:${3000}/advertisement/${adv._id}`;
            a.textContent = adv.title;
            span.appendChild(a);
            li.appendChild(span);
            ul.appendChild(li);
        });
    }
    catch (ex) {
        console.error(ex);
    }
}

function sort_and_filter() {
    visualizeAdv();
}

onMounted(() =>{
  sort_and_filter();
})

</script>

<template>
  <form class="sort_and_filterform">
    <fieldset>
        <span> Scegli ordinamento: {{ selectedSortOption }}</span>
        <select class="sortAd" v-model="selectedSortOption">
            <option disabled value="">--Seleziona ordinamento--</option>
            <option v-for="option in sortOptions" :value="option.value">
              {{ option.text }}
            </option>
        </select>
    <br>
    </fieldset>
    
    <fieldset>
        <span>Filtra per il tipo di stanza:</span><br /> 
        <label>
            <input type="checkbox" v-model="filterRoomSingle.checked"></input>
            Singola - {{ filterRoomSingle.value }} {{ filterRoomSingle.checked }}
        </label><br />
        <label>
            <input type="checkbox" v-model="filterRoomDouble.checked"></input>
            Doppia - {{ filterRoomDouble.value }} {{ filterRoomDouble.checked }}
        </label><br /> 
        <label>
            <input type="checkbox" v-model="filterRoomTriple.checked"></input>
            Tripla
        </label><br /> 
        <br />

        <span>Filtra per la residenza dell'appartamento:</span><br /> 
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
            Centro_storico_Piedicastello
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
            San_Giuseppe_Santa_Chiara
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
            Ravina_romagnano
        </label><br /> 
        <label>
          <input type="checkbox" v-model="filterResidenceOltrecastello.checked"></input>
            Oltrecastello
        </label><br />
        <br />   

    </fieldset>
    <button type="button" @click="sort_and_filter();">Visualizza annunci</button>
</form>

  <h1>Lista Annunci</h1>
    <li class="green" id="ads"></li>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
  color: white;
}
</style>