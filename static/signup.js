document.addEventListener('DOMContentLoaded', () => {
    //BEGIN CHANGE HTTPS TO HTTP
    if (window.location.protocol === "https:") {
        window.location.protocol = "http:";
    }
    //END CHANGE HTTPS TO HTTP

    isvalidusername = false;
    isvalidpassword = false;
    isvalidpasswordconf = false;

    //BEGIN DISBABLE SIGN UP BUTTON
    document.querySelector("#signupBtn").disabled = true;
    document.querySelector("#signupBtn").className = "btn btn-outline-danger";
    document.querySelector("#signUpBtn").innerHTML = "Please fill out fields before signing up";
    //END DISABLE SIGN UP BUTTON

    //BEGIN USERNAME VALIDATION
    document.querySelector("#usernamesu").onblur = () => {
        document.querySelector('#usernamereq').style.visibility = 'hidden';
        const username = document.querySelector('#usernamesu').value;
        const usernameReq = /(?=^[A-Za-z])(?=^.{6,64}$).*$/;
        if (username == "") {
            //HANDLE NO ENTRY HERE:
            document.querySelector("#noEntry").innerHTML = "Please enter a username donkey"
            document.querySelector('#usernamesu').className = "form-control";
        } else if (!username.match(usernameReq)) {
            document.querySelector("#usernamesuInvalid").innerHTML = "Username requirements not met";
            document.querySelector('#usernamesu').className = "form-control is-invalid";
        } else {
            console.log("yash...your next issue is gonna be a front end toolbar if you cant do this shit");
            // Init new AJAX request:
            const request = new XMLHttpRequest();
            if (!(username == "")) {
                document.querySelector("#noEntry").innerHTML = ""
                    //LOADING BAR HERE
                document.querySelector('#loadingBtn').style = "display:block;";
                request.open('POST', '/checkUsername');
                //After request completion:
                request.onload = () => {
                        // const isTaken = JSON.parse(request.responseText);
                        const data = JSON.parse(request.responseText);
                        console.log(data)
                            //update <small>:
                        if (data.isTaken) {
                            document.querySelector("#usernamesuInvalid").innerHTML = "Username is taken"
                            document.querySelector('#usernamesu').className = "form-control is-invalid";
                            document.querySelector('#checkusername').style = "display:block;";
                            document.querySelector('#loadingBtn').style = "display:none;";
                        } else {
                            document.querySelector("#usernamesuValid").innerHTML = "Username is avaliable"
                            document.querySelector('#usernamesu').className = "form-control is-valid";
                            document.querySelector('#loadingBtn').style = "display:none;";
                            isvalidusername = true;
                        }
                    }
                    //Add data to request:
                const data = new FormData();
                data.append('username', username);
                //send req
                request.send(data)
                return false;
            }
        }
    };
    //END USERNAME VALIDATION 

    //Client side verfication to check if username and password fields are blank:
    document.querySelector("#signupBtn").onclick = () => {
        const password = document.querySelector("#passwordsu").value;
        const passwordConf = document.querySelector("#passwordsuConf").value;
        const username = document.querySelector("#usernamesu").value;
        if (username == "") {
            // alert("Please enter a username!")
            document.querySelector("#noEntry").innerHTML = "Please enter a username donkey"
        }
        if (password == "") {
            // alert("Please enter a password!")
            document.querySelector('#passwordsu').className = "form-control is-invalid";
        } else {
            if (password !== passwordConf) {
                document.querySelector('#passwordsuConf').className = "form-control is-invalid";
            } else if (password === passwordConf) {
                document.querySelector('#creatingUser').style = "display:block;";
                document.querySelector("#signup").submit()
            }
        }
    };
    document.querySelector('#usernamesu').onfocus = () => {
        document.querySelector('#usernamereq').style.visibility = 'visible';
        document.querySelector("#noEntry").innerHTML = ""
    };
    document.querySelector('#passwordsu').onfocus = () => {
        document.querySelector('#passreq').style.visibility = 'visible';
    };
    document.querySelector('#passwordsu').onblur = () => {
        document.querySelector('#passreq').style.visibility = 'hidden';
        password = document.querySelector("#passwordsu").value;
        passwordReq = /(?=^[A-Za-z])(?=^.{8,330}$)(?=.*[!@#$%^&*]+)(?=^\S+$)(?=.*\d{1,})(?=.*[a-z]{1,})(?=.*[A-Z]{1,}).*$/
        if (!password.match(passwordReq)) {
            //alert("You did not meet the password requirements")
            document.querySelector("#passwordsuInvalid").innerHTML = "Password did not meet the criteria";
            document.querySelector("#passwordsu").className = "form-control is-invalid";
        } else {
            document.querySelector("#passwordsu").className = "form-control is-valid";
            isvalidpassword = true;
        }
    }
    document.querySelector('#passwordsuConf').oninput = () => {
            password = document.querySelector("#passwordsu").value;
            passwordConf = document.querySelector("#passwordsuConf").value;
            if (password !== passwordConf) {
                document.querySelector("#passwordsuConf").className = "form-control is-invalid";
            } else if (password === passwordConf) {
                document.querySelector("#passwordsuConf").className = "form-control is-valid";
                isvalidpasswordconf = true;
            }
        }
        //CHECK IF ALL FIELDS ARE VALID THEN ENABLE BUTTON

});