import React from 'react';
import SpeechRecognition from '../SpeechRecognition';

let styles = {
  root : {
		backgroundColor: '#f5f5f5',
    border: '1px solid #000',
    padding: '10px',
    borderRadius: '25px'
	},
	hidden: {
		display: 'none'
	}
};

export default class RecognitionLog extends React.Component {
	constructor() {
		super();
		// Initial state of the component
		this.state = { transcript : '' };
		SpeechRecognition.onResult((result) => {
			this.setState({transcript : result.transcript});
		})
	}
	isHidden() {
		return (this.state.transcript ? false : true);
	}
	getStyles() {
		return Object.assign(
      {},
      styles.root,
			this.isHidden() && styles.hidden
    );
	}
	render() {
		console.log(this.state.transcript);
    return (
			<p style={ this.getStyles() } >{this.state.transcript}</p>
		);
	}
}
