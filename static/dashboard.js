document.addEventListener('DOMContentLoaded', () => {
    document.cookie = "samesite=secure, test=1";
    // Connect to socket
    console.log("connecting");
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    const username = document.querySelector("#username").innerHTML;
    socket.on('connect', () => {
        console.log("connected")
        document.querySelector("#sendMessage").onclick = () => {
            const msg = document.querySelector("#message").value;
            if (msg == "") {
                alert("Cannot send empty message")
            } else {

                socket.emit('post message', { 'message': msg, 'user': username });
                console.log("sending message: " + msg)
            }
        };
    });

    //Recieve incoming messages:
    socket.on('broadcast message', data => {
        const li = document.createElement('li');
        li.innerHTML = `${data.user}: ${data.message}`;
        document.querySelector("#messages").append(li);
    })


});