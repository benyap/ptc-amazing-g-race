import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Button, Intent, Dialog } from '@blueprintjs/core';
import { addTeam } from '../../../../graphql/team';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';


@graphql(addTeam('ok'), { name: 'MutationCreateTeam' })
@autobind
class TeamCreate extends React.Component {
	static propTypes = {
		refetchTeams: PropTypes.func.isRequired
	}

	state = {
		showCreateTeamDialog: false,
		createTeamLoading: false,
		createTeamError: null,
		teamName: ''
	}

	toggleCreateTeamDialog() {
		this.setState((prevState) => {
			return { 
				showCreateTeamDialog: !prevState.showCreateTeamDialog,
				createTeamError: null,
				teamName: ''
			};
		});
	}

	editTeamName(e) {
		this.setState({ teamName: e.target.value });
	}

	async submitCreateTeam() {
		this.setState({ createTeamLoading: true, createTeamError: null });
		try {
			await this.props.MutationCreateTeam({ variables: { teamName: this.state.teamName.trim() } });
			await this.props.refetchTeams();
			this.setState({
				showCreateTeamDialog: false,
				createTeamLoading: false, 
				createTeamError: null,
				teamName: ''
			});
		}
		catch (e) {
			this.setState({
				createTeamLoading: false,
				createTeamError: e.toString()
			});
		}
	}

	render() {
		return (
			<div>
				<Button text='Create new team' iconName='people' className='pt-fill pt-minimal' intent={Intent.PRIMARY} onClick={this.toggleCreateTeamDialog}/>

				<Dialog isOpen={this.state.showCreateTeamDialog} iconName='people' title='Create a new team' onClose={this.toggleCreateTeamDialog}>
					<div className='pt-dialog-body'>
						{this.state.createTeamError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'0.5rem'}}>
								{this.state.createTeamError}
							</div>
							:null}
						<label className='pt-label'>
							<b>Team name:</b> 
							<FormInput id={'new-team'} value={this.state.teamName} onChange={this.editTeamName}
								intent={this.state.createTeamError?Intent.DANGER:Intent.NONE}/>
						</label>
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button onClick={this.toggleCreateTeamDialog} text='Cancel' className='pt-minimal' disabled={this.state.createTeamLoading}/>
							<Button onClick={this.submitCreateTeam} text='Create' intent={Intent.PRIMARY} loading={this.state.createTeamLoading}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}

export default TeamCreate;
