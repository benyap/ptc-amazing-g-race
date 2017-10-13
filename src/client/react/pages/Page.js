import React from 'react';
import PropTypes from 'prop-types';


/**
 * This component is a template for a Page component which renders the default navbar.
 * Renders the page in a `div` with `role='page'` and `id={pageId}`.
 * All child components should implement the `renderPage` method to render content elements,
 * instead directly implementing the `render` method.
 */
class Page extends React.Component {
	renderPage() {
		console.warn('Page should implement renderPage method (pageId: ' + this.props.pageId + ')');
		return (
			<div role='content' className='content'>
				<main>
					<h1>Empty Page</h1>
					<p>Page ID: <code>{this.props.pageId}</code></p>
				</main>
			</div>
		);
	}

	render() {
		return (
			<div role='page' id={this.props.pageId}>
				{this.renderPage()}
			</div>
		);
	}
}


export default Page;
