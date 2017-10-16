import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, Intent } from '@blueprintjs/core';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { challengeLoadWasSuccessful } from '../../../../actions/stateActions';
import { getChallenges } from '../../../../graphql/challenge';
import NotificationToaster from '../../../components/NotificationToaster';
import ChallengeUnlock from './ChallengeUnlock';
import ChallengeList from './ChallengeList';


const QueryGetChallengesOptions = {
	name: 'QueryGetChallenges',
	options: { fetchPolicy: 'cache-and-network' }
};

@graphql(getChallenges('_id key order title locked public teams'), QueryGetChallengesOptions)
@connect()
@autobind
class Challenges extends React.Component {
	state = {
		showHelp: false
	}

	toggleHelp() {
		this.setState((prevState) => {
			return { showHelp: !prevState.showHelp };
		});
	}

	componentDidMount() {
		this.refresh();
	}

	async refresh() {
		try {
			await this.props.QueryGetChallenges.refetch();
			this.props.dispatch(challengeLoadWasSuccessful(true));
		}
		catch (err) {
			this.props.dispatch(challengeLoadWasSuccessful(false));
			if (err.toString() !== 'Error: GraphQL error: You are not in a team.') {
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			}
		}
	}

	render() {
		return (
			<main id='challenges' className='dashboard'>
				<div className='content'>
					<h2>
						Challenges
						<Button className='helper-button pt-small pt-minimal pt-intent-warning' iconName='refresh' onClick={this.refresh} loading={this.props.QueryGetChallenges.loading} style={{padding:'0'}}/>
						<Button className='helper-button pt-small pt-minimal pt-intent-primary' iconName='help' onClick={this.toggleHelp}/>
					</h2>
					<div style={{margin:'1rem 0'}}>
						<ChallengeUnlock refetchChallenges={this.props.QueryGetChallenges.refetch}/>
					</div>

					{ this.state.showHelp ? 
						<div className='pt-callout pt-icon-help pt-intent-primary'>
							Keep track of the challenges you have access to and which ones you've completed. 
							As you progress through the race, you'll see new challenges you unlock show up here. 
						</div>
						: null
					}

					<ChallengeList challengesQuery={this.props.QueryGetChallenges}/>
					
				</div>
			</main>
		);
	}
}


export default Challenges;
