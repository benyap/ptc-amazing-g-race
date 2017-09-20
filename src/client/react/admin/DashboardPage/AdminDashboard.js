import React from 'react';
import { Tab2, Tabs2 } from '@blueprintjs/core';
import { autobind } from 'core-decorators';
import MediaQuery from 'react-responsive';
import bp from '../../../../../lib/react/components/utility/bp';
import UsersView from '../UsersView';
import TeamsView from '../TeamsView';
import GameStateView from '../GameStateView';
import ServerSettingsView from '../ServerSettingsView';


@autobind
class AdminDashboard extends React.Component {
	state = {
		selectedTabId: 'users'
	}

	handleTabChange(selectedTabId) {
		this.setState({selectedTabId});
	}

	renderTabs(vertical) {
		return (
			<Tabs2 id='dashboard' className={vertical?'':'mobile-tabs'} onChange={this.handleTabChange} 
				selectedTabId={this.state.selectedTabId} vertical={vertical}>
				<Tab2 id='users' title='Users' panel={<UsersView/>}/>
				<Tab2 id='teams' title='Teams' panel={<TeamsView/>}/>
				<Tab2 id='game' title='Game State' panel={<GameStateView/>}/>
				<Tab2 id='state' title='Server' panel={<ServerSettingsView/>}/>
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
