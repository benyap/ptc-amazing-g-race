import { gql } from 'react-apollo';


// ===========
//	 QUERIES
// ===========

const _listObjectsFromS3 = (params) => {
	return gql`
	query ListObjectsFromS3($MaxKeys:Int,$Prefix:String,$StartAfter:String){  
		_listObjectsFromS3(MaxKeys:$MaxKeys,Prefix:$Prefix,StartAfter:$StartAfter){ ${params} }
	}`;
}


export {
	_listObjectsFromS3
};
