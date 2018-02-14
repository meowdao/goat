import React, {Component} from "react";
import PropTypes from "prop-types";
import {Modal, Button} from "react-bootstrap";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {messageRemove} from "../../actions/message";
import {FormattedMessage} from "react-intl";
import {withRouter} from "react-router";


@withRouter
@connect(
	state => ({
		messages: state.messages
	}),
	dispatch => bindActionCreators({messageRemove}, dispatch)
)
export default class ErrorDialog extends Component {
	static propTypes = {
		messages: PropTypes.array,
		messageRemove: PropTypes.func,
		location: PropTypes.shape({
			pathname: PropTypes.string.isRequired
		}).isRequired
	};

	onHide(message) {
		return () => {
			this.props.messageRemove(message);
		};
	}

	renderDialog(message, i) {
		return (
			<Modal key={i} show onHide={::this.onHide(message)}>
				<Modal.Header closeButton>
					<Modal.Title>
						{message.status ? "An Error Occurred" : "System Information"}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>{message.status ? <FormattedMessage id={`errors.${message.message}`} values={message} /> : message.message}</p>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={::this.onHide(message)}>Close</Button>
				</Modal.Footer>
			</Modal>
		);
	}

	render() {
		if (this.props.location.pathname === "/message") {
			return null;
		}
		return (
			<div>
				{this.props.messages.map(::this.renderDialog)}
			</div>
		);
	}
}
