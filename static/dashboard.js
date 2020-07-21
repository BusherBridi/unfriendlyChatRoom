document.addEventListener('DOMContentLoaded', () => {
    // Trigger file upload when profilepic is clicked
    document.querySelector("#profilePicSection").onclick = () => {
        document.querySelector("#profilePicUpload").click();
    };
    toggleHelp("announcement", "annouHelp");
    toggleHelp("bioText", "bioHelp");
    toggleHelp("urlText", "urlHelp");
    toggleHelp("locationText", "locationHelp");
});




//Function to toggle help text on focus/blur
function toggleHelp(inputID, helpID) {
    inputID = "#" + inputID;
    helpID = "#" + helpID;
    console.log(inputID);
    document.querySelector(inputID).onfocus = () => {
        document.querySelector(helpID).style.visibility = "visible";
    };
    document.querySelector(inputID).onblur = () => {
        document.querySelector(helpID).style.visibility = "hidden";
    }
};