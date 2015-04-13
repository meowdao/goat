"use strict";

import React from "react";
import Headline from "./headline.js";
import Message from "./utils/message.js";
import Welcome from "./static/welcome.js";
import Dispatcher from "../utils/dispatcher.js";
import ActionTypes from "../utils/constants.js";


export default class Article extends React.Component {

	static propTypes = {
		user: React.PropTypes.object
		//view: React.PropTypes.instanceOf(React.Component)
	};

	static defaultProps = {
		user: null,
		view: Welcome
	};

	state = {
		view: this.props.view
	};

	constructor(props) {
		super(props);
	}

	componentDidMount () {
		this.userToken = Dispatcher.register((payload) => {
			if (payload.actionType === ActionTypes.CHANGE_VIEW) {
				this.setState({view: payload.view})
			}
		});
	}

	componentWillUnmount() {
		Dispatcher.unregister(this.userToken);
	}

	render() {
		return (
			<div className="container">
				<Message/>
				<Headline text="Headline"/>
				<this.state.view  {...this.props}/>
			</div>
		);
	}

}
