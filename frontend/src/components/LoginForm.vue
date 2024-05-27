<script setup>
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router';

    const message = ref('Inserisci le credenziali per accedere')
    const username = ref('')
    const password = ref('')
    const hasError = ref(false)
    const warning = ref('')
    const show = ref(false)
    const passwordType = computed(() => show.value ? 'text' : 'password');

    const loggedIn = ref(false)

    const router = useRouter();

    const isButtonDisabled = computed(() => {
        return !username.value || !password.value
    })

    async function login() {
        warning.value = ''
        hasError.value = false

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

            message.value = "Accesso effettuato correttamente!"
            triggerForm();
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } 
        catch (ex) {
            console.error(ex);
            warning.value = 'Username o password non validi'
            hasError.value = true;
        }
    }

    function showPassword(){
        show.value = !show.value
    }

    function triggerForm(){
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

            <div class="centeredGroup">
                <input type="checkbox" id="checkbox" v-model="show" @input="showPassword">
                <label class="checkboxText" for="checkbox">Mostra password</label>
            </div>

            <div class="centeredGroup">
                <button class="logInButton" type="button" @click="login" :disabled="isButtonDisabled">Log In</button>
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
    .LoginForm {
        border-radius: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        outline: none;
        width: 400px;
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .logInButton {
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
        text-align: left;
        margin-top: 15px;
        width: 100%;
    }
    .input {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 15px;
    }
    .LoginForm .tag {
        font-weight: 500;
        color: white;
        width: 90px;
        margin-right: 10px;
    }
    .inputGroup input {
        width: 200px;
        height: 40px;
        margin-bottom: 15px;
        border-radius: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        outline: none;
    }
    .LoginForm .checkboxText {
        width: 120px;
        margin-bottom: 5px;
        margin-left: 10px;
    }
    .warning {
        color: red;
        font-size: 0.8rem;
        margin-top: 5px;
        margin-bottom: 15px;
    }
    .centeredGroup {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;
    }
</style>