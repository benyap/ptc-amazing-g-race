import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Button, Intent, Dialog } from '@blueprintjs/core';
import { removeTeam } from '../../../../graphql/team';
import NotificationToaster from '../../../components/NotificationToaster';


@graphql(removeTeam('ok'), {name: 'MutationRemoveTeam'})
@autobind
class TeamRemove extends React.Component {
	static propTypes = {
		teamId: PropTypes.string.isRequired,
		refetchTeams: PropTypes.func.isRequired,
		closeProfile: PropTypes.func.isRequired
	}

	state = {
		showRemoveTeam: false,
		removeTeamLoading: false,
		removeTeamError: null
	}

	toggleRemoveTeam() {
		this.setState((prevState) => {
			return { showRemoveTeam: !prevState.showRemoveTeam, removeTeamError: null };
		});
	}
	
	async submitRemoveTeam() {
		this.setState({removeTeamLoading: true, removeTeamError: null});
		try {
			await this.props.MutationRemoveTeam({ variables: { teamId: this.props.teamId }});
			await this.props.refetchTeams();
			this.props.closeProfile();
		}
		catch (err) {
			this.setState({ removeTeamLoading: false, removeTeamError: err.toString() });
			if (!this.state.showRemoveTeam) {
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			}
		}
	}

	render() {
		return (
			<span>
				<Button className='pt-minimal' intent={Intent.DANGER} iconName='trash' onClick={this.toggleRemoveTeam}/>
				<Dialog isOpen={this.state.showRemoveTeam} onClose={this.toggleRemoveTeam} title='Remove team' iconName='warning-sign'>
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
			</span>
		);
	}
}

export default TeamRemove;
