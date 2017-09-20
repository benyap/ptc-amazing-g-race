import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';


@autobind
class TeamCard extends React.Component {
	static propTypes = {
		team: PropTypes.shape({
			_id: PropTypes.string,
			teamName: PropTypes.string,
			members: PropTypes.array,
			memberCount: PropTypes.number
		}).isRequired
	};

	render() {
		let { teamName, memberCount } = this.props.team;

		return (
			<div className='pt-card pt-elevation-0 pt-interactive user-card'>
				<h5>
					{`${teamName}`}
				</h5>
				<p className='pt-text-muted'>
					This team has {memberCount} members.
				</p>
			</div>
		);
	}
}


export default TeamCard;
