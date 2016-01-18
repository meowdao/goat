"use strict";

import React, {PropTypes} from "react";
import TwitterStore from "../../stores/TwitStore.js";

export default class TwitterList extends React.Component {

	static propTypes = {
		messages: PropTypes.array

	};

	static defaultProps = {
		messages: []
	};

	constructor() {
		super(...arguments);
		this.state = this.getStateFromStores();
	}

	state = {
		messages: this.props.messages
	};

	componentDidMount() {
		TwitterStore.addChangeListener(this._onChange.bind(this));
	}

	componentWillUnmount() {
		TwitterStore.removeChangeListener(this._onChange.bind(this));
	}

	getStateFromStores() {
		return {
			messages: TwitterStore.getMessages()
		};
	}

	_onChange() {
		this.setState(this.getStateFromStores());
	}


	render() {
		return (
			<ul>
				{this.state.messages.map((message, i) => {
					return <li key={i}><h5>{message.user.name}:</h5> {message.text}</li>;
				})}
			</ul>
		);
	}

}
