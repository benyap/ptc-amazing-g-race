import React from 'react';
import { autobind } from 'core-decorators';
import ImageUploader from '../../../../../../../lib/react/components/ImageUploader';


@autobind
class ImageUploaderTest extends React.Component {
	render() {
		return (
			<main id='image-uploader-test' className='dashboard'>
				<div className='content'>
					<h2>Image uploader test</h2>
					<ImageUploader preview showFilesize/>
				</div>
			</main>
		);
	}
}


export default ImageUploaderTest;
