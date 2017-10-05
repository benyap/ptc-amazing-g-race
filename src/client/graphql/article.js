import { gql } from 'react-apollo';


// ===========
//	 QUERIES
// ===========

const getArticles = (params) => {
	return gql`
	query GetArticles($category:String!){
		getArticles(category:$category){ ${params} }
	}`;
}

const getArticle = (params) => {
	return gql`
	query GetArticle($category:String!, $articleId:ID!){
		getArticle(category:$category, articleId:$articleId){ ${params} }
	}`;
}


// ===========
//	MUTATIONS
// ===========

const addArticle = (params) => {
	return gql`
	mutation AddArticle($title:String!,$category:String!,$content:String!){
		addArticle(title:$title,category:$category,content:$content){ ${params} }
	}`;
}

const setArticleTitle = (params) => {
	return gql`
	mutation SetArticleTitle($articleId:ID!,$category:String!, $newTitle:String!){
		setArticleTitle(articleId:$articleId, category:$category, newTitle:$newTitle){ ${params} }
	}`;
}

const editArticle = (params) => {
	return gql`
	mutation EditArticle($articleId:ID!,$category:String!, $content:String!){
		editArticle(articleId:$articleId, category:$category, content:$content){ ${params} }
	}`;
}

const removeArticle = (params) => {
	return gql`
	mutation RemoveArticle($articleId:ID!,$category:String!){
		removeArticle(articleId:$articleId, category:$category){ ${params} }
	}`;
}


export {
	getArticles,
	getArticle,
	addArticle,
	setArticleTitle,
	editArticle,
	removeArticle
};
