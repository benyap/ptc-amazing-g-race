import React from 'react';
import Page from './Page';

import '../scss/pages/_not-found.scss';


class NotFound extends Page {
	renderPage(route) {
		return (
			<main>
				<div class='pt-non-ideal-state not-found'>
					<div class='pt-non-ideal-state-visual pt-non-ideal-state-icon'>
						<span class='pt-icon pt-icon-error'></span>
					</div>
					<h4 class='pt-non-ideal-state-title'>Page Not Found</h4>
					<div class='pt-non-ideal-state-description'>
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
