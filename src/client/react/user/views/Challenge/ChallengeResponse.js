import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Spinner, Button } from '@blueprintjs/core';
import { getTeamResponses } from '../../../../graphql/response';
import ResponseUpload from './ResponseUpload';
import ResponsePhrase from './ResponsePhrase';


const QueryGetTeamResponsesParams = 'responseType responseValue uploadDate uploadedBy checked responseValid pointsAwarded retry';

const QueryGetTeamResponsesOptions = {
	name: 'QueryGetTeamResponses',
	options: ({challengeKey, itemKey}) => {
		return {
			fetchPolicy: 'cache-and-network',
			variables: {challengeKey, itemKey}
		}
	}
};

@graphql(getTeamResponses(QueryGetTeamResponsesParams), QueryGetTeamResponsesOptions)
@autobind
class ChallengeResponse extends React.Component {
	static propTypes = {
		itemKey: PropTypes.string.isRequired,
		challengeKey: PropTypes.string.isRequired,
		responseType: PropTypes.oneOf([
			'upload', 'phrase'
		]).isRequired
	}

	refetch() {
		this.props.QueryGetTeamResponses.refetch();
	}

	render() {
		const { itemKey, challengeKey, responseType } = this.props;
		const { loading, getTeamResponses } = this.props.QueryGetTeamResponses;
		let classNames, title, text, canRespond;
		let response, helpPhrase;

		// Create response element
		switch (responseType) {
			case 'upload': {
				helpPhrase = 'This item requires you to upload an image for us to verify.';
				response = <ResponseUpload itemKey={itemKey} challengeKey={challengeKey} onSuccess={this.refetch}/>;
				break;
			}
			case 'phrase': {
				helpPhrase = 'This item requires you enter a phrase for us to verify.';
				response = <ResponsePhrase itemKey={itemKey} challengeKey={challengeKey} onSuccess={this.refetch}/>;
				break;
			}
		}

		if (!getTeamResponses) {
			if (loading) {
				// Query loading
				return (
					<div style={{textAlign:'center'}}>
						<Spinner/>
					</div>
				);
			}
		}
		else if (!getTeamResponses.length) {
			// No responses yet
			classNames = 'pt-callout pt-icon-error';
			title = 'Incomplete';
			text = `${helpPhrase} Your team has not given a response yet.`;
			canRespond = true;
		}
		else {
			// Responses found
			const latestResponse = getTeamResponses[0];

			if (latestResponse.checked) {
				if (latestResponse.responseValid) {
					// Response valid
					classNames = 'pt-callout pt-intent-success pt-icon-endorsed';
					title = 'Correct';
					text = `Well done! You team was awarded ${latestResponse.pointsAwarded} ${latestResponse.pointsAwarded===1?'point':'points'} for your efforts.`;
				}
				else {
					// Response invalid
					classNames = `pt-callout pt-icon-delete pt-intent-danger`;
					title = 'Incorrect';
					text = `Sorry, your team's response was not accepted. You ${latestResponse.retry?'may':'may not'} try again.`;
					canRespond = latestResponse.retry;
				}
			}
			else {
				// Response pending
				classNames = 'pt-callout pt-intent-warning pt-icon-time';
				title = 'Pending';
				text = `Your team's response is being verified. Check back in a few minutes!`;
			}
		}

		return (
			<div className='pt-card' style={{padding:'0.5rem',background:'#0d0d0c'}}>
				<div className={classNames} style={{marginBottom:'0'}}>
					<Button iconName='refresh' loading={this.props.QueryGetTeamResponses.loading} className='pt-minimal' 
						style={{float:'right',margin:'-0.6rem',padding:'0'}} onClick={this.refetch}/>
					<h5>{title}</h5>
					{text}
					{canRespond?response:null}
				</div>
			</div>
		);
	}
}


export default ChallengeResponse;
