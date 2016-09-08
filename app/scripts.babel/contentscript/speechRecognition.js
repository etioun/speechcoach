// Import events module
var events = require('events');
// Create an eventEmitter object


'use strict';

var SpeechRecognition = ( function () {
  var defaults = {
    'lang' : 'fr-fr',
    'onResult' : false
  };

  var settings = {};

  var _recognition = {};

  var _stopped = true;

  var _eventEmitter = null;

  var init = function(options) {

    Object.assign(settings, defaults, options);

    _eventEmitter = new events.EventEmitter();

    _recognition = new webkitSpeechRecognition();

    _recognition.continuous = true;
    _recognition.interimResults = true;
    // _recognition.lang = settings['lang'];

    _recognition.onresult = function (event) {
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        console.log(event.results[i][0].transcript);
        _eventEmitter.emit('result', event.results[i][0]);
        // if (event.results[i].isFinal && settings['onResult']) {
        //     settings['onResult'](event.results[i][0]);
        // }
      }
    };

    var thisRef = this;

    _recognition.onend = function (event) {
      console.log('ended');
      _stopped = true;
      // thisRef.trigger('end');
    }

    _recognition.onstart = function (event) {
      _stopped = false;
      _eventEmitter.emit('start');
    }
  }

  var onResult = function (callback) {
    _eventEmitter.on('result', callback);
  }

  var start = function (callback) {
    _recognition.start();
    _eventEmitter.once('start', callback);
  }

  var stop = function (callback) {
    _recognition.stop();
    if (callback) {
      _waitTillStop(callback);
    }
  }

  var _waitTillStop = function (callback) {
    if (_stopped == true) {
      callback();
    } else {
      setTimeout(function () { _waitTillStop(callback);}, 1000);
    }
  }

  var _waitTillStart = function (callback) {
    if (_start == true) {
      callback();
    } else {
      setTimeout(function () { _waitTillStop(callback);}, 100);
    }
  }

  var setLang = function(lang) {
    _recognition.lang = lang;
    console.log(_recognition);
  }

  return {
    init : init,
    onResult : onResult,
    start : start,
    stop : stop,
    setLang : setLang
  }
} )();

// _.extend(SpeechRecognition, Backbone.Events);

module.exports = SpeechRecognition;
