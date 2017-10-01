import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Button, Intent, Spinner, EditableText, Dialog } from '@blueprintjs/core';
import { saveState } from '../../../actions/stateActions';
import { getTeam, setTeamName, setTeamPoints, removeTeam } from '../../../graphql/team';
import { getUsers, setUserTeam, removeUserTeam } from '../../../graphql/user';
import NotificationToaster from '../NotificationToaster';

import '../../scss/admin/_team-profile.scss';


const QueryTeamParams = '_id teamName members{username firstname lastname} memberCount points';

const QueryTeamOptions = {
	name: 'QueryTeam',
	options: (props) => ({
		variables: { teamId: props.team._id },
		fetchPolicy: 'cache-and-network'
	})
}

const QueryUsersOptions = {
	name: 'QueryUsers',
	options: { 
		variables: { skip: 0, limit: 0 },
		fetchPolicy: 'network-only'
	}
}

@compose(
	graphql(getTeam(QueryTeamParams), QueryTeamOptions),
	graphql(getUsers('firstname lastname username teamId'), QueryUsersOptions),
	graphql(setTeamName('ok failureMessage'), {name: 'MutationSetTeamName'}),
	graphql(setTeamPoints('ok failureMessage'), {name: 'MutationSetTeamPoints'}),
	graphql(removeTeam('ok'), {name: 'MutationRemoveTeam'}),
	graphql(setUserTeam('ok'), {name: 'MutationSetUserTeam'}),
	graphql(removeUserTeam('ok'), {name: 'MutationRemoveUserTeam'})
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

		addUsersDialogOpen: false,
		addUserLoading: false,
		addUserError: null,
		userToAdd: null,

		removeUserDialogOpen: false,
		removeUserLoading: false,
		removeUserError: null,
		userToRemove: null,

		removeTeamDialogOpen: false,
		removeTeamLoading: false,
		removeTeamError: null
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
		this.setState({saving: true});
		
		// Execute mutation
		mutation({ variables })
			.then(async (result) => {
				if (result.data[mutationName].ok) {
					await this.props.QueryTeam.refetch();
					this.props.dispatch(saveState());
					if (this._mounted) this.setState({saving: false});
				}
				else {
					if (this._mounted) this.setState({saving: false});
					NotificationToaster.show({
						intent: Intent.DANGER,
						message: result.data[mutationName].failureMessage
					});
				}
			})
			.catch((err) => {
				if (this._mounted) this.setState({saving: false});
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			});
	}

	toggleAddUsers() {
		this.setState((prevState) => {
			const state = { addUsersDialogOpen: !prevState.addUsersDialogOpen, addUserError: null };
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

	toggleRemoveUser(userToRemove) {
		return () => {
			this.setState((prevState) => {
				return { 
					removeUserDialogOpen: !prevState.removeUserDialogOpen, 
					removeUserError: null,
					userToRemove: userToRemove
				};
			});
		}
	}

	submitRemoveUser() {
		this.setState({removeUserLoading: true});
		this.props.MutationRemoveUserTeam({ variables: { username: this.state.userToRemove }})
		.then(async (result) => {
			await this.props.QueryUsers.refetch()
			await this.props.QueryTeam.refetch() 
			this.props.dispatch(saveState());
			if (this._mounted) this.setState({removeUserLoading: false, removeUserDialogOpen: false});
		})
		.catch((err) => {
			if (this._mounted) {
				this.setState({
					removeUserLoading: false,
					removeUserError: err.toString()
				});
			}
		});
	}

	toggleRemoveTeam() {
		this.setState((prevState) => {
			return { removeTeamDialogOpen: !prevState.removeTeamDialogOpen, removeTeamError: null };
		});
	}
	
	submitRemoveTeam() {
		this.setState({removeTeamLoading: true, removeTeamError: null});
		this.props.MutationRemoveTeam({ variables: { teamId: this.props.team._id }})
			.then(() => {
				this.props.closeProfile();
			})
			.catch((err) => {
				if (this._mounted) this.setState({ removeTeamLoading: false, removeTeamError: err.toString() });
			});
	}

	render() {
		let content = null;

		if (this.props.QueryTeam.getTeam) {
			const {
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
											onClick={this.toggleRemoveUser(member.username)}/>
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
				{this.props.QueryTeam.loading || this.state.saving ? 
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
					<div className='manage-item'>
						Team ID: {this.props.team._id}
					</div>
					<div className='manage-item'>
						<span>Points:&nbsp;</span>
						<EditableText selectAllOnFocus 
							value={this.state.points} 
							onChange={this.editPoints} 
							onConfirm={this.confirmPoints}/>
					</div>
				</div>

				{content}

				{/* Add user dialog */}
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
									this.props.QueryUsers.getUsers.map((user) => {
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

				{/* Remove user dialog */}
				<Dialog isOpen={this.state.removeUserDialogOpen} onClose={this.toggleRemoveUser()} title='Remove user from team' iconName='warning-sign'>
					<div className='pt-dialog-body'>
						{this.state.removeUserError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error'>
								{this.state.removeUserError}
							</div>
							:null}
						<p>
							Are you sure you want to remove <code>{this.state.userToRemove}</code> from this team?
						</p>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button onClick={this.toggleRemoveUser()} text='Cancel' className='pt-minimal' disabled={this.state.removeUserLoading}/>
							<Button onClick={this.submitRemoveUser} text='Remove team' intent={Intent.DANGER} loading={this.state.removeUserLoading}/>
						</div>
					</div>
				</Dialog>

				{/* Remove team dialog */}
				<Dialog isOpen={this.state.removeTeamDialogOpen} onClose={this.toggleRemoveTeam} title='Remove team' iconName='warning-sign'>
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
							<Button onClick={this.submitRemoveTeam} text='Remove team' intent={Intent.DANGER} loading={this.state.removeTeamLoading}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default TeamProfile;
