<script>

async function getData(){
  try {
        const result = await fetch("http://localhost:3000/publishAd", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then( resp =>
            resp.json()
        );
        return result;
    }
    catch (ex) {
        console.error(ex);
    }
}

export default{
    data(){
        return{
            advertisements: ""
        }
    },
    async mounted() {
        this.advertisements = await getData();
    }
}

</script>

<template>
  <div class="greetings">
    <li class="green" v-for="ad in advertisements">
      {{ ad.title }}
    </li>
  </div>
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