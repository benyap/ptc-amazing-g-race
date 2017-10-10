import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Spinner, Button, Dialog, Intent } from '@blueprintjs/core';
import { graphql } from 'react-apollo';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import { getChallenges } from '../../../../graphql/challenge';
import NotificationToaster from '../../../components/NotificationToaster';
import ChallengeCard from './ChallengeCard';


const QueryGetChallengesOptions = {
	name: 'QueryGetChallenges',
	options: { fetchPolicy: 'cache-and-network' }
};

@graphql(getChallenges('_id key order title locked public teams'), QueryGetChallengesOptions)
@autobind
class Challenges extends React.Component {
	state = {
		loading: false,
		showHelp: false,
		showUnlockChallenge: false,
		unlockChallengeValue: '',
		unlockChallengeLoading: false,
		unlockChallengeError: null
	}

	toggleHelp() {
		this.setState((prevState) => {
			return { showHelp: !prevState.showHelp };
		});
	}

	toggleUnlockChallengePassphrase() {
		this.setState((prevState) => {
			return { 
				showUnlockChallenge: !prevState.showUnlockChallenge, 
				unlockChallengeError: null, 
				unlockChallengeValue: '' 
			};
		});
	}

	submitPassphrase() {
		this.setState({unlockChallengeError: null, unlockChallengeLoading: true});
		// TODO: Make API call to unlock challenge

		this.setState({showUnlockChallenge: false, unlockChallengeLoading: false});
	}

	async refresh() {
		this.setState({loading: true});
		try {
			await this.props.QueryGetChallenges.refetch();
		}
		catch (err) {
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
		}
		this.setState({loading: false});
	}

	render() {
		return (
			<main id='challenges' className='dashboard'>
				<div className='content'>
					<h2>
						Challenges
						<Button className='helper-button pt-small pt-minimal pt-intent-warning' iconName='refresh' onClick={this.refresh} loading={this.state.loading} style={{padding:'0'}}/>
						<Button className='helper-button pt-small pt-minimal pt-intent-primary' iconName='help' onClick={this.toggleHelp}/>
					</h2>
					<div style={{margin:'1rem 0'}}>
						<Button className='pt-fill' intent={Intent.PRIMARY} text='Unlock a challenge' iconName='unlock' onClick={this.toggleUnlockChallengePassphrase}/>
					</div>
					{ this.state.showHelp ? 
						<div className='pt-callout pt-icon-help pt-intent-primary'>
							Keep track of the challenges you have access to and which ones you've completed. 
							As you progress through the race, you'll see new challenges you unlock show up here. 
						</div>
						: null
					}
					{ this.props.QueryGetChallenges.getChallenges ?
						this.props.QueryGetChallenges.getChallenges.map((challenge) => {
							return <ChallengeCard key={challenge.key} order={challenge.order} challenge={challenge}/>
						}).sort((a, b) => {
							if (a.props.order > b.props.order) return 1;
							else if (a.props.order < b.props.order) return -1;
							else return 0;
						})
						:
						<div style={{textAlign:'center',margin:'2rem'}}>
							<Spinner/>
						</div>
					}
				</div>

				{/* Unlock challenge dialog */}
				<Dialog title='Enter passphrase' isOpen={this.state.showUnlockChallenge} onClose={this.toggleUnlockChallengePassphrase}>
					<div className='pt-dialog-body'>
						{this.state.unlockChallengeError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error'>
								{this.state.unlockChallengeError}
							</div>
							:null}
						<FormInput id='passphrase' value={this.state.editValue} onChange={this.handleChange} large 
							intent={this.state.unlockChallengeError ? Intent.DANGER : Intent.NONE}/>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button onClick={this.toggleUnlockChallengePassphrase} text='Cancel' className='pt-minimal' disabled={this.state.unlockChallengeLoading}/>
							<Button onClick={this.submitPassphrase} text='Enter' intent={Intent.PRIMARY} loading={this.state.unlockChallengeLoading}/>
						</div>
					</div>
				</Dialog>
			</main>
		);
	}
}


export default Challenges;
