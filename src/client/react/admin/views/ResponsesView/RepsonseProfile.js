import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import DateFormat from 'dateformat';
import { Link } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';
import { Intent } from '@blueprintjs/core';
import { getResponse } from '../../../../graphql/response';
import { getTeam } from '../../../../graphql/team';
import NotificationToaster from '../../../components/NotificationToaster';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ResponsePreview from './ResponsePreview';
import ResponseCheck from './ResponseCheck';


const QueryGetResponseOptions = {
	name: 'QueryGetResponse',
	options: (props) => {
		return { 
			fetchPolicy: 'cache-and-network',
			variables: { responseId: props.responseId } 
		}
	}
}

const QueryGetResponseParams = '_id responseType challengeKey itemKey teamId uploadedBy uploadDate checked checkedBy checkedOn pointsAwarded comment responseValid retry';

@graphql(getResponse(QueryGetResponseParams), QueryGetResponseOptions)
@withApollo
@autobind
class ResponseProfile extends React.Component {
	static propTypes = {
		responseId: PropTypes.string.isRequired
	}

	state = {
		teamInfo: null
	}

	async componentDidUpdate() {
		const { getResponse } = this.props.QueryGetResponse;

		if (getResponse) {
			if (!this.state.teamInfo) {
				try {
					const result = await this.props.client.query({
						query: getTeam('_id teamName'),
						variables: { teamId: getResponse.teamId }
					});
					this.setState({ teamInfo: result.data.getTeam	});
				}
				catch (err) {
					NotificationToaster.show({
						intent: Intent.DANGER,
						message: err.toString()
					});
				}
			}
		}
	}

	render() {
		const { loading, getResponse } = this.props.QueryGetResponse;
		const { teamInfo } = this.state;
		let heading, receivedDate, content, responsePreview, responseCheck;

		if (getResponse) {
			receivedDate = `Recieved ${DateFormat(new Date(getResponse.uploadDate), 'hh:MM:ss TT (mmm dd yyyy)')}`
			heading = <span><b>Response from </b><span className='pt-text-muted'>{getResponse.teamId} (fetching...)</span></span>;

			if (teamInfo) {
				heading = <span><b>Response from {teamInfo.teamName}</b></span>;
			}
			
			content = (
				<div>
					<table className='pt-table pt-striped'>
						<tbody>
							<tr>
								<td>Challenge</td>
								<td>{getResponse.challengeKey}</td>
							</tr>
							<tr>
								<td>Item</td>
								<td>{getResponse.itemKey}</td>
							</tr>
							<tr>
								<td>Uplaoded by</td>
								<td>{getResponse.uploadedBy}</td>
							</tr>
							<tr>
								<td>Status</td>
								<td>
									{
										getResponse.checked ?
										<span style={{color:'green'}}>Checked by {getResponse.checkedBy}<br/>{DateFormat(new Date(getResponse.checkedOn), 'hh:MM:ss TT mmm dd yyyy')}</span> :
										<span style={{color:'red'}}><b>Not checked</b></span>
									}
								</td>
							</tr>
							<tr>
								<td>Response valid</td>
								<td>
									{
										getResponse.responseValid ?
										<span style={{color:'green'}}>Valid</span> :
										<span style={{color:'darkred'}}>Invalid</span>
									}
								</td>
							</tr>
							<tr>
								<td>Retry</td>
								<td>
									{
										getResponse.retry ?
										<span style={{color:'green'}}>Can retry</span> :
										<span style={{color:'darkred'}}>Cannot retry</span>
									}
								</td>
							</tr>
							<tr>
								<td>Points awarded</td>
								<td>{getResponse.pointsAwarded}</td>
							</tr>
						</tbody>
					</table>
				</div>
			);

			responsePreview = (
				<div style={{marginTop:'0.5rem'}}>
					<ResponsePreview response={getResponse}/>
				</div>
			);

			responseCheck = (
				<div style={{marginTop:'0.5rem'}}>
					<ResponseCheck response={getResponse} refetchResponse={this.props.QueryGetResponse.refetch}/>
				</div>
			);
		}
		else if (loading || dataLoading) {
			content = <LoadingSpinner/>;
		}

		return (
			<div className='pt-card'>
				<Link className='pt-minimal pt-button pt-icon pt-icon-cross' to='/admin/dashboard/responses' style={{float:'right'}}/>
				<h5>{heading}</h5>
				<p className='pt-text-muted'>{receivedDate}</p>
				{content}
				{responsePreview}
				{responseCheck}
			</div>
		);
	}
}


export default ResponseProfile;
