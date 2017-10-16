import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { NonIdealState } from '@blueprintjs/core';
import { getTeams, addTeam } from '../../../../graphql/team';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ViewError from '../../components/ViewError';
import RefreshBar from '../../components/RefreshBar';
import TeamCard from './TeamCard';
import TeamProfile from './TeamProfile';
import TeamCreate from './TeamCreate';

import '../../scss/views/_teams-view.scss';


const QueryGetTeamsOptions = {
	name: 'QueryGetTeams',
	options: {
		variables: { skip: 0, limit: 0 }
	}
}

@graphql(getTeams('_id teamName points memberCount'), QueryGetTeamsOptions)
@autobind
class TeamsView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool.isRequired
	}

	state = {
		viewProfile: null,
		refetching: false
	}
	
	renderProfile(team) {
		this.setState({ viewProfile: team });
	}

	async closeProfile() {
		this.setState({ viewProfile: null, refetching: true });
		await this.props.QueryGetTeams.refetch();
		this.setState({ refetching: false });
	}

	render() {
		let content = null;
		const { loading, error, getTeams } = this.props.QueryGetTeams;

		if (error) {
			content = <ViewError error={error}/>;
		}
		else if (this.state.viewProfile) {
			content = <TeamProfile team={this.state.viewProfile} closeProfile={this.closeProfile} refetchTeams={this.props.QueryGetTeams.refetch}/>;
		}
		else if (getTeams) {
			if (getTeams.length) {
				content = (
					<div className='view-list'>
						{getTeams.map((team) => {
							return <TeamCard key={team._id} team={team} renderProfile={this.renderProfile}/>;
						})}
						<TeamCreate refetchTeams={this.props.QueryGetTeams.refetch}/>
					</div>
				);
			}
			else {
				content = (
					<div>
						<TeamCreate refetchTeams={this.props.QueryGetTeams.refetch}/>
						<div style={{margin:'3rem'}}>
							<NonIdealState title='No teams' description={`This is a team game so you better make some teams mate. Unless, no one has signed up yet...`} visual='people'/>
						</div>
					</div>
				);
			}
		}
		else if (loading) {
			content = <LoadingSpinner/>;
		}
		
		return (
			<div id='dashboard-teams' className='dashboard-tab'>
				<h4>Teams</h4>
				<RefreshBar query={this.props.QueryGetTeams} disabled={this.state.viewProfile} refetching={this.state.refetching} shouldRefresh={this.props.shouldRefresh}/>
				{content}
			</div>
		);
	}
}


export default TeamsView;
