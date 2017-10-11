import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Link } from 'react-router-dom';
import { Spinner, Button, Intent, Icon, Collapse } from '@blueprintjs/core';
import MarkdownRenderer from '../../../../../../lib/react/components/MarkdownRenderer';


@autobind
class ChallengeCard extends React.Component {
	static propTypes = {
		challenge: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			key: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			locked: PropTypes.bool.isRequired,
			public: PropTypes.bool.isRequired,
			teams: PropTypes.array.isRequired,
		}).isRequired
	}

	render() {
		const { challenge } = this.props;
		return (
			<div style={{marginBottom:'0.5rem'}}>
				<div className='pt-card pt-elevation-0 pt-interactive'>
					<Link to={`/dashboard/challenges/${challenge._id}`}>
						<h5 style={{color:'white',marginBottom:'0.5rem'}}>
							{challenge.title}
						</h5>
						<div className='pt-text-muted'>
							{ !challenge.public ? 
								(challenge.teams.length === 1 ? 
									`Only your team has unlocked this challenge!` :
									`${challenge.teams.length} teams have unlocked this challenge!`)
								: `All teams have access to this challenge!`
							}
						</div>
					</Link>
				</div>
			</div>
			
		);
	}
}


export default ChallengeCard;
