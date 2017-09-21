import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { gql, graphql } from 'react-apollo';
import { Button, Intent, Spinner, EditableText } from '@blueprintjs/core';

import '../../scss/admin/_team-profile.scss';


const QueryTeam = gql`
query GetTeam($teamId: ID!){
	getTeam(teamId: $teamId){
		_id
		teamName
		members{
			username
			firstname
			lastname
		}
		memberCount
		points
	}
}`;

const QueryTeamOptions = {
	name: 'QueryTeam',
	options: (props) => ({
		variables: { teamId: props.team._id },
		fetchPolicy: 'cache-and-network'
	})
}

@graphql(QueryTeam, QueryTeamOptions)
@autobind
class TeamProfile extends React.Component {
	static propTypes = {
		team: PropTypes.shape({
			_id: PropTypes.string,
			teamName: PropTypes.string,
			memberCount: PropTypes.number,
			members: PropTypes.array,
			points: PropTypes.number
		}),
		closeProfile: PropTypes.func.isRequired,
		reload: PropTypes.func.isRequired
	}

	state = {
		points: null
	}

	closeProfile() {
		this.props.reload();
		this.props.closeProfile();
	}

	editPoints(value) {
		this.setState({points: value});
	}

	confirmPoints(value) {
		console.log("value", value);
	}

	render() {
		let content = null;
		let showLoadingIndicator = false;
		
		if (this.props.QueryTeam.loading) {
			showLoadingIndicator = true;
		}

		if (this.props.QueryTeam.getTeam) {
			let {
				teamName,
				memberCount,
				members,
				points
			} = this.props.QueryTeam.getTeam;

			if (this.state.points === null) {
				setTimeout(() => {
					this.setState({points});
				}, 0);
			}

			content = (
				<div>
					{members.length ? 
						members.map((member) => {
							return (
								<div className='member' key={member.username}>
									<div className='name'>
										{`${member.firstname} ${member.lastname}`}
									</div>
									<div className='actions'>
										<Button className='pt-minimal' iconName='remove'/>
									</div>
								</div>
							);
						})
						:
						<div>
							There are no users in this team.
						</div>
					}
				</div>
			);
		}

		return (
			<div id='team-profile' className='pt-card team-profile'>
				<Button className='pt-minimal' intent={Intent.DANGER} text='Close' onClick={this.closeProfile} style={{float:'right'}}/>
				{showLoadingIndicator ? 
					<div style={{float:'right'}}>
						<Spinner className='pt-small'/>
					</div>
				: null }
				<h4><b>{this.props.team.teamName}</b></h4>
				<div className='manage'>
					<div className='points'>
						<span>Points:&nbsp;</span>
						<EditableText selectAllOnFocus 
							className='points'
							value={this.state.points} 
							onChange={this.editPoints} 
							onConfirm={this.confirmPoints}/>
					</div>
					<div className='add'>
						<Button className='pt-minimal' iconName='new-person' text='Add users to this team' intent={Intent.PRIMARY}/>
					</div>
				</div>
				{content}
			</div>
		);
	}
}


export default TeamProfile;
