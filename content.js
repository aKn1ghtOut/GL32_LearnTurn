const showBox = () => {
    var initTime = (new Date()).getTime();

    var addElem = document.createElement("div");
    addElem.classList.add("addElem");
    addElem.style.width = "200px";
    addElem.style.height = "200px";
    addElem.style.position = "fixed";
    addElem.style.padding = "40px";
    addElem.style.top = "200px";
    addElem.style.left = "200px";
    addElem.style.background = "black";
    addElem.style.zIndex = 3000;
    addElem.style.fontSize = "20px";
    addElem.style.color = "white";

    var elemInText = "Learnturn extension</br>CLICK ME FAST";

    addElem.innerHTML = elemInText;

    document.querySelector("body").appendChild(addElem);

    addElem.onclick = () => {
        addElem.style.display = "none";

        var clickedTime = (new Date()).getTime();
        var timeTaken = clickedTime - initTime;

        chrome.runtime.sendMessage({ message: "boxclicked", timeTaken });

        setTimeout(showBox, 30000);
    }
}

setTimeout(showBox, 10000);