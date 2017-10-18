import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';


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
							<option value='all'>All stories</option>
							<option value='custom'>Custom stories</option>
							<option value='user'>User stories</option>
							<option value='system'>System stories</option>
						</select>
					</div>
				</div>
			</div>
		);
	}
}


export default Filter;
