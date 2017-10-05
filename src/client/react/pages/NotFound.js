import React from 'react';
import Page from './Page';


class NotFound extends Page {
	renderPage(route) {
		return (
			<main id='not-found' style={{paddingTop: '20vh'}}>
				<div className='pt-non-ideal-state not-found'>
					<div className='pt-non-ideal-state-visual pt-non-ideal-state-icon'>
						<span className='pt-icon pt-icon-error'></span>
					</div>
					<h4 className='pt-non-ideal-state-title'>Page Not Found</h4>
					<div className='pt-non-ideal-state-description'>
						The page at <code>{route.location.pathname}</code> could not be found.
						<br/>
						Please ensure the URL is correct.
					</div>
				</div>
			</main>
		);
	}
}


export default NotFound;
