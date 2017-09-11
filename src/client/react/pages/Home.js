import React from 'react';
import Page from './Page';
import { gql, graphql } from 'react-apollo';

import Authenticated from '../../../../lib/react/components/utility/Authenticated';
import AuthenticationStatus from '../../../../lib/react/components/utility/AuthenticationStatus';
import AuthenticationDispatcher from '../../../../lib/react/components/testUtilities/AuthenticationDispatcher';


const QueryRaceState = gql`
query GetPublicSetting($key:String!){
  getPublicSetting(key:$key) {
    value
  }
}`

const QueryRaceStateOptions = {
	name: 'QueryRaceState',
	options: {
		variables: { key: 'race_state' }
	}
}


@graphql(QueryRaceState, QueryRaceStateOptions)
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
