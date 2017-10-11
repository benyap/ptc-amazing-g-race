import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Spinner } from '@blueprintjs/core';
import { graphql } from 'react-apollo';
import { getResponses } from '../../../../graphql/response';
import RefreshBar from '../../components/RefreshBar';
import ResponseCard from './ResponseCard';

import '../../scss/views/_response-view.scss';


const QueryGetResponsesParams = '_id challengeKey itemKey teamId uploadDate checked checkedBy responseValid retry';

const QueryGetResponsesOptions = {
	name: 'QueryGetResponses',
	options: { fetchPolicy: 'cache-and-network' }
}

@graphql(getResponses(QueryGetResponsesParams), QueryGetResponsesOptions)
@autobind
class ResponsesView extends React.Component {
	render() {
		let { loading, error, getResponses } = this.props.QueryGetResponses;
		let content;
		
		if (error) {
			content = <ViewError error={error}/>;
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
			content = <div className='loading-spinner'><Spinner/></div>;
		}
		
		return (
			<div id='dashboard-responses' className='dashboard-tab'>
				<h4>Responses</h4>
				<RefreshBar query={this.props.QueryGetResponses} shouldRefresh={this.props.shouldRefresh}/>
				{content}
			</div>
		);
	}
}


export default ResponsesView;
