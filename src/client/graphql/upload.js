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


const _getObject = (params) => {
	return gql`
	query GetObject($key:String!){  
		_getObject(key:$key){ ${params} }
	}`;
}


// =============
//	 MUTATIONS
// =============

const _deleteObject = (params) => {
	return gql`
	mutation DeleteObject($collection:String!,$key:String!){
		_deleteObject(collection:$collection,key:$key){ ${params} }
	}`;
}


export {
	_listObjectsFromS3,
	_getObject,
	_deleteObject
};
