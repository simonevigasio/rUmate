<script setup>

import { useRoute } from 'vue-router';

const route = useRoute();

function isRouteActive(path){
  return route.path === path;
}

function alreadyLogged(){
  return localStorage.getItem("token") !== null
}

async function logout() {
  localStorage.clear();
  try {
    const resp = await fetch("http://localhost:3000/users/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
    })
  
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  catch (ex) {
    console.error(ex);
  }
}

</script>

<template>
  <ul>
    <li><img alt="rumate-logo" class="image" src="../assets/rumate_logo_small.png" width="50" height="50" /></li>
    <li><router-link to="/" :class="['link', { active: isRouteActive('/') }]">Home</router-link></li>

    <template v-if="!alreadyLogged()">
      <li><router-link to="/login" :class="['link', {active: isRouteActive('/login')}]" >Login</router-link></li>
      <li><router-link to="/signin" :class="['link', {active: isRouteActive('/signin')}]">Signin</router-link></li>
    </template>
    
    <template v-else>
      <li><router-link to="/chat" :class="['link', { active: isRouteActive('/#chat') }]">Chat</router-link></li>
      <li><router-link to="/publishAd" :class="['link', { active: isRouteActive('/publishAd') }]">Il mio annuncio</router-link></li>
      <li><router-link to="/" class="link" @click="logout">Log out</router-link></li>
    </template>

  </ul>
</template>

<style scoped>

/* navbar */
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
  position: fixed;
  top: 0;
  left: 0px;
  width: 100%;
  z-index: 1;
}

li {
  float: left;
}

li .link {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

li .link:hover:not(.active) {
  background-color: #111;
}

.active {
  background-color: #04AA6D;
}

/*-----------------------------------*/

.logo {
  margin-bottom: 40px;
  position: sticky;
}

.image {
  display: block;
  margin: 0 1rem;
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