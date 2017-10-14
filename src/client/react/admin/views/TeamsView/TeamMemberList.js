import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Intent, Spinner } from '@blueprintjs/core';
import { getTeam } from '../../../../graphql/team';
import TeamUser from './TeamUser';
import TeamAddUser from './TeamAddUser';


const QueryTeamOptions = {
	name: 'QueryTeam',
	options: (props) => ({
		variables: { teamId: props.teamId },
		fetchPolicy: 'cache-and-network'
	})
}

@graphql(getTeam('_id members{username firstname lastname}'), QueryTeamOptions)
@autobind
class TeamMemberList extends React.Component {
	static propTypes = {
		teamId: PropTypes.string.isRequired
	}

	render() {
		const { loading, error, getTeam } = this.props.QueryTeam;

		if (getTeam) {
			if (getTeam.members.length) {
				return (
					<div>
						<TeamAddUser teamId={this.props.teamId} refetchTeam={this.props.QueryTeam.refetch}/>
						{getTeam.members.map((member) => {
								return <TeamUser key={member.username} member={member} refetchTeam={this.props.QueryTeam.refetch}/>;
							})
							.sort((member1, member2) => {
								const { member: a } = member1.props;
								const { member: b } = member2.props;

								if (a.firstname > b.firstname) return 1;
								else if (a.firstname < b.firstname) return -1;
								else {
									if (a.lastname > b.lastname) return 1;
									else if (a.lastname < b.lastname) return -1;
									else return 0;
								}
							})}
					</div>
				);
			}
			else {
				return (
					<div>
						<br/>
						<em>There are no users in this team.</em>
					</div>
				);
			}
		}
		else if (loading) {
			return (
				<div style={{textAlign:'center',margin:'2rem'}}>
					<Spinner/>
				</div>
			);
		}
		else {
			return (
				<div className='pt-callout pt-intent-danger pt-icon-error'>
					<h5>Failed to retrieve team members.</h5>
					{error?error.toString():'A server error occurred.'}
				</div>
			);
		}
	}
}


export default TeamMemberList;
