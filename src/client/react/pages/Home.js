import React from 'react';
import Page from './Page';

import Authenticated from '../../../../lib/react/components/utility/Authenticated';
import AuthenticationStatus from '../../../../lib/react/components/utility/AuthenticationStatus';
import AuthenticationDispatcher from '../../../../lib/react/components/testUtilities/AuthenticationDispatcher';

class Home extends Page {
	renderPage() {
		return (
			<main>
				<Authenticated>
					<AuthenticationStatus/>
				</Authenticated>
			</main>
		);
	}
}


export default Home;
