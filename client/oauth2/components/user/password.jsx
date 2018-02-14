import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Col, Form, FormGroup} from "react-bootstrap";
import {FormattedMessage, injectIntl} from "react-intl";
import {confirm, password} from "../../../../shared/constants/placeholder";
import InputGroupValidation from "../../../shared/components/inputs/input.group.validation";
import {viewItemLabel, viewItemValue} from "../../../../shared/constants/display";
import {getServerUrl} from "../../../../shared/utils/misc";
import {readFromQueryString} from "../../../shared/utils/location";
import withFormHelper from "../../../shared/components/forms/withFormHelper";
import {withRouter} from "react-router";


@injectIntl
@withRouter
@withFormHelper("users")
export default class Password extends Component {
	static propTypes = {
		storeName: PropTypes.string,

		onChange: PropTypes.func,
		onSubmit: PropTypes.func,

		password: PropTypes.string,
		confirm: PropTypes.string,

		messageShow: PropTypes.func,

		location: PropTypes.shape({
			search: PropTypes.string.isRequired
		}).isRequired,
		history: PropTypes.shape({
			push: PropTypes.func.isRequired
		}).isRequired,

		intl: PropTypes.shape({
			formatMessage: PropTypes.func.isRequired
		}).isRequired
	};

	componentWillReceiveProps(nextProps) {
		if (!nextProps[this.props.storeName].isLoading && nextProps[this.props.storeName].success && nextProps[this.props.storeName].name === "password") {
			window.opener.postMessage({
				source: "oauth2",
				message: ""
			}, getServerUrl(readFromQueryString("module", this.props.location.search)));
			this.props.messageShow({
				type: "success",
				message: this.props.intl.formatMessage({
					id: "message.change-successful"
				})
			});
			this.props.history.push("/message");
		}
	}

	render() {
		return (
			<Form horizontal autoComplete="off" onSubmit={this.props.onSubmit} action="/users/password" name="password" method="PUT">
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
				<FormGroup>
					<Col xsOffset={viewItemLabel} xs={viewItemValue}>
						<Button type="submit">
							<FormattedMessage id="components.buttons.change" />
						</Button>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}
