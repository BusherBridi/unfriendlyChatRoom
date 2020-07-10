// document.addEventListener('DOMContentLoaded', () => {
//     // Connect to socket
//     console.log("connecting");
//     var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

//     const username = document.querySelector("#username").innerHTML;
//     socket.on('connect', () => {
//         console.log("connected")
//         document.querySelector("#sendMessage").onclick = () => {
//             const msg = document.querySelector("#message").value;
//             if (msg == "") {
//                 alert("Cannot send empty message")
//             } else {

//                 socket.emit('post message', { 'message': msg, 'user': username });
//                 console.log("sending message: " + msg)
//             }
//         };
//     });

//     //Recieve incoming messages:
//     socket.on('broadcast message', data => {
//         const li = document.createElement('li');
//         li.innerHTML = `${data.user}: ${data.message}`;
//         document.querySelector("#messages").append(li);
//     })


// });


document.addEventListener('DOMContentLoaded', () => {
    // Connect to socket
    if (window.location.protocol === "https:") {
        window.location.protocol = "http:";
    }

    document.querySelector("#themeSelect").onchange = () => {
      switch(document.querySelector("#themeSelect").value) {
        case "basic":
          document.querySelector("body").style.color = "black";
          document.querySelector("body").style.backgroundColor = "white";
          break;

        case "mustard":
          document.querySelector("body").style.color = "red";
          document.querySelector("body").style.backgroundColor = "yellow";
          break;

        case "dark":
          document.querySelector("body").style.color = "white";
          document.querySelector("body").style.backgroundColor = "black";
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
    })
});
