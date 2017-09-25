import database from '../../db';


// Create article 
const addArticle = function(root, params, ctx, options) {
	return database.article.addArticle(ctx.user, params.title, params.category, params.src);
}

// Get articles from a category
const getArticles = function(root, params, ctx, options) {
	return database.article.getArticles(ctx.user, params.category);
}

// Get an article from a category
const getArticle = function(root, params, ctx, options) {
	return database.article.getArticle(ctx.user, params.category, params.articleId);
}

// Remove an article
const removeArticle = function(root, params, ctx, options) {
	return database.article.removeArticle(ctx.user, params.category, params.articleId);
}

// Set the title of an article
const setArticleTitle = function(root, params, ctx, options) {
	return database.article.setArticleTitle(ctx.user, params.category, params.articleId, params.newTitle);
}

// Edit an article
const editArticle = function(root, params, ctx, options) {
	return database.article.editArticle(ctx.user, params.category, params.articleId, params.content);
}


export default {
	addArticle,
	getArticles,
	getArticle,
	removeArticle,
	setArticleTitle,
	editArticle
};
