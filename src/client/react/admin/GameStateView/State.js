import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';


@autobind
class State extends React.Component {
	static propTypes = {
		state: PropTypes.shape({
			name: PropTypes.string.isRequired,
			key: PropTypes.string.isRequired,
			settings: PropTypes.shape({
				set: PropTypes.arrayOf(PropTypes.shape({
					key: PropTypes.string.isRequired,
					value: PropTypes.string.isRequired
				}))
			}).isRequired
		}).isRequired,
		currentState: PropTypes.string.isRequired
	}

	render() {
		let { name, key, settings } = this.props.state;
		let modifier = '';
		if (this.props.currentState===this.props.state.key) modifier = 'current-state';

		return (
			<div class={'pt-card pt-elevation-1 pt-interactive ' + modifier}>
				<h5>{name}</h5>
			</div>
		);
	}
}


export default State;