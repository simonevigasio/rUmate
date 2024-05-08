<script setup>
    import { ref, computed, onMounted } from 'vue'

    const message = ref('Insert your credentials to log in')
    const username = ref(localStorage.getItem('username') || '')
    const password = ref(localStorage.getItem('password') || '')
    const hasUsernameError = ref(false)
    const hasPasswordError = ref(false)
    const warningUsername = ref('')
    const warningPassword = ref('')
    const show = ref(false)
    const passwordType = computed(() => show.value ? 'text' : 'password');

    const loggedIn = ref(false)

    const isButtonDisabled = computed(() => {
        return !username.value || !password.value
    })

    function tryLogIn(){
        warningUsername.value = ''
        warningPassword.value = ''

        if(username.value.length < 8 || username.value.length > 25) {
            warningUsername.value = 'No account with such username exists'
            hasUsernameError.value = true
        }else{
            hasUsernameError.value = false
        }

        if(!/[!@#$%^&*(),.?]/.test(password.value)) {
            warningPassword.value = 'Incorrect password'
            hasPasswordError.value = true
        }else{
            hasPasswordError.value = false
        }

        if(hasUsernameError.value || hasPasswordError.value) {
            return
        }

        message.value = "You successfully logged in!"
        loggedIn.value = true
    }

    function showPassword(){
        show.value = !show.value
    }

    onMounted(() => {
        localStorage.setItem('username', username.value)
        localStorage.setItem('password', password.value)
    })
</script>

<template>
    <div class="LoginForm">
        <h2><span class="green" v-html="message"></span></h2>

        <template v-if="!loggedIn">
            <div class="inputGroup">
                <div class="input">
                    <label class="tag" for="username">Username:</label>
                    <input id="username" v-model="username" placeholder="Insert username here">
                    <p class="warning">{{ warningUsername }}</p>
                </div>
                <div class="input">
                    <label class="tag" for="password">Password:</label>
                    <input id="password" :type="passwordType" v-model="password" placeholder="Insert password here">
                    <p class="warning">{{ warningPassword }}</p>
                </div>
            </div>

            <input type="checkbox" id="checkbox" v-model="show" @input="showPassword"><label class="checkboxText" for="checkbox">Make password visible</label>

            <h2><button class="logInButton" @click="tryLogIn" :disabled="isButtonDisabled">Log In</button></h2>
        </template>
    </div>
</template>

<style scoped>
    .LoginForm h2 {
        font-weight: 500;
        font-size: 2.0rem;
        position: relative;
        top: 10px;
        margin-bottom: 30px;
        margin-left: -40px;
    }
    .LoginForm p {
        margin-bottom: 15px;
    }
    .LoginForm .tag{
        font-weight: 500;
        color: white;
        display: inline-block;
        width: 90px;
        margin-bottom: 5px;
    }
    .LoginForm .checkboxText{
        width: 90px;
        margin-bottom: 5px;
        margin-left: 10px;
    }
    .LoginForm input{
        border-radius: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        outline: none;
    }
    .logInButton {
        font-size: 1.2rem;
        padding: 10px 20px;
        width: auto;
        border-radius: 20px;
        border: none;
        background-color: hsla(160, 100%, 37%, 1);
        color: white;
        cursor: pointer;
    }
    .logInButton:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    .warning {
        color: red;
        font-size: 0.8rem;
        margin-top: 5px;
    }

    @media (max-width: 1023px) {
        .LoginForm h2{
            text-align: center;
            margin: 0 auto 2rem;
        } 
    }
</style>