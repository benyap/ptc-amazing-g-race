import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Link } from 'react-router-dom';
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

@graphql(getTeam('_id teamName'), QueryGetTeamOptions)
@autobind
class ResponseCard extends React.Component {
	static propTypes = {
		response: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			challengeKey: PropTypes.string.isRequired,
			itemKey: PropTypes.string.isRequired,
			teamId: PropTypes.string.isRequired,
			checked: PropTypes.bool,
			checkedBy: PropTypes.string,
			responseValid: PropTypes.bool,
			retry: PropTypes.bool
		})
	}

	render() {
		const { challengeKey, itemKey, checked, checkedBy, responseValid, retry } = this.props.response;
		const { getTeam } = this.props.QueryGetTeam;
		let iconName = 'upload';
		let className = 'new';
		let checkedByName = 'Not checked';

		if (checked) {
			checkedByName = `Checked by ${checkedBy}`;
			if (responseValid) {
				className = 'valid';
				if (retry) iconName = 'tick';
				else iconName = 'tick-circle';
			}
			else {
				className = 'error';
				if (retry) iconName = 'cross';
				else iconName = 'delete'
			}
		}

		return (
			<Link to={`/admin/dashboard/responses/${this.props.response._id}`} style={{textDecoration:'none'}}>
				<div className={`pt-card pt-elevation-0 pt-interactive response-card ${className}`}>
					<h5>
						<span className={`pt-icon pt-icon-${iconName}`}></span>&nbsp;
						<b>{`[${challengeKey}]`}</b> {itemKey}
					</h5>
					<div className='pt-text-muted'>
						{`${getTeam?`From ${getTeam.teamName}`:'Getting team name...'}`}<br/>
						{`${checkedByName}`}
					</div>
				</div>
			</Link>
		);
	}}


export default ResponseCard;
