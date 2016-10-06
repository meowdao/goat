import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Alert} from "react-bootstrap";
import {MESSAGE_REMOVE} from "../../constants/constants";


const dismiss = message =>
	dispatch =>
		dispatch({
			type: MESSAGE_REMOVE,
			message
		});

@connect(
	state => ({
		messages: state.messages
	}),
	dispatch => bindActionCreators({dismiss}, dispatch)
)
export default class Message extends Component {

	static propTypes = {
		messages: PropTypes.array,
		dismiss: PropTypes.func
	};

	static defaultProps = {
		messages: []
	};

	render() {
		return (
			<div>
				{this.props.messages.map(message =>
					<Alert
						onDismiss={() => {
							this.props.dismiss(message);
						}}
						bsStyle={message.type}
					>
						{message.text}
					</Alert>
				)}
			</div>
		);
	}
}
