import React from 'react';

import '../../scss/_hero.scss';


class Home extends React.Component {
	render() {
		return (
			<main className='hero' style={{height: '200%', width: '100%'}}>
				<div className='title text'>
					The Amazing G<span className='em'>Race</span>
				</div>
				<div className='date text'>
					7th December, 2017
				</div>
				<div className='registration text'>
					Registration opens
					<br/>
					<span className='em'>Monday 18th September, 2017</span>
				</div>
			</main>
		);
	}
}


export default Home;
