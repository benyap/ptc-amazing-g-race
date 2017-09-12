import React from 'react';
import { autobind } from 'core-decorators';
import { Button, Intent, ProgressBar, Icon } from '@blueprintjs/core';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import Validator from '../../../../../../lib/react/components/forms/validation/Validator';
import NotEmpty from '../../../../../../lib/react/components/forms/validation/functions/NotEmpty';
import HasLength from '../../../../../../lib/react/components/forms/validation/functions/HasLength';
import IsMatch from '../../../../../../lib/react/components/forms/validation/functions/IsMatch';
import { errorProps } from './lib';


@autobind
class Form3 extends React.Component {
	state = {
		password: this.props.state.password,
		password2: this.props.state.password2,
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

	validatePassword(value) {
		if (NotEmpty(value)) {
			if (HasLength(value, 6)) {
				return { ok: true }
			}
			else {
				return { ok: false, helperText: 'Password must be at least 6 characters long.' };
			}
		}
		else {
			return { ok: false, helperText: 'A password is required.'}
		}
	}

	validatePassword2(value) {
		if (NotEmpty(value)) {
			if (IsMatch(value, this.state.password)) {
				return { ok: true };
			}
			else {
				return { ok: false, helperText: 'Passwords do not match.' };
			}
		}
		else {
			return { ok: false, helperText: 'Please confirm your password.' };
		}
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
		let validatePassword = this.validatePassword(this.state.password);
		let validatePassword2 = this.validatePassword2(this.state.password2);

		if (validatePassword.ok && validatePassword2.ok) return true;
		else return false;
	}

	render() {
		return (
			<div>
				<div className='pt-callout pt-intent-warning' style={{marginBottom: '0.3rem'}}>
					<h5>Step 3 of 4</h5>
					Each member of the Amazing GRace will have an account which they will use to log in on the day.
					Part of the race will involve entering answers online so make sure you choose a secure but memorable password!
				</div>

				<Validator validationFunction={this.validatePassword} errorProps={errorProps()}>
					<FormInput id='password' large type='password' value={this.state.password} onChange={this.onChange} label='Password'/>
				</Validator>

				<Validator validationFunction={this.validatePassword2} errorProps={errorProps()}>
					<FormInput id='password2' large type='password' value={this.state.password2} onChange={this.onChange} label='Confirm password'/>
				</Validator>
				
				<Button onClick={this.props.next} className='pt-large' text='Next >' disabled={this.state.nextDisabled} intent={Intent.PRIMARY} style={{float:'right'}}/>
				<Button onClick={this.props.back} className='pt-large pt-minimal' text='< Back' intent={Intent.PRIMARY} style={{float:'left'}}/>
			</div>
		);
	}
}


export default Form3;
