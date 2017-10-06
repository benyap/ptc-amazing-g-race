import Mongo from 'mongodb';
import connect from '../connect';
import permission from '../permission';


/**
 * Create a new article
 * @param {*} user 
 * @param {String} title 
 * @param {String} category 
 * @param {String} content 
 */
const addArticle = async function(user, title, category, content) {
	if (!user) return new Error('No user logged in');

	const authorized = await permission.checkPermission(user, ['admin:create-article']);
	if (authorized !== true) return authorized;

	// Validate paramters
	if (!title) return new Error('Article title is required.');
	if (!category) return new Error('Article category is required.');
	if (!content) return new Error('Article content is required.');
	
	const db = await connect();
	
	// Check that article name is unique
	const articleNameCheck = await db.collection(`article_${category}`).findOne({title});
	if (articleNameCheck) {
		return new Error(`A article with the title \'${title}\' already exists.`);
	}

	// Create the article
	const article = {
		title,
		content,
		category,
		createdBy: user.username,
		created: new Date()
	}

	db.collection(`article_${category}`).insert(article);

	// Log action
	const action = {
		action: 'Create article',
		target: title,
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
	
	// Return the articles
	return db.collection(`article_${category}`).find().toArray();
}


/**
 * Get the articles from a specified category
 * @param {*} user 
 * @param {String} category 
 * @param {String} articleId 
 */
const getArticle = async function(user, category, articleId) {
	if (!user) return new Error('No user logged in');
	
	const authorized = await permission.checkPermission(user, ['user:view-articles']);
	if (authorized !== true) return authorized;

	// Validate paramters
	if (!category) return new Error('Article category is required.');
	
	const db = await connect();
	
	// Check that category exists
	const article = await db.collection(`article_${category}`).findOne({_id: Mongo.ObjectID(articleId)});
	if (!article) {
		return new Error(`The article with the id '${articleId}' does not exist.`);
	}

	// Return the articles
	return article;
}


/**
 * Remove an article
 * @param {*} user 
 * @param {String} category 
 * @param {String} articleId 
 */
const removeArticle = async function(user, category, articleId) {
	if (!user) return new Error('No user logged in.');
	
	const authorized = await permission.checkPermission(user, ['admin:remove-article']);
	if (authorized !== true) return authorized;

	return _modifyArticle('remove', user, category, articleId);
}


/**
 * Set an article's title
 * @param {*} user 
 * @param {String} category 
 * @param {String} articleId 
 * @param {String} newTitle 
 */
const setArticleTitle = async function(user, category, articleId, newTitle) {
	if (!user) return new Error('No user logged in.');
	
	const authorized = await permission.checkPermission(user, ['admin:edit-article']);
	if (authorized !== true) return authorized;

	return _modifyArticle('title', user, category, articleId, newTitle);
}


/**
 * Edit an article
 * @param {*} user 
 * @param {String} category 
 * @param {String} articleId 
 * @param {String} content 
 */
const editArticle = async function(user, category, articleId, content) {
	if (!user) return new Error('No user logged in.');
	
	const authorized = await permission.checkPermission(user, ['admin:edit-article']);
	if (authorized !== true) return authorized;

	return _modifyArticle('content', user, category, articleId, content);
}


/**
 * Modify an article using one of the actions:
 *  - 'remove': remove the article
 *  - 'title': modify the title of the article
 *  - 'content': modify the content of the article
 * @param {String} modifyType 
 * @param {*} user 
 * @param {String} category 
 * @param {String} articleId 
 * @param {String} data 
 */
const _modifyArticle = async function(modifyType, user, category, articleId, data) {
	// Validate paramters
	if (!articleId) return new Error('Article articleId is required.');
	if (!category) return new Error('Article category is required.');
	
	const db = await connect();
	
	// Check that article exists
	const articleCheck = await db.collection(`article_${category}`).findOne({_id: Mongo.ObjectID(articleId)});
	if (!articleCheck) {
		return new Error(`The article with the id '${articleId}' does not exist.`);
	}

	let actionName = null;
	let infoJSON = null;

	switch(modifyType) {
		case 'remove': {
			db.collection(`article_${category}`).remove({_id: Mongo.ObjectID(articleId)});
			actionName = 'Remove article';
			infoJSON = { articleId, category };
			break;
		}

		case 'title': {
			db.collection(`article_${category}`).update(
				{_id: Mongo.ObjectID(articleId)}, 
				{
					$set: {
						title: data,
						modified: new Date(),
						modifiedBy: user.username
					},
				}
			);
			actionName = 'Set article title';
			infoJSON = { articleId, newTitle: data };
			break;
		}

		case 'content': {
			db.collection(`article_${category}`).update(
				{_id: Mongo.ObjectID(articleId)}, 
				{
					$set: {
						content: data,
						modified: new Date(),
						modifiedBy: user.username
					}
				}
			);
			actionName = 'Modify article content';
			infoJSON = { articleId, category, content: data };
			break;
		}
	}

	// Log action
	const action = {
		action: actionName,
		target: 'article',
		targetCollection: `article_${category}`,
		date: new Date(),
		who: user.username,
		infoJSONString: JSON.stringify(infoJSON)
	};

	db.collection('actions').insert(action);

	return {
		ok: true,
		action: action
	}
}


export default {
	addArticle,
	getArticles,
	getArticle,
	removeArticle,
	setArticleTitle,
	editArticle
}
