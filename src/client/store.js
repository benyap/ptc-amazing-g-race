import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localforage';
import { saveWhitelist, loadWhitelist } from './actions/whitelist';
import API from './API';
import reducers from './reducers';


// ======================
//  Create Apollo Client
// ======================

const networkInterface = createNetworkInterface({
	uri: API.api
});

const apolloClient = new ApolloClient({
	networkInterface
});


// ======================
//  REDUX-STORAGE CONFIG
// ======================

const reducersWithStorage = storage.reducer(reducers(apolloClient));
const engine = createEngine('ptc-amazing-g-race');

// Save storage middleware
const saveStorageMiddleware = storage.createMiddleware(engine, [], saveWhitelist);

// Load storage middleware
const load = storage.createLoader(engine);
const loadStorageMiddleware = store => next => async action => {
	let found = false;
	loadWhitelist.forEach((item) => {
		if (!found && item === action.type) found = true;
	});
	if (found) await load(store);
	next(action);
};


// ===========================
//  STORE & MIDDLEWARE CONFIG
// ===========================

let middleware;
let store;

if (process.env.NODE_ENV === 'production') {
	middleware = applyMiddleware(apolloClient.middleware(), loadStorageMiddleware, promise(), thunk, saveStorageMiddleware);
	store = createStore(reducersWithStorage, middleware);
}
else {
		// Add logger and redux dev tools when not in production
		middleware = applyMiddleware(apolloClient.middleware(), loadStorageMiddleware, promise(), thunk, createLogger(), saveStorageMiddleware);
		store = createStore(reducersWithStorage, composeWithDevTools(middleware));	
}


// ========================================
//  ADD AUTHORIZATION TO NETWORK INTERFACE
// ========================================

networkInterface.use([{
	applyMiddleware(req, next) {
		if (!req.options.headers) {
			req.options.headers = {};
		}
		req.options.headers['authorization'] = 'Bearer ' + store.getState().auth.tokens.access;
		next();
	}
}]);


export default store;
export { apolloClient };
