import React, {Component} from "react";
import PropTypes from "prop-types";
import {ListGroup, Well, Row, Table} from "react-bootstrap";
import withLoader from "./withLoader";
import withStore from "./withStore";


export default function withListItemHelper(storeName, type) {
	return ListItem => {
		@withStore(storeName)
		@withLoader(storeName)
		class ListItemHelper extends Component {
			static propTypes = {
				storeName: PropTypes.string,
				count: PropTypes.number,
				limit: PropTypes.number,
				view: PropTypes.string
			};

			getRows() {
				return this.props[this.props.storeName].list.slice(0, this.props.limit).map((item, i) => (
					<ListItem
						key={i}
						storeName={this.props.storeName}
						{...item}
					/>
				))
			}

			render() {
				// console.log("ListItemHelper:render", this.props);
				if (this.props[this.props.storeName].list.length) {
					switch (type) {
						case Table:
							return (
								<Table className={`${this.props.storeName}-list`} striped bordered condensed hover>
									<tbody>
									{this.getRows()}
									</tbody>
								</Table>
							);
						default:
							return (
								<List className={`${this.props.storeName}-list`}>
									{this.getRows()}
								</List>
							);
					}

				} else {
					return (
						<Well className="text-center">Nothing to display</Well>
					);
				}
			}
		}

		return ListItemHelper;
	};
}

