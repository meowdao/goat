/**
 * Create a select element. You can give it an array of objects and
 * specify which props in the object should be used as the select"s
 * value and display. Make sure to have a callback.
 *
 * @example

 var data = {
     1: "Option 1",
     2: "Option 2",
     3: "Option 3"
 };

 <FormInputList options={options} />

 *
 * @flow
 */

import React from "react/addons";
import classnames from "classnames";

class FormInputList extends React.Component {

	onChange(){
		const list = React.findDOMNode(this.refs.list);
		const array = [].slice.call(list.querySelectorAll("input")).filter(o => o.checked).map(o => o.value);
		this.props.onChange({
			target: {
				name: this.props.name,
				value: this.props.type === "checkbox" ? array : array[0]
			}
		});
	}

	render():any {
		const { className, options, defaultChecked, ...props } = this.props;

		return (
			<ul ref="list" className={classnames("check-list info__check-list", className)}>
				{Object.keys(options).map(key =>
					<li key={key}>
						<label>
							<input {...props} value={key} defaultChecked={[].concat(defaultChecked).indexOf(key) !== -1} onChange={this.onChange.bind(this)}/>
							<span>{options[key]}</span>
						</label>
					</li>
				)}
			</ul>
		);
	}

}

FormInputList.propTypes = {
	value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
	placeholder: React.PropTypes.string,
	options: React.PropTypes.object.isRequired,
	onChange: React.PropTypes.func.isRequired,
	defaultValue: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
	className: React.PropTypes.string,
	type: React.PropTypes.oneOf(["checkbox", "radio"])
};

FormInputList.defaultProps = {
	defaultValue: "",
	type: "checkbox"
};

export default FormInputList;
