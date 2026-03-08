document.getElementById('btn-sign-in').addEventListener("click",(e)=>{
    e.preventDefault();
    const url = document.getElementById("Username-input").value;
    // console.log(url);
    const password = document.getElementById("password-input").value;
    // console.log(password);
    if(url === "admin" && password === "admin1234"){
        window.location.href = "/index.html";
    }else{
        alert("Invalid Credentials");
    }
})