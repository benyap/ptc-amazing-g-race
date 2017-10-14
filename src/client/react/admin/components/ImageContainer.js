import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { NonIdealState } from '@blueprintjs/core';

import '../scss/components/_image-container.scss';


const defaultImgContainerStyle = {
	textAlign: 'center',
	background: 'rgba(0, 0, 0, 0.8)',
	color: 'white',
	padding: '0.5rem',
	borderRadius: '0.3rem',
	marginBottom: '0.5rem'
}

const defaultImgStyle = {
	maxWidth: '100%',
	maxHeight: '70h'
}

@autobind
class ImageContainer extends React.Component {
	static propTypes = {
		style: PropTypes.object,
		imgStyle: PropTypes.object,
		src: PropTypes.string.isRequired,
		alt: PropTypes.string,
		onError: PropTypes.func
	}

	static defaultProps = {
		style: defaultImgContainerStyle,
		imgStyle: defaultImgStyle
	}

	state = {
		error: false
	}

	onImageError() {
		if (this.props.onError) {
			this.setState({ error: true });
			this.props.onError();
		}
		else {
			this.setState({ error: true });
		}
	}

	render() {
		return (
			<div style={this.props.style}>
				{ this.state.error ? 
					<div className='image-error' style={{margin:'2rem'}}>
						<NonIdealState title='Failed to retrieve image.' visual='error'/>
					</div>
					:
					<img src={this.props.src} alt={this.props.alt} style={this.props.imgStyle} onError={this.onImageError}/>
				}
			</div>
		);
	}
}


export default ImageContainer;
