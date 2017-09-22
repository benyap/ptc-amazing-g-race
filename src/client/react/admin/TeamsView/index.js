import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { gql, graphql } from 'react-apollo';
import { Spinner } from '@blueprintjs/core';
import ViewError from '../ViewError';
import RefreshBar from '../RefreshBar';
import TeamCard from './TeamCard';
import TeamProfile from './TeamProfile';


const QueryGetTeams = gql`
query GetTeams($skip:Int,$limit:Int) {
	getTeams(skip:$skip, limit:$limit) {
		_id
		teamName
		points
		memberCount
	}
}`;

const QueryGetTeamsOptions = {
	name: 'QueryGetTeams',
	options: {
		variables: {
			skip: 0,
			limit: 0
		}
	}
}

@graphql(QueryGetTeams, QueryGetTeamsOptions)
@autobind
class TeamsView extends React.Component {
	static propTypes = {
		visible: PropTypes.bool
	}

	state = {
		viewProfile: null
	}

	renderProfile(team) {
		this.setState({ viewProfile: team });
	}

	closeProfile() {
		this.setState({ viewProfile: null }, () => {
			this.props.QueryGetTeams.refetch();
		});
	}

	render() {
		let content = null;
		let { loading, error, getTeams } = this.props.QueryGetTeams;

		if (loading) {
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
			else {
				if (this.state.viewProfile) {
					content = (
						<TeamProfile team={this.state.viewProfile} closeProfile={this.closeProfile} reload={this.props.QueryGetTeams.refetch}/>
					);
				}
				else {
					content = (
						<div className='view-list'>
							{getTeams.map((team) => {
								return (
									<TeamCard key={team._id} team={team} renderProfile={this.renderProfile}/>
								);
							})}
						</div>
					);
				}
			}
		}

		return (
			<div id='dashboard-teams' className='dashboard-tab'>
				<h4>Teams</h4>
				<RefreshBar query={this.props.QueryGetTeams} visible={this.props.visible} disabled={this.state.viewProfile}/>
				{content}
			</div>
		);
	}
}


export default TeamsView;
