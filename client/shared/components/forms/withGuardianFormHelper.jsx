import React, {Component} from "react";
import PropTypes from "prop-types";
import {Prompt} from "react-router-dom";


export default function withGuardianFormHelper() {
	return WrappedComponent => {
		// console.log("withGuardianFormHelper:WrappedComponent", WrappedComponent);

		class GuardianFormHelper extends Component {
			static propTypes = {
				storeName: PropTypes.string,
				onChange: PropTypes.func
			};

			state = {
				isSaved: true
			};

			componentWillReceiveProps(nextProps) {
				// console.log("UpdateFormHelper:componentWillReceiveProps", nextProps);
				if (!nextProps[this.props.storeName].isLoading && nextProps[this.props.storeName].success) {
					if (nextProps[this.props.storeName].name === "update" || nextProps[this.props.storeName].name === "create" || nextProps[this.props.storeName].name === "batch") {
						this.setState({
							isSaved: true
						});
					}
				}
			}

			onChange(e) {
				// console.log("GuardianFormHelper:onChange", e);
				e.persist();
				if (this.state.isSaved) {
					this.setState({
						isSaved: false
					}, () => {
						this.props.onChange(e);
					});
				} else {
					this.props.onChange(e);
				}
			}

			render() {
				// console.log("GuardianFormHelper:render", this.props, this.state);
				return (
					<div>
						<Prompt when={!this.state.isSaved} message="You have unsaved information, are you sure you want to leave this page?" />
						<WrappedComponent
							{...this.props}
							onChange={::this.onChange}
						/>
					</div>
				);
			}
		}

		return GuardianFormHelper;
	};
}
