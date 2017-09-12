import React from 'react';
import Title from '../Title';


class Home extends React.Component {
	render() {
		return (
			<main>
				<Title/>
				<div className='registration text padding'>
					Registration opens
					<br/>
					<span className='em'>Monday 18th September, 2017</span>
				</div>
			</main>
		);
	}
}


export default Home;
