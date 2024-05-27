<script setup>
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router';

    const message = ref('Inserisci le credenziali per la registrazione')
    const username = ref('')
    const password = ref('')
    const passwordRepeated = ref('')
    const hasUsernameError = ref(false)
    const hasPasswordError = ref(false)
    const hasPasswordRepeatedError = ref(false)
    const warningUsername = ref('Lo username deve contenere dai 3 ai 50 caratteri')
    const warningPassword = ref('La password deve contenere dai 5 ai 255 caratteri')
    const warningPasswordRepeated = ref('La password deve essere uguale a quella inserita sopra')
    const show = ref(false)
    const passwordType = computed(() => show.value ? 'text' : 'password');

    const signedIn = ref(false)

    const router = useRouter();

    const isButtonDisabled = computed(() => {
        return !username.value || !password.value || !passwordRepeated.value
    })

    function trySignup(){
        warningUsername.value = 'Lo username deve contenere dai 3 ai 50 caratteri'
        warningPassword.value = 'La password deve contenere dai 5 ai 255 caratteri'
        warningPasswordRepeated.value = ''
        hasUsernameError.value = false
        hasPasswordError.value = false
        hasPasswordRepeatedError.value = false

        if(passwordRepeated.value != password.value){
            warningPasswordRepeated.value = 'La password deve essere uguale a quella inserita sopra'
            hasPasswordRepeatedError.value = true
        }else{
            signup();
        }
    }

    async function signup() {
        const user = {
            username: username.value,
            password: password.value,
        }

        warningUsername.value = ''
        warningPassword.value = ''
        hasUsernameError.value = false
        hasPasswordError.value = false

        try {
            const resp = await fetch("http://localhost:3000/authenticate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            const token = resp.headers.get('X-Auth-Token');

            const json = await resp.json();
            console.log(json);

            localStorage.setItem("token", token);
            localStorage.setItem("username", json.username);

            if(resp.status === 200){
                message.value = "Registrazione effettuata correttamente!"
                triggerForm();
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            }else{
                const errorMessage = json.message || 'Registrazione fallita';
                warningUsername.value = errorMessage;
                hasUsernameError.value = true;
            }
        }
        catch (ex) {
            if(username.value.length < 3 || username.value.length > 50) {
                warningUsername.value = 'Lo username deve contenere dai 3 ai 50 caratteri'
                hasUsernameError.value = true
            }

            if(password.value.length < 5 || password.value.length > 255){
                warningPassword.value = 'La password deve contenere dai 5 ai 255 caratteri'
                hasPasswordError.value = true
            }

            console.error(ex);
        }
    }

    function showPassword(){
        show.value = !show.value
    }

    function triggerForm(){
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
                    <p :class="{ 'initialWarning': !hasPasswordError, 'warning': hasPasswordError }">{{ warningPassword }} </p>
                </div>
                <div class="input">
                    <label class="tag" for="passwordRepeated">Ripeti password:</label>
                    <input id="passwordRepeated" :type="passwordType" v-model="passwordRepeated" placeholder="Reinserisci password qui"></input>
                    <p :class="{ 'initialWarning': !hasPasswordRepeatedError, 'warning': hasPasswordRepeatedError }">{{ warningPasswordRepeated }}</p>
                </div>
            </div>

            <div class="centeredGroup">
                <input type="checkbox" class="checkbox" v-model="show" @input="showPassword">
                <label class="checkboxText" for="checkbox">Mostra password</label>
            </div>
            
            <div class="centeredGroup">
                <button class="button" type="button" @click="trySignup" :disabled="isButtonDisabled">Sign In</button>
            </div>
        </template>

        <template v-else>
            <label class="tag">Caricando la home...</label>
        </template>
    </form>
</template>

<style scoped>
    h2 {
        font-weight: 500;
        font-size: 2.0rem;
        padding: 10px;
        margin-bottom: 10px;
        text-align: center;
        width: 100%;
    }
    .registrationForm {
        border-radius: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        outline: none;
        width: 400px;
        margin-top: 15px;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .button {
        font-weight: 500;
        font-size: 1.2rem;
        padding: 10px;
        outline: none;
        width: 100px;
        border-radius: 20px;
        border: none;
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
        width: 100%;
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
    .registrationForm .checkboxText{
        width: 120px;
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
    .centeredGroup {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 15px;
    }
</style>