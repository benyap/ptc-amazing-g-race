import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Button } from '@blueprintjs/core';
import API from '../../../../../API';
import ImageUploader from '../../../../../../../lib/react/components/ImageUploader';


const mapStateToProps = (state, ownProps) => {
	return { access: state.auth.tokens.access }
}

@connect(mapStateToProps)
@autobind
class ImageUploaderTest extends React.Component {
	state = {
		image: null,
		uploading: false,
		uploadError: null
	}

	setImage(image) {
		this.setState({image: image});
	}

	async uploadFile() {
		this.setState({ uploading: true, uploadError: null });

		const mutation =
		`mutation UploadObject($collection:String!,$key:String!,$name:String!){
			_uploadObject(collection:$collection,key:$key,name:$name){
				ok failureMessage
			}
		}`;

		const variables = { 
			collection: 'images', 
			key: this.state.image.name,	// TODO: Use a unique key for this image
			name: this.state.image.name
		};
		const formData = new FormData();
		formData.append('variables', JSON.stringify(variables));
		formData.append('file', this.state.image);
		formData.append('query', mutation);

		const config = {
			url: API.api,
			method: 'POST',
			timeout: 60000,
			headers: { 
				'content-type': 'multipart/form-data',
				'Authorization': `Bearer ${this.props.access}`
			},
			data: formData
		}

		try {
			const result = await axios(config);
			const { data: { data: { _uploadObject }, errors } } = result;

			if (errors) {
				this.setState({ uploading: false, uploadError: errors[0].message });
			}
			else if (_uploadObject.ok) {
				this.setState({ uploading: false });
			}
			else {
				this.setState({ uploading: false, uploadError: _uploadObject.failureMessage });
			}
		}
		catch (err) {
			this.setState({ uploading: false, uploadError: err.toString() });
		}
	}

	render() {
		return (
			<main id='image-uploader-test' className='dashboard'>
				<div className='content'>
					<h2>Image uploader test</h2>
					{ this.state.uploadError ? 
						<div className='pt-callout pt-intent-danger pt-icon-error'>
							<h5>Upload error</h5>
							{this.state.uploadError}
						</div>
						:null
					}
					<ImageUploader preview showFilesize compress onChange={this.setImage} disabled={this.state.uploading}/>
					<Button className='pt-fill pt-intent-primary' text={'Upload'} onClick={this.uploadFile} 
						loading={this.state.uploading} disabled={!this.state.image}/>
				</div>
			</main>
		);
	}
}


export default ImageUploaderTest;
