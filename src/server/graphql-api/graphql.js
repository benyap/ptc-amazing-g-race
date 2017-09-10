import express from 'express';
import graphQLHTTP from 'express-graphql';
// import schema from './schema';


const router = express.Router();

// const graphQLConfig = {
// 	schema: schema,
// 	graphiql: process.env.NODE_ENV === 'development',
// 	pretty: true
// };

// router.use('/', graphQLHTTP(graphQLConfig));


export default router;