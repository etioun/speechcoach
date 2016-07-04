import React from 'react';
import VoiceList from './VoiceList';
import Repeat from './Repeat';
import Record from './Record';
import RecognitionLog from './RecognitionLog';


let styles = {
  root : {
		position : 'fixed',
		top: 0,
    left: 0,
		zIndex: 100000
	},
	hidden : {
		display : 'none'
	}
};

export default class CommandCenter extends React.Component {
	constructor() {
		super();
		this.state = { text : '' };
  }
	componentWillMount() {
		this.props.CCMediator.setText = (text) => {
			this.setState({text: text});
		}
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.text != this.state.text) {
			SpeechSynth.say(this.state.text);
		}
	}
	getStyles() {
    return Object.assign(
      {},
      styles.root
    );
  }
	render(){
		return (
			<div style={ this.getStyles() }>
				<div>
					<VoiceList text={this.state.text} />
					<Repeat text={this.state.text} />
					<Record />
				</div>
				<div>
					<RecognitionLog />
				</div>
			</div>
		);
	}
}
