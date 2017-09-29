import { gql } from 'react-apollo';

// ===========
//	 QUERIES
// ===========

const getSettings = (params) => {
	return gql`
	query GetSettings($skip:Int,$limit:Int){
		getSettings(skip:$skip,limit:$limit){ ${params} }
	}`;
}

const getPublicSetting = (params) => {
	return gql`
	query GetPublicSetting($key:String!){
		getPublicSetting(key:$key) { ${params} }
	}`;
}

const getProtectedSetting = (params) => {
	return gql`
	query GetProtectedSetting($key:String!){
		getProtectedSetting(key:$key) { ${params} }
	}`;
}

const getSetting = (params) => {
	return gql`
	query GetSetting($key:String!){
		getSetting(key:$key) { ${params} }
	}`;
}


// ===========
//	MUTATIONS
// ===========

const setSetting = (params) => {
	return gql`
	mutation SetSetting($key:String!,$value:String!){
		setSetting(key:$key,value:$value) { ${params} }
	}`;
}


export {
	getSettings,
	getPublicSetting,
	getProtectedSetting,
	getSetting,
	setSetting
};
