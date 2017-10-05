import React from 'react';

export default ({location}) => {
	return (
		<main id='not-found' className='dashboard'>
			<div className='content' style={{height:'50vh',marginTop:'10vh'}}>
				<div className='pt-non-ideal-state'>
					<div className='pt-non-ideal-state-visual pt-non-ideal-state-icon'>
						<span className='pt-icon pt-icon-error'></span>
					</div>
					<h4 className='pt-non-ideal-state-title'>Nothing here.</h4>
					<div className='pt-non-ideal-state-description'>
						The path at <code>{location.pathname}</code> doesn't have any content.
					</div>
				</div>
			</div>
		</main>
	);
}
