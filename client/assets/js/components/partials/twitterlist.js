"use strict";

import React, {PropTypes} from "react";
import TwitterStore from "../../stores/TwitStore.js";
import {Table, ButtonToolbar, Button, ListGroup, ListGroupItem} from "react-bootstrap";

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
								<Table striped>
									<tdbody>
										<tr>
											<td><img src={message.user.profile_image_url}/></td>
											<td>{message.text}</td>
										</tr>
									</tdbody>
								</Table>
								<ButtonToolbar>
									<Button bsSize="xsmall" href={twitUrl}>Original Twit</Button>
								</ButtonToolbar>
							</ListGroupItem>
						);
					})}
				</ListGroup>
			</div>
		);
	}

}
