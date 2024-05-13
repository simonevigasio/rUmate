<script setup>

import { ref } from 'vue';

const activeNavItem = ref('home');

const setActiveNavItem = (item) => {
  activeNavItem.value = item;
};

</script>

<template>
  <div class="logo">
    <img alt="rUmate logo" class="image" src="/home/stecmp/rUmate/rumate/frontend/src/assets/rumate_logo_small.png" width="250" height="250" />
    <h1 class="title">rUmate</h1>
    <h3 class="subtitle">Perchè il prossimo coinquilino sei tu!</h3>
  </div>

  <div class="topnav">
    <a :class="{ active: activeNavItem === 'home' }" href="/" @click="setActiveNavItem('home')">home</a>
    <a :class="{ active: activeNavItem === 'login' }" href="/login" @click="setActiveNavItem('login')">Log in</a>
    <a :class="{ active: activeNavItem === 'signin' }" href="/signin" @click="setActiveNavItem('signin')">Sign in</a>
    <a :class="{ active: activeNavItem === 'chat' }" href="/#chat" @click="setActiveNavItem('chat')">Chat</a>
    <a :class="{ active: activeNavItem === 'publishAd' }" href="/publishAd" @click="setActiveNavItem('publishAd')">Il mio annuncio</a>
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