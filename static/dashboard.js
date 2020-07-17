document.addEventListener('DOMContentLoaded', () => {
    // Trigger file upload when profilepic is clicked
    document.querySelector("#profilePicSection").onclick = () => {
        document.querySelector("#profilePicUpload").click();
    };
    toggleHelp("announcement", "annouHelp");
    toggleHelp("bioText", "bioHelp");
    toggleHelp("urlText", "urlHelp");
    toggleHelp("locationText", "locationHelp");


    //Trigger when user clicks save: 
    document.querySelector("#saveBtn").onclick = () => {
        const bio = document.querySelector("#bioText").value;
        const announcement = document.querySelector("#announcement").value;
        const url = document.querySelector("#urlText").value;
        const location = document.querySelector("#locationText").value;
        // Init new AJAX request:
        const request = new XMLHttpRequest();
        request.open('POST', '/savechanges');
        request.onload = () => {

            const data = JSON.parse(request.responseText);
            console.log(data)
        };
        //Add data to request:
        const data = new FormData();
        data.append('bio', bio);
        data.append('announcement', announcement);
        data.append('url', url);
        data.append('location', location);
        //send req
        request.send(data)
        return false;
    };
});




//Function to toggle help text on focus/blur
function toggleHelp(inputID, helpID) {
    inputID = "#" + inputID;
    helpID = "#" + helpID;
    document.querySelector(inputID).onfocus = () => {
        document.querySelector(helpID).style.visibility = "visible";
    };
    document.querySelector(inputID).onblur = () => {
        document.querySelector(helpID).style.visibility = "hidden";
    }
};