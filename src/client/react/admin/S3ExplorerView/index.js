import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import { graphql } from 'react-apollo';
import { _listObjectsFromS3 } from '../../../graphql/upload';
import { Spinner } from '@blueprintjs/core';
import S3Explorer from '../../../../../lib/react/components/S3Explorer';
import RefreshBar from '../RefreshBar';
import ViewError from '../ViewError';


const QueryS3ObjectsParams = 'Name Prefix KeyCount Contents{Key LastModified Size} CommonPrefixes{Prefix}';

@graphql(_listObjectsFromS3(QueryS3ObjectsParams), { name: 'QueryS3Objects' })
@autobind
class S3ExplorerView extends React.Component {
	static propTypes = {
		shouldRefresh: PropTypes.bool.isRequired
	}

	navigateTo(Prefix) {
		return (e) => {
			this.props.QueryS3Objects.refetch({ Prefix });
		}
	}

	open(Key) {
		return (e) => {
			console.log(Key);
		}
	}

	render() {
		let content;
		if (this.props.QueryS3Objects.loading) {
			if (this.objects) {
				content = (
					<S3Explorer root={'uploads/'} objects={this.objects} navigateTo={this.navigateTo} open={this.open} loading/>
				);
			}
			else {
				content = (
					<div className='loading-spinner'>
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
						navigateTo={this.navigateTo} open={this.open}/>
				);
			}
		}

		return (
			<div id='dashboard-s3explorer' className='dashboard-tab'>
				<h4>AWS S3 uploads explorer</h4>
				<RefreshBar query={this.props.QueryS3Objects} shouldRefresh={this.props.shouldRefresh}/>
				{content}
			</div>
		);
	}
}


export default S3ExplorerView;
