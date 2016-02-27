"use strict";

import React, {PropTypes, Component} from "react";
import {Input, ButtonInput} from "react-bootstrap";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import API from "../../utils/API";
import {UPDATE_USER} from "../../constants/constants";
import zxcvbn from "zxcvbn";

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
		firstName: PropTypes.string,
		lastName: PropTypes.string,
		email: PropTypes.string,
		isActive: PropTypes.bool,
		role: PropTypes.string
	};

	static defaultProps = {
		users: [],
		userProfile: {},
		firstName: "",
		lastName: "",
		email: "",
		isActive: false,
		role: ""
	};

	state = {
		firstName: this.props.firstName,
		lastName: this.props.lastName,
		email: this.props.email,
		isActive: this.props.isActive,
		role: this.props.role
	};

	componentWillMount() {
		this.setState(this.props.params._id ? this.props.users.find(user => user._id === this.props.params._id) : this.props.userProfile);
	}

	onSubmit(e) {
		e.preventDefault();
		this.props.userUpdate(this.state);
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">
					<h3>Profile:</h3>
						<form className="form-horizontal" onSubmit={::this.onSubmit}>
							<Input
								type="text"
								name="firstName"
								label="First Name"
								labelClassName="col-xs-2"
								wrapperClassName="col-xs-5"
								value={this.state.firstName}
								onChange={(e) => this.setState({firstName: e.target.value})}
							/>
							<Input
								type="text"
								name="lastName"
								label="Last Name"
								labelClassName="col-xs-2"
								wrapperClassName="col-xs-5"
								value={this.state.lastName}
								onChange={(e) => this.setState({lastName: e.target.value})}
							/>
							<Input
								type="email"
								name="email"
								label="Email"
								labelClassName="col-xs-2"
								wrapperClassName="col-xs-5"
								value={this.state.email}
								onChange={(e) => this.setState({email: e.target.value})}
							/>

							<Input
								type="password"
								name="password"
								value={this.state.password}
								placeholder="******"
								label="Password"
								bsStyle={!this.state.password || zxcvbn(this.state.password).score >= 1 ? null : "error"}
								hasFeedback
								labelClassName="col-xs-2"
								wrapperClassName="col-xs-5"
								onChange={e => this.setState({password: e.target.value})}
							/>
							<Input
								type="password"
								name="confirm"
								value={this.state.confirm}
								placeholder="******"
								label="Confirm password"
								bsStyle={!this.state.confirm || this.state.password === this.state.confirm ? null : "error"}
								hasFeedback
								labelClassName="col-xs-2"
								wrapperClassName="col-xs-5"
								onChange={e => this.setState({confirm: e.target.value})}
							/>

							<Input
								type="select"
								name="isActive"
								label="Status"
								labelClassName="col-xs-2"
								wrapperClassName="col-xs-5"
								defaultValue={this.state.isActive ? "true" : "false"}
								onChange={(e) => this.setState({isActive: e.target.value})}
							>
								<option value={true}>Active</option>
								<option value={false}>Not active</option>
							</Input>

							<Input
								type="select"
								name="role"
								label="User role"
								labelClassName="col-xs-2"
								wrapperClassName="col-xs-5"
								defaultValue={this.state.role === "admin" ? "admin" : "user"}
								onChange={(e) => this.setState({role: e.target.value})}
							>
								<option value="admin">Admin</option>
								<option value="user">User</option>
							</Input>

							<ButtonInput
								type="submit"
								value="Save"
								bsStyle="info"
								wrapperClassName="col-xs-offset-2 col-xs-10"
							/>
						</form>
				</div>
			</div>
		);
	}
}
