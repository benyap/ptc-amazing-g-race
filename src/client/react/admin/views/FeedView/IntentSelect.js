import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';


@autobind
class IntentSelect extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		disabled: PropTypes.bool.isRequired,
		value: PropTypes.string.isRequired
	}

	render() {
		return (
			<label className='pt-label'>
				Intent: 
				<div className='pt-select'>
					<select onChange={this.props.onChange} value={this.props.value} disabled={this.props.disabled}>
						<option value='none'>None (white)</option>
						<option value='primary'>Primary (blue)</option>
						<option value='success'>Success (green)</option>
						<option value='warning'>Warning (yellow)</option>
						<option value='danger'>Danger (red)</option>
					</select>
				</div>
			</label>
		);
	}
}


export default IntentSelect;
