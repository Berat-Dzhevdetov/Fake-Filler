chrome.browserAction.onClicked.addListener(fillInputs);

function fillInputs(tab) {
    chrome.tabs.sendMessage(tab.id, "a");
}