import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'core-decorators/es/autobind';
import DateFormat from 'dateformat';
import { Menu, MenuItem, Spinner } from '@blueprintjs/core';


const style = {
	display: 'flex',
	alignItems: 'center',
	border: 'solid 1px lightgray',
	padding: '0 0.5rem',
	borderRadius: '0.4rem'
};

@autobind
class S3Explorer extends React.Component {
	static propTypes = {
		root: PropTypes.string,
		objects: PropTypes.shape({
			Name: PropTypes.string.isRequired,
			Prefix: PropTypes.string.isRequired,
			KeyCount: PropTypes.number.isRequired,
			Contents: PropTypes.arrayOf(PropTypes.shape({
				Key: PropTypes.string.isRequired,
				LastModified: PropTypes.string.isRequired,
				Size: PropTypes.number.isRequired
			})).isRequired,
			CommonPrefixes: PropTypes.arrayOf(PropTypes.shape({
				Prefix: PropTypes.string.isRequired
			})).isRequired
		}).isRequired,
		navigateTo: PropTypes.func.isRequired,
		loading: PropTypes.bool,
		open: PropTypes.func.isRequired
	};

	static defaultProps = {
		root: ''
	};

	render() {
		const { Name, Prefix, KeyCount, Contents, CommonPrefixes } = this.props.objects;
		const { navigateTo, open } = this.props;

		const escapedRoot = this.props.root.replace('/', '\\/');
		
		// ^(${root})(.*)$
		const currentDirectoryRegex = new RegExp(`^(${escapedRoot})(.*)$`);

		// ^(uploads\/)(([a-zA-Z0-9-_ ]*)\/)*$
		const directoryNameRegex = new RegExp(`^(${escapedRoot})(([a-zA-Z0-9-_ ]*)\/)*$`);

		// ^(uploads\/)(.*\/)*([a-zA-Z0-9-_ ]*\/){1}$
		const previousDirectoryRegex = new RegExp(`^(${escapedRoot})(.*\/)*([a-zA-Z0-9-_ ]*\/){1}$`);

		const folders = CommonPrefixes.map((folder) => {
			const folderPrefix = currentDirectoryRegex.exec(folder.Prefix)[2];
			const folderName = directoryNameRegex.exec(folder.Prefix)[3];

			return (
				<MenuItem iconName='folder-close' key={folder.Prefix}
					text={folderName} 
					onClick={navigateTo(folderPrefix)}
					disabled={this.props.loading}/>
			);
		});
		
		const items = Contents.map((item) => {
			if (item.Key !== Prefix) {
				return (
					<MenuItem iconName='document' key={item.Key} 
						text={item.Key.replace(Prefix, '')}
						onClick={open(item.Key)} disabled={this.props.loading}
						label={`${DateFormat(new Date(item.LastModified), 'mmm dd hh:MM:ss TT')}`}
						/>
				);
			}
		});
		
		let back;
		const backPrefix = previousDirectoryRegex.exec(Prefix);

		if (backPrefix) {
			back = <MenuItem text='..' iconName='chevron-left' onClick={navigateTo(backPrefix[2] ? backPrefix[2] : '')} disabled={this.props.loading}/>
		}

		const cd = currentDirectoryRegex.exec(Prefix)[2];

		return (
			<div>
				<div style={style}>
					<b>Location:&nbsp;&nbsp;</b>
					<ul className='pt-breadcrumbs'>
						<li>root</li>
						{cd.split('/').map((path) => {
							return <li key={path}>{path}</li>
						})}
					</ul>
					{ this.props.loading ? <Spinner className='pt-small'/> : null }
				</div>
				<Menu>
					{back}
					{folders}
					{items}
				</Menu>
			</div>
		);
	}
}


export default S3Explorer;
