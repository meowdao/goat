/**
 * Create a select element. Give it an object and it will use each key as the
 * option value and key value for each option display. Make sure to have a
 * callback.
 *
 * Example:

 cost options = {
	1: 'Option 1',
	2: 'Option 2',
	3: 'Option 3'
};

 <FormSelect options={options} placeholder="Select one" ... />

 *
 * @flow
 */

import React from 'react/addons';
import classnames from 'classnames';

class FormSelect extends React.Component {

	static propTypes = {
		name: React.PropTypes.string,
		value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
		placeholder: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		defaultValue: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number, React.PropTypes.array]),
		className: React.PropTypes.string,
		options: React.PropTypes.object.isRequired,
		multiple: React.PropTypes.bool
	};

	static defaultProps = {
		defaultValue: ''
	};

	onChange() {
		const select = React.findDOMNode(this.refs.select);
		const array = [].slice.call(select.querySelectorAll('option')).filter(o => o.selected).map(o => o.value);
		this.props.onChange({
			target: {
				name: this.props.name,
				value: this.props.multiple === true ? array : array[0]
			}
		});
	}

	render():any {
		const { className, options, ...props } = this.props;

		const placeholder = this.props.placeholder ?
			<option value="">{this.props.placeholder}</option> : null;

		return (
			<select {...props}
				ref='select'
				className={classnames('form__select', className)}
				onChange={this.onChange.bind(this)}>
				{placeholder}
				{Object.keys(options).map(key =>
						<option key={key} value={key}>
							{options[key]}
						</option>
				)}
			</select>
		);
	}
}

export default FormSelect;
