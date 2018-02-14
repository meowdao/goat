import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Route} from "react-router";
import Oauth2Login from "../../../oauth2/components/user/login";
import CommonLogin from "../common/login";
import Article from "./article";


@connect(
	state => ({
		user: state.user
	})
)
export default class Private extends Component {
	static propTypes = {
		user: PropTypes.object,
		component: PropTypes.func
	};

	render() {
		// console.log("Private:render", this.props);
		const {component, ...rest} = this.props;
		return (
			<Route
				{...rest}
				render={props => {
					// console.log("PrivateRoute:render", props);
					if (this.props.user) {
						return (
							<Article {...props}>
								{React.createElement(component, props)}
							</Article>
						);
					} else {
						if (process.env.MODULE === "oauth2") {
							return (
								<Oauth2Login />
							);
						} else {
							return (
								<CommonLogin />
							);
						}
					}
				}}
			/>
		);
	}
}
