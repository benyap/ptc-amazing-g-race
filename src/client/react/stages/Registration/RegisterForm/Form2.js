import React from 'react';
import autobind from 'core-decorators/es/autobind';
import { withApollo, gql } from 'react-apollo';
import { Button } from '@blueprintjs/core/dist/components/button/buttons';
import { Intent } from '@blueprintjs/core/dist/common/intent';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import Validator from '../../../../../../lib/react/components/forms/validation/Validator';
import NotEmpty from '../../../../../../lib/react/components/forms/validation/functions/NotEmpty';
import RegexCheck from '../../../../../../lib/react/components/forms/validation/functions/RegexCheck';
import { errorProps, pendingProps, successProps } from './lib';


const QueryEmailUnique = gql`query CheckUnique($parameter:UserParameter!,$value:String!){checkUnique(parameter:$parameter,value:$value){ok}}`;

@withApollo
@autobind
class Form2 extends React.Component {
	state = {
		email: this.props.state.email,
		mobileNumber: this.props.state.mobileNumber,
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

	async validateEmail(value) {
		if (NotEmpty(value)) {
			const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (RegexCheck(value, regex)) {
				// Check email with server
				return this.props.client.query({ 
					query: QueryEmailUnique,
					variables: { parameter: 'email', value: value } 
				})
				.then((result) => {
					if (result.data) {
						if (result.data.checkUnique.ok) {
							return { ok: true, helperText: 'You can use this email.'};
						}
						else {
							return { ok: false, helperText: 'This email is already taken.' };
						}
					}
					else {
						return { ok: false, helperText: 'Could not verify the email with the server.' };
					}
				});
			}
			else {
				return { ok: false, helperText: 'Invalid email.'};
			}
		}
		else {
			return { ok: false, helperText: 'Email is required.' };
		}
	}

	validateMobile(value) {
		if (NotEmpty(value)) {
			const regex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
			if (RegexCheck(value, regex)) {
				return { ok: true };
			}
			else {
				return { ok: false, helperText: 'Invalid mobile number.' };
			}
		}
		else {
			return { ok: false, helperText: 'Moblie number is required.' };
		}
	}

	async _validateFormNext() {
		if (await this._validateForm()) {
			if (this.state.nextDisabled) this.setState({nextDisabled: false});
		}
		else {
			if (!this.state.nextDisabled) this.setState({nextDisabled: true});
		}
	}

	async _validateForm() {
		const validateEmail = await this.validateEmail(this.state.email);
		const validateMobile = this.validateMobile(this.state.mobileNumber);

		if (validateEmail.ok && validateMobile.ok) return true;
		else return false;
	}

	render() {
		return (
			<div>
				<div className='pt-callout pt-intent-warning' style={{marginBottom: '0.3rem'}}>
					<h5>Step 2 of 4</h5>
					Your email will be used to create an account.
					Your mobile will be saved just in case we need to contact you, 
					especially on the day of the event.
				</div>

				<Validator validationFunction={this.validateEmail} errorProps={errorProps()} pendingProps={pendingProps()} showPending successProps={successProps()} showSuccess>
					<FormInput id='email' large value={this.state.email} onChange={this.onChange} label='Email'/>
				</Validator>

				<Validator validationFunction={this.validateMobile} errorProps={errorProps()}>
					<FormInput id='mobileNumber' large value={this.state.mobileNumber} onChange={this.onChange} label='Mobile'/>
				</Validator>
				
				<Button onClick={this.props.next} className='pt-large' text='Next >' disabled={this.state.nextDisabled} intent={Intent.PRIMARY} style={{float:'right'}}/>
				<Button onClick={this.props.back} className='pt-large pt-minimal' text='< Back' intent={Intent.PRIMARY} style={{float:'left'}}/>
			</div>
		);
	}
}


export default Form2;
