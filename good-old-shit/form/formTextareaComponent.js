/**
 * Will create an input element with the type that you specify.
 *
 * @example

 // text input
 <FormTextarea onChange={aCallback} defaultValue={aValue} />

 * @flow
 */

import React from 'react/addons';
import classnames from 'classnames';

export default class FormTextarea extends React.Component {

	static propTypes = {
		type: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		onChange: React.PropTypes.func,
		value: React.PropTypes.string,
		defaultValue: React.PropTypes.string,
		className: React.PropTypes.string,
		name: React.PropTypes.string,
		autoFocus: React.PropTypes.bool
	};

	static defaultProps = {
		defaultValue: ''
	};

	state = {
		length: this.props.defaultValue.length
	};

	onChange(e) {
		this.setState({length: e.target.value.length});
		this.props.onChange(e);
	}

	render():React.Component {

		return (
			<textarea {...this.props} class="form-control" rows="3"/>
		);
	}
}
