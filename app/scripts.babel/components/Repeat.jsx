import React from 'react';


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
      <button onClick={ this.clickHdlr.bind(this) } type="button">Repeat synth !</button>
		);
	}
}
