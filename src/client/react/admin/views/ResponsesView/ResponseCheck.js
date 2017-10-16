import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import DateFormat from 'dateformat';
import { graphql } from 'react-apollo';
import { Intent, Button, Collapse, Switch } from '@blueprintjs/core';
import { checkResponse } from '../../../../graphql/response';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import NotificationToaster from '../../../components/NotificationToaster';


@graphql(checkResponse('ok'), { name: 'MutationCheckResponse' })
@autobind
class ResponseCheck extends React.Component {
	static propTypes = {
		response: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			responseValid: PropTypes.bool.isRequired,
			checked: PropTypes.bool.isRequired,
			retry: PropTypes.bool.isRequired,
			pointsAwarded: PropTypes.number.isRequired,
			comment: PropTypes.string.isRequired
		}).isRequired,
		refetchResponse: PropTypes.func.isRequired
	}

	state = {
		showCheckResponse: false,
		checkResponseLoading: false,
		checkResponseError: null,
		responseValid: this.props.response.responseValid,
		retry: this.props.response.retry,
		pointsAwarded: this.props.response.pointsAwarded,
		comment: this.props.response.comment
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

	onCommentChange(e) {
		this.setState({ comment: e.target.value });
	}

	async submitCheckResponse() {
		try {
			this.setState({ checkResponseError: null, checkResponseLoading: true });
			await this.props.MutationCheckResponse({
				variables: {
					responseId: this.props.response._id,
					responseValid: this.state.responseValid, 
					retry: this.state.retry,
					pointsAwarded: this.state.pointsAwarded,
					comment: this.state.comment
				}
			});
			await this.props.refetchResponse();
			this.setState({ checkResponseLoading: false });
		}
		catch (err) {
			this.setState({ checkResponseLoading: false, checkResponseError: err.toString() });
			if (!this.state.showCheckResponse) {
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: `Unable to modify response state: ${err.toString()}`
				});
			}
		}
	}

	render() {
		let warning;

		if (this.props.response.checked) {
			warning = (
				<div className='pt-callout pt-intent-warning pt-icon-warning-sign' style={{marginBottom:'1rem'}}>
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
				<div className='pt-callout pt-intent-primary pt-icon-info-sign' style={{marginBottom:'1rem'}}>
					<h5>Modifying the response status</h5>
					<div>
						Modifying this response and saving it will apply the point change to the team and cause your verdict to be reflected on the user's dashboard.
						Please check your action is correct before proceeding.
					</div>
				</div>
			);
		}

		return (
			<div>
				<Button className='pt-fill' iconName={this.state.showCheckResponse?'chevron-down':'chevron-right'} 
					text='Modify response status' onClick={this.toggle('showCheckResponse')}/>
				<Collapse isOpen={this.state.showCheckResponse}>
					<div style={{marginTop:'1rem',padding:'1rem',background:'#f5f5f5',borderRadius:'0.3rem'}}>
						{ this.state.checkResponseError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{margin:'0.5rem 0'}}>
								<h5>Error</h5>
								{this.state.checkResponseError}
							</div>
							: null
						}
						{warning}
						<Switch checked={this.state.responseValid} label='Response valid' onChange={this.toggle('responseValid')} className='pt-large' disabled={this.state.checkResponseLoading}/>
						<Switch checked={this.state.retry} label='Retry' onChange={this.toggle('retry')} className='pt-large' disabled={this.state.checkResponseLoading}/>
						<div class='pt-form-group pt-inline' style={{marginBottom:'0.3rem'}}>
							<label class='pt-label' for='points'>
								Points Awarded
							</label>
							<div class='pt-form-content'>
								<div class='pt-input-group' style={{maxWidth:'5rem'}}>
									<input id='points' class='pt-input' type='text' value={this.state.pointsAwarded} onChange={this.onPointsAwardedChange} disabled={this.state.checkResponseLoading}/>
								</div>
							</div>
						</div>
						<FormInput id='comment' value={this.state.comment} onChange={this.onCommentChange} disabled={this.state.checkResponseLoading}
							label='Comment' helperText='Teams will see this comment on their response'/>
						<Button intent={Intent.DANGER} className='pt-fill' text='Save' onClick={this.submitCheckResponse} loading={this.state.checkResponseLoading}/>
					</div>
				</Collapse>
			</div>
		);
	}
}


export default ResponseCheck;
