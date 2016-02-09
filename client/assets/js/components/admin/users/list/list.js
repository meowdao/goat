"use strict";

import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";
import API from "../../../../utils/API";
import {bindActionCreators} from "redux";
import {Input, Tooltip, Button} from "react-bootstrap";
import {UPDATE_USER, UPDATE_USER_LIST} from "../../../../constants/constants";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";
import _ from "lodash";

const userUpdate = data =>
	dispatch =>
		API.updateUsers(data)
			.then(response => {
				dispatch({
					type: UPDATE_USER,
					data: response
				});
			});

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
	state => ({
		users: state.users.usersData,
		count: state.users.count
	}),
	dispatch => bindActionCreators({userUpdate, getUsers}, dispatch)
)
export default class UserList extends Component {

	static displayName = "User List";

	static propTypes = {
		users: PropTypes.array,
		userUpdate: PropTypes.func,
		getUsers: PropTypes.func,
		count: PropTypes.number,
		skip: PropTypes.number,
		limit: PropTypes.number
	};

	static defaultProps = {
		users: [],
		skip: 0,
		limit: 5,
		count: 0,
		sizePerPageList: [5, 10, 20, 50, 100]
	};

	state = {
		skip: this.props.skip,
		limit: this.props.limit,
		//onPageChange: ::this.onPageChange,
		//onSizePerPageList: ::this.sizePerPageListChange,
		page: 1,  //which page you want to show as default
		sizePerPageList: [10, 20, 50], //you can change the dropdown list for size per page
		sizePerPage: 5,  //which size per page you want to locate as default
		paginationSize: 5,  //the pagination bar size.
		prePage: "<", // Previous page button text
		nextPage: ">", // Next page button text
		firstPage: "first", // First page button text
		lastPage: "last" // Last page button text
	};

	componentDidMount() {
		this.props.getUsers({skip: this.state.skip, limit: this.state.limit});
	}

	changeLimit(limit) {
		this.setState({limit}, () => {
			this.props.getUsers({skip: this.state.skip, limit: this.state.limit});
		});
	}

	//onPageChange(page, sizePerPage) {
	//	this.setState({
	//		//skip: page === 1 ? 0 : sizePerPage * page - sizePerPage
	//	}, () => {
	//		this.props.getUsers({skip: this.state.skip, limit: this.state.limit});
	//	});
	//}

	onAfterSaveCell(user, cellName, cellValue) {
		if (!_.find(this.props.users, user)) {
			this.props.userUpdate(user);
		}
	}

	//sizePerPageListChange(sizePerPage) {
	//	this.setState({sizePerPage, limit: sizePerPage}, () => {
	//		this.props.getUsers({skip: this.props.skip, limit: this.state.limit});
	//	});
	//}

	isActive(cell, row) {
		if (cell === true) {
			return (
				<Button className="pull-left" bsStyle={cell ? "success" : "danger"}
				        onClick={() => this.isActiveChange(row)} bsSize="small"
				>
					{cell ? "Active" : "Not active"}
				</Button>
			);
		} else {
			return (
				<Button className="pull-left" bsStyle={cell ? "success" : "danger"}
				        onClick={() => this.isActiveChange(row)} bsSize="small"
				>
					{cell ? "Active" : "Not active"}
				</Button>
			);
		}
	}

	isActiveChange(user) {
		Object.assign(user, {isActive: !user.isActive});
		this.props.userUpdate(user);
	}

	showList() {
		const cellEditProp = {
			mode: "click",
			blurToSave: true,
			afterSaveCell: ::this.onAfterSaveCell
		};

		return (
			<div className="container col-sm-12">
				{this.props.users.length === 0
					? "Nothing to display"
					: <BootstrapTable
					data={JSON.parse(JSON.stringify(this.props.users))}
					dataAlign="left"
					pagination={true}
					cellEdit={cellEditProp}
					striped={true}
					hover={true}
					condensed={true}
					options={this.state}>
					<TableHeaderColumn dataField="_id" hidden={true} isKey={true}>ID</TableHeaderColumn>
					<TableHeaderColumn dataField="email" width="200"
					                   editable={false}>Email</TableHeaderColumn>
					<TableHeaderColumn dataField="firstName" width="200">First Name</TableHeaderColumn>
					<TableHeaderColumn dataField="lastName" width="200">Last Name</TableHeaderColumn>
					<TableHeaderColumn dataField="role" width="200" editable={false}>User role</TableHeaderColumn>
					<TableHeaderColumn dataField="isActive" width="200" editable={false}
					                   dataFormat={::this.isActive}>User
						status</TableHeaderColumn>
				</BootstrapTable>
				}
			</div>

		);
	}

	showForm() {
		return (
			<div className="container">
				<form>
					<div className="row">
						<div className="col-sm-1" style={{paddingTop: 6}}>
							<Tooltip placement="left" id="tooltip-admin-users" className="in">
								Total users
							</Tooltip>
						</div>
						<div className="col-sm-1">
							<Input
								id="limit"
								type="select"
								defaultValue={this.state.limit}
								onChange={(e) => this.changeLimit(~~e.target.value)}
							>
								<option value="5">5</option>
								<option value="10">10</option>
								<option value="20">20</option>
								<option value="50">50</option>
								<option value="100">100</option>
							</Input>
						</div>
					</div>
				</form>
			</div>
		);
	}

	render() {
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-sm-8">
							{this.showForm()}
							{this.showList()}
						</div>
					</div>

				</div>
			</div>
		);
	}
}
