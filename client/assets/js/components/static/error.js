"use strict";

import React from "react";
import Title from "../partials/title.js";
import Message from "../partials/messages.js";


export default class Error extends Message {

	static displayName = "Error";

	render() {
		return (
			<div className="container">

				<Title {...this.props}/>

				{this.state.messages.map((message, i) =>
					<p key={i}>
						{message.text}
					</p>
				)}
			</div>
		);
	}

}

