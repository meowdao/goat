"use strict";

import React, {PropTypes} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Input, ButtonInput, Pagination} from "react-bootstrap";
import API from "../../../utils/API";

let pages;

const users = (data) =>
	dispatch =>
		API.searchUsers(data)
			.then(response => {
				pages = response.count % 2 ? response.count / 2 + 1 : response.count / 2;
				dispatch({
					type: "USER_LIST",
					data: response
				});
			});

@connect(
	state => ({
		pages
	}),
	dispatch => bindActionCreators({users}, dispatch)
)
export default class UserListForm extends React.Component {

	static propTypes = {
		users: PropTypes.func,
		email: PropTypes.string,
		pages: PropTypes.number,
		activePage: PropTypes.number
	};

	static defaultProps = {
		email: "",
		pages: 0,
		activePage: 1
	};

	state = {
		email: this.props.email,
		activePage: this.props.activePage
	};

	onSubmit(e) {
		if (e) {
			e.preventDefault();
			this.setState({activePage: 1}, () => {
				this.props.users(this.state);
			});
		} else {
			this.props.users(this.state);
		}
	}

	changePages(e, selectedEvent) {
		this.setState({activePage: selectedEvent.eventKey}, () => {
			this.onSubmit();
		});
	}

	render() {
		return (
			<div className="container">
				<form onSubmit={::this.onSubmit}>
					<div className="row">
						<div className="col-sm-4">
							<Input
								id="name-search"
								autoFocus="true"
								type="text"
								placeholder="User email"
								defaultValue={this.state.email}
								onChange={(e) => this.setState({email: e.target.value})}
							/>
						</div>
						<div className="col-sm-1">
							<ButtonInput
								type="submit"
								value="Search"
								bsStyle="info"
							/>
						</div>
					</div>
				</form>
				<Pagination
					prev
					next
					first
					last
					ellipsis
					items={this.props.pages}
					maxButtons={5}
					activePage={this.state.activePage}
					onSelect={::this.changePages} />
			</div>

		);
	}

}
