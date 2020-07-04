document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    var sbmt = document.querySelector("#submitBtn")

    socket.on('connect', () => {
        console.log("connected to socket")
        sbmt.onclick = () => {
            const msg = document.querySelector('#message').value;
            socket.emit('post message', { 'message': msg });
        };

    });
    socket.on('broadcast message', data => {
        const li = document.createElement('li');
        li.innerHTML = `Message: ${data.message}`;
        document.querySelector('#messages').append(li);
    });


});