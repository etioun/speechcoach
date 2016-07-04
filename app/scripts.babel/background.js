'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onActivated.addListener(activeInfo => {
  showState();
});

chrome.tabs.onUpdated.addListener(function(tabId,  changeInfo,  tab) {
  chrome.tabs.sendMessage(tab.id, {action: 'getState'}, enabled => {
      updateState(tab, enabled);
      showState();
  });
});

chrome.browserAction.onClicked.addListener(function(tab) {
  toggleExtension(tab)
});

function toggleExtension(tab)
{
  chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
    // chrome.extension.getBackgroundPage().console.log(tabs[0].id + ','+ enable);
    chrome.tabs.sendMessage(tabs[0].id, {action: 'toggle'}, enabled => {
      updateState(tabs[0], enabled);
      showState();
    });
  });
};

function updateState(tab, enabled){
  if (enabled) {
    enabledTabs[tab.id] = tab;
  } else {
    enabledTabs[tab.id] = null;
  }
}

function showState() {
  chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
    if (tabs[0] && enabledTabs[tabs[0].id]) {
      chrome.browserAction.setBadgeText({text: 'On'});
    } else {
      chrome.browserAction.setBadgeText({text: 'Off'});
    }
  });
};

let enabledTabs = [];
showState();
