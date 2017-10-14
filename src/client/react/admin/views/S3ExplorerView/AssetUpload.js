import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Intent, Dialog } from '@blueprintjs/core';
import API from '../../../../API';
import FormInput from '../../../../../../lib/react/components/forms/FormInput';
import ImageUploader from '../../../../../../lib/react/components/ImageUploader';
import { uploadObject } from '../../../../graphql/upload';


const mapStateToProps = (state) => {
	return { access: state.auth.tokens.access };
}

@connect(mapStateToProps)
@autobind
class AssetUpload extends React.Component {
	static propTypes = {
		refetchAssets: PropTypes.func.isRequired
	}

	state = {
		showAssetUpload: false,
		assetUploadLoading: false,
		assetUploadError: null,
		assetKeyError: false,
		assetKey: '',
		asset: null
	}

	toggleShowAssetUpload() {
		this.setState((prevState) => {
			return { 
				showAssetUpload: !prevState.showAssetUpload, 
				assetUploadError: null,
				assetKeyError: false,
				assetKey: '',
				asset: null
			};
		});
	}

	onAssetChange(asset) {
		this.setState({ asset });
	}

	onAssetKeyChange(e) {
		this.setState({assetKey: e.target.value});
	}

	async uploadFile() {
		if (this.state.assetKey.length < 1) {
			this.setState({ assetUploadError: 'An asset key is required.', assetKeyError: true });
			return;
		}

		// Validate asset key
		const keyRegex = /^(([a-zA-Z0-9-_()\[\].]+)(\/*)([a-zA-Z0-9-_()\[\].]+)|([a-zA-Z0-9-_()\[\].]+))+$/;
		const result = keyRegex.exec(this.state.assetKey);
		
		if (!result) {
			this.setState({ assetUploadError: 'Invalid asset key name. Please use another key.', assetKeyError: true });
			return;
		}
		
		this.setState({ assetUploadLoading: true, assetUploadError: null, assetKeyError: false });

		const mutation =
		`mutation UploadObject($collection:String!,$key:String!,$name:String!){
			_uploadObject(collection:$collection,key:$key,name:$name){ ok }
		}`;

		const variables = { 
			collection: 'assets', 
			key: this.state.assetKey,
			name: this.state.asset.name
		};

		const formData = new FormData();
		formData.append('variables', JSON.stringify(variables));
		formData.append('file', this.state.asset);
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
				this.setState({ assetUploadLoading: false, assetUploadError: errors[0].message });
			}
			else if (_uploadObject.ok) {
				await this.props.refetchAssets();
				this.setState({ assetUploadLoading: false, showAssetUpload: false });
			}
			else {
				this.setState({ assetUploadLoading: false, assetUploadError: _uploadObject.failureMessage });
			}
		}
		catch (err) {
			this.setState({ assetUploadLoading: false, assetUploadError: err.toString() });
		}
	}

	render() {
		return (
			<div style={{marginBottom:'0.5rem'}}>
				<Button text='Upload a public asset' className='pt-fill pt-minimal pt-intent-primary' iconName='cloud-upload' onClick={this.toggleShowAssetUpload}/>
				<Dialog title='Upload a public asset' isOpen={this.state.showAssetUpload} onClose={this.toggleShowAssetUpload}>
					<div className='pt-dialog-body'>

						<div className='pt-callout pt-intent-warning pt-icon-warning-sign' style={{marginBottom:'0.5rem'}}>
							<h5>Warning</h5>
							<ul style={{margin:'0',padding:'0 0 0 1rem'}}>
								<li>
									Please note that all uploads will be publicly available to anyone with the link.
								</li>
								<li>
									Uploading an asset with the same <b>asset key</b> as another file will override that file.
								</li>
							</ul>
						</div>

						<FormInput id='assetKey' onChange={this.onAssetKeyChange} value={this.state.assetKey} disabled={this.state.assetUploadLoading}
							intent={this.state.assetKeyError?Intent.DANGER:Intent.NONE}
							label='Asset key' helperText={`Provide a unique name for this asset. Use a '/' to indicate a folder path. `}/>

						<ImageUploader onChange={this.onAssetChange} disabled={this.state.assetUploadLoading} preview compress showFilesize/>

						{ this.state.assetUploadError ? 
							<div className='pt-callout pt-intent-danger pt-icon-error' style={{marginBottom:'1rem'}}>
								{ this.state.assetUploadError }
							</div> : null
						}
					</div>
					<div className='pt-dialog-footer'>
						<div className='pt-dialog-footer-actions'>
							<Button text='Cancel' onClick={this.toggleShowAssetUpload} className='pt-minimal' disabled={this.state.assetUploadLoading}/>
							<Button text='Upload' iconName='cloud-upload' onClick={this.uploadFile} className='pt-intent-primary' 
								loading={this.state.assetUploadLoading} disabled={!this.state.asset}/>
						</div>
					</div>
				</Dialog>
			</div>
		);
	}
}


export default AssetUpload;
