import React from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import '../../scss/components/_image-uploader.scss';


@autobind
class ImageUploader extends React.Component {
	static propTypes = {
		filetype: PropTypes.string,
		preview: PropTypes.bool,
		onChange: PropTypes.func
	}

	static defaultProps = {
		filetype: 'image',
		showFilesize: false,
		preview: false,
	}
	
	state = {
		name: `Upload ${this.props.filetype}`,
		filesize: '',
		imgsrc: null,
		previewStyle: { padding: '1rem' }
	}

	onChange({target}) {
		if (target.files[0]) {
			this.setState({
				name: this.props.showFilesize ? `File size: ${+(target.files[0].size/(1000*1000)).toFixed(3)}mb` : target.files[0].name
			});

			if (this.props.preview) {
				// Update preview
				let reader = new FileReader();
				reader.readAsDataURL(target.files[0]);
				reader.onloadend = function(e) {
					this.setState({ 
						imgsrc: [reader.result],
						previewStyle: { padding: '0.3rem' }
					});
				}.bind(this);
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
		return (
			<div className='image-uploader'>
				<label className='pt-file-upload'>
					<input type='file' accept='image/*' onChange={this.onChange}/>
					<span class='pt-file-upload-input'>{this.state.name}</span>
				</label>
				{ this.props.preview ? 
					<div className='image-uploader-preview' style={this.state.previewStyle}>
						<img src={this.state.imgsrc} alt='No preview available'/>
					</div>
					: null
				}
			</div>
			);
	}
}


export default ImageUploader;
