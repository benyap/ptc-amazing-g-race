import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Button, Intent, Dialog } from '@blueprintjs/core';
import { createChallenge } from '../../../../graphql/challenge';
import NotificationToaster from '../../../components/NotificationToaster';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';


@graphql(createChallenge('ok'), { name: 'MutationCreateChallenge' })
@autobind
class AddChallenge extends React.Component {
	static propTypes = {
		refetchChallenges: PropTypes.func.isRequired
	}

	state = {
		showCreateChallenge: false,
		createChallengeLoading: false,
		createChallengeError: null,

		// Fields
		challengeKey: '',
		order: '0'
	}

	toggleCreateChallenge() {
		this.setState((prevState) => {
			return { showCreateChallenge: !prevState.showCreateChallenge }
		});
	}

	editValue(valueName) {
		return (e) => {
			this.setState({ [valueName]: e.target.value });
		}
	}

	async submitCreateChallenge() {
		this.setState({ createChallengeLoading: true, createChallengeError: null });
		try {
			const id = parseInt(Date.now()/1000) % 100000;
			await this.props.MutationCreateChallenge({
				variables: {
					key: this.state.challengeKey,
					order: this.state.order,
					passphrase: `${id}`,
					title: `New Challenge #${id}`,
					description: `## Challenge ${id}`
				}
			});
			await this.props.refetchChallenges();
			this.setState({ createChallengeLoading: false, showCreateChallenge: false, challengeKey: '' });
		}
		catch (err) {
			if (this.state.showCreateChallenge) {
				this.setState({ createChallengeLoading: false, createChallengeError: err.toString() });
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
				<Button text='Create new challenge' iconName='flag' className='pt-fill pt-minimal' 
					intent={Intent.PRIMARY} onClick={this.toggleCreateChallenge}/>

				<Dialog isOpen={this.state.showCreateChallenge} title='Create a new challenge' iconName='flag' onClose={this.toggleCreateChallenge}>
					<div className='pt-dialog-body'>
						{this.state.createChallengeError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'0.5rem'}}>
								{this.state.createChallengeError}
							</div>
							:null}

						<div className='pt-callout pt-icon-info-sign' style={{marginBottom:'0.5rem'}}>
							<ul style={{margin:'0',padding:'0 0 0 1rem'}}>
								<li>
									The <b>challenge key</b> should be a unique identifier for this challenge, and cannot be changed once set. 
									Users will not see the challenge key (they see the challenge title, which can be set later).
								</li>
								<li>
									The challenge <b>order</b> determines the order in which the challenge appears on the screen.
								</li>
							</ul>
						</div>

						<b>Challenge key:</b> 
						<FormInput id='challenge-key' value={this.state.challengeKey} onChange={this.editValue('challengeKey')}
							helperText='Use the format <type>-<name>, where <type> is one of [challenge, station].'/>

						<b>Order:</b> 
						<FormInput id='challenge-order' value={this.state.order} onChange={this.editValue('order')}/>

					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button onClick={this.toggleCreateChallenge} text='Cancel' className='pt-minimal' disabled={this.state.createChallengeLoading}/>
							<Button onClick={this.submitCreateChallenge} text='Create' intent={Intent.PRIMARY} loading={this.state.createChallengeLoading}/>
						</div>
					</div>
				</Dialog>
			</div>	
		);
	}
}


export default AddChallenge;
