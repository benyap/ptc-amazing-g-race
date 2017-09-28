import React from 'react';
import PropTypes from 'prop-types';
import ImageCompressor from '@xkeshi/image-compressor';
import { Spinner } from '@blueprintjs/core';
import { autobind } from 'core-decorators';

import '../../scss/components/_image-uploader.scss';


@autobind
class ImageUploader extends React.Component {
	static propTypes = {
		filetype: PropTypes.string,
		preview: PropTypes.bool,
		onChange: PropTypes.func,
		compress: PropTypes.bool,
		quality: PropTypes.number
	}

	static defaultProps = {
		filetype: 'image',
		showFilesize: false,
		preview: false,
		compress: false,
		quality: 0.8
	}
	
	state = {
		name: `Upload ${this.props.filetype}`,
		filesize: '',
		imgsrc: null,
		processingImage: false,
		previewStyle: { padding: '1rem' }
	}

	_updatePreview(image) {
		this.setState({
			name: this.props.showFilesize ? `File size: ${+(image.size/(1000*1000)).toFixed(3)}mb` : image.name
		});

		if (this.props.preview) {
			// Update preview
			let reader = new FileReader();
			reader.readAsDataURL(image);
			reader.onloadend = function(e) {
				this.setState({ 
					processingImage: false,
					imgsrc: [reader.result],
					previewStyle: { padding: '0.3rem' }
				});
			}.bind(this);
		}
	}

	onChange({target}) {
		if (target.files[0]) {
			this.setState({ processingImage: true });
			if (this.props.compress) {
				new ImageCompressor(target.files[0], {
					quality: this.props.quality,
					maxWidth: 1920,
					maxHeight: 1080,
					success: function(result) {
						this._updatePreview(result);
					}.bind(this)
				});
			}
			else {
				this._updatePreview(target.files[0]);
			}
		} 
		else {
			this.setState({
				name: `Upload ${this.props.filetype}`
			});

			if (this.props.preview) {
				// Update preview
				this.setState({
					imgsrc: null,
					previewStyle: { padding: '1rem' }
				});
			}
		}

		if (this.props.onChange) this.props.onChange(target.files);
	}

	render() {
		let preview;

		if (this.props.preview) {
			let content;
			if (this.state.processingImage) {
				content = <Spinner style={{textAlign: 'center', margin: '2rem'}}/>;
			}
			else if (this.state.imgsrc) {
				content = <img src={this.state.imgsrc} alt='No preview available'/>;
			}
			else {
				content = <div>No preview available</div>
			}

			preview = (
				<div className='image-uploader-preview' style={this.state.previewStyle}>
					{content}
				</div>
			);
		}

		return (
			<div className='image-uploader'>
				<label className='pt-file-upload'>
					<input type='file' accept='image/*' onChange={this.onChange}/>
					<span class='pt-file-upload-input'>{this.state.name}</span>
				</label>
				{preview}
			</div>
			);
	}
}


export default ImageUploader;
