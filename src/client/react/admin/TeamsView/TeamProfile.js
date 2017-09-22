import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { compose, gql, graphql } from 'react-apollo';
import { Button, Intent, Spinner, EditableText } from '@blueprintjs/core';
import { saveState } from '../../../actions/stateActions';
import { connect } from 'react-redux';

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

const MutationSetTeamName = gql`
mutation SetTeamName($teamId:ID!, $name:String!) {
	setTeamName(teamId:$teamId, name:$name) {
		ok
		failureMessage
	}
}`;

const MutationSetTeamPoints = gql`
mutation SetTeamPoints($teamId:ID!, $points:Float!) {
	setTeamPoints(teamId:$teamId, points:$points) {
		ok
		failureMessage
	}
}`;

@compose(
	graphql(QueryTeam, QueryTeamOptions),
	graphql(MutationSetTeamName, {name: 'MutationSetTeamName'}),
	graphql(MutationSetTeamPoints, {name: 'MutationSetTeamPoints'})
)
@connect()
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
		teamName: null,
		points: null,
		saving: false,
		error: null
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}
	
	closeProfile() {
		this.props.reload();
		this.props.closeProfile();
	}

	editPoints(value) {
		this.setState({points: value});
	}

	editName(value) {
		this.setState({teamName: value});
	}

	confirmPoints(value) {
		if (value.length > 0) {
			const regex = /^[-0-9]+(\.|)[0-9]{0,2}$/;
			if (regex.exec(value)) {
				this.savePoints();
				return;
			}
		}
		this.setState({points: this.props.QueryTeam.getTeam.points});
	}

	confirmName(value) {
		if (value.length > 0) {
			this.saveName();
			return;
		}
		this.setState({points: this.props.QueryTeam.getTeam.teamName});
	}

	savePoints() {
		const variables = { 
			teamId: this.props.team._id,
			points: this.state.points 
		};

		// Save points
		this._save(this.props.MutationSetTeamPoints, 'setTeamPoints', variables);
	}

	saveName() {
		const variables = { 
			teamId: this.props.team._id,
			name: this.state.teamName 
		};

		// Save name
		this._save(this.props.MutationSetTeamName, 'setTeamName', variables);
	}

	_save(mutation, mutationName, variables) {
		this.setState({saving: true, error: null});
		
		// Execute mutation
		mutation({ variables })
			.then((result) => {
				if (result.data[mutationName].ok) {
					this.props.QueryTeam.refetch()
						.then(() => {
							console.log('dispatch')
							this.props.dispatch(saveState());
							if (this._mounted) this.setState({saving: false});
						});
				}
			})
			.catch((err) => {
				if (this._mounted) this.setState({saving: false, error: err.toString()});
				else console.warn(err);
			});
	}

	render() {
		let content = null;
		let showLoadingIndicator = false;
		
		if (this.saving || this.props.QueryTeam.loading) {
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

			if (this.state.teamName === null) {
				setTimeout(() => {
					this.setState({teamName});
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
							<br/>
							<em>There are no users in this team.</em>
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

				<h4><b>
					{
						this.state.teamName ? 
						<EditableText selectAllOnFocus 
							value={this.state.teamName} 
							onChange={this.editName} 
							onConfirm={this.confirmName}/> :
						this.props.team.teamName
					}
				</b></h4>

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
