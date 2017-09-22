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
			memberCount: PropTypes.number,
			points: PropTypes.number
		}).isRequired,
		renderProfile: PropTypes.func.isRequired
	};

	openProfile() {
		this.props.renderProfile(this.props.team);
	}

	render() {
		let { teamName, memberCount, points } = this.props.team;

		return (
			<div className='pt-card pt-elevation-0 pt-interactive user-card' onClick={this.openProfile}>
				<h5>
					{`${teamName}`}
				</h5>
				<p className='pt-text-muted'>
					{points} points ({memberCount} members)
				</p>
			</div>
		);
	}
}


export default TeamCard;
