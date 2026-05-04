const BASE_URL = "http://localhost:3000";

// VALIDATIONS
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateMobile(mobile) {
    return /^[0-9]{10}$/.test(mobile);
}

// REGISTER (AJAX POST)
function register() {
    let user = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        mobile: document.getElementById("mobile").value.trim(),
        dob: document.getElementById("dob").value,
        city: document.getElementById("city").value.trim(),
        address: document.getElementById("address").value.trim(),
        password: document.getElementById("password").value
    };

    // VALIDATION
    if (!user.name) return alert("Name required");
    if (!validateEmail(user.email)) return alert("Invalid email");
    if (!validateMobile(user.mobile)) return alert("Mobile must be 10 digits");
    if (!user.dob) return alert("DOB required");
    if (!user.city) return alert("City required");
    if (!user.address) return alert("Address required");
    if (user.password.length < 6) return alert("Password min 6 chars");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/register`, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
        if (xhr.status === 200) {
            alert("Registered Successfully");
        } else {
            alert(JSON.parse(xhr.responseText).message);
        }
    };

    xhr.send(JSON.stringify(user));
}

// LOGIN (AJAX POST)
function login() {
    let data = {
        email: document.getElementById("loginEmail").value.trim(),
        password: document.getElementById("loginPassword").value
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/login`, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
        if (xhr.status === 200) {
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid credentials");
        }
    };

    xhr.send(JSON.stringify(data));
}