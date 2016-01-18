"use strict";

import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";
import {Alert} from "react-bootstrap";

@connect(
	state => ({
		messages: state.messages
	})
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
					<Alert key={message.id} dismissAfter={3000}
						onDismiss={() => {
							this.props.dismiss({
								type: "MESSAGE_REMOVE",
								message: message
							});
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
