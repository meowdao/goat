"use strict";

import React from "react";
import $ from "jquery";

import Dispatcher from "../../utils/dispatcher.js";
import ActionTypes from "../../utils/constants.js";

class Change extends React.Component {

	static propTypes = {
		password: React.PropTypes.string,
		confirm: React.PropTypes.string
	};

	static defaultProps = {
		password: "321ewqDSA",
		confirm: "321ewqDSA"
	};

	state = {
		password: this.props.password,
		confirm: this.props.confirm
	};

	constructor(props) {
		super(props);
	}

	onSubmit(e) {
		e.preventDefault();
		$.ajax({
			method: "POST",
			url: "/user/change",
			data: {
				hash: hash,
				email: this.state.email,
				password: this.state.password
			}
		})
			.then(response => {
				Dispatcher.dispatch({
					actionType: ActionTypes.UPDATE_USER,
					user: response
				});
			})
			.catch(e => {
				console.log(e)
			});
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Change password</h3>
				</div>
				<div className="panel-body">
					<form className="form-horizontal" onSubmit={this.onSubmit.bind(this)} autocomplete="off">

						<div className="form-group">
							<label htmlFor="name" className="col-sm-2 control-label">Password</label>

							<div className="col-sm-10">
								<input type="password" className="form-control" name="name" id="password" defaultValue="" placeholder="******"
								       onChange={e => this.setState({password: e.target.value})}/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="confirm" className="col-sm-2 control-label">Confirm password</label>

							<div className="col-sm-10">
								<input type="password" className="form-control" name="confirm" id="confirm" defaultValue="" placeholder="******"
								       onChange={e => this.setState({confirm: e.target.value})}/>
							</div>
						</div>

						<div className="form-group">
							<div className="col-sm-offset-2 col-sm-10">
								<button type="submit" className="btn btn-default">Change</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default Change;
