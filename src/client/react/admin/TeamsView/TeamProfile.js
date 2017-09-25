import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { compose, gql, graphql } from 'react-apollo';
import { Button, Intent, Spinner, EditableText, Dialog } from '@blueprintjs/core';
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

const QueryUsers = gql`
query ListAll($limit:Int, $skip:Int){
	listAll(limit:$limit, skip:$skip) {
		firstname
		lastname
		username
		teamId
	}
}`;

const QueryUsersOptions = {
	name: 'QueryUsers',
	options: { 
		variables: { skip: 0, limit: 0 },
		fetchPolicy: 'network-only'
	}
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

const MutationSetUserTeam = gql`
mutation SetUserTeam($username:String!,$teamId:ID!){
	setUserTeam(username:$username,teamId:$teamId){
		ok
	}
}`;

const MutationRemoveUserTeam = gql`
mutation RemoveUserTeam($username:String!){
  removeUserTeam(username:$username){
		ok
	}
}`;

const MutationRemoveTeam = gql`
mutation RemoveTeam($teamId:ID!){
	removeTeam(teamId:$teamId){
		ok
	}
}`;

@compose(
	graphql(QueryTeam, QueryTeamOptions),
	graphql(QueryUsers, QueryUsersOptions),
	graphql(MutationSetTeamName, {name: 'MutationSetTeamName'}),
	graphql(MutationSetTeamPoints, {name: 'MutationSetTeamPoints'}),
	graphql(MutationSetUserTeam, {name: 'MutationSetUserTeam'}),
	graphql(MutationRemoveUserTeam, {name: 'MutationRemoveUserTeam'}),
	graphql(MutationRemoveTeam, {name: 'MutationRemoveTeam'})
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
		error: null,
		addUsersDialogOpen: false,
		addUserLoading: false,
		userToAdd: null,
		addUserError: null,
		removeTeamDialogOpen: false,
		removeTeamError: null,
		removeTeamLoading: false
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
			.then(async (result) => {
				if (result.data[mutationName].ok) {
					await this.props.QueryTeam.refetch();
					this.props.dispatch(saveState());
					if (this._mounted) this.setState({saving: false});
				}
			})
			.catch((err) => {
				if (this._mounted) this.setState({saving: false, error: err.toString()});
				else console.warn(err);
			});
	}

	toggleAddUsers() {
		this.setState((prevState) => {
			let state = { addUsersDialogOpen: !prevState.addUsersDialogOpen, addUserError: null };
			if (state.addUsersDialogOpen) state.userToAdd = 'NONE';
			else state.userToAdd = null;
			return state;
		});
	}

	submitAddUser() {
		this.setState({ addUserLoading: true });

		const variables = { 
			teamId: this.props.team._id,
			username: this.state.userToAdd 
		};

		// Save points
		this.props.MutationSetUserTeam({ variables })
			.then(async (result) => {
				await this.props.QueryUsers.refetch();
				await this.props.QueryTeam.refetch()
				this.props.dispatch(saveState());
				if (this._mounted) this.setState({addUserLoading: false, addUsersDialogOpen: false, addUserError: null});
			})
			.catch((err) => {
				if (this._mounted) this.setState({addUserLoading: false, addUserError: err.toString()});
				else console.warn(err);
			});
	}

	changeUserToAdd({ target: { value } }) {
		this.setState({ userToAdd: value });
	}

	removeUser(username) {
		return () => {
			this.setState({['remove-'+username]: true});
			this.props.MutationRemoveUserTeam({ variables: { username }})
				.then(async (result) => {
					await this.props.QueryUsers.refetch()
					await this.props.QueryTeam.refetch() 
					this.props.dispatch(saveState());
					if (this._mounted) this.setState({['remove-'+username]: false});
				})
				.catch((err) => {
					if (this._mounted) this.setState({['remove-'+username]: false});
					console.warn(err);
				});
		}
	}

	toggleRemoveTeam() {
		this.setState((prevState) => {
			return { removeTeamDialogOpen: !prevState.removeTeamDialogOpen, removTeamError: null };
		});
	}
	
	removeTeam() {
		this.setState({removeTeamLoading: true, removeTeamError: null});
		this.props.MutationRemoveTeam({ variables: { teamId: this.props.team._id }})
			.then(() => {
				this.props.closeProfile();
			})
			.catch((err) => {
				if (this._mounted) this.setState({ removeTeamLoading: false, removeTeamError: err.toString() });
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
										<Button className='pt-minimal' iconName='remove' 
											onClick={this.removeUser(member.username)}
											loading={this.state['remove-'+member.username]}/>
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
					<Button className='pt-minimal action-button' iconName='new-person' intent={Intent.PRIMARY} onClick={this.toggleAddUsers}/>
					<Button className='pt-minimal action-button' iconName='remove' intent={Intent.DANGER} onClick={this.toggleRemoveTeam}/>
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
					<Dialog isOpen={this.state.addUsersDialogOpen} onClose={this.toggleAddUsers} title='Add user' iconName='new-person'>
						<div className='pt-dialog-body'>
							{this.state.addUserError ? 
								<div className='pt-callout pt-intent-danger pt-icon-error'>
									{this.state.addUserError}
								</div>
								:null}
							<label className='pt-label'>
								Add user: 
								<div className='pt-select'>
									<select onChange={this.changeUserToAdd} disabled={this.state.addUserLoading}>
										{this.props.QueryUsers.loading ? 
											<option value='NONE'>Loading...</option>:
											<option value='NONE'>Select a user...</option>
										}
										{this.props.QueryUsers.loading ? 
										null:
										this.props.QueryUsers.listAll.map((user) => {
											if (!user.teamId) {	// Only add users without a team
												return <option key={user.username} value={user.username}>{`${user.firstname} ${user.lastname}`}</option>
											}
										})}
									</select>
								</div>
							</label>
						</div>
						<div className='pt-dialog-footer'>
							<div className='pt-dialog-footer-actions'>
								<Button onClick={this.toggleAddUsers} text='Cancel' className='pt-minimal' disabled={this.state.addUserLoading}/>
								<Button onClick={this.submitAddUser} text='Add' intent={Intent.PRIMARY} loading={this.state.addUserLoading}/>
							</div>
						</div>
					</Dialog>
					<Dialog isOpen={this.state.removeTeamDialogOpen} onClose={this.toggleRemoveTeam} title='Remove team' iconName='warning'>
						<div className='pt-dialog-body'>
							{this.state.removeTeamError ? 
								<div className='pt-callout pt-intent-danger pt-icon-error'>
									{this.state.removeTeamError}
								</div>
								:null}
							<p>
								Are you sure you want to remove this team?
							</p>
						</div>
						<div className='pt-dialog-footer'>
							<div className='pt-dialog-footer-actions'>
								<Button onClick={this.toggleRemoveTeam} text='Cancel' className='pt-minimal' disabled={this.state.removeTeamLoading}/>
								<Button onClick={this.removeTeam} text='Remove team' intent={Intent.PRIMARY} loading={this.state.removeTeamLoading}/>
							</div>
						</div>
					</Dialog>
				</div>
				{content}
			</div>
		);
	}
}


export default TeamProfile;
