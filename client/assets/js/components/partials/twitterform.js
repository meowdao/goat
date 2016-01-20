"use strict";

import React, {PropTypes} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Input, ButtonInput} from "react-bootstrap";
import API from "../../utils/API";

const twits = data =>
	dispatch =>
		API.searchTwits(data)
			.then(response => {
				dispatch({
					type: "UPDATE_TWITTER",
					data: response.statuses
				});
			});


@connect(
	state => ({}),
	dispatch => bindActionCreators({twits}, dispatch)
)

export default class TwitterForm extends React.Component {

	static propTypes = {
		query: PropTypes.string,
		count: PropTypes.number,
		twits: PropTypes.func

	};

	static defaultProps = {
		query: "string",
		count: 5
	};

	state = {
		q: this.props.query,
		count: this.props.count
	};

	onSubmit(e) {
		e.preventDefault();
		this.props.twits(this.state);
	}

	render() {
		return (
			<div className="container">
				<form onSubmit={::this.onSubmit}>
					<Input
						type="text"
						defaultValue={this.state.q}
						onChange={(e) => this.setState({q: e.target.value})}
					/>
					<Input
						type="text"
						defaultValue={this.state.count}
						onChange={(e) => this.setState({count: ~~e.target.value})}
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
