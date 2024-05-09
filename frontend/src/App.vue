<script>
import Presentation from './components/Presentation.vue'
import RegistrationForm from './components/RegistrationForm.vue'
import LoginForm from './components/LoginForm.vue'
import VisualizationAd from './components/VisualizationAd.vue'

export default{
  components:{
    Presentation,
    RegistrationForm,
    LoginForm,
    VisualizationAd
  }
 }
</script>

<template>
  <header>
    <img alt="rUmate logo" class="logo" src="./assets/rumate_logo_small.png" width="250" height="250" />
    <div class="wrapper">
      <Presentation msg="rUmate" />
    </div>
  </header>

  <main class="form">
    <VisualizationAd/>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  .form {
    display: flex;
    place-items: center;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}

@media (max-width: 1023px) {
  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
  }

  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
  }

  .form .inputGroup {
    width: 100%;
    max-width: 80%;
    text-align: center;
    margin-top: 1rem;
  }

  .form .signInButton {
    margin-top: 1rem;
  }

  .logo {
    margin: 2rem auto 2rem;
  }

  .wrapper {
    text-align: center;
  }
}
</style>