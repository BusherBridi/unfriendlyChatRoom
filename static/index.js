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
            data.append('signup', username);

            //send req
            request.send(data)
            return false;
        } else {
            alert("No")
            return false;
        }

    };
    document.querySelector("#signupBtn").onclick = () => {
        const password = document.querySelector("#passwordsu").value;
        const passwordConf = document.querySelector("#passwordsuConf").value;
        if (password !== passwordConf) {
            document.querySelector("#passwordError").innerHTML = "passwords do not match"
        } else if (password === passwordConf) {
            document.querySelector("#creatingUser").innerHTML = "Creating User..."
            document.querySelector("#signup").submit()

        }
    };
});









// // Connect to websocket
// var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

// var sbmt = document.querySelector("#submitBtn")

// socket.on('connect', () => {
//     console.log("connected to socket")
//     sbmt.onclick = () => {
//         const msg = document.querySelector('#message').value;
//         socket.emit('post message', { 'message': msg });
//     };

// });
// socket.on('broadcast message', data => {
//     const li = document.createElement('li');
//     li.innerHTML = `Message: ${data.message}`;
//     document.querySelector('#messages').append(li);
// });