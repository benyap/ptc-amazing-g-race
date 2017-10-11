import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Spinner, Button, Intent, Dialog } from '@blueprintjs/core';
import { getAllChallenges, createChallenge } from '../../../../graphql/challenge';
import { saveState } from '../../../../actions/stateActions';
import RefreshBar from '../../components/RefreshBar';
import ViewError from '../../components/ViewError';
import ChallengeCard from './ChallengeCard';
import ChallengeProfile from './ChallengeProfile';
import NotificationToaster from '../../../components/NotificationToaster';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';

import '../../scss/views/_challenges-view.scss';


const QueryGetAllChallengesOptions = {
	name: 'QueryGetAllChallenges',
	options: { networkPolicy: 'cache-and-network' }
}

@compose(
	graphql(getAllChallenges('_id key order title public locked items{key}'), QueryGetAllChallengesOptions),
	graphql(createChallenge('ok'), { name: 'MutationCreateChallenge' })
)
@connect()
@autobind
class ChallengesView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool.isRequired
	}

	state = {
		viewProfile: null,
		refetching: false,
		showCreateChallenge: false,
		createChallengeLoading: false,
		createChallengeError: null,
		challengeKey: '',
		order: '0'
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	refetchChallenges() {
		if (!this.state.viewProfile) {
			if (this._mounted) this.setState({refetching: true});
			this.props.QueryGetAllChallenges.refetch()
			.then(() => {
				if (this._mounted) this.setState({refetching: false});
				this.props.dispatch(saveState());
			})
			.catch((err) => {
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			});
		}
	}

	renderProfile(challenge) {
		this.setState({ viewProfile: challenge });
	}

	closeProfile() {
		this.setState({ viewProfile: null }, () => {
			this.refetchChallenges();
		});
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
			await this.props.QueryGetAllChallenges.refetch();
			this.setState({ createChallengeLoading: false, showCreateChallenge: false, challengeKey: '' });
		}
		catch (err) {
			if (this._mounted) {
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
		let content = null;

		const { loading, error, getAllChallenges } = this.props.QueryGetAllChallenges;

		if (error) {
			content = <ViewError error={error}/>;
		}
		else if (this.state.viewProfile) {
			content = <ChallengeProfile challenge={this.state.viewProfile} closeProfile={this.closeProfile}/>;
		}
		else if (getAllChallenges) {
			content = (
				<div className='view-list'>
					{ getAllChallenges.map((challenge) => {
						return <ChallengeCard key={challenge.key} challenge={challenge} renderProfile={this.renderProfile}/>;
					})}
					<Button text='Create new challenge' iconName='add' className='pt-fill pt-minimal' 
						intent={Intent.PRIMARY} onClick={this.toggleCreateChallenge}/>
				</div>
			);
		}
		else if (loading) {
			content = <div className='loading-spinner'><Spinner/></div>;
		}

		return (
			<div id='dashboard-challenges' className='dashboard-tab'>
				<h4>Challenges</h4>
				<RefreshBar query={this.props.QueryGetAllChallenges} refetching={this.state.refetching} 
					disabled={this.state.viewProfile} shouldRefresh={this.props.shouldRefresh}/>
				{content}

				{/* Create Challenge dialog */}
				<Dialog isOpen={this.state.showCreateChallenge} title='Create a new challenge' onClose={this.toggleCreateChallenge}>
					<div className='pt-dialog-body'>
						{this.state.createChallengeError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'0.5rem'}}>
								{this.state.createChallengeError}
							</div>
							:null}
						<label className='pt-label'>
							<div className='pt-callout pt-icon-info-sign' style={{marginBottom:'0.5rem'}}>
								The <b>challenge key</b> should be a unique identifier for this challenge,
								and cannot be changed once set.
								The challenge <b>order</b> determines the order in which the challenge appears on the screen.
							</div>
							<div>
								<b>Challenge key:</b> 
								<FormInput id='challenge-key' value={this.state.challengeKey} onChange={this.editValue('challengeKey')}/>
								<b>Order:</b> 
								<FormInput id='challenge-order' value={this.state.order} onChange={this.editValue('order')}/>
							</div>
						</label>
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


export default ChallengesView;
