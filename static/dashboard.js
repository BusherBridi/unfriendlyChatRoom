document.addEventListener('DOMContentLoaded', () => {
    // Connect to socket
    if (window.location.protocol === "https:") {
        window.location.protocol = "http:";
    }

    document.querySelector("#themeSelect").onchange = () => {
        let body = document.querySelector("body");

        //Resetting the body styles
        body.style.background = "";
        body.style.animation = "";
        body.style.backgroundSize = "";

        //Set style based on selected theme
        switch (document.querySelector("#themeSelect").value) {

            case "basic":
                body.style.color = "black";
                body.style.backgroundColor = "white";
                document.querySelector(".messageBar").backgroundColor = "white";
                break;

            case "mustard":
                body.style.color = "red";
                body.style.backgroundColor = "yellow";
                document.querySelector(".messageBar").backgroundColor = "white";
                break;

            case "dark":
                body.style.color = "white";
                body.style.backgroundColor = "black";
                break;

            case "vibe":
                var params = ["270deg, #e9ec5e, #ff2278", "270deg, #02bee8, #7a33bf", "270deg, #840029, #a91834, #f64d52"];
                var rand = Math.floor(Math.random() * params.length);

                body.style.color = "white";
                body.style.background = "linear-gradient(" + params[rand] + ")";
                body.style.animation = "grad 9s ease infinite";
                body.style.backgroundSize = "400% 400%";
                break;
        }
    }


    console.log("connecting");
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    // Get username
    const username = document.querySelector("#username").innerHTML;

    //Broadcast msg:

    document.querySelector('#sendMessage').onclick = () => {
        const msg = document.querySelector("#message").value;
        if (msg == "") {
            alert("Cannot send empty message")
        } else {
            socket.emit('post message', { 'message': msg, 'user': username })
            console.log("sending message: " + msg);
        };
    }
    socket.on('broadcast message', data => {
        const li = document.createElement('li');
        console.log(`getting message: ${data.msg}`)
        li.innerHTML = `${data.user}: ${data.message}`;
        document.querySelector("#messages").append(li);
        document.querySelector("#messages *:last-child").scrollIntoView();
    })
});
