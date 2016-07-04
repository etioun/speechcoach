'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import CommandCenter from './components/CommandCenter';
import SpeechRecognition from './SpeechRecognition';

function getSelectionText() {
    var text = '';
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != 'Control') {
        text = document.selection.createRange().text;
    }
    return text;
}

document.addEventListener('mouseup', function () {
  if (enabled === false)
    return;

  var text = getSelectionText();
  if (text && selectedText != text) {
    selectedText = text;
    console.log(text);
    CCMediator.setText(text);
  }
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'toggle'){
      enabled = !enabled;
      sendResponse(enabled);
      showWidget(enabled);
    } else if ( request.action === 'getState' ) {
      sendResponse(enabled);
    }
  }
);

function showWidget(visible) {
  if (commandCenterElt === null) {
    commandCenterElt = document.createElement("div");
    document.body.appendChild(commandCenterElt)
    ReactDOM.render(<CommandCenter CCMediator={CCMediator}/>, commandCenterElt);
  }
  if (visible) {
    commandCenterElt.style.visibility = "visible";
  } else {
    commandCenterElt.style.visibility = "hidden";
  }
}

let CCMediator = {};
let enabled = false;
let commandCenterElt = null;
let selectedText = null;

SpeechSynth.init();
SpeechRecognition.init();
