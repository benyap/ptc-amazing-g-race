import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { getTeam } from '../../../../graphql/team';


const QueryGetTeamOptions = {
	name: 'QueryGetTeam', 
	options: (props) => {
		return { 
			fetchPolicy: 'cache-and-network',
			variables: { teamId: props.response.teamId } 
		}
	}
}

@graphql(getTeam('teamName'), QueryGetTeamOptions)
@autobind
class ResponseCard extends React.Component {
	static propTypes = {
		response: PropTypes.shape({
			challengeKey: PropTypes.string.isRequired,
			itemKey: PropTypes.string.isRequired,
			teamId: PropTypes.string.isRequired,
			uploadDate: PropTypes.string.isRequired,
			checked: PropTypes.bool,
			checkedBy: PropTypes.string,
			responseValid: PropTypes.bool,
			retry: PropTypes.bool
		}),
		renderProfile: PropTypes.func.isRequired
	}

	openProfile(e) {
		this.props.renderProfile(this.props.response);
	}

	render() {
		const { challengeKey, itemKey, teamId, checked, checkedBy, responseValid, retry } = this.props.response;
		const { loading, getTeam } = this.props.QueryGetTeam;
		let iconName = 'upload';
		let className = 'new';
		let checkedByName = 'Not checked';

		if (checked) {
			checkedByName = `Checked by ${checkedBy}`;
			if (responseValid) {
				iconName = 'tick-circle';
				className = 'valid';
			}
			else {
				className = 'error';
				if (retry) iconName = 'error';
				else iconName = 'delete'
			}
		}

		return (
			<div className={`pt-card pt-elevation-0 pt-interactive response-card ${className}`} onClick={this.openProfile}>
				<h5>
					<span className={`pt-icon pt-icon-${iconName}`}></span>&nbsp;
					<b>{`[${challengeKey}]`}</b> {itemKey}
				</h5>
				<div className='pt-text-muted'>
					{`${getTeam?`From ${getTeam.teamName}`:'Getting team name...'}`}<br/>
					{`${checkedByName}`}
				</div>
			</div>
		);
	}}


export default ResponseCard;
