import 'babel-polyfill';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import Root from './react/Root';
import store, { apolloClient } from './store';


let root = (
	<ApolloProvider store={store} client={apolloClient}>
		<Root/>
	</ApolloProvider>
);

ReactDOM.render(root, document.getElementById('root'));
