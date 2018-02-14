import React, {Component} from "react";
import PropTypes from "prop-types";
import querystring from "querystring";
import {omit} from "lodash";
import withFormHelper from "./withFormHelper";
import {readFromQueryString} from "../../utils/location";


export default function withListHelper(storeName) {
	return WrappedComponent => {
		@withFormHelper(storeName)
		class ListHelper extends Component {
			static propTypes = {
				storeName: PropTypes.string,
				onSubmit: PropTypes.func,
				onChange: PropTypes.func,
				setState: PropTypes.func,
				location: PropTypes.shape({
					search: PropTypes.string.isRequired,
					pathname: PropTypes.string.isRequired
				}).isRequired,
				history: PropTypes.shape({
					push: PropTypes.func.isRequired
				}).isRequired,
				skip: PropTypes.number,
				limit: PropTypes.number,
				view: PropTypes.string
			};

			static defaultProps = {
				limit: 12,
				skip: 0,
				view: "list"
			};

			componentWillMount() {
				// console.log("ListFormHelper:componentWillMount", this.props);
				this.props.setState({
					skip: ~~readFromQueryString("skip", this.props.location.search) || this.props.skip,
					limit: ~~readFromQueryString("limit", this.props.location.search) || this.props.limit,
					view: readFromQueryString("view", this.props.location.search) || this.props.view
				});
			}

			componentWillReceiveProps(nextProps) {
				// console.log("ListFormHelper:componentWillReceiveProps", nextProps);
				if (!nextProps[this.props.storeName].isLoading && nextProps[this.props.storeName].success && nextProps[this.props.storeName].name === "list") {
					if (this.props[this.props.storeName].isLoading) {
						window.scrollTo(0, 0);
						this.updateQueryString(nextProps);
					}
				}
			}

			onSubmit(e) {
				// console.log("ListFormHelper:onSubmit", e);
				// e.persist();
				this.props.onSubmit({
					preventDefault: e ? ::e.preventDefault : Function,
					target: {
						getAttribute: name => {
							switch (name) {
								case "action":
									return `/${this.props.storeName}`;
								case "name":
									return "list";
								case "method":
									return "GET";
								default:
									return null;
							}
						}
					}
				});
			}

			// THIS IS UGLY SHIIIT
			updateQueryString(nextProps) {
				const state = omit(nextProps, [
					"view",
					"messageShow", "doAjaxAction", "dispatch", "onChange", "setState", "onSubmit",
					"location", "history", "match",
					"storeName", "paramName",
					nextProps.storeName
				]);
				if (state.limit === ListHelper.defaultProps.limit) {
					state.limit = void 0;
				}
				if (state.skip === ListHelper.defaultProps.skip) {
					state.skip = void 0;
				}
				Object.keys(state).forEach(key => {
					if (state[key] === "") {
						state[key] = void 0;
					}
				});
				const search = querystring.stringify(JSON.parse(JSON.stringify(Object.assign(querystring.parse(nextProps.location.search.substring(1)), state))));
				if (nextProps.location.search.substring(1) !== search) {
					nextProps.history.push({search});
				}
			}

			render() {
				// console.log("ListFormHelper:render", this.props);
				return (
					<WrappedComponent
						{...this.props}
						onSubmit={::this.onSubmit}
					/>
				);
			}
		}

		return ListHelper;
	};
}
