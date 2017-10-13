import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Button, Dialog, Intent } from '@blueprintjs/core';
import { resetPassword } from '../../../../graphql/auth';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import NotificationToaster from '../../../components/NotificationToaster';


@graphql(resetPassword('ok'), {name: 'MutationResetPassword'})
@autobind
class UserPasswordReset extends React.Component {
	static propTypes = {
		username: PropTypes.string.isRequired
	}

	state = {
		showResetPassword: false,
		resetPasswordText: '',
		resetPasswordConfirmText: '',
		resetPasswordLoading: false,
		resetPasswordError: null
	}

	toggleResetPassword() {
		this.setState((prevState) => {
			return {
				showResetPassword: !prevState.showResetPassword,
				resetPasswordError: null,
				resetPasswordText: '',
				resetPasswordConfirmText: ''
			}
		});
	}

	resetPasswordChange({ target: { value }}) {
		this.setState({resetPasswordText: value});
	}

	resetPasswordConfirmChange({ target: { value }}) {
		this.setState({resetPasswordConfirmText: value});
	}
	
	async submitResetPassword() {
		this.setState({resetPasswordLoading: true, resetPasswordError: null});
		try {
			await this.props.MutationResetPassword({
				variables: {
					username: this.props.username,
					newPassword: this.state.resetPasswordText,
					confirmPassword: this.state.resetPasswordConfirmText
				}
			});
			this.setState({resetPasswordLoading: false, showResetPassword: false});
			NotificationToaster.show({
				intent: Intent.SUCCESS,
				message: `${this.props.username}'s password has been reset.`
			});
		}
		catch (err) {
			if (this.state.showResetPassword) {
				this.setState({
					resetPasswordLoading: false, 
					resetPasswordError: err.toString()
				});
			}
			else {
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			}
		}
	}

	render() {
		return (
			<div>
				<Button onClick={this.toggleResetPassword} text='Reset password' className='pt-button pt-small'/>

				<Dialog title='Reset user password' isOpen={this.state.showResetPassword} onClose={this.toggleResetPassword}>
					<div className='pt-dialog-body'>
						{this.state.resetPasswordError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'1rem'}}>
								{this.state.resetPasswordError}
							</div>
							:null}

						<FormInput id='newpassword' value={this.state.resetPasswordText} 
							onChange={this.resetPasswordChange} type='password'
							label='New password:' disabled={this.state.resetPasswordLoading}
							intent={this.state.resetPasswordError?Intent.DANGER:Intent.NONE}/>
						
						<FormInput id='newpassword' value={this.state.resetPasswordConfirmText} 
							onChange={this.resetPasswordConfirmChange} type='password'
							label='Confirm password:' disabled={this.state.resetPasswordLoading}
							intent={this.state.resetPasswordError?Intent.DANGER:Intent.NONE}/>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button className='pt-minimal' onClick={this.toggleResetPassword} disabled={this.state.resetPasswordLoading}>Cancel</Button>
							<Button className='pt-intent-danger' onClick={this.submitResetPassword} loading={this.state.resetPasswordLoading}>Reset</Button>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default UserPasswordReset;
