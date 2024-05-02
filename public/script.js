var loggedUser = {}

function signup() {
    const user = {
        username: document.getElementById("signupUsername").value,
        password: document.getElementById("signupPassword").value,
    }
    
    fetch("../signup", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((resp) => {
            loggedUser.token = resp.headers.get('X-Auth-Token');
            return resp.json();
        })
        .then(function(data) { 
            loggedUser.username = data.username;
            localStorage.setItem("user", loggedUser);
            return;
        })
        .catch( error => console.error(error) );
}

function login() {
    const user = {
        username: document.getElementById("loginUsername").value,
        password: document.getElementById("loginPassword").value,
    }
    
    fetch(`../login`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    })
        .then((resp) => {
            return resp.json();
        })
        .then(function(data) { 
            loggedUser.username = user.username;
            loggedUser.token = data.token;
            localStorage.setItem("user", loggedUser);
            return;
        })
        .catch( error => console.error(error) );
}

function logout() {
    loggedUser = {}
    console.log(loggedUser);
}