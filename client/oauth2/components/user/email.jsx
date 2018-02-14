import React, {Component} from "react";
import PropTypes from "prop-types";
import {FormattedMessage, injectIntl} from "react-intl";
import {Button, Col, Form, FormGroup} from "react-bootstrap";
import {email} from "../../../../shared/constants/placeholder";
import InputGroupValidation from "../../../shared/components/inputs/input.group.validation";
import {viewItemLabel, viewItemValue} from "../../../../shared/constants/display";
import {getServerUrl} from "../../../../shared/utils/misc";
import {readFromQueryString} from "../../../shared/utils/location";
import withFormHelper from "../../../shared/components/forms/withFormHelper";


@injectIntl
@withFormHelper("users")
export default class Email extends Component {
	static propTypes = {
		doAjaxAction: PropTypes.func,
		messageShow: PropTypes.func,
		onSubmit: PropTypes.func,
		onChange: PropTypes.func,
		email: PropTypes.string,
		storeName: PropTypes.string,
		location: PropTypes.shape({
			search: PropTypes.string.isRequired
		}).isRequired,
		users: PropTypes.object,
		history: PropTypes.shape({
			push: PropTypes.func.isRequired
		}).isRequired,
		intl: PropTypes.shape({
			formatMessage: PropTypes.func.isRequired
		}).isRequired
	};

	componentWillReceiveProps(nextProps) {
		if (!nextProps[this.props.storeName].isLoading && nextProps[this.props.storeName].success && nextProps[this.props.storeName].name === "email") {
			window.opener.postMessage({
				source: "oauth2",
				message: ""
			}, getServerUrl(readFromQueryString("module", this.props.location.search)));
			this.props.messageShow({
				type: "success",
				message: this.props.intl.formatMessage({
					id: "message.email-successful"
				})
			});
			this.props.history.push("/message");
		}
	}

	render() {
		return (
			<Form horizontal autoComplete="off" onSubmit={this.props.onSubmit} name="email" action="/users/email" method="PUT">
				<InputGroupValidation
					type="email"
					name="email"
					defaultValue={this.props.email}
					placeholder={email}
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
