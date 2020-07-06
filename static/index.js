document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#signup').onsubmit = () => {

        // Init new AJAX request:
        const request = new XMLHttpRequest();
        const username = document.querySelector('#usernamesu').value;
        if (!(username == "")) {
            request.open('POST', '/signup');

            //After request completion:
            request.onload = () => {
                    // const isTaken = JSON.parse(request.responseText);
                    const data = JSON.parse(request.responseText);
                    console.log(data)

                    //update <small>:
                    if (data.isTaken) {
                        document.querySelector('#alreadyExists').innerHTML = "This username is already taken";

                    } else {
                        document.querySelector('#alreadyExists').innerHTML = "";
                    }
                }
                //Add data to request:
            const data = new FormData();
            data.append('signup', username);

            //send req
            request.send(data)
            return false;
        } else {
            document.querySelector('#alreadyExists').innerHTML = "dude... fill it out first..."
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