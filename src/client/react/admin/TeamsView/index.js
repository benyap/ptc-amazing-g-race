import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { compose, gql, graphql } from 'react-apollo';
import { Spinner, Button, Intent, Dialog } from '@blueprintjs/core';
import FormInput from '../../../../../lib/react/components/forms/FormInput';
import ViewError from '../ViewError';
import RefreshBar from '../RefreshBar';
import TeamCard from './TeamCard';
import TeamProfile from './TeamProfile';


const QueryGetTeams = gql`
query GetTeams($skip:Int,$limit:Int) {
	getTeams(skip:$skip, limit:$limit) {
		_id
		teamName
		points
		memberCount
	}
}`;

const QueryGetTeamsOptions = {
	name: 'QueryGetTeams',
	options: {
		variables: {
			skip: 0,
			limit: 0
		}
	}
}

const MutationCreateTeam = gql`
mutation AddTeam($teamName:String!){
	addTeam(teamName:$teamName){
		ok
	}
}`;

@compose(
	graphql(QueryGetTeams, QueryGetTeamsOptions),
	graphql(MutationCreateTeam, { name: 'MutationCreateTeam' })
)
@autobind
class TeamsView extends React.Component {
	static propTypes = {
		visible: PropTypes.bool
	}

	state = {
		viewProfile: null,
		showCreateTeamDialog: false,
		createTeamLoading: false,
		createTeamError: null,
		teamName: ''
	}

	renderProfile(team) {
		this.setState({ viewProfile: team });
	}

	closeProfile() {
		this.setState({ viewProfile: null }, () => {
			this.props.QueryGetTeams.refetch();
		});
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
			let result = await this.props.MutationCreateTeam({ variables: { teamName: this.state.teamName.trim() } });
			this.setState({createTeamLoading: false, createTeamError: null});
			this.toggleCreateTeamDialog();
			this.props.QueryGetTeams.refetch();
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
		let { loading, error, getTeams } = this.props.QueryGetTeams;

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
							<Dialog isOpen={this.state.showCreateTeamDialog} iconName='add' title='Create a new team' onClose={this.toggleCreateTeamDialog}>
								<div style={{padding: '1rem'}}>
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
				<RefreshBar query={this.props.QueryGetTeams} visible={this.props.visible} disabled={this.state.viewProfile}/>
				{content}
			</div>
		);
	}
}


export default TeamsView;
