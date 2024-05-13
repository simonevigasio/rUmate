<script setup>
    import { ref, computed } from 'vue'

    const message = ref('Insert your credentials to log in')
    const username = ref('')
    const password = ref('')
    const hasError = ref(false)
    const warning = ref('')
    const show = ref(false)
    const passwordType = computed(() => show.value ? 'text' : 'password');

    const loggedIn = ref(false)

    const isButtonDisabled = computed(() => {
        return !username.value || !password.value
    })

    async function login() {
        warning.value = ''

        const user = {
            username: username.value,
            password: password.value,
        }
        try {
            const resp = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            
            const json = await resp.json();

            localStorage.setItem("token", json.token);
            localStorage.setItem("username", user.username);

            message.value = "You successfully logged in!"
            triggerForm();
        } 
        catch (ex) {
            console.error(ex);
                warning.value = 'Invalid username or password'
                hasError.value = true;
        }
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
        if(loggedIn.value == true){
            username.value = ''
            password.value = ''
            hasError.value = false
            warning.value = ''
        }
        loggedIn.value = !loggedIn.value
    }
</script>

<template>
     <h2><span class="green" v-html="message"></span></h2>

    <form class="LoginForm">
        <template v-if="!loggedIn">
            <div class="inputGroup">
                <div class="input">
                    <label class="tag" for="username">Username:</label>
                    <input id="username" v-model="username" placeholder="Inserisci username qui">
                </div>
                <div class="input">
                    <label class="tag" for="password">Password:</label>
                    <input id="password" :type="passwordType" v-model="password" placeholder="Inserisci password qui">
                    <p class="warning">{{ warning }}</p>
                </div>
            </div>

            <input type="checkbox" id="checkbox" v-model="show" @input="showPassword"><label class="checkboxText" for="checkbox">Mostra password</label>

            <h2><button class="logInButton" type="button" @click="login" :disabled="isButtonDisabled">Log In</button></h2>
        </template>

        <template v-else>
            <h2><button class="logOutButton" type="button" @click="logout">Log out</button></h2>
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
    .LoginForm {
        border-radius: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        outline: none;
        width: auto;
        margin-top: 15px;
    }
    .logInButton,
    .logOutButton {
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
    .logInButton:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
    .inputGroup {
        text-align: center;
        margin-top: 15px;
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
        margin-bottom: 15px;
    }
    .warning {
        color: red;
        font-size: 0.8rem;
        margin-top: 5px;
        margin-bottom: 15px;
    }
</style>