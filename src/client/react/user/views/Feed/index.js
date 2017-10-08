import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';


@autobind
class Feed extends React.Component {

	render() {
		return (
			<main id='feed' className='dashboard'>
				<div className='content'>
					<h2>Newsfeed</h2>

				</div>
			</main>
		);
	}
}


export default Feed;
