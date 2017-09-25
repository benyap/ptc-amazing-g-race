import database from '../../db';


// Create article 
const createArticle = function(root, params, ctx, options) {
	return database.article.createArticle(ctx.user, params.title, params.category, params.src);
}

// Get articles from a category
const getArticles = function(root, params, ctx, options) {
	return database.article.getArticles(ctx.user, params.category);
}


export default {
	createArticle,
	getArticles
};
