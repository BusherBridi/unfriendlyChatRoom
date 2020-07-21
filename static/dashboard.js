document.addEventListener('DOMContentLoaded', () => {
    // Trigger file upload when profilepic is clicked
    document.querySelector("#profilePicSection").onclick = () => {
        document.querySelector("#uploadSection").style.visibility = "visible";
    };
    toggleHelp("announcement", "annouHelp");
    toggleHelp("bioText", "bioHelp");
    toggleHelp("urlText", "urlHelp");
    toggleHelp("locationText", "locationHelp");

    getChanges();
    //'upload' PROFILE PIC:
    document.querySelector("#changePicBtn").onclick = () => {
        // Init new AJAX request:
        const profilePicUrl = document.querySelector("#picurl").value;
        const request = new XMLHttpRequest();
        request.open('POST', '/changePic');
        request.onload = () => {
            const data = JSON.parse(request.responseText);
            console.log(data);
            getChanges();
            document.querySelector("#uploadSection").style.visibility = "hidden";
        };
        //Add data to request:
        const data = new FormData();
        data.append("profilePicUrl", profilePicUrl);
        request.send(data);
        return false;
    };
    //SAVE CHANGES:
    //Trigger when user clicks save: 
    document.querySelector("#saveBtn").onclick = () => {
        const divSave = document.createElement('div');
        divSave.innerHTML = `Saving your shitty info`;
        divSave.classList.add('alert');
        divSave.classList.add('alert-success');
        divSave.classList.add("w3-spin");
        divSave.style.width = "300px";
        document.querySelector("#personalInfo").prepend(divSave);
        setTimeout(function() {
            divSave.classList.remove("w3-spin");
        }, 3000);
        const bio = document.querySelector("#bioText").value;
        const announcement = document.querySelector("#announcement").value;
        const url = document.querySelector("#urlText").value;
        const location = document.querySelector("#locationText").value;
        // Init new AJAX request:
        const request = new XMLHttpRequest();
        request.open('POST', '/savechanges');
        request.onload = () => {
            divSave.classList.remove("w3-spin");
            divSave.innerHTML = "Shitty info saved"
            setTimeout(() => {
                divSave.remove();
            }, 3000);
            const data = JSON.parse(request.responseText);
            console.log(data);
        };
        //Add data to request:
        const data = new FormData();
        data.append('bio', bio);
        data.append('announcement', announcement);
        data.append('url', url);
        data.append('location', location);
        //send req
        request.send(data)
        getChanges();
        return false;

    };
});


//Function to get changes from db and update html
function getChanges() {
    //GET CHANGES:
    const request = new XMLHttpRequest();
    request.open('POST', '/getchanges');
    console.log("loading...")
    const divSucc = document.createElement('div');
    divSucc.innerHTML = `Getting your shitty info`;
    divSucc.classList.add('alert');
    divSucc.classList.add('alert-primary');
    divSucc.classList.add("w3-spin");
    divSucc.style.width = "300px";
    document.querySelector("#personalInfo").prepend(divSucc);
    setTimeout(function() {
        divSucc.classList.remove("w3-spin");
    }, 3000);
    request.onload = () => {
        const data = JSON.parse(request.responseText);
        console.log(data);
        if (data.success == true) {
            divSucc.remove();
            document.querySelector("#bioText").value = data.bio;
            document.querySelector("#announcement").value = data.announcement;
            document.querySelector("#urlText").value = data.url;
            document.querySelector("#locationText").value = data.location;
            document.querySelector("#profilePic").src = data.profilePicUrl;
        } else {
            setTimeout(() => {
                divSucc.remove();
            }, 3000);
            const divNotSucc = document.createElement('div');
            divNotSucc.innerHTML = `Uh oh! An error occured and we couldn't get your shitty info`;
            divNotSucc.classList.add('alert');
            divNotSucc.classList.add('alert-danger');
            divNotSucc.classList.add("w3-spin");
            divNotSucc.style.width = "300px";
            document.querySelector("#personalInfo").prepend(divNotSucc);
            setTimeout(function() {
                divNotSucc.classList.remove("w3-spin");
            }, 3000);
            setTimeout(function() {
                divNotSucc.remove();
            }, 10000);
        }
    };
    request.send();

};

//Function to toggle help text on focus/blur
function toggleHelp(inputID, helpID) {
    inputID = "#" + inputID;
    helpID = "#" + helpID;
    document.querySelector(inputID).onfocus = () => {
        document.querySelector(helpID).style.visibility = "visible";
    };
    document.querySelector(inputID).onblur = () => {
        document.querySelector(helpID).style.visibility = "hidden";
    };
};