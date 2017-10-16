# Power To Change - The Amazing GRace
This app was created for the 2017 End of Year event run by students from Power to Change. 


## Running this project
### Dependencies
This project is built using the [Node.js](https://nodejs.org/) framework. You will need the latest versions of `node` and `npm` (automatically installed when you install Node.js) installed on your computer to build and run this project.

### Installation
1. Clone the repository onto your local machine.
2. Navigate to the root directory of the project and run `npm install` to install the required packages. 
3. Once the required packages have been downloaded and installed, you should be ready to run the project. 

*Please note that you will need to have an environment variables file (`.env`) in your root directory with the required environment variables for the server to run correctly (see [Environemnt variables](#environment-variables)).*

### Running the development environment
1. Run `npm run client:dev:watch` to build the client. This will also watch the client files for changes, which will automatically trigger a rebuild. 
2. In a new terminal, run `npm run server:dev:watch` to build and run the server. This will also watch the server files for changes, which will automatically trigger a rebuild and restart the server. 
3. Go to your localhost to access the web app (default is `localhost:3000`).

### Running the production environment
1. Run `npm run server:build` to build the server files. This will build the server with production settings.
2. Run `npm run client:build` to build the client files. This will build the client with production settings.
3. Run `npm start` to run the server. 
4. Go to your localhost to access the web app (default is `localhost:3000`). 

### Environment variables
Credentials for access to cloud services are not committed to version control for security reasons. The server uses the following services which require configuration using a `.env` file:

- Express.js
  - Express session secret - `EXPRESS_SESSION_SECRET`
	
- JSON Web Token
	- JWT secret - `JWT_SECRET`
	
- MongoDB Atlas
	- Access username - `MONGO_ADMIN_USER`
	- Access key - `MONGO_ADMIN_KEY`
	- Default DB to connect to - `MONGO_DB`
	
*You will need legitimate credentials to an active MongoDB Atlas instance for the server to connect to.*

- Amazon Web Services S3
	- AWS Region - `AWS_S3_REGION`
	- AWS bucket name - `AWS_S3_BUCKET`
	- AWS upload folder name - `AWS_S3_UPLOAD_BUCKET`
	- AWS user access key ID - `AWS_S3_USER_ACCESS_KEY_ID`
	- AWS user secret access key - `AWS_S3_USER_SECRET_ACCESS_KEY`
	- AWS admin access key ID - `AWS_S3_ADMIN_ACCESS_KEY_ID`
	- AWS admin secret access key - `AWS_S3_ADMIN_ACCESS_KEY_ID`
	
*You will need legitimate credentials to an active AWS S3 instance with the correctly configured IAM access settings for the server to connect to.*


## Contributing
### Workflow
**IMPORTANT: This application is currently live**. It is extremely important that the `master` branch is always in a stable, deployable state. The application is hosted on [Heroku](http://www.heroku.com), which automatically builds and deploys the `master` branch to a staging environment. Commits should **NOT** be made directly to the `master` branch.

This project uses the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows#feature-branch-workflow). Please ensure you are familiar with how it works before committing any code to this repository. 

### Conventions
This project is written in JavaScript so standard JavaScript conventions should be followed for consistency. Function and variable names should be written in uncapitalised `camelCase`, where as classes and components should be written in capitalised `CamelCase`. 
Tabs should be used for indentation, and single quotes should be used for strings. 

This project uses ES6 syntax, in addition to `await`/`async` and `decorators`. Please use these features when necessary to avoid verbose and inconsistent code. 


### Technology stack
#### Server
This server is built using the [Node.js](https://nodejs.org/) framework with [Express.js](https://expressjs.com/). It serves a single [GraphQL](http://graphql.org/) endpoint to provide access to the database, which is hosted using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). 

#### Client
The Front-End serves two separate [React](https://facebook.github.io/react/) applications - one for the main public site, and one for the administrator site. The Front-End also utilises the [Blueprint.js](http://blueprintjs.com/) library for React components, [Redux](http://redux.js.org/) for application state management, and [React Apollo](http://dev.apollodata.com/react/) for handling data querying and caching management. 


### Project structure
#### `lib`
The `lib` folder contains generic and reusable React components that have no specific custom functionality. If a component can be reused on other projects, it belongs in the `lib` folder. Any new components added to this folder should be independent of any other components or functionalities of this application. 

#### `public`
The `public` folder contains public assets that are served by the server. Compiled scripts, fonts and images are placed in this folder. Compiled and minified JS scripts, fonts and images are automatically output to this folder. 

#### `src` 
The `src` folder contains the meat of the project. The main entry points for both the server and client are found in the respective folders `client` and `server` inside `src`. 

##### `client`
The `client` is split up into several main folders:
- `actions` for defining Redux actions which define actions that can modify the application state
- `react` for React components (both public and admin apps are contained in this folder)
- `reducers` for Redux reducers which define how Redux handles actions that are dispatched

The entry point for the main client site is `main.js`, and the entry point for the admin site is `admin.js`. 

##### `server`
All GraphQL implementation should be inside the `graphql-api` folder. Files inside the `db` folder are responsible for communicating with the MongoDB database - it should not be aware of the existence of GraphQL as an interface between the client and the server.
This prevents the interface layer being tightly coupled with the database, allowing either one to be switched with minimal changes to other areas of the server. 


## Production environment
This application is currently hosted on [Heroku](http://www.heroku.com). This repository is connected to a pipeline on Heroku that contains two stages: **staging** - which is automatically deployed from the `master` branch, and **production** - which is the live application and must be manually promoted from the `staging` application on the Heroku dashboard. 

Using the GitFlow Workflow, no commits should be directly made to master when modifying the codebase. 
All merges should be done using a Pull Request so that it can be reviewed before it is pushed into the staging application. 
Heroku **review** applications are enabled, which builds automatically when a Pull Request is made to the `master` branch. Before merging a Pull Request, the review app can be used for testing. 

All review and staging apps use the development database, so testing on development servers (both local and in the cloud) that mutate the database will not be propogated to the live database. 
