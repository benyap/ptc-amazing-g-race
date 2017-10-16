import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { Popover, Button, Menu, Position, Intent } from '@blueprintjs/core';


@autobind
class Filter extends React.Component {
	static propTypes = {
		value: PropTypes.string.isRequired,
		onChange: PropTypes.func.isRequired
	}

	render() {
		return (
			<div className='pt-control-group filter'>
				<div className='pt-input-group'>
					<span className='pt-icon pt-icon-filter'></span>
					<div className='pt-select'>
						<select onChange={this.props.onChange} value={this.props.value}>
							<option value='all'>Filter...</option>
							<option value='all'>All users</option>
							<option value='admins'>Admins</option>
							<option value='players'>Players</option>
							<option value='paid'>Paid</option>
							<option value='notpaid'>Not paid</option>
							<option value='noteam'>No team</option>
							<option value='dietaryrequirements'>Dietary</option>
						</select>
					</div>
				</div>
			</div>
		);
	}
}


export default Filter;
