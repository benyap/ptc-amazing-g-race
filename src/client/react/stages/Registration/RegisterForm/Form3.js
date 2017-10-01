import React from 'react';
import autobind from 'core-decorators/es/autobind';
import { withApollo, gql } from 'react-apollo';
import { ProgressBar } from '@blueprintjs/core/dist/components/progress/progressBar';
import { Icon } from '@blueprintjs/core/dist/components/icon/icon';
import { Button } from '@blueprintjs/core/dist/components/button/buttons';
import { Intent } from '@blueprintjs/core/dist/common/intent';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import Validator from '../../../../../../lib/react/components/forms/validation/Validator';
import NotEmpty from '../../../../../../lib/react/components/forms/validation/functions/NotEmpty';
import HasLength from '../../../../../../lib/react/components/forms/validation/functions/HasLength';
import IsMatch from '../../../../../../lib/react/components/forms/validation/functions/IsMatch';
import RegexCheck from '../../../../../../lib/react/components/forms/validation/functions/RegexCheck';
import { errorProps, pendingProps, successProps } from './lib';


const QueryUsernameUnique = gql`query CheckUnique($parameter:UserParameter!,$value:String!){checkUnique(parameter:$parameter,value:$value){ok}}`;

@withApollo
@autobind
class Form3 extends React.Component {
	state = {
		username: this.props.state.username,
		password: this.props.state.password,
		confirmPassword: this.props.state.confirmPassword,
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

	async validateUsername(value) {
		if (NotEmpty(value)) {
			if (HasLength(value, 5)) {
				const regex = /^[A-Za-z0-9-_]+$/;
				if (RegexCheck(value, regex)) { 
					// Check username with server
					return this.props.client.query({ 
						query: QueryUsernameUnique,
						variables: { parameter: 'username', value: value } 
					})
					.then((result) => {
						if (result.data) {
							if (result.data.checkUnique.ok) {
								return { ok: true, helperText: 'You can use this username.'};
							}
							else {
								return { ok: false, helperText: 'This username is already taken.' };
							}
						}
						else {
							return { ok: false, helperText: 'Could not verify the username with the server.' };
						}
					});
				}
				else {
					return { ok: false, helperText: 'Please only use letters, numbers, dashes or underscores.'};
				}
			}
			else {
				return { ok: false, helperText: 'Username must be at least 5 characters long.' };
			}
		}
		else {
			return { ok: false, helperText: 'A username is required.'}
		}
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

	validateConfirmPassword(value) {
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

	async _validateFormNext() {
		if (await this._validateForm()) {
			if (this.state.nextDisabled) this.setState({nextDisabled: false});
		}
		else {
			if (!this.state.nextDisabled) this.setState({nextDisabled: true});
		}
	}

	async _validateForm() {
		const validateUsername = await this.validateUsername(this.state.username);
		const validatePassword = this.validatePassword(this.state.password);
		const validateConfirmPassword = this.validateConfirmPassword(this.state.confirmPassword);

		if (validateUsername.ok && validatePassword.ok && validateConfirmPassword.ok) return true;
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

				<Validator validationFunction={this.validateUsername} errorProps={errorProps()} pendingProps={pendingProps()} showPending successProps={successProps()} showSuccess>
					<FormInput id='username' large value={this.state.username} onChange={this.onChange} label='Username'/>
				</Validator>

				<Validator validationFunction={this.validatePassword} errorProps={errorProps()}>
					<FormInput id='password' large type='password' value={this.state.password} onChange={this.onChange} label='Password'/>
				</Validator>

				<Validator validationFunction={this.validateConfirmPassword} errorProps={errorProps()}>
					<FormInput id='confirmPassword' large type='password' value={this.state.confirmPassword} onChange={this.onChange} label='Confirm password'/>
				</Validator>
				
				<Button onClick={this.props.next} className='pt-large' text='Next >' disabled={this.state.nextDisabled} intent={Intent.PRIMARY} style={{float:'right'}}/>
				<Button onClick={this.props.back} className='pt-large pt-minimal' text='< Back' intent={Intent.PRIMARY} style={{float:'left'}}/>
			</div>
		);
	}
}


export default Form3;
