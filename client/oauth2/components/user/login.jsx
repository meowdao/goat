import React, {Component} from "react";
import PropTypes from "prop-types";
import {Col, FormGroup, Button, Form, ButtonToolbar} from "react-bootstrap";
import {FormattedMessage} from "react-intl";
import {email, password} from "../../../../shared/constants/placeholder";
import InputGroup from "../../../shared/components/inputs/input.group";
import withFormHelper from "../../../shared/components/forms/withFormHelper";
import {viewItemLabel, viewItemValue} from "../../../../shared/constants/display";


@withFormHelper("users")
export default class Login extends Component {
	static propTypes = {
		email: PropTypes.string,
		password: PropTypes.string,
		onChange: PropTypes.func
	};

	render() {
		return (
			<Form horizontal autoComplete="off" name="login" action="/api/login" method="POST">
				<InputGroup
					type="email"
					name="email"
					defaultValue={this.props.email}
					placeholder={email}
					onChange={this.props.onChange}
				/>
				<InputGroup
					type="password"
					name="password"
					defaultValue={this.props.password}
					placeholder={password}
					onChange={this.props.onChange}
				/>
				<FormGroup>
					<Col xsOffset={viewItemLabel} xs={viewItemValue}>
						<ButtonToolbar>
							<Button type="submit">
								<FormattedMessage id="components.buttons.login" />
							</Button>
							<Button type="button" href="/forgot">
								<FormattedMessage id="components.buttons.forgot" />
							</Button>
							<Button type="button" href="/register">
								<FormattedMessage id="components.buttons.signup" />
							</Button>
						</ButtonToolbar>
					</Col>
				</FormGroup>
			</Form>
		);
	}
}
