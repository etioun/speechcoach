import React from 'react';
import SpeechRecognition from '../SpeechRecognition';

let styles = {
  root : {
    fontSize: 'initial',
    backgroundColor: 'white',
    borderRadius: '5px',
    padding: '5px',
		border: '1px solid #000'
	}
};

export default class VoiceList extends React.Component {
	constructor() {
		super();

    this.selectionChangedHdlr = this.selectionChangedHdlr.bind(this);
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
      <select style={ styles.root } name='language' value={ this.state.selected } onChange={ this.selectionChangedHdlr } >
        {this.state.voices.map( (voice, index ) => {
          return <option key={ index } value={ index } >{ voice.lang + ' ' + voice.voiceURI }</option>;
        })}
			</select>
		);
	}
}
