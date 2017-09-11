import React from 'react';
import Home from './Home';
import NotFound from './NotFound';


// ===============================
//  Wrap page components with ids
// ===============================

export const HomePage = (...props) => (
	<Home {...props} pageId={'home'}/>
);

export const NotFoundPage = (...props) => (
	<NotFound {...props} pageId={'notfound'}/>
);
