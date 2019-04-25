document.addEventListener('DOMContentLoaded', function () {

    document.querySelector('button').addEventListener('click', onclick, false);

    function onclick() {
        var text = document.getElementById('servergroup').value;
        localStorage.setItem("servergroup", text);

        //Update comment
        chrome.tabs.query({ currentWindow: true, active: true },
            function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, localStorage.getItem("servergroup"));
            }
        );

        //Show message that settings are saved 
        document.getElementById('message').style.display = 'block';
    }

    //Update already set value
    if (localStorage.getItem("servergroup"))
        document.getElementById('servergroup').value = localStorage.getItem("servergroup");

}, false)