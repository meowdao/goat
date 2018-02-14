import React, {Component} from "react";
import {Glyphicon} from "react-bootstrap";


export default class Loader extends Component {
	render() {
		return (
			<div>
				<Glyphicon glyph="refresh" className="gly-spin" />&nbsp;Loading...
			</div>
		);
	}
}
