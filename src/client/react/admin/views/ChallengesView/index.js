import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import { Intent, NonIdealState } from '@blueprintjs/core';
import { getAllChallenges } from '../../../../graphql/challenge';
import { saveState } from '../../../../actions/stateActions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import RefreshBar from '../../components/RefreshBar';
import ViewError from '../../components/ViewError';
import ChallengeCard from './ChallengeCard';
import ChallengeProfile from './ChallengeProfile';
import AddChallenge from './AddChallenge';

import '../../scss/views/_challenges-view.scss';


const QueryGetAllChallengesOptions = {
	name: 'QueryGetAllChallenges',
	options: { networkPolicy: 'cache-and-network' }
}

@graphql(getAllChallenges('_id key order title public locked items{key}'), QueryGetAllChallengesOptions)
@connect()
@autobind
class ChallengesView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool.isRequired
	}

	state = {
		viewProfile: null,
		refetching: false
	}

	async refetchChallenges() {
		if (!this.state.viewProfile) {
			this.setState({refetching: true});
			try {
				await this.props.QueryGetAllChallenges.refetch();
				this.setState({refetching: false});
				this.props.dispatch(saveState());
			}
			catch (err) {
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			}
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

	render() {
		let content = null;

		const { loading, error, getAllChallenges } = this.props.QueryGetAllChallenges;

		if (error) {
			content = <ViewError error={error}/>;
		}
		else if (this.state.viewProfile) {
			content = <ChallengeProfile challenge={this.state.viewProfile} closeProfile={this.closeProfile} refetchChallenges={this.props.QueryGetAllChallenges.refetch}/>;
		}
		else if (getAllChallenges) {
			if (getAllChallenges.length) {
				content = (
					<div className='view-list'>
						{ getAllChallenges.map((challenge) => {
							return <ChallengeCard key={challenge.key} challenge={challenge} renderProfile={this.renderProfile}/>;
						})}
						<AddChallenge refetchChallenges={this.props.QueryGetAllChallenges.refetch}/>
					</div>
				);
			}
			else {
				content = (
					<div>
						<AddChallenge refetchChallenges={this.props.QueryGetAllChallenges.refetch}/>
						<div style={{margin:'3rem'}}>
							<NonIdealState title='No challenges' description={`This is going to be a rather boring race if you don't add some challenges!`} visual='flag'/>
						</div>
					</div>
				);
			}
		}
		else if (loading) {
			content = <LoadingSpinner/>;
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
