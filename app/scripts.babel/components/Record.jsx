import React from 'react';
import SpeechRecognition from '../SpeechRecognition';

let RecordModes = {
	stopped : 'stopped',
	starting : 'starting',
	recording : 'recording'
}

export default class Record extends React.Component {
	constructor() {
		super();
		// Initial state of the component
		this.state = { mode : RecordModes.stopped };
	}
	clickHdlr() {
		if ( this.state.mode === RecordModes.stopped ) {
			this.setState({ mode : RecordModes.starting });
			SpeechRecognition.start(() => {
				this.setState({ mode : RecordModes.recording });
			});
		} else if ( this.state.mode === RecordModes.recording ) {
			SpeechRecognition.stop();
			this.setState({ mode : RecordModes.stopped });
		}
	}
	getLabel() {
		switch (this.state.mode) {
			case RecordModes.stopped :
			case RecordModes.starting : return 'Record !';
			case RecordModes.recording : return 'Stop recording !';
		}
	}
	render() {
    return (
      <button onClick={ this.clickHdlr.bind(this) } type="button">{ this.getLabel() }</button>
		);
	}
}
