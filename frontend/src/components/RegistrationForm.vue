<script setup>
    import { ref, computed, onMounted } from 'vue'

    const message = ref('Insert your credentials to sign in')
    const username = ref(localStorage.getItem('username') || '')
    const password = ref(localStorage.getItem('password') || '')
    const passwordRepeated = ref(localStorage.getItem('passwordRepeated') || '')
    const hasUsernameError = ref(false)
    const hasPasswordError = ref(false)
    const hasPasswordRepeatedError = ref(false)
    const warningUsername = ref('Username must be between 8 and 25 characters')
    const warningPassword = ref('Password must contain at least one symbol (!@#$%^&*(),.?)')
    const warningPasswordRepeated = ref('Password must be the same as the one inserted above')
    const show = ref(false)
    const passwordType = computed(() => show.value ? 'text' : 'password');

    const signedIn = ref(false)

    const isButtonDisabled = computed(() => {
        return !username.value || !password.value || !passwordRepeated.value
    })

    function trySignIn(){
        warningUsername.value = ''
        warningPassword.value = ''
        warningPasswordRepeated.value = ''

        if(username.value.length < 8 || username.value.length > 25) {
            warningUsername.value = 'Username must be between 8 and 25 characters'
            hasUsernameError.value = true
        }else{
            hasUsernameError.value = false
        }

        if(!/[!@#$%^&*(),.?]/.test(password.value)) {
            warningPassword.value = 'Password must contain at least one symbol (!@#$%^&*(),.?)'
            hasPasswordError.value = true
        }else{
            hasPasswordError.value = false
        }

        if(passwordRepeated.value != password.value){
            warningPasswordRepeated.value = 'Password must be the same as the one inserted above'
            hasPasswordRepeatedError.value = true
        }else{
            hasPasswordRepeatedError.value = false
        }

        if(hasUsernameError.value || hasPasswordError.value || hasPasswordRepeatedError.value) {
            return
        }

        message.value = "You successfully signed in!"
        signedIn.value = true
    }

    function showPassword(){
        show.value = !show.value
    }

    onMounted(() => {
        localStorage.setItem('username', username.value)
        localStorage.setItem('password', password.value)
        localStorage.setItem('passwordRepeated', passwordRepeated.value)
    })
</script>

<template>
    <div class="registrationForm">
        <h2><span class="green" v-html="message"></span></h2>

        <template v-if="!signedIn">
            <div class="inputGroup">
                <div class="input">
                    <label class="tag" for="username">Username:</label>
                    <input id="username" v-model="username" placeholder="Insert username here">
                    <p :class="{ 'initialWarning': !hasUsernameError, 'warning': hasUsernameError }">{{ warningUsername }}</p>
                </div>
                <div class="input">
                    <label class="tag" for="password">Password:</label>
                    <input id="password" :type="passwordType" v-model="password" placeholder="Insert password here">
                    <p :class="{ 'initialWarning': !hasPasswordError, 'warning': hasPasswordError }">{{ warningPassword }}</p>
                </div>
                <div class="input">
                    <label class="tag" for="passwordRepeated">Repeat password:</label>
                    <input id="passwordRepeated" :type="passwordType" v-model="passwordRepeated" placeholder="Reinsert password here">
                    <p :class="{ 'initialWarning': !hasPasswordRepeatedError, 'warning': hasPasswordRepeatedError }">{{ warningPasswordRepeated }}</p>
                </div>
            </div>

            <input type="checkbox" id="checkbox" v-model="show" @input="showPassword"><label class="checkboxText" for="checkbox">Make password visible</label>

            <h2><button class="signInButton" @click="trySignIn" :disabled="isButtonDisabled">Sign In</button></h2>
        </template>
    </div>
</template>

<style scoped>
    .registrationForm h2 {
        font-weight: 500;
        font-size: 2.0rem;
        position: relative;
        top: 10px;
        margin-bottom: 30px;
        margin-left: -40px;
    }
    .registrationForm p {
        margin-bottom: 15px;
    }
    .registrationForm .tag {
        font-weight: 500;
        color: white;
    }
    .registrationForm .input {
        margin-bottom: 15px;
    }
    .registrationForm .tag{
        display: inline-block;
        width: 90px;
        margin-bottom: 5px;
    }
    .registrationForm .checkboxText{
        width: 90px;
        margin-bottom: 5px;
        margin-left: 10px;
    }
    .registrationForm input,
    .registrationForm select {
        border-radius: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        outline: none;
    }
    .signInButton {
        font-size: 1.2rem;
        padding: 10px 20px;
        width: auto;
        border-radius: 20px;
        border: none;
        background-color: hsla(160, 100%, 37%, 1);
        color: white;
        cursor: pointer;
    }
    .signInButton:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    .warning {
        color: red;
        font-size: 0.8rem;
        margin-top: 5px;
    }
    .initialWarning {
        color: hsla(160, 100%, 37%, 1);
        font-size: 0.8rem;
        margin-top: 5px;
    }

    @media (max-width: 1023px) {
        .registrationForm h2{
            text-align: center;
            margin: 0 auto 2rem;
        } 
    }
</style>