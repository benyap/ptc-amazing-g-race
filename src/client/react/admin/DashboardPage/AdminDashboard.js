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


@withRouter
@autobind
class AdminDashboard extends React.Component {
	state = {
		selectedTabId: 'users'
	}

	views = [
		'users', 'teams', 'instructions', 'state', 'server'
	];

	componentDidMount() {
		let path = 'users';
		if (this.props.location.state && this.props.location.state.origin) {
			const regex = /(view=)([a-zA-Z0-9]+)/;
			const result = regex.exec(this.props.location.state.origin.search);
	
			if (result && this.views.indexOf(result[2]) >= 0) {
				path = result[2];
			}
		}

		this.setState({selectedTabId: path}, () => {
			this.props.history.push(`/admin/dashboard?view=${this.state.selectedTabId}`);
		});
	}

	handleTabChange(selectedTabId) {
		this.setState({selectedTabId});
		this.props.history.push(`/admin/dashboard?view=${selectedTabId}`);
	}

	renderTabs(vertical) {
		return (
			<Tabs2 id='dashboard' className={vertical?'':'mobile-tabs'} onChange={this.handleTabChange} 
				selectedTabId={this.state.selectedTabId} vertical={vertical}>
				<Tab2 id='users' title='Users' panel={<UsersView visible={this.state.selectedTabId==='users'}/>}/>
				<Tab2 id='teams' title='Teams' panel={<TeamsView visible={this.state.selectedTabId==='teams'}/>}/>
				<Tab2 id='instructions' title='Instructions' panel={<InstructionArticlesView visible={this.state.selectedTabId==='instructions'}/>}/>
				<Tab2 id='state' title='Game State' panel={<GameStateView visible={this.state.selectedTabId==='state'}/>}/>
				<Tab2 id='server' title='Server' panel={<ServerSettingsView visible={this.state.selectedTabId==='server'}/>}/>
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
