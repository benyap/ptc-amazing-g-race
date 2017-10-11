import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Link } from 'react-router-dom';
import { graphql, withApollo } from 'react-apollo';
import { Spinner, Intent } from '@blueprintjs/core';
import { getResponse } from '../../../../graphql/response';
import { getTeam } from '../../../../graphql/team';
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

const QueryGetResponseParams = '_id challengeKey itemKey teamId uploadedBy uploadDate checked checkedBy responseValid retry';

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

		if (getResponse && !this.state.teamInfo) {
			try {
				const result = await this.props.client.query({
					query: getTeam('teamName points'),
					variables: { teamId: getResponse.teamId },
					fetchPolicy: 'network-only'
				});
				this.setState({ teamInfo: result.data.getTeam });
			}
			catch (err) {
				NotificationToaster.show({
					intent: Intent.DANGER,
					message: err.toString()
				});
			}
		}
	}

	render() {
		const { loading, getResponse } = this.props.QueryGetResponse;
		const { teamInfo } = this.state;
		let content;

		if (getResponse) {
			let heading = <span>Response from <span className='pt-text-muted'>{getResponse.teamId} (fetching...)</span></span>;
			if (teamInfo) {
				heading = <span>Response from {teamInfo.teamName}</span>;
			}
			
			content = (
				<div>
					<h5>{heading}</h5>
					<b>Challenge: </b>{getResponse.challengeKey}<br/>
					<b>Item: </b>{getResponse.itemKey}<br/>
				</div>
			);
		}
		else if (loading) {
			content = <div style={{margin:'2rem 0',textAlign:'center'}}><Spinner/></div>;
		}

		return (
			<div className='pt-card'>
				<Link className='pt-minimal pt-button pt-icon pt-icon-cross' to='/admin/dashboard/responses' style={{float:'right'}}/>
				{content}
			</div>
		);
	}
}


export default ResponseProfile;
