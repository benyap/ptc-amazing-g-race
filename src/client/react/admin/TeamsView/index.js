import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { compose, graphql } from 'react-apollo';
import { Spinner, Button, Intent, Dialog } from '@blueprintjs/core';
import { getTeams, addTeam } from '../../../graphql/team';
import FormInput from '../../../../../lib/react/components/forms/FormInput';
import ViewError from '../ViewError';
import RefreshBar from '../RefreshBar';
import TeamCard from './TeamCard';
import TeamProfile from './TeamProfile';


const QueryGetTeamsOptions = {
	name: 'QueryGetTeams',
	options: {
		variables: { skip: 0, limit: 0 }
	}
}

@compose(
	graphql(getTeams('_id teamName points memberCount'), QueryGetTeamsOptions),
	graphql(addTeam('ok'), { name: 'MutationCreateTeam' })
)
@autobind
class TeamsView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool.isRequired
	}

	state = {
		viewProfile: null,
		refetching: false,
		showCreateTeamDialog: false,
		createTeamLoading: false,
		createTeamError: null,
		teamName: ''
	}

	renderProfile(team) {
		this.setState({ viewProfile: team });
	}

	async closeProfile() {
		this.setState({ viewProfile: null, refetching: true });
		await this.props.QueryGetTeams.refetch();
		this.setState({ refetching: false });
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
		this.setState({ createTeamLoading: true });
		try {
			await this.props.MutationCreateTeam({ variables: { teamName: this.state.teamName.trim() } });
			await this.props.QueryGetTeams.refetch();
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
		let content = null;
		const { loading, error, getTeams } = this.props.QueryGetTeams;

		if (loading) {
			content = (
				<div className='loading-spinner'>
					<Spinner/>
				</div>
			);
		}
		else {
			if (error) {
				content = <ViewError error={error}/>
			}
			else {
				if (this.state.viewProfile) {
					content = (
						<TeamProfile team={this.state.viewProfile} closeProfile={this.closeProfile} reload={this.props.QueryGetTeams.refetch}/>
					);
				}
				else {
					content = (
						<div className='view-list'>
							{getTeams.map((team) => {
								return (
									<TeamCard key={team._id} team={team} renderProfile={this.renderProfile}/>
								);
							})}
							<Button text='Create new team' iconName='add' className='pt-fill pt-minimal' intent={Intent.PRIMARY} onClick={this.toggleCreateTeamDialog}/>

							{/* Create new team dialog */}
							<Dialog isOpen={this.state.showCreateTeamDialog} iconName='add' title='Create a new team' onClose={this.toggleCreateTeamDialog}>
								<div className='pt-dialog-body'>
									{this.state.createTeamError ? 
										<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'0.5rem'}}>
											{this.state.createTeamError}
										</div>
										:null}
									<label className='pt-label'>
										<b>Team name:</b> 
										<FormInput id={'new-team'} value={this.state.teamName} onChange={this.editTeamName}/>
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
		}

		return (
			<div id='dashboard-teams' className='dashboard-tab'>
				<h4>Teams</h4>
				<RefreshBar query={this.props.QueryGetTeams} disabled={this.state.viewProfile} refetching={this.state.refetching} shouldRefresh={this.props.shouldRefresh}/>
				{content}
			</div>
		);
	}
}


export default TeamsView;
