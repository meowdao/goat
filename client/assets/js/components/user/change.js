"use strict";

import React from "react";
import API from "../../utils/API";
import {password, confirm} from "../../../../../server/utils/constants/misc.js";


export default class Change extends React.Component {

	static displayName = "Password Change";

	static propTypes = {
		password: React.PropTypes.string,
		confirm: React.PropTypes.string,
		hash: React.PropTypes.string,
		history: React.PropTypes.object,
		routes: React.PropTypes.array.isRequired
	};

	static defaultProps = {
		password,
		confirm,
		hash: null
	};

	state = {
		password: this.props.password,
		confirm: this.props.confirm,
		hash: this.props.hash
	};

	onSubmit(e) {
		e.preventDefault();
		API.change(this.state)
		.then(() => {
			this.props.history.pushState(null, "/user/login");
		});
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Change password</h3>
				</div>
				<div className="panel-body">
					<form className="form-horizontal" onSubmit={this.onSubmit.bind(this)} autoComplete="off">
						<input type="hidden" name="hash" value={this.props.hash}/>
						<div className="form-group">
							<label htmlFor="name" className="col-sm-2 control-label">Password</label>
							<div className="col-sm-10">
								<input type="password" className="form-control" name="name" id="password" defaultValue="" placeholder="******"
									onChange={e => this.setState({password: e.target.value})}
								/>
							</div>
						</div>
						<div className="form-group">
							<label htmlFor="confirm" className="col-sm-2 control-label">Confirm password</label>
							<div className="col-sm-10">
								<input type="password" className="form-control" name="confirm" id="confirm" defaultValue="" placeholder="******"
									onChange={e => this.setState({confirm: e.target.value})}
								/>
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
