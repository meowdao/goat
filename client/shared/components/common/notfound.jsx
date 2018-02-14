import React, {Component} from "react";
import {FormattedMessage} from "react-intl";


export default class NotFound extends Component {
	render() {
		return (
			<div>
				<FormattedMessage id="errors.page-not-found" />
			</div>
		);
	}
}
