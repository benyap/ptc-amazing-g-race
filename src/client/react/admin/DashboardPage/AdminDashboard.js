import React from 'react';
import autobind from 'core-decorators/es/autobind';
import { Tab2, Tabs2, Intent } from '@blueprintjs/core';
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
import NotificationToaster from '../NotificationToaster';


const VIEWS = [
	'users', 
	'teams', 
	'challenges', 
	'instructions', 
	'uploads', 
	'state', 
	'server'
];

@withRouter
@autobind
class AdminDashboard extends React.Component {
	state = {
		selectedTabId: 'users'
	}

	componentWillMount() {
		const { params } = this.props.match;
		if (params) {
			// Ensure view exists
			let viewExists = false;
			VIEWS.forEach((view) => {
				if (!viewExists) {
					if (view === params.view) viewExists = true;
				}
			})

			if (viewExists) {
				this.props.history.push(`/admin/dashboard/${params.view}`);
				this.setState({selectedTabId: params.view});
			}
			else {
				this.props.history.push(`/admin/dashboard/users`);
				this.setState({selectedTabId: 'users'});
				NotificationToaster.show({
					intent: Intent.WARNING,
					message: `The view '${params.view}' does not exist. You have been redirected to the 'users' view.`
				});
			}
		}
	}

	handleTabChange(newTabId) {
		this.props.history.push(`/admin/dashboard/${newTabId}`);
		this.setState({selectedTabId: newTabId});
	}

	renderTabs(vertical) {
		return (
			<Tabs2 id='dashboard' className={vertical?'':'mobile-tabs'} onChange={this.handleTabChange} 
				selectedTabId={this.state.selectedTabId} vertical={vertical}>
				<Tab2 id={VIEWS[0]} title='Users' panel={<UsersView shouldRefresh={this.state.selectedTabId===VIEWS[0]}/>}/>
				<Tab2 id={VIEWS[1]} title='Teams' panel={<TeamsView shouldRefresh={this.state.selectedTabId===VIEWS[1]}/>}/>
				<Tab2 id={VIEWS[2]} title='Challenges' panel={<ChallengesView shouldRefresh={this.state.selectedTabId===VIEWS[2]}/>}/>
				<Tab2 id={VIEWS[3]} title='Uploads (S3)' panel={<S3ExplorerView shouldRefresh={this.state.selectedTabId===VIEWS[3]}/>}/>
				<Tab2 id={VIEWS[4]} title='Instructions' panel={<InstructionArticlesView shouldRefresh={this.state.selectedTabId===VIEWS[4]}/>}/>
				<Tab2 id={VIEWS[5]} title='Game State' panel={<GameStateView shouldRefresh={this.state.selectedTabId===VIEWS[5]}/>}/>
				<Tab2 id={VIEWS[6]} title='Server' panel={<ServerSettingsView shouldRefresh={this.state.selectedTabId===VIEWS[6]}/>}/>
			</Tabs2>
		);
	}

	render() {
		return (
			<main id='admin-dashboard'>
				<h2 style={{margin: '1rem 0.6rem'}}>Administrator Dashboard</h2>
				<MediaQuery minWidth={bp.s+1}>
					{this.renderTabs(true)}
				</MediaQuery>
				<MediaQuery maxWidth={bp.s}>
					{this.renderTabs(false)}
				</MediaQuery>
			</main>
		);
	}
}


export default AdminDashboard;
