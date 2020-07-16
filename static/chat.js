document.addEventListener('DOMContentLoaded', () => {
    // Connect to socket
    if (window.location.protocol === "https:") {
        window.location.protocol = "http:";
    }

    document.querySelector("#themeSelect").onchange = () => {
        let body = document.querySelector("body");
        let bar = document.querySelector(".messageBar");

        //Resetting the body styles
        body.style = "";
        bar.style = "";


        //Set style based on selected theme
        switch (document.querySelector("#themeSelect").value) {

            case "basic":
                body.style.color = "black";
                body.style.backgroundColor = "white";
                bar.style.backgroundColor = "rgb(160, 160, 160)";
                break;

            case "mustard":
                body.style.color = "red";
                body.style.backgroundColor = "yellow";

                bar.style.color = "yellow";
                bar.style.backgroundColor = "red";
                break;

            case "dark":
                body.style.color = "white";
                body.style.backgroundColor = "black";
                bar.style.backgroundColor = "rgba(0, 0, 0, 0)"
                break;

            case "vibe":
                var params = ["270deg, #e9ec5e, #ff2278", "270deg, #02bee8, #7a33bf", "270deg, #840029, #a91834, #f64d52"];
                var rand = Math.floor(Math.random() * params.length);

                body.style.color = "white";
                body.style.background = "linear-gradient(" + params[rand] + ")";
                body.style.animation = "grad 9s ease infinite";
                body.style.backgroundSize = "400% 400%";
                bar.style.backgroundColor = "rgba(160, 160, 160, .5)"
                break;
        }
    }


    console.log("connecting");
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    // Get username
    const username = document.querySelector("#username").innerHTML;

    //Update online users list with new user
  //  socket.emit('user connected', { 'uname': username });

    //Update Online List for everyone
    socket.emit('update online list');


    //Broadcast msg:
    document.querySelector('#sendMessage').onclick = () => {
        const msg = document.querySelector("#message").value;
        if (msg == "") {
            alert("Cannot send empty message")
        } else {
            socket.emit('post message', { 'message': msg, 'user': username })
            console.log("sending message: " + msg);
            document.querySelector("#message").value = "";
            socket.emit('update online list');
        };
    }

    document.querySelector("#message").addEventListener("keyup", event => {
        if (event.key !== "Enter") return;
        document.querySelector("#sendMessage").click();
        event.preventDefault();
    });

    socket.on('broadcast message', data => {
        const li = document.createElement('li');
        console.log(`getting message: ${data.msg}`)
        li.innerHTML = `${data.user}: ${data.message}`;
        document.querySelector("#messages").append(li);
        document.querySelector("#messages *:last-child").scrollIntoView();
    });

    socket.on('add new online', data => {
        const item = document.createElement('li');
        item.innerHTML = `${data.uname}`;
        document.querySelector("#onlineUsers").append(item);
    });


    socket.on('send username', () => {
        //let username = document.querySelector("#username").innerHTML
        document.querySelector("#onlineUsers").innerHTML = "";
        socket.emit('pass username', {'uname' : username});
    });

});
