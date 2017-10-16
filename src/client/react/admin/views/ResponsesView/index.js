import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { NonIdealState } from '@blueprintjs/core';
import { getResponses } from '../../../../graphql/response';
import LoadingSpinner from '../../../components/LoadingSpinner';
import RefreshBar from '../../components/RefreshBar';
import ViewError from '../../components/ViewError';
import ResponseCard from './ResponseCard';
import ResponseProfile from './RepsonseProfile';
import ResponsesSummary from './ResponsesSummary';

import '../../scss/views/_response-view.scss';


const POLL_RESPONSE_INTERVAL = 60 * 1000; 

const QueryGetResponsesParams = '_id challengeKey teamId itemKey checked checkedBy responseValid pointsAwarded retry';

const QueryGetResponsesOptions = {
	name: 'QueryGetResponses',
	options: { fetchPolicy: 'cache-and-network' }
}

@graphql(getResponses(QueryGetResponsesParams), QueryGetResponsesOptions)
@autobind
class ResponsesView extends React.Component {
	state = {
		filter: 'none',
		search: ''
	}

	componentDidMount() {
		this.props.QueryGetResponses.startPolling(POLL_RESPONSE_INTERVAL);
	}

	componentWillUnmount() {
		this.props.QueryGetResponses.stopPolling();
	}

	searchResponses(search) {
		this.setState({search});
	}

	filterResponses(filter) {
		this.setState({filter});
	}


	_applySearchResponse(response) {
		if (this.state.search.length > 0) {
			const search = this.state.search.toLowerCase();
			const matchChallenge = response.challengeKey.toLowerCase().indexOf(search) >= 0;
			const matchItem = response.itemKey.toLowerCase().indexOf(search) >= 0;

			if (matchChallenge || matchItem) return true;
			else return false;
		}
		else return true;
	}

	_applyFilterResponse(response) {
		switch (this.state.filter) {
			case 'checked': {
				return response.checked;
			}
			case 'unchecked': {
				return !response.checked;
			}
			case 'valid': {
				return response.responseValid;
			}
			case 'invalid': {
				return !response.responseValid;
			}
			case 'add': {
				return response.pointsAwarded > 0;
			}
			case 'stay': {
				return response.pointsAwarded === 0;
			}
			case 'deduct': {
				return response.pointsAwarded < 0;
			}
			case 'all':
			default: return true;
		}
	}

	render() {
		const { loading, error, getResponses } = this.props.QueryGetResponses;
		let content, summary; 
		let responseCount = 0, responseTotal = 0;
		
		if (error) {
			content = <ViewError error={error}/>;
		}
		else if (this.props.item) {
			if (getResponses) {
				content = <ResponseProfile responseId={this.props.item}/>;
			}
			else {
				content = <LoadingSpinner/>;
			}
		}
		else {
			if (getResponses) {
				if (getResponses.length) {
					content = (
						<div className='view-list'>
						{ getResponses.map((response) => {
								responseTotal += 1;
								if (this._applyFilterResponse(response) && this._applySearchResponse(response)) {
									responseCount += 1;
									return <ResponseCard key={response._id} response={response}/>;
								}
							}).sort((a, b) => {
								if (a.props.response.checked && b.props.response.checked) return 0;
								else if (a.props.response.checked) return 1;
								else if (b.props.response.checked) return -1;
								else return 0;
							})}
						</div>
					);
					
					if (responseCount === 0) {
						content = (
							<div style={{margin:'3rem'}}>
								<NonIdealState title='No responses match your query.' description='Did you make a typo?' visual='search'/>
							</div>
						);
					}
				}
				else {
					content = (
						<div>
							<div style={{margin:'3rem'}}>
								<NonIdealState title='No responses' description={`You sure the challenges weren't impossibly hard?`} visual='inbox'/>
							</div>
						</div>
					);
				}

				summary = (
					<ResponsesSummary searchValue={this.state.search} filterValue={this.state.filter}
						onSearchChange={this.searchResponses} onFilterChange={this.filterResponses}
						responseTotal={responseTotal} responseCount={responseCount}/>
				);
			}
			else if (loading) {
				content = <LoadingSpinner/>;
			}
		}
		
		return (
			<div id='dashboard-responses' className='dashboard-tab'>
				<h4>Responses</h4>
				<RefreshBar query={this.props.QueryGetResponses} shouldRefresh={this.props.shouldRefresh} disabled={this.props.item}/>
				{summary}
				{content}
			</div>
		);
	}
}


export default ResponsesView;
