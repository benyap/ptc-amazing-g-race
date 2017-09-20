import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { gql, graphql } from 'react-apollo';
import { Spinner } from '@blueprintjs/core';
import ViewError from '../ViewError';
import RefreshBar from '../RefreshBar';
import TeamCard from './TeamCard';


const QueryGetTeams = gql`
query GetTeams($skip:Int,$limit:Int) {
  getTeams(skip:$skip, limit:$limit) {
    _id
    teamName
    members{
      firstname
      lastname
		}
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
		loading: false
	}

	render() {
		let content = null;
		let { loading, error, getTeams } = this.props.QueryGetTeams;

		if (loading || this.state.loading) {
			content = (
				<div className='loading-spinner'>
					<Spinner/>
				</div>
			);
			this.loading = true;
		}
		else {
			if (error) {
				content = <ViewError error={error}/>
			}
			else {
				content = (
					<div className='view-list'>
						{getTeams.map((team) => {
							return (
								<TeamCard key={team._id} team={team}/>
							);
						})}
					</div>
				);
			}
		}

		return (
			<div id='dashboard-teams' className='dashboard-tab'>
				<h4>Teams</h4>
				<RefreshBar query={this.props.QueryGetTeams} visible={this.props.visible}/>
				{content}
			</div>
		);
	}
}


export default TeamsView;
