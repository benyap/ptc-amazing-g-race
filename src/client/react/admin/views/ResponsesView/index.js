import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Spinner, Button, Intent } from '@blueprintjs/core';
import { graphql } from 'react-apollo';
import { getResponses } from '../../../../graphql/response';
import RefreshBar from '../../components/RefreshBar';
import ViewError from '../../components/ViewError';
import ResponseCard from './ResponseCard';
import ResponseProfile from './RepsonseProfile';

import '../../scss/views/_response-view.scss';


const POLL_RESPONSE_INTERVAL = 60 * 1000; 

const QueryGetResponsesParams = '_id challengeKey teamId itemKey checked checkedBy responseValid retry';

const QueryGetResponsesOptions = {
	name: 'QueryGetResponses',
	options: { fetchPolicy: 'cache-and-network' }
}

@graphql(getResponses(QueryGetResponsesParams), QueryGetResponsesOptions)
@autobind
class ResponsesView extends React.Component {
	componentDidMount() {
		this.props.QueryGetResponses.startPolling(POLL_RESPONSE_INTERVAL);
	}

	componentWillUnmount() {
		this.props.QueryGetResponses.stopPolling();
	}

	render() {
		const { loading, error, getResponses } = this.props.QueryGetResponses;
		let content;
		
		if (error) {
			content = <ViewError error={error}/>;
		}
		else if (this.props.item) {
			if (getResponses) {
				content = <ResponseProfile responseId={this.props.item}/>;
			}
			else {
				content = (
					<div style={{textAlign:'center',margin:'3rem'}}>
						<Spinner/>
					</div>
				);
			}
		}
		else if (getResponses) {
			content = (
				<div className='view-list'>
					{ getResponses.map((response) => {
							return <ResponseCard key={response._id} response={response}/>;
						}).sort((a, b) => {
							if (a.props.response.checked && b.props.response.checked) return 0;
							else if (a.props.response.checked) return 1;
							else if (b.props.response.checked) return -1;
							else return 0;
						})}
				</div>
			);
		}
		else if (loading) {
			content = (
				<div style={{textAlign:'center',margin:'3rem'}}>
					<Spinner/>
				</div>
			);
		}
		
		return (
			<div id='dashboard-responses' className='dashboard-tab'>
				<h4>Responses</h4>
				<RefreshBar query={this.props.QueryGetResponses} shouldRefresh={this.props.shouldRefresh} disabled={this.props.item}/>
				{content}
			</div>
		);
	}
}


export default ResponsesView;
