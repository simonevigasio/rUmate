<script>
import Presentation from './components/Presentation.vue'
import { NSpace } from 'naive-ui'

export default{
  components:{
    Presentation,
    NSpace
  }
}
</script>

<template>
  <n-space vertical>
    <header class="wrapper">
        <Presentation/>
    </header>

    <main>
      <RouterView/>
    </main>
  </n-space>
</template>

<style scoped>
  /* header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
  } */

  .form {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 4rem;
  }
</style>