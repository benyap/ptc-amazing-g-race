import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import S3Explorer from '../../../../../../lib/react/components/S3Explorer';
import { _listObjectsFromS3 } from '../../../../graphql/upload';
import { getProtectedSetting } from '../../../../graphql/setting';
import LoadingSpinner from '../../../components/LoadingSpinner';
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
		const { loading, error, _listObjectsFromS3 } = this.props.QueryS3Objects;
		let content, help;

		if (loading) {
			if (this.objects) {
				content = (
					<S3Explorer root={'uploads/'} objects={this.objects} navigateTo={this.navigateTo} open={this.openPreview} loading/>
				);
			}
			else {
				content = <LoadingSpinner/>;
			}
		}
		else {
			if (error) {
				content = (
					<ViewError error={error}/>
				);
			}
			else {
				this.objects = _listObjectsFromS3;
				content = (
					<S3Explorer root={'uploads/'} objects={_listObjectsFromS3} 
						navigateTo={this.navigateTo} open={this.openPreview}/>
				);
			}
		}

		if (!error) {
			help = (
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
			);
		}

		return (
			<div id='dashboard-s3explorer' className='dashboard-tab'>
				<h4>AWS S3 uploads explorer</h4>
				<RefreshBar query={this.props.QueryS3Objects} shouldRefresh={this.props.shouldRefresh}/>
				{help}
				{error ? null : <AssetUpload refetchAssets={this.props.QueryS3Objects.refetch}/>}
				{error ? null : <ObjectPreview objectKey={this.state.previewObject} close={this.closePreview} refetchObjects={this.props.QueryS3Objects.refetch}/>}
				{content}
			</div>
		);
	}
}


export default S3ExplorerView;
