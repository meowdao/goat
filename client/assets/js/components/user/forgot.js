"use strict";

import React from "react";
import API from "../../utils/API";
import {email} from "../../../../../server/utils/constants/misc.js";


export default class Forgot extends React.Component {

	static displayName = "Password Recovery";

	static propTypes = {
		email: React.PropTypes.string
	};

	static defaultProps = {
		email: email
	};

	state = {
		email: this.props.email
	};

	constructor(props) {
		super(props);
	}

	onSubmit(e) {
		e.preventDefault();
		API.forgot(this.state)
			.then(() => {
				this.props.history.pushState(null, "/user/login");
			});
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Forgot password</h3>
				</div>
				<div className="panel-body">
					<form className="form-horizontal" onSubmit={this.onSubmit.bind(this)} autoComplete="off">

						<div className="form-group">
							<label htmlFor="email" className="col-sm-2 control-label">Email</label>

							<div className="col-sm-10">
								<input type="text" className="form-control" name="email" id="email" defaultValue="" placeholder="me@example.com"
									   onChange={e => this.setState({email: e.target.value})}/>
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

