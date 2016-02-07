"use strict";

import React, {PropTypes} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Input, ButtonInput, Pagination} from "react-bootstrap";
import API from "../../../../utils/API";
import {UPDATE_USER_LIST} from "../../../../constants/constants";

const getUsers = data =>
	dispatch =>
		API.searchUsers(data)
			.then(response => {
				dispatch({
					type: UPDATE_USER_LIST,
					data: response
				});
			});

@connect(
	state => ({count: state.users.count}),
	dispatch => bindActionCreators({getUsers}, dispatch)
)
export default class UserListForm extends React.Component {

	static propTypes = {
		users: PropTypes.array,
		getUsers: PropTypes.func,
		email: PropTypes.string,
		skip: PropTypes.number,
		limit: PropTypes.number,
		count: PropTypes.number
	};

	static defaultProps = {
		email: "",
		skip: 0,
		limit: 5,
		count: 0
	};

	state = {
		email: this.props.email,
		skip: this.props.skip,
		limit: this.props.limit
	};

	onSubmit(e) {
		e.preventDefault();
		this.setState({activePage: 1, skip: 0}, () => {
			this.props.getUsers(this.state);
		});
	}

	changePages(e, selectedEvent) {
		this.setState({
			activePage: selectedEvent.eventKey,
			skip: selectedEvent.eventKey === 1 ? 0 : this.props.limit * selectedEvent.eventKey - this.props.limit
		}, () => {
			this.props.getUsers(this.state);
		});
	}

	showPagination() {
		if (this.state.activePage) {
			return (
				<Pagination
					prev
					next
					first
					last
					ellipsis
					items={this.state.limit ? Math.ceil(this.props.count / this.state.limit) : 1}
					maxButtons={5}
					activePage={this.state.activePage}
					onSelect={::this.changePages}
				/>
			);
		} else {
			return null;
		}
	}

	render() {
		return (
			<div className="container">
				<form onSubmit={::this.onSubmit}>
					<div className="row">
						<div className="col-sm-3">
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
							<h5>Per page:</h5>
						</div>
						<div className="col-sm-2">
							<Input
								id="limit"
								type="select"
								defaultValue={this.state.limit}
								onChange={(e) => this.setState({limit: ~~e.target.value})}
							>
								<option value="">All users</option>
								<option value="5">5</option>
								<option value="10">10</option>
								<option value="20">20</option>
								<option value="50">50</option>
							</Input>
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
				{::this.showPagination()}
			</div>

		);
	}

}
