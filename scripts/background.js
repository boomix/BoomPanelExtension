chrome.browserAction.onClicked.addListener(() => {
	chrome.tabs.create({'url': 'http://identy.lv/forum'}); 
});
