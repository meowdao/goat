"use strict";

import React from "react";
import $ from "jquery";

import Dispatcher from "../../utils/dispatcher.js";
import ActionTypes from "../../utils/constants.js";

export default class Change extends React.Component {

	static propTypes = {
		email: React.PropTypes.string
	};

	static defaultProps = {
		email: "ctapbiumabp@gmail.com"
	};

	state = {
		email: this.props.email
	};

	constructor(props) {
		super(props);
	}

	onSubmit(e) {
		e.preventDefault();
		$.ajax({
			method: "POST",
			url: "/user/forgot",
			data: {
				email: this.state.email
			}
		})
			.then((response) => {
				Dispatcher.dispatch({
					actionType: ActionTypes.UPDATE_USER,
					user: response
				});
			})
			.fail((e) => {
				console.log(e)
			});
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Forgot password</h3>
				</div>
				<div className="panel-body">
					<form className="form-horizontal" onSubmit={this.onSubmit.bind(this)} autocomplete="off">

						<div className="form-group">
							<label htmlFor="email" className="col-sm-2 control-label">Email</label>

							<div className="col-sm-10">
								<input type="text" className="form-control" name="email" id="email" defaultValue="" placeholder="me@example.com"
								       onChange={(e) => this.setState({email: e.target.value})}/>
							</div>
						</div>

						<div className="form-group">
							<div className="col-sm-offset-2 col-sm-10">
								<button type="submit" className="btn btn-default">Send email</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}
