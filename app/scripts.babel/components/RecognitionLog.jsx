import React from 'react';
import SpeechRecognition from '../SpeechRecognition';

export default class RecognitionLog extends React.Component {
	constructor() {
		super();
		// Initial state of the component
		this.state = { transcript : '' };
		SpeechRecognition.onResult((result) => {
			this.setState({transcript : result.transcript});
		})
	}
	render() {
    return (
      <p>{this.state.transcript}</p>
		);
	}
}
