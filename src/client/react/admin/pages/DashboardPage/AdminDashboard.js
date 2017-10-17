import React from 'react';
import autobind from 'core-decorators/es/autobind';
import MediaQuery from 'react-responsive';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import { Tab2, Tabs2, Intent, Icon } from '@blueprintjs/core';
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
import FeedView from '../../views/FeedView';
import NotificationToaster from '../../../components/NotificationToaster';
import UncheckedResponseToaster from '../../../components/UncheckedResponseToaster';
import { getResponses } from '../../../../graphql/response';


const POLL_RESPONSE_INTERVAL = 60 * 1000; 

const VIEWS = [
	'users', 
	'teams', 
	'challenges', 
	'uploads', 
	'instructions', 
	'state', 
	'server',
	'logs',
	'responses',
	'feed'
];

const QueryGetResponsesOptions = {
	name: 'QueryGetResponses',
	options: {
		fetchPolicy: 'network-only',
		variables: { uncheckedOnly: true }
	}
}

const mapStateToProps = (state, ownProps) => {
	return { 
		showResponses: state.settings.showNotifications
	}
}

@graphql(getResponses('checked'), QueryGetResponsesOptions)
@withRouter
@connect(mapStateToProps)
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
		this.pollResponses = setInterval(this._handlePollResponses, POLL_RESPONSE_INTERVAL);		
	}

	_clearPollingResponses() {
		clearInterval(this.pollResponses);
	}

	_handleResponseAction() {
		this.props.history.push(`/admin/dashboard/responses`);
		this.setState({selectedTabId: 'responses'});
	}
	
	async _handlePollResponses() {
		// Only request data if notifications are turned on
		if (!this.props.showResponses) return;

		try {
			const result = await this.props.QueryGetResponses.refetch();

			const { data: { error, getResponses } } = result;
			
			const difference = getResponses.length - this.state.uncheckedResponses;
		
			if (difference > 0) {
				UncheckedResponseToaster.show({
					timeout: 20000,
					intent: Intent.SUCCESS,
					message: `There ${difference>1?'are':'is'} ${difference} new unchecked ${difference>1?'responses':'response'} (${getResponses.length} total).`,
					action: {
						onClick: this._handleResponseAction,
						text: 'View'
					}
				});
			}
			else if (getResponses.length > 0) {
				UncheckedResponseToaster.show({
					timeout: 20000,
					intent: Intent.PRIMARY,
					message: `There ${getResponses.length===1?'is':'are'} ${getResponses.length} unchecked ${getResponses.length===1?'response':'responses'}.`,
					action: {
						onClick: this._handleResponseAction,
						text: 'View'
					}
				});
			}
			
			this.setState({ uncheckedResponses: getResponses.length });
		}
		catch (err) {
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
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

				<Tab2 id={VIEWS[0]} title={<span><Icon iconName='person'/>&nbsp;Users</span>}
					panel={<UsersView shouldRefresh={this.state.selectedTabId===VIEWS[0]} item={item}/>}/>
					
				<Tab2 id={VIEWS[1]} title={<span><Icon iconName='people'/>&nbsp;Teams</span>}
					panel={<TeamsView shouldRefresh={this.state.selectedTabId===VIEWS[1]} item={item}/>}/>

				<Tab2 id={VIEWS[2]} title={<span><Icon iconName='flag'/>&nbsp;Challenges</span>}
					panel={<ChallengesView shouldRefresh={this.state.selectedTabId===VIEWS[2]} item={item}/>}/>

				<Tab2 id={VIEWS[8]} title={<span><Icon iconName='inbox'/>&nbsp;Responses</span>}
					panel={<ResponsesView shouldRefresh={this.state.selectedTabId===VIEWS[8]} item={item}/>}/>

				<Tab2 id={VIEWS[9]} title={<span><Icon iconName='feed'/>&nbsp;Newsfeed</span>}
					panel={<FeedView shouldRefresh={this.state.selectedTabId===VIEWS[9]} item={item}/>}/>

				<Tab2 id={VIEWS[4]} title={<span><Icon iconName='clipboard'/>&nbsp;Instructions</span>}
					panel={<InstructionArticlesView shouldRefresh={this.state.selectedTabId===VIEWS[4]} item={item}/>}/>

				<Tab2 id={VIEWS[3]} title={<span><Icon iconName='cloud-upload'/>&nbsp;Uploads</span>}
					panel={<S3ExplorerView shouldRefresh={this.state.selectedTabId===VIEWS[3]} item={item}/>}/>

				<Tab2 id={VIEWS[5]} title={<span><Icon iconName='property'/>&nbsp;Game State</span>}
					panel={<GameStateView shouldRefresh={this.state.selectedTabId===VIEWS[5]} item={item}/>}/>

				<Tab2 id={VIEWS[6]} title={<span><Icon iconName='cog'/>&nbsp;Settings</span>}
					panel={<ServerSettingsView shouldRefresh={this.state.selectedTabId===VIEWS[6]} item={item}/>}/>

				<Tab2 id={VIEWS[7]} title={<span><Icon iconName='application'/>&nbsp;Logs</span>}
					panel={<LogsView shouldRefresh={this.state.selectedTabId===VIEWS[7]} item={item}/>}/>

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
