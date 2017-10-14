import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { compose, graphql } from 'react-apollo';
import { Button, Intent, Dialog } from '@blueprintjs/core';
import { getUsers, setUserTeam } from '../../../../graphql/user';
import NotificationToaster from '../../../components/NotificationToaster';


const QueryUsersOptions = {
	name: 'QueryUsers',
	options: { 
		variables: { skip: 0, limit: 0 },
		fetchPolicy: 'network-only'
	}
}

@compose(
	graphql(getUsers('firstname lastname username teamId'), QueryUsersOptions),
	graphql(setUserTeam('ok'), {name: 'MutationSetUserTeam'})
)
@autobind
class TeamAddUser extends React.Component {
	static propTypes = {
		teamId: PropTypes.string.isRequired,
		refetch: PropTypes.func.isRequired
	}

	state = {
		addUsersDialogOpen: false,
		addUserLoading: false,
		addUserError: null,
		userToAdd: null
	}

	toggleAddUsers() {
		this.setState((prevState) => {
			const state = { addUsersDialogOpen: !prevState.addUsersDialogOpen, addUserError: null };

			// Reset user to add if dialog is opened
			if (state.addUsersDialogOpen) state.userToAdd = 'NONE';
			else state.userToAdd = null;

			return state;
		});
	}

	async submitAddUser() {
		this.setState({ addUserLoading: true, addUserError: null });

		// Save points
		try {
			await this.props.MutationSetUserTeam({
				variables: { 
					teamId: this.props.teamId,
					username: this.state.userToAdd 
				}
			});
			await this.props.refetch();
			if (this.state.addUsersDialogOpen) this.setState({addUserLoading: false, addUsersDialogOpen: false});
			this.props.QueryUsers.refetch();
		}
		catch (err) {
			if (this.state.addUsersDialogOpen) this.setState({addUserLoading: false, addUserError: err.toString()});
			else {
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			}
		}
	}

	changeUserToAdd(e) {
		this.setState({ userToAdd: e.target.value });
	}

	render() {
		return (
			<span>
				<Button className='pt-minimal action-button' iconName='new-person' intent={Intent.PRIMARY} onClick={this.toggleAddUsers}/>

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
								<select onChange={this.changeUserToAdd} disabled={this.state.addUserLoading || this.props.QueryUsers.loading}>
									{this.props.QueryUsers.loading ? 
										<option value='NONE'>Loading users...</option>:
										<option value='NONE'>Select a user...</option>
									}
									{this.props.QueryUsers.loading ? null:
										this.props.QueryUsers.getUsers.map((user) => {
											// Only add users without a team
											if (!user.teamId) {
												return <option key={user.username} value={user.username}>{`${user.firstname} ${user.lastname}`}</option>
											}
										})
									}
								</select>
							</div>
						</label>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button onClick={this.toggleAddUsers} text='Cancel' className='pt-minimal' disabled={this.state.addUserLoading}/>
							<Button onClick={this.submitAddUser} text='Add' intent={Intent.PRIMARY} loading={this.state.addUserLoading} disabled={this.props.QueryUsers.loading}/>
						</div>
					</div>
				</Dialog>
			</span>
		);
	}
}


export default TeamAddUser;
