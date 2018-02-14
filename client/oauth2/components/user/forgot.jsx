import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Col, FormGroup, Button, Form} from "react-bootstrap";
import {FormattedMessage, injectIntl} from "react-intl";
import {email} from "../../../../shared/constants/placeholder";
import {messageShow} from "../../../shared/actions/message";
import InputGroup from "../../../shared/components/inputs/input.group";
import doAjaxAction from "../../../shared/actions/ajax";
import {viewItemLabel, viewItemValue} from "../../../../shared/constants/display";
import withFormHelper from "../../../shared/components/forms/withFormHelper";


@injectIntl
@withFormHelper("users")
export default class Forgot extends Component {
	static propTypes = {
		users: PropTypes.object,

		onChange: PropTypes.func,
		onSubmit: PropTypes.func,
		email: PropTypes.string,

		doAjaxAction: PropTypes.func,
		messageShow: PropTypes.func,

		history: PropTypes.shape({
			push: PropTypes.func.isRequired
		}).isRequired,

		intl: PropTypes.shape({
			formatMessage: PropTypes.func.isRequired
		}).isRequired
	};

	componentWillReceiveProps(nextProps) {
		if (!nextProps.users.isLoading && nextProps.users.success && nextProps.users.name === "forgot") {
			this.props.messageShow({
				type: "success",
				message: this.props.intl.formatMessage({
					id: "message.forgot-successful"
				})
			});
			this.props.history.push("/message");
		}
	}

	render() {
		return (
			<Form horizontal autoComplete="off" onSubmit={this.props.onSubmit} action="/users/forgot" name="forgot" method="POST">
				<InputGroup
					type="email"
					name="email"
					defaultValue={this.props.email}
					placeholder={email}
					onChange={this.props.onChange}
				/>
				<FormGroup>
					<Col xsOffset={viewItemLabel} xs={viewItemValue}>
						<Button type="submit">
							<FormattedMessage id="components.buttons.send" />
						</Button>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}
