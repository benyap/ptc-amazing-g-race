import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';

import '../../scss/components/_markdownInput.scss';


@autobind
class MarkdownInput extends React.Component {
	static propTypes = {
		onChange: PropTypes.func,
		readOnly: PropTypes.bool,
		src: PropTypes.string
	}

	render() {
		return (
			<div className='markdown input'>
				<textarea name='editor' id='editor' cols='60' rows='10' 
					onChange={this.props.onChange} readOnly={this.props.readOnly}
					value={this.props.src ? this.props.src : ''}
					placeholder='Type content here...'>
				</textarea>
			</div>
		);
	}
}


export default MarkdownInput;
