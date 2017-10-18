import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import DateFormat from 'dateformat';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Intent, Tree } from '@blueprintjs/core';
import { getActions } from '../../../../graphql/user';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ViewError from '../../components/ViewError';
import NotificationToaster from '../../../components/NotificationToaster';
import RefreshBar from '../../components/RefreshBar';
import Filters from './Filters';

import '../../scss/views/_logs-view.scss';


const QueryActionsParams = '_id action target who date infoJSONString';

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
		limit: '20',
		username: '',
		action: '',
		nodes: []
	}

	componentDidMount() {
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
				{ id: 'when', iconName: 'time', label: `WHEN: ${DateFormat(new Date(action.date), 'hh:MM TT mmm dd yyyy')}` },
				{ id: 'target', iconName: 'locate', label: `TARGET: ${action.target}` }
			];

			if (dataNodes.length) {
				childNodes.push({ id: 'data', iconName: 'database', label: `DATA`, childNodes: dataNodes });
			}

			return {
				id: action._id,
				date: action.date,
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
		let content, filter;
		const { loading, error, getActions } = this.props.QueryActions;

		if (error) {
			content = <ViewError error={error}/>;
		}
		else {
			filter = (
				<Filters onChange={this.onChange} onFilter={this.onFilter} loading={this.props.QueryActions.loading}
					action={this.state.action} username={this.state.username} skip={this.state.skip} limit={this.state.limit}/>
			);

			if (this.state.nodes) {
				let startDate;
				let results;
	
				if (this.state.nodes.length > 0) {
					let endDate = DateFormat(new Date(this.state.nodes[0].date), 'mmmm d');
	
					if (this.state.nodes.length > 1) {
						startDate = DateFormat(new Date(this.state.nodes[this.state.nodes.length-1].date), 'mmmm d');
					}
					else startDate = endDate;
	
					results = `Showing ${this.state.nodes.length} results from ${startDate} to ${endDate}`;
				}
				else {
					results = 'No logs to show.';
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
			else if (loading) {
				content = <LoadingSpinner/>;
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
				{/* <RefreshBar query={this.props.QueryActions} shouldRefresh={this.props.shouldRefresh}/> */}
				{filter}
				{content}
			</div>
		);
	}
}


export default LogsView;
