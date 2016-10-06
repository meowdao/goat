import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";
import {Col, FormGroup, Button} from "react-bootstrap";


@connect(
	state => ({
		user: state.user,
		oauth2: state.oauth2
	}),
)
export default class Decision extends Component {

	static displayName = "Decision";

	static propTypes = {
		user: PropTypes.object,
		oauth2: PropTypes.object
	};

	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	state = {
		user: this.props.user,
		oauth2: this.props.oauth2
	};

	render() {
		return (
			<div className="container">
				<form action="/dialog/authorize/decision" method="post">
					<p className="title3">Hi, {this.state.user.fullName}!</p>
					<p><b>{this.state.oauth2.client.name}</b> <span>is requesting access to your account.</span></p>
					<p className="title2">Do you approve? </p>
					<input name="transaction_id" type="hidden" value={this.state.oauth2.transactionID}/>
					<FormGroup>
						<Col smOffset={2} sm={10}>
							<Button value="Allow" type="submit">
								Allow
							</Button>
							<Button value="Deny" type="submit" name="cancel">
								Deny
							</Button>
						</Col>
					</FormGroup>
					[<a href="/logout">Logout </a>]
				</form>
			</div>
		);
	}
}
