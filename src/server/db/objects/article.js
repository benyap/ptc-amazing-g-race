import connect from '../connect';
import permission from '../permission';


/**
 * Create a new article
 * @param {*} user 
 * @param {String} title 
 * @param {String} category 
 * @param {String} src 
 */
const addArticle = async function(user, title, category, src) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['admin:create-article']);
	if (authorized !== true) return authorized;

	// Validate paramters
	if (!title) return new Error('Article title is required.');
	if (!category) return new Error('Article category is required.');
	if (!src) return new Error('Article source is required.');
	
	const db = await connect();
	
	// Check that article name is unique
	const articleNameCheck = await db.collection(`article_${category}`).findOne({title});
	if (articleNameCheck) {
		return new Error(`A article with the title \'${title}\' already exists.`);
	}

	// Create the article
	const article = {
		title,
		src,
		category,
		createdBy: user.username,
		created: new Date()
	}

	db.collection(`article_${category}`).insert(article);

	// Log action
	const action = {
		action: 'Create article',
		target: 'article',
		targetCollection: `article_${category}`,
		date: new Date(),
		who: user.username,
		infoJSONString: JSON.stringify({ title, category })
	};

	db.collection('actions').insert(action);

	return article;
}


/**
 * Get the articles from a specified category
 * @param {*} user 
 * @param {String} category 
 */
const getArticles = async function(user, category) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['user:view-articles']);
	if (authorized !== true) return authorized;

	// Validate paramters
	if (!category) return new Error('Article category is required.');
	
	const db = await connect();
	
	// Check that category exists
	const articles = await db.collection(`article_${category}`).find().toArray();
	if (articles.length < 1) {
		return new Error(`The category '${category}' does not exist.`);
	}

	// Return the articles
	return articles;
}


export default {
	addArticle,
	getArticles,
	
}
