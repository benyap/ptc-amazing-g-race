import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';


@autobind
class Challenges extends React.Component {

	render() {
		return (
			<main id='challenges' className='dashboard'>
				<div className='content'>
					<h2>Challenges</h2>
					
				</div>
			</main>
		);
	}
}


export default Challenges;
