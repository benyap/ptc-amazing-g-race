import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, Dialog, Intent } from '@blueprintjs/core';
import { graphql } from 'react-apollo';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import { unlockAttempt } from '../../../../graphql/challenge';


@graphql(unlockAttempt('ok failureMessage'), { name: 'MutationUnlockAttempt' })
@autobind
class ChallengeUnlock extends React.Component {
	static propTypes = {
		refetchChallenges: PropTypes.func.isRequired
	}

	state = {
		showUnlockChallenge: false,
		unlockChallengeValue: '',
		unlockChallengeLoading: false,
		unlockChallengeError: null,
		unlockChallengeSuccess: null
	}

	toggleUnlockChallengePassphrase() {
		this.setState((prevState) => {
			return { 
				showUnlockChallenge: !prevState.showUnlockChallenge, 
				unlockChallengeError: null, 
				unlockChallengeSuccess: false,
				unlockChallengeValue: '' 
			};
		});
	}

	editUnlockChallengeValue(e) {
		this.setState({unlockChallengeValue: e.target.value});
	}

	async submitPassphrase() {
		if (this.state.unlockChallengeValue.length < 1) {
			this.setState({unlockChallengeError: `No passphrase entered.`});
		}
		else {
			this.setState({unlockChallengeError: null, unlockChallengeLoading: true});
			try {
				const result = await this.props.MutationUnlockAttempt({
					variables: { phrase: this.state.unlockChallengeValue }
				});
				
				if (result.data.unlockAttempt.ok) {
					await this.props.refetchChallenges();
					this.setState({unlockChallengeLoading: false, unlockChallengeSuccess: true });
				}
				else {
					this.setState({unlockChallengeLoading: false, unlockChallengeError: result.data.unlockAttempt.failureMessage});
				}
			}
			catch (err) {
				this.setState({ unlockChallengeLoading: false, unlockChallengeError: err.toString() });
			}
		}
	}

	render() {
		return (
			<div>
				<Button className='pt-fill' intent={Intent.PRIMARY} text='Unlock a challenge' iconName='unlock' onClick={this.toggleUnlockChallengePassphrase}/>

				{/* Unlock challenge dialog */}
				<Dialog title='Enter passphrase' isOpen={this.state.showUnlockChallenge} onClose={this.toggleUnlockChallengePassphrase}>
					<div className='pt-dialog-body'>
						{/* Error message */}
						{this.state.unlockChallengeError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error'>
								{this.state.unlockChallengeError}
							</div>
							:null}
						
						{/* Success message */}
						{this.state.unlockChallengeSuccess ? 
							<div className='pt-callout pt-intent-success pt-icon-tick-circle'>
								<h5>You've unlocked a new challenge!</h5>
								Nice work. Your team is one step closer to victory.
							</div>
							:
							<FormInput id='passphrase' value={this.state.unlockChallengeValue} onChange={this.editUnlockChallengeValue} large 
							intent={this.state.unlockChallengeError ? Intent.DANGER : Intent.NONE}/>
						}
					</div>
					<div className='pt-dialog-footer'>
							{this.state.unlockChallengeSuccess?
								<div className='pt-dialog-footer-actions'>
									<Button onClick={this.toggleUnlockChallengePassphrase} text='Close' intent={Intent.PRIMARY}/>
								</div>
								:
								<div className='pt-dialog-footer-actions'>
									<Button onClick={this.toggleUnlockChallengePassphrase} text='Cancel' className='pt-minimal' disabled={this.state.unlockChallengeLoading}/>
									<Button onClick={this.submitPassphrase} text='Enter' intent={Intent.PRIMARY} loading={this.state.unlockChallengeLoading}/>
								</div>
							}
					</div>
				</Dialog>
			</div>
		);
	}
}


export default ChallengeUnlock;
