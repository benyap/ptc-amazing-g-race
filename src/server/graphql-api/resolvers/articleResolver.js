import database from '../../db';


// Create article 
const addArticle = function(root, params, ctx, options) {
	return database.article.addArticle(ctx.user, params.title, params.category, params.src);
}

// Get articles from a category
const getArticles = function(root, params, ctx, options) {
	return database.article.getArticles(ctx.user, params.category);
}


export default {
	addArticle,
	getArticles
};
