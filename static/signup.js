document.addEventListener('DOMContentLoaded', () => {
    if (window.location.protocol === "https:") {
        window.location.protocol = "http:";
    }
    document.querySelector('#checkUsername').onclick = () => {
        const username = document.querySelector('#usernamesu').value;
        if (username == "") {
            //HANDLE NO ENTRY HERE:
            document.querySelector("#noEntry").innerHTML = "Please enter a username donkey"
            document.querySelector('#usernamesu').className = "form-control";
        }


        // Init new AJAX request:
        const request = new XMLHttpRequest();

        if (!(username == "")) {
            document.querySelector("#noEntry").innerHTML = ""
                //LOADING BAR HERE
            document.querySelector('#checkusername').style = "display:none;";
            document.querySelector('#loadingBtn').style = "display:block;";

            request.open('POST', '/checkUsername');

            //After request completion:
            request.onload = () => {
                    // const isTaken = JSON.parse(request.responseText);
                    const data = JSON.parse(request.responseText);
                    console.log(data)

                    //update <small>:
                    if (data.isTaken) {

                        document.querySelector('#usernamesu').className = "form-control is-invalid";
                        document.querySelector('#checkusername').style = "display:block;";
                        document.querySelector('#loadingBtn').style = "display:none;";


                    } else {

                        document.querySelector('#usernamesu').className = "form-control is-valid";
                        document.querySelector('#checkusername').style = "display:block;";
                        document.querySelector('#loadingBtn').style = "display:none;";
                    }
                }
                //Add data to request:
            const data = new FormData();
            data.append('username', username);

            //send req
            request.send(data)
            return false;
        } else {
            //HANDLE NO ENTRY HERE:
            document.querySelector("#noEntry").innerHTML = "Please enter a username donkey"
            return false;
        }

    };
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
});