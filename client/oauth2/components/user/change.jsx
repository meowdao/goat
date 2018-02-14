import React, {Component} from "react";
import PropTypes from "prop-types";
import {Col, FormGroup, Button, Form} from "react-bootstrap";
import {FormattedMessage, injectIntl} from "react-intl";
import {password, confirm} from "../../../../shared/constants/placeholder";
import InputGroupValidation from "../../../shared/components/inputs/input.group.validation";
import withFormHelper from "../../../shared/components/forms/withFormHelper";
import {viewItemLabel, viewItemValue} from "../../../../shared/constants/display";


@injectIntl
@withFormHelper("users")
export default class Forgot extends Component {
	static propTypes = {
		messageShow: PropTypes.func,
		storeName: PropTypes.string,
		password: PropTypes.string,
		confirm: PropTypes.string,
		match: PropTypes.shape({
			params: PropTypes.object
		}).isRequired,
		history: PropTypes.shape({
			push: PropTypes.func.isRequired
		}).isRequired,
		intl: PropTypes.shape({
			formatMessage: PropTypes.func.isRequired
		}).isRequired,
		onSubmit: PropTypes.func,
		onChange: PropTypes.func,
		setState: PropTypes.func
	};

	componentWillMount() {
		this.props.setState({
			token: this.props.match.params.token
		});
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps[this.props.storeName].isLoading && nextProps[this.props.storeName].success && nextProps[this.props.storeName].name === "change") {
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
			<Form horizontal autoComplete="off" onSubmit={this.props.onSubmit} name="change" action="/users/change" method="PUT">
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
