import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '@blueprintjs/core';

import '../../../scss/dashboard/_team-panel.scss';


class TeamPanel extends React.Component {
	static propTypes = {
		loading: PropTypes.bool.isRequired,
		team: PropTypes.shape({
			teamName: PropTypes.string.isRequired,
			points: PropTypes.number.isRequired,
			memberCount: PropTypes.number.isRequired,
			members: PropTypes.array,
		})
	}

	render() {
		if (this.props.team) {
			const { points, members } = this.props.team;
			return (
				<div id='dashboard-team-panel'>
					<div className='pt-callout'>
						<div className='points'>
							Points: {points}
						</div>
					</div>
				</div>
			);
		}
		else if (this.props.loading) {
			return (
				<div className='pt-callout'>
					Getting the latest stats...
				</div>
			);
		}
		else {
			return (
				<div className='pt-callout pt-intent-danger pt-icon-error'>
					You have not been allocated into a team.
				</div>
			);
		}
	}
}


export default TeamPanel;
