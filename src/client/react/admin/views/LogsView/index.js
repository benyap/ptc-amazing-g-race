import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import DateFormat from 'dateformat';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Spinner, Button, Intent, Tree, ITreeNode } from '@blueprintjs/core';
import { getActions } from '../../../../graphql/user';
import ViewError from '../../components/ViewError';
import NotificationToaster from '../../../components/NotificationToaster';
import RefreshBar from '../../components/RefreshBar';
import Filters from './Filters';

import '../../scss/views/_logs-view.scss';


const QueryActionsParams = 'action target who date infoJSONString';

const QueryActionsOptions = {
	name: 'QueryActions', 
	options: {
		fetchPolicy: 'cache-and-network',
		variables: { skip: 0, limit: 20 }
	}
}

@graphql(getActions(QueryActionsParams), QueryActionsOptions)
@connect()
@autobind
class LogsView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool.isRequired
	}

	state = {
		skip: '0',
		limit: '10',
		username: '',
		action: '',
		nodes: []
	}

	componentDidMount() {
		this.setState({ loading: true });
		this.fetchActions();
	}

	async fetchActions() {
		try {
			await this.props.QueryActions.refetch({
				skip: this.state.skip,
				limit: this.state.limit,
				action: this.state.action,
				username: this.state.username
			});
			
			const nodes = this._constructTreeNodes(this.props.QueryActions.getActions);
			this.setState({nodes, loading: false});
		}
		catch (err) {
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
		}
	}

	_constructTreeNodes(actions) {
		return actions.map((action) => {
			const dataNodes = [];
			let data;
			
			if (action.infoJSONString) {
				data = JSON.parse(action.infoJSONString);
				let i = 0;
				Object.keys(data).map((key) => {
					dataNodes.push({ id: i++, label: `${key} = ${data[key]}` })
				});
			}

			const childNodes = [
				{ id: 'who', iconName: 'person', label: `WHO: ${action.who}` },
				{ id: 'action', iconName: 'take-action', label: `ACTION: ${action.action}` },
				{ id: 'when', iconName: 'time', label: `WHEN: ${DateFormat(new Date(action.date), 'mmm dd yyyy hh:MM TT')}` },
				{ id: 'target', iconName: 'locate', label: `TARGET: ${action.target}` }
			];

			if (dataNodes.length) {
				childNodes.push({ id: 'data', iconName: 'database', label: `DATA`, childNodes: dataNodes });
			}

			return {
				id: action.date,
				hasCaret: true,
				label: `[${DateFormat(new Date(action.date), 'mmm dd')}] [${action.who}] ${action.action}`,
				childNodes: childNodes
			}
		});
	}

	onNodeCollapse(node) {
		node.isExpanded = false;
		this.setState({nodes: this.state.nodes});
	}

	onNodeExpand(node) {
		node.isExpanded = true;
		this.setState({nodes: this.state.nodes});
	}

	onFilter() {
		this.fetchActions();
	}

	onChange({target}) {
		this.setState({ [target.id]: target.value });
	}

	render() {
		let content = null;
		const { error, getActions } = this.props.QueryActions;

		if (this.state.loading) {
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
				let startDate;
				let results;

				if (this.state.nodes.length > 0) {
					let endDate = DateFormat(new Date(this.state.nodes[0].id), 'mmmm d');

					if (this.state.nodes.length > 1) {
						startDate = DateFormat(new Date(this.state.nodes[this.state.nodes.length-1].id), 'mmmm d');
					}
					else startDate = endDate;

					results = `Showing ${this.state.nodes.length} results from ${startDate} to ${endDate}`;
				}
				else {
					results = 'No results found.';
				}

				content = (
					<div>
						<div className='results-info'style={{margin:'0.8rem 0'}}>
							<em>{results}</em>
						</div>
						<Tree
							contents={this.state.nodes}
							onNodeCollapse={this.onNodeCollapse}
							onNodeExpand={this.onNodeExpand}
						/>
					</div>
				);
			}
		}

		const variables = {
			skip: this.state.skip,
			limit: this.state.limit,
			action: this.state.action,
			username: this.state.username
		}
		
		return (
			<div id='dashboard-logs' className='dashboard-tab'>
				<h4>Server Action Log</h4>
				<RefreshBar query={this.props.QueryActions} shouldRefresh={this.props.shouldRefresh}/>
				<Filters onChange={this.onChange} onFilter={this.onFilter} loading={this.props.QueryActions.loading}
					action={this.state.action} username={this.state.username} skip={this.state.skip} limit={this.state.limit}/>
				{content}
			</div>
		);
	}
}


export default LogsView;
