/**
 * Will create an input element with the type that you specify.
 *
 * @example

 // text input
 <FormInput type="text" onChange={aCallback} defaultValue={aValue} />

 // password input
 <FormInput type="password" onChange={anotherCallback} defaultValue={anotherValue} />

 // email input and will focus on this input when the component is rendered
 <FormInput type="email" onChange={emailCallback} defaultValue={emailValue} autoFocus={true} />

 * @flow
 */

import React from 'react/addons';
import classnames from 'classnames';

export default class FormInput extends React.Component {

	static propTypes = {
		type: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		onChange: React.PropTypes.func,
		value: React.PropTypes.string,
		defaultValue: React.PropTypes.string,
		className: React.PropTypes.string,
		name: React.PropTypes.string,
		maxLength: React.PropTypes.number,
		autoFocus: React.PropTypes.bool,

		label: React.PropTypes.string
	};

	static defaultProps = {
		type: 'text',
		defaultValue: ''
	};

	state = {
		length: this.props.defaultValue.length
	};


	constructor(props) {
		super(props);
	}

	onChange(e) {
		this.setState({length: e.target.value.length});
		this.props.onChange(e);
	}

	render():React.Component {

		return (
			<div className="form-group">
				<label htmlFor={this.props.id} className="col-sm-2 control-label">{this.props.label}</label>

				<div className="input-group col-sm-10">
					<input {...this.props} className="form-control" onChange={this.onChange.bind(this)}/>

					{!this.props.maxLength ? null : <div className="input-group-addon">{this.props.maxLength - this.state.length}</div>}
				</div>
			</div>
		);
	}

}
