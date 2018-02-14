import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Button, ButtonToolbar, Form} from "react-bootstrap";
import {FormattedMessage} from "react-intl";


@connect(
	state => ({
		user: state.user,
		oauth2: state.oauth2
	})
)
export default class Authorize extends Component {
	static propTypes = {
		user: PropTypes.object,
		oauth2: PropTypes.object
	};

	render() {
		// console.log("Authorize:render", this.props);
		return (
			<Form horizontal action="/api/decision" method="post">
				<p className="title3">Hi, {this.props.user.fullName}!</p>
				<p><b>{this.props.oauth2.client.name}</b> <span>is requesting access to your account.</span></p>
				<p className="title2">Do you approve? </p>
				<input name="transaction_id" type="hidden" value={this.props.oauth2.transactionID} />
				<ButtonToolbar>
					<Button value="Allow" type="submit" name="allow">
						<FormattedMessage id="components.buttons.allow" />
					</Button>
					<Button value="Deny" type="submit" name="cancel">
						<FormattedMessage id="components.buttons.deny" />
					</Button>
					<Button value="Deny" type="button" href="/api/logout">
						<FormattedMessage id="components.buttons.logout" />
					</Button>
				</ButtonToolbar>
			</Form>
		);
	}
}
