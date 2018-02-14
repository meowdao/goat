import React, {Component} from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {FormattedMessage} from "react-intl";
import {messageRemove} from "../../actions/message";


@connect(
	state => ({
		messages: state.messages
	}),
	dispatch => bindActionCreators({messageRemove}, dispatch)
)
export default class Message extends Component {
	static propTypes = {
		messages: PropTypes.array,
		messageRemove: PropTypes.func
	};

	static defaultProps = {
		messages: []
	};

	componentWillUnmount() {
		this.props.messages.map(message =>
			this.props.messageRemove(message)
		);
	}

	renderDebugInfo() {
		if (process.env.NODE_ENV === "production") {
			return null;
		}
		return (
			<pre>
				DEBUG INFO: <br/>
				{JSON.stringify(this.props.messages, null, "\t")}
			</pre>
		);
	}

	renderMessage(message) {
		if (message.status === 404 && message.name === "token") {
			return (
				<>
					<FormattedMessage id={`errors.token-expired`}/>{" "}
					<a href="/resend"><FormattedMessage id={`errors.token-expired-link`}/></a>
				</>
			);
		}
		return message.status ? <FormattedMessage id={`errors.${message.message}`} values={message}/> : message.message
	}

	render() {
		return (
			<div>
				{this.props.messages.map((message, i) =>
					<p key={i}>{this.renderMessage(message)}</p>
				)}
				{this.renderDebugInfo()}
			</div>
		);
	}
}
