import React, {PropTypes, Component} from "react";
import {Col, FormGroup, ControlLabel, FormControl, Button} from "react-bootstrap";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import API from "../../../utils/API";
import {UPDATE_USER} from "../../../constants/constants";
import zxcvbn from "zxcvbn";
import {reEmail} from "../../../../../../server/utils/constants/regexp";


const userUpdate = data =>
	dispatch =>
		API.updateUsers(data)
			.then(response => {
				dispatch({
					type: UPDATE_USER,
					data: response
				});
			});

@connect(
	state => ({
		users: state.users.usersData,
		userProfile: state.user
	}),
	dispatch => bindActionCreators({userUpdate}, dispatch)
)
export default class UserEdit extends Component {

	static displayName = "User Edit";

	static propTypes = {
		users: PropTypes.array,
		userProfile: PropTypes.object,
		params: PropTypes.object,
		userUpdate: PropTypes.func,
		fullName: PropTypes.string,
		email: PropTypes.string,
		status: PropTypes.string,
		role: PropTypes.string,
		password: PropTypes.string,
		confirm: PropTypes.string
	};

	static defaultProps = {
		users: [],
		userProfile: {},
		fullName: "",
		email: "",
		status: "inactive",
		role: "",
		password: "",
		confirm: ""
	};

	state = {
		fullName: this.props.lastName,
		email: this.props.email,
		status: this.props.status,
		role: this.props.role,
		password: this.props.password,
		confirm: this.props.confirm
	};

	componentWillMount() {
		this.setState(this.props.params._id ? this.props.users.find(user => user._id === this.props.params._id) : this.props.userProfile);
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.userUpdate(this.state);
	}

	validateEmail() {
		if (!this.state.email) {
			return null;
		}
		return reEmail.test(this.state.email) ? "success" : "error";
	}

	validatePassword() {
		if (!this.state.password) {
			return null;
		}
		return zxcvbn(this.state.password).score >= 1 ? "success" : "error";
	}

	validateConfirm() {
		if (!this.state.confirm) {
			return null;
		}
		return this.state.password === this.state.confirm ? "success" : "error";
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<h3>Profile:</h3>
					<form className="form-horizontal" onSubmit={::this.onSubmit}>
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
						<FormGroup
							controlId="formHorizontalConfirm"
							validationState={this.validateConfirm()}
						>
							<Col componentClass={ControlLabel} sm={2}>
								Status
							</Col>
							<Col sm={2}>
								<FormControl
									componentClass="select"
									placeholder="Status"
									defaultValue={this.state.status === "active" ? "true" : "false"}
									onChange={(e) => this.setState({status: e.target.value})}
								>
									<option value="active">Active</option>
									<option value="inactive">Suspended</option>
								</FormControl>
							</Col>
						</FormGroup>
						<FormGroup
							controlId="formHorizontalConfirm"
							validationState={this.validateConfirm()}
						>
							<Col componentClass={ControlLabel} sm={2}>
								Role
							</Col>
							<Col sm={2}>
								<FormControl
									componentClass="select"
									placeholder="User role"
									defaultValue={this.state.role === "admin" ? "admin" : "user"}
									onChange={(e) => this.setState({role: e.target.value})}
								>
									<option value="admin">Admin</option>
									<option value="user">User</option>
								</FormControl>
							</Col>
						</FormGroup>
						<FormGroup>
							<Col smOffset={2} sm={10}>
								<Button
									type="submit"
								>
									Edit
								</Button>
							</Col>
						</FormGroup>
					</form>
				</div>
			</div>
		);
	}
}
