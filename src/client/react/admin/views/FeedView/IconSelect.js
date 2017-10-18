import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import ICONS from './Icons';


@autobind
class IconSelect extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		disabled: PropTypes.bool.isRequired,
		value: PropTypes.string.isRequired
	}

	render() {
		return (
			<label className='pt-label'>
				Icon: 
				<div className='pt-select'>
					<select onChange={this.props.onChange} value={this.props.value} disabled={this.props.disabled}>
						<option value=''>NONE</option>
						{
							ICONS.map((iconObject) => {
								return (
									<option key={iconObject[0]} value={iconObject[0]}>
										{iconObject[1]}
									</option>
								);
							})
						}
					</select>
				</div>
			</label>
		);
	}
}


export default IconSelect;
