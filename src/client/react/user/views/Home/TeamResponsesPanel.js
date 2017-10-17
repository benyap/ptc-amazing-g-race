import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Spinner, Button, Intent } from '@blueprintjs/core';
import { getTeamResponses } from '../../../../graphql/response';
import NotificationToaster from '../../../components/NotificationToaster';


const QueryGetTeamResponsesParams = '_id checked responseValid retry';

const QueryGetTeamResponsesOptions = {
	name: 'QueryGetTeamResponses',
	options: {
		fetchPolicy: 'cache-and-network'
	}
};

@graphql(getTeamResponses(QueryGetTeamResponsesParams), QueryGetTeamResponsesOptions)
@autobind
class TeamResponsesPanel extends React.Component {
	static propTypes = {
		user: PropTypes.shape({
			teamId: PropTypes.string
		}).isRequired
	}

	constructor(props) {
		super(props);
		const { getTeamResponses } = props.QueryGetTeamResponses;

		this.state = {
			loaded: false,
			pending: null,
			valid: null, 
			invalid: null,
			retry: null
		}
		
		// Initialize inital state
		if (props.user.teamId) {
			if (getTeamResponses) {
				this.state = this._countResponses(getTeamResponses);
			}
		}
	}

	async componentDidMount() {
		this.refetch();
	}

	async refetch() {
		if (!this.props.user.teamId) return;

		try {
			const result = await this.props.QueryGetTeamResponses.refetch();
			
			// Count responses
			if (result.data.getTeamResponses) {
				const newState = this._countResponses(result.data.getTeamResponses);
				this.setState(newState);
			}
		}
		catch (err) {
			NotificationToaster.show({
				intent: Intent.DANGER,
				message: err.toString()
			});
		}
	}

	_countResponses(responses) {
		let pending = 0, valid = 0, invalid = 0, retry = 0;

		responses.forEach((response) => {
			if (response.checked) {
				if (response.responseValid) valid += 1;
				else invalid += 1;
				if (response.retry) retry += 1;
			}
			else {
				pending += 1;
			}
		});

		return { loaded: true, pending, valid, invalid, retry };
	}
	
	render() {
		const { loading } = this.props.QueryGetTeamResponses;
		let content;
		let pending, valid, invalid, retry;

		if (!this.props.user.teamId) {
			content =  (
				<div className='pt-callout pt-intent-primary pt-icon-info-sign'>
					<h5>Challenges overview</h5>
					This panel will show an overview of how your team is going in answering challenges in the race.
				</div>
			);
		}
		else if (this.state.loaded) {
			const loadingStyle = {color:'#bfccd6'};

			valid = (
				<div className='pt-callout pt-icon-thumbs-up'>
					<span style={loading?loadingStyle:null}>
						{`Your team has given ${this.state.valid} valid ${this.state.valid === 1 ? 'response' : 'responses'}.`}
					</span>
				</div>
			);
			
			invalid = (
				<div className='pt-callout pt-icon-thumbs-down'>
					<span style={loading?loadingStyle:null}>
						{`Your team has given ${this.state.invalid} invalid ${this.state.invalid === 1 ? 'response' : 'responses'}.`}
					</span>
				</div>
			);

			if (this.state.pending > 0) {
				pending = (
					<div className='pt-callout pt-icon-time pt-intent-warning'>
						<span style={loading?loadingStyle:null}>
							{`Your team has ${this.state.pending} pending ${this.state.pending === 1 ? 'response.' : 'repsonses.'}`}
						</span>
					</div>
				);
			}

			if (this.state.retry > 0) {
				retry = (
					<div className='pt-callout pt-icon-refresh pt-intent-success'>
						<span style={loading?loadingStyle:null}>
							{`There ${this.state.retry === 1 ? 'is' : 'are'} ${this.state.retry} ${this.state.retry === 1 ? 'challenge' : 'challenges'} your team can resubmit a response for.`}
						</span>
					</div>
				);
			}

			content = (
				<div className='response-list'>
					{valid}
					{invalid}
					{pending}
					{retry}
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
			<div id='team-responses-panel' style={{marginBottom:'1rem'}}>
				<Button iconName='refresh' className='pt-intent-warning pt-small pt-minimal' style={{float:'right',padding:'0'}} 
					loading={loading} onClick={this.refetch}/>
				<h4>Your team's responses</h4>
				{content}
			</div>
		);
	}
}


export default TeamResponsesPanel;
