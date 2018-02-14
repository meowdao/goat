import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Article from "./article";
import {Route} from "react-router";


@connect(
	state => ({
		user: state.user
	})
)
export default class Public extends Component {
	static propTypes = {
		user: PropTypes.object,
		component: PropTypes.func
	};

	render() {
		const {component, ...rest} = this.props;
		return (
			<Route
				{...rest}
				render={props => {
					return (
						<Article {...props}>
							{React.createElement(component)}
						</Article>
					);
				}}
			/>
		);
	}
}
