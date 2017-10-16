import React from 'react';
import PropTypes from 'prop-types';
import { NonIdealState } from '@blueprintjs/core';
import { connect } from 'react-redux';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ChallengeCard from './ChallengeCard';


const mapStateToProps = (state) => {
	return { challengeLoadWasSuccessful: state.state.challengeLoadWasSuccessful };
}

@connect(mapStateToProps)
class ChallengeList extends React.Component {
	static propTypes = {
		challengesQuery: PropTypes.shape({
			getChallenges: PropTypes.array,
			loading: PropTypes.bool.isRequired,
			error: PropTypes.object
		}).isRequired
	}

	render() {
		const { getChallenges, loading, error } = this.props.challengesQuery;

		let noChallengeTitle = 'No challenges'
		let noChallengeDescription = 'No challenges are currently available.';
		let noChallengeVisual = 'map';

		if (getChallenges && this.props.challengeLoadWasSuccessful) {
			if (getChallenges.length > 0) {
				return getChallenges.map((challenge) => {
					return <ChallengeCard key={challenge.key} order={challenge.order} challenge={challenge}/>;
				})
				.sort((a, b) => {
					if (a.props.order > b.props.order) return 1;
					else if (a.props.order < b.props.order) return -1;
					else return 0;
				});
			}
			// No challenges available: return default message
		}
		else if (loading) {
			return <LoadingSpinner/>;
		}
		else {
			if (error) {
				if (error.toString() === 'Error: GraphQL error: You are not in a team.') {
					noChallengeTitle = 'You are not in a team'
					noChallengeDescription = 'Once you are part of a team, you will be able to access the challenges available to your team.';
					noChallengeVisual = 'people';
				}
				else {
					noChallengeTitle = 'Unable to retrieve challenges'
					noChallengeDescription = error.toString();
					noChallengeVisual = 'error';
				}
			}
		}

		return (
			<div style={{margin:'3rem 0'}}>
				<NonIdealState title={noChallengeTitle} description={noChallengeDescription} visual={noChallengeVisual}/>
			</div>
		);
	}
}


export default ChallengeList;
