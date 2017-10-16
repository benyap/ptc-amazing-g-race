import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Button, Intent, Dialog } from '@blueprintjs/core';
import { removeUserTeam } from '../../../../graphql/user';
import NotificationToaster from '../../../components/NotificationToaster';


@graphql(removeUserTeam('ok'), {name: 'MutationRemoveUserTeam'})
@autobind
class TeamUser extends React.Component {
	static propTypes = {
		member: PropTypes.shape({
			username: PropTypes.string.isRequired,
			firstname: PropTypes.string.isRequired,
			lastname: PropTypes.string.isRequired
		}).isRequired,
		refetchTeam: PropTypes.func.isRequired
	}

	state = {
		removeUserDialogOpen: false,
		removeUserLoading: false,
		removeUserError: null
	}

	toggleRemoveUser() {
		this.setState((prevState) => {
			return { 
				removeUserDialogOpen: !prevState.removeUserDialogOpen, 
				removeUserError: null
			};
		});
	}

	async submitRemoveUser() {
		this.setState({removeUserLoading: true, removeUserError: null});

		try {
			await this.props.MutationRemoveUserTeam({ 
				variables: { username: this.props.member.username }
			});
			await this.props.refetchTeam();
			this.setState({removeUserLoading: false, removeUserDialogOpen: false});
		}
		catch (err) {
			if (this.state.removeUserDialogOpen) this.setState({ removeUserLoading: false, removeUserError: err.toString() });
			else {
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			}
		}
	}

	render() {
		const { username, firstname, lastname } = this.props.member;

		return (
			<div className='member'>
				<Button className='pt-minimal pt-small pt-intent-danger' iconName='remove' onClick={this.toggleRemoveUser} loading={this.state.removeUserLoading} style={{padding:'0'}}/>
				<span>&nbsp;{firstname} {lastname}</span>

				<Dialog isOpen={this.state.removeUserDialogOpen} onClose={this.toggleRemoveUser} title='Remove user from team' iconName='warning-sign'>
					<div className='pt-dialog-body'>
						{this.state.removeUserError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error'>
								{this.state.removeUserError}
							</div>
							:null}
						<p>
							Are you sure you want to remove {firstname} {lastname} from this team?
						</p>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button onClick={this.toggleRemoveUser} text='Cancel' className='pt-minimal' disabled={this.state.removeUserLoading}/>
							<Button onClick={this.submitRemoveUser} text='Remove user' intent={Intent.DANGER} loading={this.state.removeUserLoading}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default TeamUser;
