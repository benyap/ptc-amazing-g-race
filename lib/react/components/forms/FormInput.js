import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Intent } from '@blueprintjs/core';
import { autobind } from 'core-decorators';


// Intent mapper
const IntentMap = ['primary', 'success', 'warning', 'danger'];

@autobind
class FormInput extends React.Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		label: PropTypes.string,
		sublabel: PropTypes.string,
		helperText: PropTypes.string,
		defaultValue: PropTypes.string,
		placeholder: PropTypes.string,
		disabled: PropTypes.bool,
		intent: PropTypes.number,
		type: PropTypes.oneOf(['text', 'email', 'password']),
		onChange: PropTypes.func,
		value: PropTypes.string,
		readOnly: PropTypes.bool,
		leftIconName: PropTypes.string,
		rightElement: PropTypes.element,
		large: PropTypes.bool,

		// This prop is managed by Validator
		updateValidation: PropTypes.func
	}

	static defaultProps = {
		intent: Intent.NONE,
		disabled: false,
		large: false,
		type: 'text'
	}

	renderLabel() {
		const { label, sublabel } = this.props;
		return (
			<label class='pt-label' for={this.props.id}>
				{label}
				{sublabel?
					<span class='pt-text-muted'>{' ' + sublabel}</span> :
					null
				}
			</label>
		);
	}

	onChange(e) {
		// Update validation if it exists
		if (this.props.updateValidation) {
			this.props.updateValidation(e.target.value);
		}
		// Forward change to onChange handler if it exists
		if (this.props.onChange) {
			this.props.onChange(e);
		}
	}

	renderField() {
		const { helperText, placeholder, defaultValue, intent, type, disabled, value, readOnly, leftIconName, rightElement } = this.props;
		return (
			<div class={'pt-form-content' + (this.props.large?' pt-large':'')}>
				<InputGroup id={this.props.id} className={(this.props.large?' pt-large':'')}
					placeholder={placeholder} defaultValue={defaultValue} 
					intent={intent} type={type} disabled={disabled}
					value={value} readOnly={readOnly} onChange={this.onChange}
					leftIconName={leftIconName} rightElement={rightElement}/>
				{helperText?
					<div class='pt-form-helper-text'>{helperText}</div> :
					null
				}
			</div>
		);
	}
	
	render() {
		let intentClass;
		if (this.props.intent >= 0) intentClass = 'pt-intent-' + IntentMap[this.props.intent];
		return (
			<div class={'pt-form-group ' + intentClass}>
				{this.renderLabel()}
				{this.renderField()}
			</div>
		);
	}
}


export default FormInput;
