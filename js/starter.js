const connButton = document.getElementById("connector");
const connStatus = document.getElementById("statusbox");

var status = "disconnected";

const updateState = () => {
    chrome.storage.local.get(["status"], (result) => {
        status = result.status;
        connStatus.innerText = status;
        connButton.innerText = status === "connected" ? "Disconnect" : "Connect";
    })
}

connButton.onclick = (e) => {
    e.preventDefault();
    console.log("Connect here");

    chrome.runtime.sendMessage({ message: status === "connected" ? "disconnect" : "connect" }, response => setTimeout(updateState, 1000));
}

updateState();