import React from 'react';
import NotFound from './NotFound';
import Loading from './Loading';


// ===============================
//  Wrap page components with ids
// ===============================

export const NotFoundPage = (...props) => (
	<NotFound {...props} pageId={'notfound'}/>
);

export const LoadingPage = (...props) => (
	<Loading {...props} pageId={'loading'}/>
);
