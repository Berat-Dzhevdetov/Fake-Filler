chrome.browserAction.onClicked.addListener(fillInputs);

function fillInputs(tab) {
    let msg = {
        txt: "hello"
    };
    chrome.tabs.sendMessage(tab.id, msg);
}