import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";
import {Col, FormGroup, ControlLabel, FormControl, Button} from "react-bootstrap";
import {email, password} from "../../../../../server/utils/constants/misc";
import {Link} from "react-router";


@connect(
	state => ({
		user: state.user
	}),
)
export default class Login extends Component {

	static displayName = "Login";

	static propTypes = {
		email: PropTypes.string,
		password: PropTypes.string,
		history: React.PropTypes.object,
		login: PropTypes.func,
		user: PropTypes.object,
		location: PropTypes.object
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static defaultProps = {
		email,
		password
	};

	state = {
		email: this.props.email,
		password: this.props.password
	};

	render() {
		return (
			<div className="container">
				<form action="/login" className="form-horizontal" autoComplete="off" method="post">
					<FormGroup
						controlId="formHorizontalEmail"
						// validationState={this.getValidationState()}
					>
						<Col componentClass={ControlLabel} sm={2}>
							Email
						</Col>
						<Col sm={10}>
							<FormControl
								type="email"
								name="email"
								value={this.state.email}
								placeholder="me@example.com"
								onChange={e => this.setState({email: e.target.value})}
							/>
						</Col>
					</FormGroup>
					<FormGroup
						controlId="formHorizontalPassword"
						// validationState={this.getValidationState()}
					>
						<Col componentClass={ControlLabel} sm={2}>
							Password
						</Col>
						<Col sm={10}>
							<FormControl
								type="password"
								name="password"
								value={this.state.password}
								placeholder="******"
								onChange={e => this.setState({password: e.target.value})}
							/>
						</Col>
					</FormGroup>
					<FormGroup>
						<Col smOffset={2} sm={10}>
							<Button
								type="submit"
								disabled={this.state.disabled}
							>
								Login
							</Button>
						</Col>
					</FormGroup>
				</form>

				<br/>

				[<Link to="/user/forgot">Forgot password?</Link>]
			</div>
		);
	}
}
