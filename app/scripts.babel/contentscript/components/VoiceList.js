import React from 'react';
import SpeechRecognition from '../SpeechRecognition';


export default class VoiceList extends React.Component {
	constructor() {
		super();
		// Initial state of the component

    this.selectionChangedHdlr = this.selectionChangedHdlr.bind(this);
    // chrome.storage.sync.get({
    //   lastVoiceUsed: 12
    // }, items => {
    //   this.state.selected = items.lastVoiceUsed;
    // });
    // this.state.selected = selected;
    // console.log(this.state.selected );
  }

  componentWillMount() {

    window.speechSynthesis.onvoiceschanged = () => {
      this.setState({ voices : window.speechSynthesis.getVoices() });
      this.updateVoiceParams();
    };
    this.state = {
      voices: window.speechSynthesis.getVoices(),
      selected : 0
    };
    this.updateVoiceParams();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.selected != prevState.selected) {
      this.updateVoiceParams();
      SpeechSynth.say(this.props.text);
    }
  }
  updateVoiceParams() {
    if (this.state.voices.length > 0) {
      SpeechSynth.setVoice(this.state.voices[this.state.selected]);
      SpeechRecognition.setLang(this.state.voices[this.state.selected].lang);
    }
  }
  selectionChangedHdlr(e) {
    this.setState({ selected : e.target.value });
  }
	render() {
    return (
      <select name='language' value={ this.state.selected } onChange={ this.selectionChangedHdlr } >
        {this.state.voices.map( (voice, index ) => {
          return <option key={ index } value={ index } >{ voice.lang + ' ' + voice.voiceURI }</option>;
        })}
			</select>
		);
	}
}
