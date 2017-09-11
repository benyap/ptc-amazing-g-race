import React from 'react';
import PropTypes from 'prop-types';

import '../../scss/tests/_component-test.scss';


class ComponentTestUnit extends React.Component {
	static propTypes = {
		state: PropTypes.string.isRequired,
		description: PropTypes.string
	}
	
	render() {
		return (
			<div className='test-component-unit pt-card'>
				<h5>{this.props.state}</h5>
				<div className='subtitle'><small className='pt-text-muted'>{this.props.description}</small></div>
				{this.props.children}
			</div>
		);
	}
}


export default ComponentTestUnit;
