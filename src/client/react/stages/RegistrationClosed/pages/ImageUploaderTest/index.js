import React from 'react';
import { autobind } from 'core-decorators';
import { Button } from '@blueprintjs/core';
import { compose, graphql } from 'react-apollo';
import { getProtectedSetting } from '../../../../../graphql/setting';
import ImageUploader from '../../../../../../../lib/react/components/ImageUploader';
import S3 from 'aws-sdk/clients/s3'


const QueryAWSKeyOptions = {
	name: 'QueryAWSKey',
	options: { variables: { key: 'aws_user_id' } }
}

const QueryAWSSecretOptions = {
	name: 'QueryAWSSecret',
	options: { variables: { key: 'aws_user_secret' } }
}

const QueryAWSRegionOptions = {
	name: 'QueryAWSRegion',
	options: { variables: { key: 'aws_region' } }
}

@compose(
	graphql(getProtectedSetting('value'), QueryAWSKeyOptions),
	graphql(getProtectedSetting('value'), QueryAWSSecretOptions),
	graphql(getProtectedSetting('value'), QueryAWSRegionOptions)
)
@autobind
class ImageUploaderTest extends React.Component {
	state = {
		image: null,
		uploading: false
	}

	componentDidUpdate() {
		let unavailable = this.props.QueryAWSKey.loading || this.props.QueryAWSSecret.loading || this.props.QueryAWSRegion.loading;
		if (!this.s3 && !unavailable) {
			this.s3 = new S3({
				accessKeyId: this.props.QueryAWSKey.getProtectedSetting.value,
				secretAccessKey: this.props.QueryAWSSecret.getProtectedSetting.value,
				region: this.props.QueryAWSRegion.getProtectedSetting.value
			});
		}
	}

	setImage(image) {
		this.setState({image: image});
	}

	uploadFile() {
		if (this.state.image) {
			this.setState({uploading: true});

			const params = {
				Body: this.state.image, 
				Bucket: 'powertochange-amazing-g-race/uploads/images', 
				Key: this.state.image.name
			}

			this.s3.putObject(params, function(err, data) {
				this.setState({uploading: false});

				// TODO: Handle log to deal with uploaded image here

			}.bind(this));
		}
	}

	render() {
		let unavailable = this.props.QueryAWSKey.loading || this.props.QueryAWSSecret.loading || this.props.QueryAWSRegion.loading;
		return (
			<main id='image-uploader-test' className='dashboard'>
				<div className='content'>
					<h2>Image uploader test</h2>
					<ImageUploader preview showFilesize compress onChange={this.setImage} disabled={this.state.uploading}/>
					<Button className='pt-fill pt-intent-primary' text={unavailable?'Loading...':'Upload'} onClick={this.uploadFile} 
						loading={this.state.uploading} disabled={unavailable||!this.state.image}/>
				</div>
			</main>
		);
	}
}


export default ImageUploaderTest;
