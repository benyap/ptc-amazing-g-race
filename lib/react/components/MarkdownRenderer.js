import React from 'react';
import PropTypes from 'prop-types';
import Marked from 'marked';

import '../scss/components/_markdownRenderer.scss';


Marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

// Custom YouTube link rendering
const renderer = new Marked.Renderer();
renderer.link = function(href, title, text) {
	const youtubeRegex = /^(http|https)(:\/\/www.youtube.com\/watch\?v=)(.{11})(.*)$/;
	const result = youtubeRegex.exec(href);
	if (result) {
		return `<iframe class='youtube' src='https://www.youtube.com/embed/${result[3]}?rel=0' frameborder='0' allowfullscreen></iframe>`;
	}
	else {
		const internalLinkRegex = /^(#[a-z0-9-]*)$/;
		const result = internalLinkRegex.exec(href);
		if (result) {
			return `<a href=${href} alt=${title}>${text}</a>`;
		}
		else {
			return `<a href=${href} alt=${title} target='_blank'>${text}</a>`;
		}
	}
}


class MarkdownRenderer extends React.Component {
	static propTypes = {
		src: PropTypes.string,
		className: PropTypes.string
	}

	render() {
		const { src, className } = this.props;

		if (src) {
			return (
				<div className={'markdown output ' + (className?className:'')} dangerouslySetInnerHTML={{__html: Marked(src, {renderer})}}/>
			);
		}
		else return null;
	}
}


export default MarkdownRenderer;
