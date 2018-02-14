import React, {Component} from "react";
import PropTypes from "prop-types";
import {FormattedMessage} from "react-intl";
import YesNoDialog from "../partials/yesno";
import withReadFormHelper from "./withReadFormHelper";


export default function withDeleteFormHelper(storeName, paramName) {
	return WrappedComponent => {
		// console.log("withDeleteFormHelper:WrappedComponent", WrappedComponent);

		@withReadFormHelper(storeName, paramName)
		class DeleteFormHelper extends Component {
			static propTypes = {
				doAjaxAction: PropTypes.func,
				storeName: PropTypes.string,
				paramName: PropTypes.string,

				match: PropTypes.shape({
					params: PropTypes.object.isRequired
				}).isRequired,
				history: PropTypes.shape({
					push: PropTypes.func.isRequired
				}).isRequired
			};

			state = {
				showConfirmationDialog: false
			};

			componentWillReceiveProps(nextProps) {
				if (!nextProps[this.props.storeName].isLoading && nextProps[this.props.storeName].success && nextProps[this.props.storeName].name === "delete") {
					this.props.history.push(`/${this.props.storeName}`);
				}
			}

			onDelete(e) {
				e.preventDefault();
				this.setState({
					showConfirmationDialog: true
				});
			}

			onDeleteConfirmed() {
				this.props.doAjaxAction({
					action: `/${this.props.storeName}/${this.props.match.params[this.props.paramName]}`,
					method: "DELETE",
					storeName: this.props.storeName,
					name: "delete"
				});
			}

			onDialogClose() {
				this.setState({
					showConfirmationDialog: false
				});
			}

			render() {
				return (
					<div>
						<YesNoDialog
							title={<FormattedMessage id="dialogs.confirmation" />}
							show={this.state.showConfirmationDialog}
							onConfirm={::this.onDeleteConfirmed}
							onCancel={::this.onDialogClose}
						>
							<FormattedMessage id={`dialogs.${this.props.storeName}-delete`} />
						</YesNoDialog>
						<WrappedComponent
							{...this.props}
							onDelete={::this.onDelete}
						/>
					</div>
				);
			}
		}

		return DeleteFormHelper;
	};
}
