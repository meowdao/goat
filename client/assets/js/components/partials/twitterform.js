"use strict";

import React, {PropTypes} from "react";
import API from "../../utils/API";
import {Well, Input, ButtonInput} from "react-bootstrap";

export default class TwitterForm extends React.Component {

	static propTypes = {
		query: PropTypes.string,
		count: PropTypes.number

	};

	static defaultProps = {
		query: "string",
		count: "number"
	};

	state = {
		query: this.props.query,
		count: this.props.count
	};

	onSubmit(e) {
		e.preventDefault();
		API.searchTwits({q: this.state.query, count: this.state.count});

	}

	render() {
		return (
			<div className="container">
				<h4> Twitter Search </h4>
				<form onSubmit={::this.onSubmit}>
					<Input
						type="text"
						defaultValue={this.state.query}
						onChange={(e) => this.setState({query: e.target.value})}
					/>
					<Input
						type="text"
						defaultValue={this.state.count}
						onChange={(e) => this.setState({count: e.target.value})}
					/>
					<ButtonInput
						type="submit"
						value="Search"
						bsStyle="info"
					/>
				</form>
			</div>

		);
	}

}
