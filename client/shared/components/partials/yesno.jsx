import React, {Component} from "react";
import PropTypes from "prop-types";
import {Modal, Button} from "react-bootstrap";
import {FormattedMessage} from "react-intl";


export default class YesNoDialog extends Component {
	static propTypes = {
		onConfirm: PropTypes.func,
		onCancel: PropTypes.func,
		children: PropTypes.node,
		show: PropTypes.bool,
		title: PropTypes.object,
		className: PropTypes.string,
		animation: PropTypes.bool,
		backdrop: PropTypes.oneOf([
			true,
			false,
			"static"
		])
	};

	onCancel() {
		this.props.onCancel();
	}

	onConfirm() {
		this.props.onConfirm();
	}

	render() {
		const {show, animation, className, backdrop} = this.props;
		return (
			<Modal onHide={::this.onCancel} {...{show, animation, className, backdrop}}>
				{this.props.title ?
					<Modal.Header>
						{this.props.title}
					</Modal.Header>
					: null}
				<Modal.Body>
					{this.props.children}
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={::this.onConfirm}>
						<FormattedMessage id="components.buttons.ok" />
					</Button>
					<Button onClick={::this.onCancel}>
						<FormattedMessage id="components.buttons.cancel" />
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}
