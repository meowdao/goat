"use strict";

import React from "react";
import {connect} from "react-redux";
import Title from "../partials/title.js";
import Message from "../partials/messages.js";


@connect(
	state => ({
		messages: state.messages
	})
)
export default class Error extends Message {

	static displayName = "Error";

	static defaultProps = {
		messages: []
	};

	render() {

		return (
			<div className="container">

				<Title {...this.props}/>

				{this.props.messages.map((message, i) =>
					<p key={i}>
						{message.text}
					</p>
				)}
			</div>
		);
	}
}
