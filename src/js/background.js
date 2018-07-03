// listen for our browerAction to be clicked
chrome.browserAction.onClicked.addListener(function(tab) {
	// for the current tab, inject the "main.js" file & execute it
	chrome.tabs.executeScript(tab.id, {
		file: "js/mytime/main.js"
	});
});
