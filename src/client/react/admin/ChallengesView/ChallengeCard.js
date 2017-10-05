import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';


@autobind
class ChallengeCard extends React.Component {
	static propTypes = {
		challenge: PropTypes.shape({
			key: PropTypes.string.isRequired,
			group: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			public: PropTypes.bool.isRequired,
			locked: PropTypes.bool.isRequired
		}),
		renderProfile: PropTypes.func.isRequired
	}

	openProfile(e) {
		this.props.renderProfile(this.props.challenge);
	}

	render() {
		const { key, group, title, locked } = this.props.challenge;

		let icon = 'pt-icon-lock ';
		
		if (this.props.challenge.public) {
			icon = 'pt-icon-globe ';
		}

		if (locked) {
			icon += 'pt-intent-danger';
		}

		return (
			<div className='pt-card pt-elevation-0 pt-interactive user-card' onClick={this.openProfile}>
				<h5>
					<span className={`pt-icon ${icon}`}></span>&nbsp;
					{title}
				</h5>
				<p className='pt-text-muted'>
					<b>Group: </b> {group} | <b>Key: </b> {key}
				</p>
			</div>
		);
	}
}


export default ChallengeCard;
