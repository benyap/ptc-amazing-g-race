import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import autobind from 'core-decorators/es/autobind';
import { connect } from 'react-redux';
import { Button, Dialog } from '@blueprintjs/core';
import API from '../../../../API';
import ImageUploader from '../../../../../../lib/react/components/ImageUploader';


const mapStateToProps = (state, ownProps) => {
	return { 
		access: state.auth.tokens.access,
		teamName: state.userInfo.teamName
	}
}

@connect(mapStateToProps)
@autobind
class ResponseUpload extends React.Component {
	static propTypes = {
		itemKey: PropTypes.string.isRequired,
		challengeKey: PropTypes.string.isRequired,
		teamName: PropTypes.string
	}

	state = {
		showWindow: false,
		image: null,
		uploading: false,
		uploadError: null
	}

	setImage(image) {
		this.setState({image: image});
	}

	async uploadFile() {
		this.setState({ uploading: true, uploadError: null });
		let { challengeKey, itemKey, teamName } = this.props;
		let { image } = this.state;

		const mutation =
		`mutation UploadObject($collection:String!,$key:String!,$name:String!){
			_uploadObject(collection:$collection,key:$key,name:$name){
				ok failureMessage
			}
		}`;
		
		const variables = { 
			collection: `images/${challengeKey}`, 
			key: `[${teamName}] ${itemKey}.${image.type.substring(image.type.indexOf('/')+1)}`,
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

	toggleWindow() {
		if (!this.state.uploading) {
			this.setState((prevState) => {
				return { showWindow: !prevState.showWindow };
			});
		}
	}

	render() {
		return (
			<div style={{marginTop:'0.5rem'}}>
				<Button text='Upload an image' className='pt-fill pt-intent-primary' iconName='cloud-upload' onClick={this.toggleWindow}/>
				<Dialog title='Upload an image' isOpen={this.state.showWindow} onClose={this.toggleWindow}>
					{ this.state.uploadError ? 
						<div className='pt-callout pt-intent-danger pt-icon-error'>
							<h5>Upload error</h5>
							{this.state.uploadError}
						</div>
						:null
					}
					<ImageUploader preview showFilesize compress onChange={this.setImage} disabled={this.state.uploading}/>
					<Button className='pt-fill pt-intent-primary' text='Upload' onClick={this.uploadFile} 
						loading={this.state.uploading} disabled={!this.state.image}/>
				</Dialog>
			</div>
		);
	}
}


export default ResponseUpload;
