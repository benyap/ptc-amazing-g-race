import React from 'react';
import PropTypes from 'prop-types';


class ComponentContainer extends React.Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired	
	}

	render() {
		return (
			<div className='test-component-container'>
				<h3>{this.props.name}</h3>
				<p>{this.props.description}</p>
				{this.props.children}
			</div>
		);
	}
}


export default ComponentContainer;
