import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Col, FormGroup, ControlLabel, FormControl, Button} from "react-bootstrap";
import zxcvbn from "zxcvbn";
import API from "../../../utils/API";
import {reEmail} from "../../../../../../server/utils/constants/regexp";
import {
	email,
	password,
	confirm,
	fullName/* , phoneNumber*/
} from "../../../../../../server/utils/constants/misc";
import {USER_LOGIN} from "../../../constants/constants";


const register = (data) =>
	dispatch =>
		API.register(data)
			.then(responce => {
				dispatch({
					type: USER_LOGIN,
					user: responce
				});
			});

@connect(
	() => ({}),
	dispatch => bindActionCreators({register}, dispatch)
)
export default class Register extends Component {

	static displayName = "Register";

	static propTypes = {
		email: PropTypes.string,
		// phoneNumber: PropTypes.string,
		password: PropTypes.string,
		confirm: PropTypes.string,
		fullName: PropTypes.string,
		history: React.PropTypes.object,
		register: PropTypes.func
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	static defaultProps = {
		email,
		// phoneNumber
		password,
		confirm,
		fullName
	};

	state = {
		email: this.props.email,
		// phoneNumber: this.props.phoneNumber,
		password: this.props.password,
		confirm: this.props.confirm,
		fullName: this.props.lastName
	};

	onSubmit(e) {
		e.preventDefault();
		this.props.register(this.state)
			.then(() => {
				this.context.router.push("/user/profile");
			});
	}

	validateEmail() {
		return reEmail.test(this.state.email) ? "success" : "error";
	}

	validatePassword() {
		return zxcvbn(this.state.password).score >= 1 ? "success" : "error";
	}

	validateConfirm() {
		return this.state.password === this.state.confirm ? "success" : "error";
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<form className="form-horizontal" onSubmit={::this.onSubmit} autoComplete="off">
						<FormGroup
							controlId="formHorizontalFirstName"
						>
							<Col componentClass={ControlLabel} sm={2}>
								First name
							</Col>
							<Col sm={10}>
								<FormControl
									type="text"
									name="fullName"
									value={this.state.fullName}
									placeholder="Gordon Freeman"
									onChange={e => this.setState({fullName: e.target.value})}
								/>
							</Col>
						</FormGroup>
						<FormGroup
							controlId="formHorizontalEmail"
							validationState={this.validateEmail()}
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
							validationState={this.validatePassword()}
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
						<FormGroup
							controlId="formHorizontalConfirm"
							validationState={this.validateConfirm()}
						>
							<Col componentClass={ControlLabel} sm={2}>
								Confirm password
							</Col>
							<Col sm={10}>
								<FormControl
									type="password"
									name="confirm"
									value={this.state.confirm}
									placeholder="******"
									onChange={e => this.setState({confirm: e.target.value})}
								/>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col smOffset={2} sm={10}>
								<Button
									type="submit"
								>
									Register
								</Button>
							</Col>
						</FormGroup>
					</form>
				</div>
			</div>
		);
	}
}
