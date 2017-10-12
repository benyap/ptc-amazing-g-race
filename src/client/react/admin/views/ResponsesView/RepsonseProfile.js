import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import DateFormat from 'dateformat';
import { Link } from 'react-router-dom';
import { compose, graphql, withApollo } from 'react-apollo';
import { Spinner, Intent, Button, Collapse, Switch, Dialog } from '@blueprintjs/core';
import { getResponse, getResponseData, checkResponse } from '../../../../graphql/response';
import { getTeam } from '../../../../graphql/team';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import NotificationToaster from '../../../components/NotificationToaster';


const QueryGetResponseOptions = {
	name: 'QueryGetResponse',
	options: (props) => {
		return { 
			fetchPolicy: 'cache-and-network',
			variables: { responseId: props.responseId } 
		}
	}
}

const QueryGetResponseDataOptions = {
	name: 'QueryGetResponseData',
	options: (props) => {
		return { 
			fetchPolicy: 'cache-and-network',
			variables: { responseId: props.responseId } 
		}
	}
}

const QueryGetResponseParams = '_id responseType challengeKey itemKey teamId uploadedBy uploadDate checked checkedBy checkedOn pointsAwarded responseValid retry';

@compose(
	graphql(getResponse(QueryGetResponseParams), QueryGetResponseOptions),
	graphql(getResponseData('data date'), QueryGetResponseDataOptions),
	graphql(checkResponse('ok'), { name: 'MutationCheckResponse' })
)
@withApollo
@autobind
class ResponseProfile extends React.Component {
	static propTypes = {
		responseId: PropTypes.string.isRequired
	}

	state = {
		teamInfo: null,
		showResponseData: false,
		showModifyResponse: false,
		checkResponseLoading: false,
		checkResponseError: null,

		loaded: false,
		responseValid: false,
		retry: false,
		pointsAwarded: '0'
	}

	async componentDidUpdate() {
		const { getResponse } = this.props.QueryGetResponse;

		if (getResponse) {
			if (!this.state.teamInfo) {
				try {
					const result = await this.props.client.query({
						query: getTeam('teamName'),
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

			if (!this.state.loaded) {
				this.setState({
					loaded: true,
					responseValid: getResponse.responseValid,
					retry: getResponse.retry,
					pointsAwarded: getResponse.pointsAwarded
				});
			}
		}
	}

	toggle(state) {
		return () => {
			this.setState((prevState) => {
				return { [state]: !prevState[state] };
			});
		}
	}

	onPointsAwardedChange(e) {
		this.setState({ pointsAwarded: e.target.value });
	}

	async submitCheckResponse() {
		try {
			this.setState({ checkResponseError: null, checkResponseLoading: true });
			await this.props.MutationCheckResponse({
				variables: {
					responseId: this.props.responseId,
					responseValid: this.state.responseValid, 
					retry: this.state.retry,
					pointsAwarded: this.state.pointsAwarded
				}
			});
			await this.props.QueryGetResponse.refetch();
			this.setState({ checkResponseLoading: false });
		}
		catch (err) {
			this.setState({ checkResponseLoading: false, checkResponseError: err.toString() });
			if (!this.state.showModifyResponse) {
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: `Unable to modify response state: ${err.toString()}`
				});
			}
		}
	}

	render() {
		const { loading, getResponse } = this.props.QueryGetResponse;
		const { loading: dataLoading , getResponseData } = this.props.QueryGetResponseData;
		const { teamInfo } = this.state;
		let heading, receivedDate, content, response, responseData, action, warning;

		if (getResponse && getResponseData) {
			receivedDate = `Recieved ${DateFormat(new Date(getResponse.uploadDate), 'hh:MM:ss TT (mmm dd yyyy)')}`
			heading = <span><b>Response from </b><span className='pt-text-muted'>{getResponse.teamId} (fetching...)</span></span>;

			if (teamInfo) {
				heading = <span><b>Response from {teamInfo.teamName}</b></span>;
			}

			if (getResponse.checked) {
				warning = (
					<div className='pt-callout pt-intent-warning pt-icon-warning-sign' style={{margin:'0.5rem 0'}}>
						<h5>Response checked</h5>
						<div>
							This response has already been checked. 
							Avoid modifying a checked response unless it is absolutely necessary.
							Team point correction will be applied upon saving the modification.
						</div>
					</div>
				);
			}
			else {
				warning = (
					<div className='pt-callout pt-intent-primary pt-icon-info-sign' style={{margin:'0.5rem 0'}}>
						<h5>Modifying the responses status</h5>
						<div>
							Modifying this response and saving it will apply the point change to the team and cause your verdict to be reflected on the user's dashboard.
							Please check your action is correct before proceeding.
						</div>
					</div>
				);
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

			// Create response data
			if (getResponse.responseType === 'upload') {
				responseData = (
					<div>
						<p>{`Retrieved from server at ${DateFormat(new Date(getResponseData.date), 'hh:MM TT mmm dd yyyy')}`}</p>
						<img style={{maxWidth:'100%', maxHeight:'100%'}} 
							src={getResponseData.data} alt={`Response uploaded by ${getResponse.uploadedBy}`}/>
					</div>
				);
			}
			else if (getResponse.responseType === 'phrase') {
				responseData = (
					<div>
						<p>{`Retrieved from server at ${DateFormat(new Date(getResponseData.date), 'hh:MM TT mmm dd yyyy')}`}</p>
						<FormInput id='phrase' readOnly large value={getResponseData.data}/>
					</div>
				);
			}

			response = (
				<div style={{marginTop:'1rem'}}>
					<Button className='pt-fill' iconName='upload' text='See response' onClick={this.toggle('showResponseData')}/>
					<Dialog title={`[${getResponse.uploadedBy}] ${getResponse.challengeKey}: ${getResponse.itemKey}`} isOpen={this.state.showResponseData} onClose={this.toggle('showResponseData')}>
						<div className='pt-dialog-body'>
							{responseData}
						</div>
					</Dialog>
				</div>
			);

			action = (
				<div style={{marginTop:'1rem'}}>
					<Button className='pt-fill' iconName={this.state.showModifyResponse?'chevron-down':'chevron-right'} 
						text='Modify response status' onClick={this.toggle('showModifyResponse')}/>
					<Collapse isOpen={this.state.showModifyResponse}>
						{warning}
						<Switch checked={this.state.responseValid} label='Response valid' onChange={this.toggle('responseValid')} className='pt-large'/>
						<Switch checked={this.state.retry} label='Retry' onChange={this.toggle('retry')} className='pt-large'/>
						<div class='pt-form-group pt-inline'>
							<label class='pt-label' for='points'>
								Points Awarded
							</label>
							<div class='pt-form-content'>
								<div class='pt-input-group' style={{maxWidth:'5rem'}}>
									<input id='points' class='pt-input' type='text' value={this.state.pointsAwarded} onChange={this.onPointsAwardedChange}/>
								</div>
							</div>
						</div>
						<Button intent={Intent.DANGER} className='pt-fill' text='Save' onClick={this.submitCheckResponse} loading={this.state.checkResponseLoading}/>
					</Collapse>
				</div>
			);
		}
		else if (loading || dataLoading) {
			content = <div style={{margin:'2rem 0',textAlign:'center'}}><Spinner/></div>;
		}

		return (
			<div className='pt-card'>
				<Link className='pt-minimal pt-button pt-icon pt-icon-cross' to='/admin/dashboard/responses' style={{float:'right'}}/>
				<h5>{heading}</h5>
				<p className='pt-text-muted'>{receivedDate}</p>
				{content}
				{response}
				{action}
			</div>
		);
	}
}


export default ResponseProfile;
