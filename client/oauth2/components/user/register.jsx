import React, {Component} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router";
import {Button, ButtonToolbar, Col, Form, FormGroup} from "react-bootstrap";
import {FormattedMessage, injectIntl} from "react-intl";
import {confirm, email, fullName, password} from "../../../../shared/constants/placeholder";
import InputGroupValidation from "../../../shared/components/inputs/input.group.validation";
import withCreateFormHelper from "../../../shared/components/forms/withCreateFormHelper";
import {viewItemLabel, viewItemValue} from "../../../../shared/constants/display";
import LanguageGroup from "../../../shared/components/groups/language";


@injectIntl
@withRouter
@withCreateFormHelper("users")
export default class CreateUserForm extends Component {
	static propTypes = {
		email: PropTypes.string,
		password: PropTypes.string,
		confirm: PropTypes.string,
		fullName: PropTypes.string,
		language: PropTypes.string,

		history: PropTypes.shape({
			push: PropTypes.func.isRequired
		}).isRequired,
		onSubmit: PropTypes.func,
		onChange: PropTypes.func,
		messageShow: PropTypes.func,

		intl: PropTypes.shape({
			formatMessage: PropTypes.func.isRequired
		}).isRequired
	};

	componentWillReceiveProps(nextProps) {
		// console.log("CreateUserForm:componentWillReceiveProps", nextProps);
		if (!nextProps[this.props.storeName].isLoading && nextProps[this.props.storeName].success && nextProps[this.props.storeName].name === "create") {
			this.props.messageShow({
				type: "success",
				message: this.props.intl.formatMessage({
					id: "message.registration-successful"
				})
			});
			// TODO this is ugly hack
			setTimeout(() => {
				this.props.history.push("/message");
			}, 100);
		}
	}

	render() {
		return (
			<Form horizontal autoComplete="off" onSubmit={this.props.onSubmit}>
				<InputGroupValidation
					type="email"
					name="email"
					defaultValue={this.props.email}
					placeholder={email}
					onChange={this.props.onChange}
				/>
				<InputGroupValidation
					type="password"
					name="password"
					defaultValue={this.props.password}
					placeholder={password}
					onChange={this.props.onChange}
				/>
				<InputGroupValidation
					type="password"
					name="confirm"
					defaultValue={this.props.confirm}
					placeholder={confirm}
					onChange={this.props.onChange}
				/>
				<InputGroupValidation
					name="fullName"
					defaultValue={this.props.fullName}
					placeholder={fullName}
					onChange={this.props.onChange}
				/>
				<LanguageGroup
					defaultValue={this.props.language}
					onChange={this.props.onChange}
				/>
				<FormGroup>
					<Col xsOffset={viewItemLabel} xs={viewItemValue}>
						<ButtonToolbar>
							<Button type="submit">
								<FormattedMessage id="components.buttons.signup"/>
							</Button>
						</ButtonToolbar>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}
