/* function used to create an account */
async function signup() {

    /* get the username and password from the form */
    const user = {
        username: document.getElementById("signupUsername").value,
        password: document.getElementById("signupPassword").value,
    }

    try {

        /* POST request to backend asking to create a new account with username and password */
        resp = await fetch("../signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        
        /* from the header of the response extract the token for future access */
        const token = resp.headers.get('X-Auth-Token');

        /* parse the boby af the response into json format */
        json = await resp.json();

        /* save token and username into localStorage */
        localStorage.setItem("token", token);
        localStorage.setItem("username", json.username);
    }
    catch (ex) {

        /* in case of exception from the backend request, log the error */
        console.error(ex);
    }
}

/* function used to login into the app using a specific account */
async function login() {

    /* get the username and password from the form */
    const user = {
        username: document.getElementById("loginUsername").value,
        password: document.getElementById("loginPassword").value,
    }

    try {

        /* POST request to backend asking to login with a specific account matching username */
        resp = await fetch("../login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        
        /* parse the boby af the response into json format */
        json = await resp.json();

        /* save token and username into localStorage */
        localStorage.setItem("token", json.token);
        localStorage.setItem("username", user.username);
    } 
    catch (ex) {

        /* in case of exception from the backend request, log the error */
        console.error(ex);
    }
}

function logout() {
    console.log("logout");
}