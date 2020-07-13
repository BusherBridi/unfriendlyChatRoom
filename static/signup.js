document.addEventListener('DOMContentLoaded', () => {
    if (window.location.protocol === "https:") {
        window.location.protocol = "http:";
    }
    document.querySelector('#checkUsername').onclick = () => {
        document.querySelector("#alreadyExists").innerHTML = "Checking..."

        // Init new AJAX request:
        const request = new XMLHttpRequest();
        const username = document.querySelector('#usernamesu').value;
        if (!(username == "")) {
            request.open('POST', '/checkUsername');

            //After request completion:
            request.onload = () => {
                    // const isTaken = JSON.parse(request.responseText);
                    const data = JSON.parse(request.responseText);
                    console.log(data)

                    //update <small>:
                    if (data.isTaken) {
                        document.querySelector('#alreadyExists').innerHTML = "This username is already taken";

                    } else {
                        document.querySelector('#alreadyExists').innerHTML = "This username is not claimed";
                    }
                }
                //Add data to request:
            const data = new FormData();
            data.append('createUser', username);

            //send req
            request.send(data)
            return false;
        } else {
            document.querySelector("#alreadyExists").innerHTML = "Please enter a username donkey"
            return false;
        }

    };
    //Client side verfication to check if username and password fields are blank:
    document.querySelector("#signupBtn").onclick = () => {
        const password = document.querySelector("#passwordsu").value;
        const passwordConf = document.querySelector("#passwordsuConf").value;
        const username = document.querySelector("#usernamesu").value;
        if (username == "") {
            alert("Please enter a username!")
        }
        if (password == "") {
            alert("Please enter a password!")
        } else {
            if (password !== passwordConf) {
                document.querySelector("#passwordError").innerHTML = "passwords do not match"
            } else if (password === passwordConf) {
                document.querySelector("#creatingUser").innerHTML = "Creating User..."
                document.querySelector("#signup").submit()

            }
        }
    };
});