import React from 'react';
import autobind from 'core-decorators/es/autobind';
import { Tab2, Tabs2 } from '@blueprintjs/core';
import MediaQuery from 'react-responsive';
import { withRouter } from 'react-router-dom';
import bp from '../../../../../lib/react/components/utility/bp';
import UsersView from '../UsersView';
import TeamsView from '../TeamsView';
import GameStateView from '../GameStateView';
import ServerSettingsView from '../ServerSettingsView';
import InstructionArticlesView from '../InstructionArticlesView';
import S3ExplorerView from '../S3ExplorerView';
import ChallengesView from '../ChallengesView';

const views = [
	'users', 
	'teams', 
	'challenges', 
	'instructions', 
	's3UploadsExplorer', 
	'state', 
	'server'
];

@withRouter
@autobind
class AdminDashboard extends React.Component {
	state = {
		selectedTabId: 'users'
	}

	renderTabs(vertical) {
		return (
			<Tabs2 id='dashboard' className={vertical?'':'mobile-tabs'} onChange={this.handleTabChange} 
				selectedTabId={this.state.selectedTabId} vertical={vertical}>
				<Tab2 id='users' title='Users' panel={<UsersView shouldRefresh={this.state.selectedTabId==='users'}/>}/>
				<Tab2 id='teams' title='Teams' panel={<TeamsView shouldRefresh={this.state.selectedTabId==='teams'}/>}/>
				<Tab2 id='challenges' title='Challenges' panel={<ChallengesView shouldRefresh={this.state.selectedTabId==='challenges'}/>}/>
				<Tab2 id='s3UploadsExplorer' title='Uploads (S3)' panel={<S3ExplorerView shouldRefresh={this.state.selectedTabId==='s3UploadsExplorer'}/>}/>
				<Tab2 id='instructions' title='Instructions' panel={<InstructionArticlesView shouldRefresh={this.state.selectedTabId==='instructions'}/>}/>
				<Tab2 id='state' title='Game State' panel={<GameStateView shouldRefresh={this.state.selectedTabId==='state'}/>}/>
				<Tab2 id='server' title='Server' panel={<ServerSettingsView shouldRefresh={this.state.selectedTabId==='server'}/>}/>
			</Tabs2>
		);
	}

	render() {
		return (
			<div>
				<MediaQuery minWidth={bp.s+1}>
					{this.renderTabs(true)}
				</MediaQuery>
				<MediaQuery maxWidth={bp.s}>
					{this.renderTabs(false)}
				</MediaQuery>
			</div>
		);
	}
}


export default AdminDashboard;
