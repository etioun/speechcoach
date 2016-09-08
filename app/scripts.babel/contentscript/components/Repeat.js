import React from 'react';

let styles = {
  root : {
    all: 'initial',
    backgroundColor: 'white',
    borderRadius: '5px',
    padding: '5px',
		border: '1px solid #000'
	}
};

export default class Reapeat extends React.Component {
	constructor() {
		super();
		// Initial state of the component
		this.state = {};
	}
	clickHdlr() {
		SpeechSynth.say(this.props.text);
	}
	render() {
    return (
      <button style={ styles.root } onClick={ this.clickHdlr.bind(this) } type="button">Repeat synth !</button>
		);
	}
}
