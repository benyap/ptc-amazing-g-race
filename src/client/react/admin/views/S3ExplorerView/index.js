import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { Spinner } from '@blueprintjs/core';
import S3Explorer from '../../../../../../lib/react/components/S3Explorer';
import { _listObjectsFromS3 } from '../../../../graphql/upload';
import { getProtectedSetting } from '../../../../graphql/setting';
import ViewError from '../../components/ViewError';
import RefreshBar from '../../components/RefreshBar';
import AssetUpload from './AssetUpload';
import ObjectPreview from './ObjectPreview';

import '../../scss/views/_s3explorer-view.scss';


const QueryS3ObjectsParams = 'Name Prefix KeyCount Contents{Key LastModified Size} CommonPrefixes{Prefix}';

@graphql(_listObjectsFromS3(QueryS3ObjectsParams), { name: 'QueryS3Objects' })
@autobind
class S3ExplorerView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool.isRequired
	}

	state = {
		previewObject: null
	}

	navigateTo(Prefix) {
		return (e) => {
			this.props.QueryS3Objects.refetch({ Prefix });
		}
	}

	openPreview(Key) {
		return (e) => {
			this.setState({ previewObject: Key });
		}
	}

	closePreview() {
		this.setState({ previewObject: null });
	}

	render() {
		let content;
		if (this.props.QueryS3Objects.loading) {
			if (this.objects) {
				content = (
					<S3Explorer root={'uploads/'} objects={this.objects} navigateTo={this.navigateTo} open={this.openPreview} loading/>
				);
			}
			else {
				content = (
					<div style={{textAlign:'center',margin:'3rem'}}>
						<Spinner/>
					</div>
				);
			}
		}
		else {
			if (this.props.QueryS3Objects.error) {
				content = (
					<ViewError error={this.props.QueryS3Objects.error}/>
				);
			}
			else {
				this.objects = this.props.QueryS3Objects._listObjectsFromS3
				content = (
					<S3Explorer root={'uploads/'} objects={this.props.QueryS3Objects._listObjectsFromS3} 
						navigateTo={this.navigateTo} open={this.openPreview}/>
				);
			}
		}

		return (
			<div id='dashboard-s3explorer' className='dashboard-tab'>
				<h4>AWS S3 uploads explorer</h4>
				<RefreshBar query={this.props.QueryS3Objects} shouldRefresh={this.props.shouldRefresh}/>
				<div className='pt-callout pt-icon-info-sign' style={{marginBottom:'0.5rem'}}>
					<ul style={{margin:'0',padding:'0 0 0 1rem'}}>
						<li>
							User responses are uploaded to the <code>images</code> directory.
						</li>
						<li>
							Public assets are uploaded to the <code>assets</code> directory.
						</li>
						<li>
							To use a custom image in a challenge description, 
							upload a <b>public asset</b> and click on it to get the Markdown markup to insert the image.
						</li>
					</ul>
				</div>
				<AssetUpload refetchAssets={this.props.QueryS3Objects.refetch}/>
				<ObjectPreview objectKey={this.state.previewObject} close={this.closePreview} refetchObjects={this.props.QueryS3Objects.refetch}/> 
				{content}
			</div>
		);
	}
}


export default S3ExplorerView;
