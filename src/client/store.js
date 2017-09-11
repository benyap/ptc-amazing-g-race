import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';

import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localforage';
import { saveWhitelist, loadWhitelist } from './actions/whitelist';

import reducers from './reducers';
import { DEBUG } from './global.config';


// ======================
//  REDUX-STORAGE CONFIG
// ======================

const reducersWithStorage = storage.reducer(reducers);
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

if (DEBUG) {
	// Add logger and redux dev tools in debug mode
	middleware = applyMiddleware(loadStorageMiddleware, promise(), thunk, createLogger(), saveStorageMiddleware);
	store = createStore(reducersWithStorage, composeWithDevTools(middleware));
}
else {
	middleware = applyMiddleware(loadStorageMiddleware, promise(), thunk, saveStorageMiddleware);
	store = createStore(reducersWithStorage, middleware);
}

// Load store
load(store);
	// .then((newState) => console.log('Loaded state:', newState))
	// .catch(() => console.log('Failed to load previous state'));


export default store;
