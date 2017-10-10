import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Spinner, Button, Intent } from '@blueprintjs/core';


@autobind
class ChallengeItem extends React.Component {
	static propTypes = {
		item: PropTypes.shape({
			key: PropTypes.string.isRequired,
			type: PropTypes.string.isRequired,
			order: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
			description: PropTypes.string.isRequired
		}).isRequired
	}

	render() {
		return (
			<div>
			</div>
		);
	}
}


export default ChallengeItem;
