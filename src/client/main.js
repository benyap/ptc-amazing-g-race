import 'babel-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
// import Root from './react/Root';
// import store from './store';

let root = (
	// <Provider store={store}>
	// 	<Root/>
	// </Provider>
	<div>Hello World!</div>
);

ReactDOM.render(root, document.getElementById('root'));
