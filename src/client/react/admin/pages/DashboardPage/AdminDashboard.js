import React from 'react';
import autobind from 'core-decorators/es/autobind';
import MediaQuery from 'react-responsive';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { Tab2, Tabs2, Intent } from '@blueprintjs/core';
import bp from '../../../../../../lib/react/components/utility/bp';
import UsersView from '../../views/UsersView';
import TeamsView from '../../views/TeamsView';
import GameStateView from '../../views/GameStateView';
import ServerSettingsView from '../../views/ServerSettingsView';
import InstructionArticlesView from '../../views/InstructionArticlesView';
import S3ExplorerView from '../../views/S3ExplorerView';
import ChallengesView from '../../views/ChallengesView';
import LogsView from '../../views/LogsView';
import ResponsesView from '../../views/ResponsesView';
import NotificationToaster from '../../../components/NotificationToaster';
import UncheckedResponseToaster from '../../../components/UncheckedResponseToaster';
import { getResponses } from '../../../../graphql/response';


const POLL_RESPONSE_INTERVAL = 30 * 1000; 

const VIEWS = [
	'users', 
	'teams', 
	'challenges', 
	'instructions', 
	'uploads', 
	'state', 
	'server',
	'logs',
	'responses'
];

const QueryGetResponsesOptions = {
	name: 'QueryGetResponses',
	options: {
		fetchPolicy: 'network-only',
		variables: { uncheckedOnly: true }
	}
}

@graphql(getResponses('checked'), QueryGetResponsesOptions)
@withRouter
@autobind
class AdminDashboard extends React.Component {
	state = {
		selectedTabId: 'users',
		uncheckedResponses: 0
	}

	componentWillMount() {
		this._clearPollingResponses();
		this._startPollingResponses();

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
				this.props.history.push(`/admin/dashboard/${params.view}${params.item?`/${params.item}`:''}`);
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

	componentWillUnmount() {
		this._clearPollingResponses();
	}
	
	_startPollingResponses() {
		this.props.QueryGetResponses.startPolling(POLL_RESPONSE_INTERVAL);
		this.pollResponses = setInterval(this._handlePollResponses, POLL_RESPONSE_INTERVAL);		
	}

	_clearPollingResponses() {
		this.props.QueryGetResponses.stopPolling();
		clearInterval(this.pollResponses);
	}

	_handleResponseAction() {
		this.props.history.push(`/admin/dashboard/responses`);
		this.setState({selectedTabId: 'responses'});
	}
	
	_handlePollResponses() {
		const { error, getResponses } = this.props.QueryGetResponses;
		if (getResponses) {
			const difference = getResponses.length - this.state.uncheckedResponses;

			if (difference > 0) {
				UncheckedResponseToaster.show({
					intent: Intent.SUCCESS,
					message: `There are ${difference} new unchecked responses (${getResponses.length} total).`,
					action: {
						onClick: this._handleResponseAction,
						text: 'View'
					}
				});
			}
			else if (getResponses.length > 0) {
				UncheckedResponseToaster.show({
					intent: Intent.PRIMARY,
					message: `There are ${getResponses.length} unchecked responses.`,
					action: {
						onClick: this._handleResponseAction,
						text: 'View'
					}
				});
			}
			this.setState({ uncheckedResponses: getResponses.length });
		}
		else if (error) {
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: error.toString()
			});
		}
	}

	handleTabChange(newTabId) {
		this.props.history.push(`/admin/dashboard/${newTabId}`);
		this.setState({selectedTabId: newTabId});
	}

	renderTabs(vertical) {
		const { item } = this.props.match.params;
		return (
			<Tabs2 id='dashboard' className={vertical?'':'mobile-tabs'} onChange={this.handleTabChange} 
				selectedTabId={this.state.selectedTabId} vertical={vertical}>
				<Tab2 id={VIEWS[0]} title='Users' panel={<UsersView shouldRefresh={this.state.selectedTabId===VIEWS[0]} item={item}/>}/>
				<Tab2 id={VIEWS[1]} title='Teams' panel={<TeamsView shouldRefresh={this.state.selectedTabId===VIEWS[1]} item={item}/>}/>
				<Tab2 id={VIEWS[8]} title='Responses' panel={<ResponsesView shouldRefresh={this.state.selectedTabId===VIEWS[8]} item={item}/>}/>
				<Tab2 id={VIEWS[2]} title='Challenges' panel={<ChallengesView shouldRefresh={this.state.selectedTabId===VIEWS[2]} item={item}/>}/>
				<Tab2 id={VIEWS[4]} title='Instructions' panel={<InstructionArticlesView shouldRefresh={this.state.selectedTabId===VIEWS[4]} item={item}/>}/>
				<Tab2 id={VIEWS[3]} title='Uploads (S3)' panel={<S3ExplorerView shouldRefresh={this.state.selectedTabId===VIEWS[3]} item={item}/>}/>
				<Tab2 id={VIEWS[5]} title='Game State' panel={<GameStateView shouldRefresh={this.state.selectedTabId===VIEWS[5]} item={item}/>}/>
				<Tab2 id={VIEWS[6]} title='Server' panel={<ServerSettingsView shouldRefresh={this.state.selectedTabId===VIEWS[6]} item={item}/>}/>
				<Tab2 id={VIEWS[7]} title='Logs' panel={<LogsView shouldRefresh={this.state.selectedTabId===VIEWS[7]} item={item}/>}/>
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
