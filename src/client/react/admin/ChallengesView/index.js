import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Spinner, Button, Intent } from '@blueprintjs/core';
import { getAllChallenges, createChallenge } from '../../../graphql/challenge';
import { saveState } from '../../../actions/stateActions';
import RefreshBar from '../RefreshBar';
import ViewError from '../ViewError';
import ChallengeCard from './ChallengeCard';
import ChallengeProfile from './ChallengeProfile';
import NotificationToaster from '../NotificationToaster';

import '../../scss/admin/_challenge-view.scss';


const QueryGetAllChallengesOptions = {
	name: 'QueryGetAllChallenges',
	options: { networkPolicy: 'cache-and-network' }
}

@compose(
	graphql(getAllChallenges('key group title public locked'), QueryGetAllChallengesOptions),
	graphql(createChallenge('ok'), { name: 'MutationCreateChallenge' })
)
@connect()
@autobind
class ChallengesView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool.isRequired
	}

	state = {
		loading: false,
		viewProfile: null,
		refetching: false,
		createChallengeLoading: false
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	refetchChallenges() {
		if (!this.state.viewProfile) {
			if (this.mounted) this.setState({refetching: true});
			this.props.QueryGetAllChallenges.refetch()
			.then(() => {
				if (this.mounted) this.setState({refetching: false});
				this.props.dispatch(saveState());
			})
			.catch((err) => {
				if (this.mounted) this.setState({loading: false});
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

	async submitCreateChallenge() {
		this.setState({ createChallengeLoading: true });
		try {
			const id = parseInt(Date.now()/1000) % 100000;
			await this.props.MutationCreateChallenge({
				variables: {
					key: `challenge_${id}`,
					group: `new`,
					type: `none`,
					passphrase: `${id}`,
					title: `NEW challenge ${id}`,
					description: `## Challenge ${id}`
				}
			});
			await this.props.QueryGetAllChallenges.refetch();
			this.setState({ createChallengeLoading: false });
		}
		catch (err) {
			this.setState({ createChallengeLoading: false });
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
		}
	}

	render() {
		let content = null;

		const { loading, error, getAllChallenges } = this.props.QueryGetAllChallenges;

		if (loading || this.state.loading) {
			content = (
				<div className='loading-spinner'>
					<Spinner/>
				</div>
			);
		}
		else {
			if (error) {
				content = <ViewError error={error}/>
			}
			else if (this.state.viewProfile) {
				content = (
					<ChallengeProfile challenge={this.state.viewProfile} closeProfile={this.closeProfile}/>
				);
			}
			else {
				content = (
					<div className='view-list'>
						{ this.props.QueryGetAllChallenges.getAllChallenges.map((challenge) => {
							return (
								<ChallengeCard key={challenge.key} challenge={challenge} renderProfile={this.renderProfile}/>
							);
						})}
						<Button text='Create new challenge' iconName='add' className='pt-fill pt-minimal' 
							intent={Intent.PRIMARY} onClick={this.submitCreateChallenge} loading={this.state.createChallengeLoading}/>
					</div>
				);
			}
		}

		return (
			<div id='dashboard-challenges' className='dashboard-tab'>
				<h4>Challenges</h4>
				<RefreshBar query={this.props.QueryGetAllChallenges} refetching={this.state.refetching} 
					disabled={this.state.viewProfile} shouldRefresh={this.props.shouldRefresh}/>
				{content}
			</div>
		);
	}
}


export default ChallengesView;
