# CDP Filter Search  
A module of City Digital Pulse (University of Ottawa - MCRLab) for searching documents of posts/tweets with filter conditions.  

## Run Application  
#### Quick Start  
1. Install Node:  
`$ brew install node`
2. Install MongoDB:  
`$ brew install mongodb`
3. Install Yarn:  
`$ npm install yarn`
> **Note**: You can use npm instead although I strongly recommend Yarn.  
4. Open terminal in the project folder.  
5. Install all node dependencies:  
`$ yarn install`  
6. Build the project:  
`$ yarn run build`  
7. Start the application in production environment:  
`$ yarn run start-prod`  
8. Go to the browser and hit `http://localhost:3005`  

#### For Development  
Webpack watch mode and Nodemon can detect the change in files and automatically re-build the project and restart the server.  
`$ yarn run start-dev`  

#### For Deployment  
The application can be deployed in the background and the process will be managed by PM2.  
`$ yarn run deploy`  
You can use npm scripts as shortcuts to manage PM2 process.  
	1. `$ yarn run deploy-start`  
	2. `$ yarn run deploy-stop`  
	3. `$ yarn run deploy-restart`  
	4. `$ yarn run deploy-delete`  

## Customized Configuration  
#### Server Configuration `/config/server.config.js`  
1. defaultServerPort: By default the server listens to port 3005.  
2. mongoConnectionUrls: Change the connection URLs of Instagram and Twitter databases according to your MongoDB configuration.  
3. collectionNames: By default the collections for storing post records are 'posts' for Instagram database and 'tweets' for Twitter database.  

#### Client Configuration `/config/client.config.js`  
1. initialNumConditions: By default there are at maximum 5 filter conditions.  

## Module API  
#### Filter Module `/modules/filter.js`  
1. **Condition Class**  
	- **Condition(field, value, option)**  
	Construct a *Condition* object as one of the conditions to be matched for the filter.  
		1. *field*: The field according to which the records are filtered in the condition, valid values including `'$keyword'`, `'$hashtag'`, `'$place'`, `'$other'`.  
		2. *value*: The value to be matched for the specified field.  
		3. *option*: Extra options for the condition, such as `{exact: true}` for exact match.  
		4. *return*: A new object of the class *Condition*.  
	- **Condition.prototype.queryInstagram**  
	**Condition.prototype.queryTwitter**  
	Get the MongoDB query object (used as the parameter for `db.collection.find(query)`) for Instagram/Twitter database.  
		1. *return*: The MongoDB query object.  

2. **Filter Class**  
	- **Filter(logicalOperator)**  
	Construct a *Filter* object with multiple conditions for matching records.  
		1. *logicalOperator*: The logical operator (and/or) with which the conditions are matched, valid values are `'and'`, `'or'`.  
		2. *return*: A new object of the class *Filter*.  
	- **Filter.prototype.addCondition(conditions)**  
	Add conditions to the *Filter* object.  
		1. *conditions*: An object or an array of objects of the *Condition* class.  
	- **Filter.prototype.queryInstagram**  
	**Filter.prototype.queryTwitter**  
	Get the MongoDB query object (used as the parameter for `db.collection.find(query)`) for Instagram/Twitter database combined all the conditions of the filter.  
		1. *return*: The MongoDB query object.  

3. **Query Class**  
	- **Query(dbs, filter, dateRange)**  
	Construct a *Query* object for applying filter to multiple databases (Instagram&Twitter).  
		1. *dbs*: An object including the MongoDB *Db* objects for different databases. For example:  
	```
	const MongoClient = require('mongodb');
	const dbs = {};
	dbs.instagram = await MongoClient.connect(...);
	dbs.twitter = await MongoClient.connect(...);	
	```
		2. *filter*: A *Filter* object with which the search is executed.  
		3. *dateRange*: The specified start and end date for between which records are matched. For example:  
	```
	const dateRange = {};
	dateRange.from = new Date(...);
	dateRange.to = new Date(...);	
	```
		4. *return*: A new object of the class *Query*.  
	- **Query.prototype.findInstagram(limit)**  
	- **Query.prototype.findTwitter(limit)**  
	Find records from the databases of Instagram/Twitter using the filter of the *query* object.  
		1. *limit*: The limit of the result to be returned, which is 1000 by default.  
		2. *return*: An array of objects that match the filter conditions.  
	
#### Schema Module `/modules/schema.js`  
- **buildObjSchema(obj, schema, ignoredProps)**  
Build a new object that includes all the available properties of an object.  
	1. *obj*: The original object.  
	2. *schema*: The result object that represents the schema of the original object.  
	3. *ignoredProps*: The properties to be ignored. For MongoDB objects the *_id* property are better off ignored. Set to an empty array by default.  
- **getAllPropPaths(obj, prePath)**  
Get the strings that represent the paths of all properties (including nested properties) of an object.  
	1. *obj*: The specified object.  
	2. *prePath*: A string to be added to the start of all paths. Set to an empty string by default.  
	3. *return*: An array of the paths of all properties of the object.  
- **getMongoSchema(mongoCollection, numSampleObjs)**  
Get the paths of all the properties of an MongoDB collection.  
	1. *mongoCollection*: The specified MongoDB collection.  
	2. *numSampleObjs*: The number of sample objects for building the schema of the collection (since MongoDB is not structured, not all objects have the same properties). Set to 20 by default.  
	3. *return*: An array of the paths of all properties available in the MongoDB collection.  

#### Utilities Module `/modules/utilities`  
- **capitalize(str)**  
Capitalize the first letter of a string.  
	1. *str*: The original string.  
	2. *return*: A new string with the first letter capitalized.  

> **Zhihao Liu**  
> E-mail: [c.liu.zh@gmail.com](c.liu.zh@gmail.com)  
> Github: [github.com/cliuzh](github.com/cliuzh)  