import 'babel-polyfill';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import ReactDOM from 'react-dom';
import AdminRoot from './react/AdminRoot';
import store, { apolloClient } from './store';


const root = (
	<ApolloProvider store={store} client={apolloClient}>
		<AdminRoot/>
	</ApolloProvider>
);

ReactDOM.render(root, document.getElementById('root'));
