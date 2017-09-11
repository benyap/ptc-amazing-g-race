import React from 'react';
import { Tab2, Tabs2 } from '@blueprintjs/core';
import { autobind } from 'core-decorators';
import MediaQuery from 'react-responsive';
import bp from '../../../../../lib/react/components/utility/bp';
import SettingsView from '../SettingsView';
import UsersView from '../UsersView';


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
				<Tab2 id='state' title='Settings' panel={<SettingsView/>}/>
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
