/**
 * @flow
 */

import _ from 'lodash';
import $ from 'jquery';
import React from 'react/addons';
import classnames from 'classnames';
import FormTextarea from './formTextareaComponent';
import BootstrapPopoverWrapper from '../../../shared/components/objects/bootstrapPopoverWrapperComponent';


export default class FormTextareaList extends React.Component {

	currentIndex = 0;

	constructor(props) {
		super(props);

		this.state = {
			items: this._format(this.props.defaultValue),
			options: false,
			buttons: false
		};
	}

	onChange() {
		const array = this._getNodes().map(o => o.value);
		this.props.onChange({
			target: {
				name: this.props.name,
				value: array
			}
		});
	}

	onMouseEnter() {
		this.setState({options: true});
	}

	onMouseLeave() {
		this.setState({
			options: false,
			buttons: false
		});
	}

	onMouseOver(e) {
		this.currentIndex = $(e.currentTarget).index();
		const options = React.findDOMNode(this.refs.options);
		const list = React.findDOMNode(this.refs.list);
		$(options).css({top: $(e.currentTarget).offset().top - $(list).offset().top});
	}

	onClick(e) {
		e.preventDefault();
		this.setState({buttons: !this.state.buttons});
	}

	moveUp() {
		this.setState({items: this.arraymove(this._format(this._getNodes()), -1)});
		this.onChange();
	}

	moveDown() {
		this.setState({items: this.arraymove(this._format(this._getNodes()), 1)});
		this.onChange();
	}

	remove() {
		const index = this.currentIndex;
		let items = [].concat(this.state.items);
		items.splice(index, 1);
		this.setState({items: items});
		this.onChange();
	}

	render():any {

		const {help, containerClassName, length, ...props} = this.props;

		const helpContainer = !help ? null :
			<BootstrapPopoverWrapper
				className="icon-question-sign"
				content={help}
				placement="right"
				trigger="hover"
				displayType="inline-block"
				attachToBody={true}/>;

		return (
			<div className="multi-field" onMouseEnter={this.onMouseEnter.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)}>
				<ul ref="list" className={classnames('multi-field__list', containerClassName)}>
					{this.renderList()}
				</ul>
				<div className="multi-field__add">
					<a className="lc-icon-text" onClick={this.addMoreFields.bind(this)}><i className="icon-plus"></i>Add goal or objective</a>
				</div>
				<div className="extra">
					{helpContainer}
				</div>
				{this.renderOptions()}
			</div>
		);
	}

	renderList() {

		const {help, containerClassName, length, defaultValue, ...props} = this.props;

		return this.state.items.map(item => {
			return (
				<li key={item.id} className="multi-field__field" onMouseOver={this.onMouseOver.bind(this)}>
					<span className="multi-field__field__bullet"></span>

					<FormTextarea {...props} defaultValue={item.value} onChange={this.onChange.bind(this)}/>
				</li>
			);
		});
	}

	renderOptions() {
		return (
			<div ref="options" className="list-options extra">
				<a onClick={this.onClick.bind(this)}>
					<i className="icon-cog"></i>
				</a>
				{!this.state.buttons ? null : <span onClick={this.moveUp.bind(this)}>
					<i className="icon-double-angle-up"></i>
				</span>}
				{!this.state.buttons ? null : <span onClick={this.moveDown.bind(this)}>
					<i className="icon-double-angle-down"></i>
				</span>}
				{!this.state.buttons ? null : <span onClick={this.remove.bind(this)}>
					<i className="icon-trash"></i>
				</span>}
			</div>
		);
	}

	addMoreFields() {
		this.setState({
			items: this.state.items.concat(this._format(['']))
		});
	}

	arraymove(array, sign) {
		if (this.currentIndex >= 0 && this.currentIndex < array.length && this.currentIndex + sign >= 0 && this.currentIndex + sign < array.length) {
			var element = array[this.currentIndex];
			array.splice(this.currentIndex, 1);
			array.splice(this.currentIndex + sign, 0, element);
			this.currentIndex += sign;
		}
		return array;
	}

	_getNodes() {
		const list = React.findDOMNode(this.refs.list);
		return [].slice.call(list.querySelectorAll('textarea'));
	}

	_format(array) {
		return array.map(item => {
			return {
				value: item.constructor === String ? item : item.value,
				id: _.uniqueId('c')
			};
		});
	}
}

FormTextareaList.propTypes = {
	type: React.PropTypes.string,
	placeholder: React.PropTypes.string,
	onChange: React.PropTypes.func,
	value: React.PropTypes.string,
	defaultValue: React.PropTypes.array,
	className: React.PropTypes.string,
	name: React.PropTypes.string,
	autoFocus: React.PropTypes.bool,

	help: React.PropTypes.string,
	containerClassName: React.PropTypes.string
};

FormTextareaList.defaultProps = {
	//maxLength: 1000,
	defaultValue: ''
};
