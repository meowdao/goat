import React, {Component} from "react";
import PropTypes from "prop-types";
import withFormHelper from "./withFormHelper";
import withGuardianFormHelper from "./withGuardianFormHelper";


export default function withCreateFormHelper(storeName, paramName) {
	return WrappedComponent => {
		// console.log("withCreateFormHelper:WrappedComponent", WrappedComponent);

		@withFormHelper(storeName, paramName)
		@withGuardianFormHelper()
		class CreateFormHelper extends Component {
			static propTypes = {
				onSubmit: PropTypes.func,
				storeName: PropTypes.string,
				paramName: PropTypes.string,

				history: PropTypes.shape({
					push: PropTypes.func.isRequired
				}).isRequired
			};

			state = {
				isSaved: true
			};

			componentWillMount() {
				// console.log("CreateFormHelper:componentWillMount");
			}

			componentWillReceiveProps(nextProps) {
				// console.log("CreateFormHelper:componentWillReceiveProps", nextProps);
				if (!nextProps[this.props.storeName].isLoading && nextProps[this.props.storeName].success && nextProps[this.props.storeName].name === "create") {
					this.setState({
						isSaved: true
					}, () => {
						// console.log("CreateFormHelper:componentWillReceiveProps:callback", this.props);
						this.props.history.push(`/${this.props.storeName}/${nextProps[this.props.storeName].list[nextProps[this.props.storeName].list.length - 1][this.props.paramName]}`);
					});
				}
			}

			onChange() {
				this.setState({
					isSaved: false
				});
			}

			onSubmit(e) {
				// console.log("withCreateFormHelper:onSubmit", this.props);
				this.props.onSubmit({
					preventDefault: e ? e.preventDefault.bind(e) : Function,
					target: {
						getAttribute: name => {
							switch (name) {
								case "action":
									return e && e.target.getAttribute(name) || `/${this.props.storeName}`;
								case "name":
									return e && e.target.getAttribute(name) || "create";
								case "method":
									return e && e.target.getAttribute(name) || "POST";
								default:
									return null;
							}
						}
					}
				});
			}

			render() {
				// console.log("CreateFormHelper:render", this.props);
				return (
					<WrappedComponent
						{...this.props}
						onSubmit={::this.onSubmit}
					/>
				);
			}
		}

		return CreateFormHelper;
	};
}
