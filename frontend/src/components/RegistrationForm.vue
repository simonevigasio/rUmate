<script setup>
    import { ref, computed } from 'vue'

    const message = ref('Insert your credentials to sign in')
    const username = ref('')
    const password = ref('')
    const passwordRepeated = ref('')
    const hasUsernameError = ref(false)
    const hasPasswordError = ref(false)
    const hasPasswordRepeatedError = ref(false)
    const warningUsername = ref('Username must be between 3 and 50 characters')
    const warningPassword = ref('Password must must contain at least one symbol (!@#$%^&*(),.?)')
    const warningPassword2 = ref('Password must be between 5 and 255 characters')
    const warningPasswordRepeated = ref('Password must be the same as the one inserted above')
    const show = ref(false)
    const passwordType = computed(() => show.value ? 'text' : 'password');

    const signedIn = ref(false)

    const isButtonDisabled = computed(() => {
        return !username.value || !password.value || !passwordRepeated.value
    })

    async function signup() {
        const user = {
            username: username.value,
            password: password.value,
        }

        try {
            const resp = await fetch("http://localhost:3000/authenticate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            const token = resp.headers.get('X-Auth-Token');

            const json = await resp.json();

            localStorage.setItem("token", token);
            localStorage.setItem("username", json.username);

            message.value = "You successfully signed in!"
            triggerForm();
        }
        catch (ex) {
            console.error(ex);
        }
    }

    function trySignIn(){
        warningUsername.value = ''
        warningPassword.value = ''
        warningPassword2.value = ''
        warningPasswordRepeated.value = ''

        if(username.value.length < 3 || username.value.length > 50) {
            warningUsername.value = 'Username must be between 8 and 25 characters'
            hasUsernameError.value = true
        }else{
            hasUsernameError.value = false
        }

        if(!/[!@#$%^&*(),.?]/.test(password.value)) {
            warningPassword.value = 'Password must contain at least one symbol (!@#$%^&*(),.?)'
            hasPasswordError.value = true
        }
        if(password.value.length < 5 || password.value.length > 255){
            warningPassword2.value = 'Password must be between 5 and 255 characters'
            hasPasswordError.value = true
        }
        if(warningPassword.value == '' && warningPassword2.value == ''){
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

        signup();
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

            triggerForm();
        }
        catch (ex) {
            console.error(ex);
        }
    }

    function showPassword(){
        show.value = !show.value
    }

    function triggerForm(){
        if(signedIn.value == true){
            username.value = ''
            password.value = ''
            passwordRepeated.value = ''
            hasUsernameError.value = false
            hasPasswordError.value = false
            hasPasswordRepeatedError.value = false
            warningUsername.value = 'Username must be between 3 and 50 characters'
            warningPassword.value = 'Password must must contain at least one symbol (!@#$%^&*(),.?)'
            warningPassword2.value = 'Password must be between 3 and 255 characters'
            warningPasswordRepeated.value = 'Password must be the same as the one inserted above'
        }
        signedIn.value = !signedIn.value
    }
</script>

<template>
    <h2><span class="green" v-html="message"></span></h2>

    <form class="registrationForm">
        <template v-if="!signedIn">
            <div class="inputGroup">
                <div class="input">
                    <label class="tag" for="signupUsername">Username:</label>
                    <input id="signupUsername" v-model="username" placeholder="Inserisci username qui"></input>
                    <p :class="{ 'initialWarning': !hasUsernameError, 'warning': hasUsernameError }">{{ warningUsername }}</p>
                </div>
                <div class="input">
                    <label class="tag" for="signupPassword">Password:</label>
                    <input id="signupPassword" :type="passwordType" v-model="password" placeholder="Inserisci password qui"></input>
                    <div class="passWarnings">
                        <p :class="{ 'initialWarning': !hasPasswordError, 'warning': hasPasswordError }">{{ warningPassword }} </p>
                        <p :class="{ 'initialWarning': !hasPasswordError, 'warning': hasPasswordError }">{{ warningPassword2 }} </p> 
                    </div>
                </div>
                <div class="input">
                    <label class="tag" for="passwordRepeated">Ripeti password:</label>
                    <input id="passwordRepeated" :type="passwordType" v-model="passwordRepeated" placeholder="Reinserisci password qui"></input>
                    <p :class="{ 'initialWarning': !hasPasswordRepeatedError, 'warning': hasPasswordRepeatedError }">{{ warningPasswordRepeated }}</p>
                </div>
            </div>

            <input type="checkbox" class="checkbox" v-model="show" @input="showPassword"><label class="checkboxText" for="checkbox">Mostra password</label>
            
            <h2><button class="button" type="button" @click="trySignIn" :disabled="isButtonDisabled">Sign In</button></h2>
        </template>

        <template v-else>
            <h2><button class="button" type="button" @click="logout">Log out</button></h2>
        </template>
    </form>
</template>

<style scoped>
    h2 {
        font-weight: 500;
        font-size: 2.0rem;
        padding: 10px;
        margin-bottom: 10px;
    }
    .registrationForm {
        border-radius: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        outline: none;
        width: 400px;
        margin-top: 15px;
        border-radius: 20px;
    }
    .button {
        font-weight: 500;
        font-size: 1.2rem;
        padding: 10px;
        outline: none;
        width: 130px;
        border-radius: 20px;
        border: none;
        margin-top: 30px;
        background-color: hsla(160, 100%, 37%, 1);
        color: white;
        cursor: pointer;
    }
    .button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    .inputGroup {
        text-align: left;
        margin-top: 15px;
    }
    .registrationForm .passWarnings {
        margin-bottom: 15px;
    }
    .registrationForm .tag {
        font-weight: 500;
        display: inline-block;
        width: 90px;
        margin-bottom: 5px;
        color: white;
    }
    .inputGroup input{
        width: 200px;
        height: 40px;
        margin-bottom: 15px;
        border-radius: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        outline: none;
    }
    .registrationForm .input{
        margin-bottom: 20px;
    }
    .registrationForm .checkbox {
        margin-top: 25px;
    }
    .registrationForm .checkboxText{
        width: 90px;
        margin-bottom: 5px;
        margin-left: 10px;
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
</style>