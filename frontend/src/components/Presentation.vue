<script setup>

import { useRoute } from 'vue-router';

const route = useRoute();

function isRouteActive(path){
  return route.path === path;
}

function alreadyLogged(){
  return localStorage.getItem("username") !== null
}

async function logout() {
  localStorage.clear();
  try {
    const resp = await fetch("http://localhost:3000/users/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
    })
    const json = await resp.json();
    console.log(json);

    setTimeout(() => {
      router.push('/');
    }, 1000);
  }
  catch (ex) {
    console.error(ex);
  }
}

</script>

<template>
  <div class="logo">
    <img alt="rUmate logo" class="image" src="/home/stecmp/rUmate/rumate/frontend/src/assets/rumate_logo_small.png" width="250" height="250" />
    <h1 class="title">rUmate</h1>
    <h3 class="subtitle">Perchè il prossimo coinquilino sei tu!</h3>
  </div>

  <div class="topnav">
    <router-link to="/" :class="{ active: isRouteActive('/') }">home</router-link>
    <template v-if="!alreadyLogged()">
      <router-link to="/login" :class="{ active: isRouteActive('/login') }">Log in</router-link>
      <router-link to="/signin" :class="{ active: isRouteActive('/signin') }">Sign in</router-link>
    </template>
    <template v-else>
      <router-link to="/#chat" :class="{ active: isRouteActive('/#chat') }">Chat</router-link>
      <router-link to="/publishAd" :class="{ active: isRouteActive('/publishAd') }">Il mio annuncio</router-link>
      <router-link to="/" @click="logout">Log out</router-link>
    </template>
  </div>
</template>

<style scoped>
.logo {
  margin-bottom: 40px;
  position: sticky;
}

.image {
  display: block;
  margin: 0 auto 1rem;
}

.logo h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
  text-align: center;
  color: hsla(160, 100%, 37%, 1);; 
}

.logo h3 {
  font-size: 1.2rem;
  text-align: center;
  color: white;
}

.topnav {
  overflow: hidden;
  background-color: #333;
}

.topnav a {
  float: left;
  display: block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.topnav a:hover {
  background-color: #ddd;
  color: black;
}

.topnav a.active {
  background-color: #04AA6D;
  color: white;
}

.topnav .icon {
  display: none;
}

@media screen and (max-width: 600px) {
  .topnav a:not(:first-child) {display: none;}
  .topnav a.icon {
    float: right;
    display: block;
  }
}

@media screen and (max-width: 600px) {
  .topnav.responsive {position: relative;}
  .topnav.responsive .icon {
    position: absolute;
    right: 0;
    top: 0;
  }
  .topnav.responsive a {
    float: none;
    display: block;
    text-align: left;
  }
}

</style>