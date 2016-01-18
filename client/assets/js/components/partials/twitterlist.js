"use strict";

import React, {PropTypes} from "react";
import TwitterStore from "../../stores/TwitStore.js";
import {ListGroup, ListGroupItem} from "react-bootstrap";

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
			<div className="container">
				<ListGroup>
					{this.state.messages.map((message, i) => {
						const twitUrl = "https://twitter.com/statuses/" + message.id_str;

						return (
							<ListGroupItem header={message.user.name} key={i}>
								<p>{message.text}</p>
								<a href={twitUrl}>Original Twit</a>
							</ListGroupItem>
						);
					})}
				</ListGroup>
			</div>
		);
	}

}
