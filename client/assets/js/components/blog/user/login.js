import React, {PropTypes, Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import API from "../../../utils/API";
import {email, password} from "../../../../../../server/utils/constants/misc";
import {USER_LOGIN} from "../../../constants/constants";


const login = data =>
	dispatch =>
		API.login(data)
			.then(responce => {
				dispatch({
					type: USER_LOGIN,
					user: responce
				});
			});

const sync = data =>
	dispatch =>
		API.sync(data)
			.then(responce => {
				dispatch({
					type: USER_LOGIN,
					user: responce
				});
			});

@connect(
	state => ({
		user: state.user
	}),
	dispatch => bindActionCreators({login, sync}, dispatch)
)
export default class Login extends Component {

	static displayName = "Login";

	static propTypes = {
		email: PropTypes.string,
		password: PropTypes.string,
		history: React.PropTypes.object,
		login: PropTypes.func,
		sync: PropTypes.func,
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

	onSubmit(e) {
		e.preventDefault();
		this.props.login(this.state)
			.then(() => {
				if (this.props.location.pathname !== "/login") {
					this.context.router.push(this.props.location);
				} else {
					this.context.router.push("/user/profile");
				}
			});
	}

	onLogin() {
		this.props.sync()
			.then(() => {
				this.context.router.push("/user/profile");
			});
	}

	open(link) {
		return e => {
			e.preventDefault();
			const n = 600;
			const r = 400;
			const i = (window.innerHeight - r) / 2;
			const s = (window.innerWidth - n) / 2;
			const popup = window.open(link, "authorization", `height=${r},width=${n},top=${i},left=${s}`);
			if (window.focus) {
				popup.focus();
			}
			popup.onload = () => {
				popup.onbeforeunload = () => {
					this.onLogin();
				};
			};
		};
	}

	render() {
		return (
			<div className="panel panel-default">
				<div className="panel-body">

					[<a href="#" onClick={this.open("/api/auth/google")}>google</a>]
					[<a href="#" onClick={this.open("/api/auth/facebook")}>facebook</a>]
					[<a href="#" onClick={this.open("/api/auth/goat")}>goat</a>]

				</div>
			</div>
		);
	}
}
