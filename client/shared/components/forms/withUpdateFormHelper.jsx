import React, {Component} from "react";
import PropTypes from "prop-types";
import withReadFormHelper from "./withReadFormHelper";
import withGuardianFormHelper from "./withGuardianFormHelper";


export default function withUpdateFormHelper(storeName, paramName) {
	return WrappedComponent => {
		// console.log("withUpdateFormHelper:WrappedComponent", WrappedComponent);

		@withReadFormHelper(storeName, paramName)
		@withGuardianFormHelper()
		class UpdateFormHelper extends Component {
			static propTypes = {
				onSubmit: PropTypes.func,
				storeName: PropTypes.string,
				paramName: PropTypes.string,

				match: PropTypes.shape({
					params: PropTypes.object.isRequired
				}).isRequired,
				history: PropTypes.shape({
					push: PropTypes.func.isRequired
				}).isRequired
			};

			componentWillReceiveProps(nextProps) {
				// console.log("UpdateFormHelper:componentWillReceiveProps", nextProps);
				if (!nextProps[this.props.storeName].isLoading && nextProps[this.props.storeName].success && nextProps[this.props.storeName].name === "update") {
					this.props.history.push(`/${this.props.storeName}/${this.props.match.params[this.props.paramName]}`);
				}
			}

			onSubmit(e) {
				this.props.onSubmit({
					preventDefault: e ? e.preventDefault.bind(e) : Function,
					target: {
						getAttribute: name => {
							switch (name) {
								case "action":
									return `/${this.props.storeName}/${this.props.match.params[this.props.paramName]}`;
								case "name":
									return "update";
								case "method":
									return "PUT";
								default:
									return null;
							}
						}
					}
				});
			}

			render() {
				// console.log("UpdateFormHelper:render", this.props, this.state);
				return (
					<WrappedComponent
						{...this.props}
						onSubmit={::this.onSubmit}
					/>
				);
			}
		}

		return UpdateFormHelper;
	};
}
