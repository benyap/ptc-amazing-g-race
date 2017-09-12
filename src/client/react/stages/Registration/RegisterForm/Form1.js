import React from 'react';
import { autobind } from 'core-decorators';
import { Button, Intent } from '@blueprintjs/core';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import Validator from '../../../../../../lib/react/components/forms/validation/Validator';
import NotEmpty from '../../../../../../lib/react/components/forms/validation/functions/NotEmpty';

import { errorProps } from './lib';


@autobind
class Form1 extends React.Component {
	state = {
		firstname: this.props.state.firstname,
		lastname: this.props.state.lastname,
		university: this.props.state.university,
		nextDisabled: true
	}

	componentDidMount() {
		this._validateFormNext();
	}
	
	onChange({ target }) {
		this.props.onChange(target.id, target.value);
		this.setState({
			[target.id]: target.value
		}, () => {
			// Validate form for next button
			this._validateFormNext();
		});
	}

	_validateName(name) {
		return (value) => {
			if (NotEmpty(value)) {
				return { ok: true };
			}
			else {
				return { ok: false, helperText: name + ' is required.' };
			}
		};
	}

	_validateFormNext() {
		if (this._validateForm()) {
			if (this.state.nextDisabled) this.setState({nextDisabled: false});
		}
		else {
			if (!this.state.nextDisabled) this.setState({nextDisabled: true});
		}
	}

	_validateForm() {
		let validFirstname = this._validateName()(this.state.firstname);
		let validLastname = this._validateName()(this.state.lastname);

		if (validFirstname.ok && validLastname.ok) return true;
		else return false;
	}

	render() {
		return (
			<div>
				<div className='pt-callout pt-intent-warning' style={{marginBottom: '0.3rem'}}>
					<h5>Step 1 of 4</h5>
					Firstly, we'll need to know who you are.
				</div>

				<Validator validationFunction={this._validateName('First name')} errorProps={errorProps()}>
					<FormInput id='firstname' large value={this.state.firstname} onChange={this.onChange} label='First name'/>
				</Validator>

				<Validator validationFunction={this._validateName('Last name')} errorProps={errorProps()}>
					<FormInput id='lastname' large value={this.state.lastname} onChange={this.onChange} label='Last name'/>
				</Validator>

				<label className='pt-label' htmlFor='university'>
					University
					<div className='pt-select pt-large'>
						<select name='university' id='university' defaultValue={this.props.state.university} onChange={this.onChange}>
							<option value='Deakin University'>Deakin University</option>
							<option value='Monash University'>Monash University</option>
							<option value='University of Melbourne'>University of Melbourne</option>
							<option value='Other'>Other</option>
						</select>
					</div>
				</label>
				
				<Button onClick={this.props.next} className='pt-large' text='Next >' disabled={this.state.nextDisabled} intent={Intent.PRIMARY} style={{float:'right'}}/>
			</div>
		);
	}
}


export default Form1;
