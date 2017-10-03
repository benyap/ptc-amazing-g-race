import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Button, Intent, Spinner } from '@blueprintjs/core';

import '../../scss/admin/_challenge-profile.scss';


@autobind
class ChallengeProfile extends React.Component {
	static propTypes = {
		challenge: PropTypes.shape({
			key: PropTypes.string.isRequired,
			group: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			public: PropTypes.bool.isRequired,
			locked: PropTypes.bool.isRequired
		}),
		closeProfile: PropTypes.func.isRequired
	}

	closeProfile() {
		this.props.closeProfile();
	}

	render() {
		const { key, group, title, locked } = this.props.challenge;

		let icon = 'pt-icon-lock ';
		
		if (this.props.challenge.public) {
			icon = 'pt-icon-unlock ';
		}

		if (locked) {
			icon += 'pt-intent-danger';
		}

		return (
			<div className='pt-card challenge-profile'>
				<Button className='pt-minimal' intent={Intent.DANGER} text='Close' onClick={this.closeProfile} style={{float:'right'}}/>
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


export default ChallengeProfile;
