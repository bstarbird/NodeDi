# Nodey

## Description
Simplistic, magic Dependency Injection Framework for Node.js. Nodey is Dependency Conjuration for the easily amused.
Pronounced Nodey, like "Node Dee" but with less D's: Nodey.

## Requires
Requires Mocha, Should and Mockery to run tests, but only Async and Introspect to run.

##Usage
Nodey builds up a container indexed by filename for all of the .js files in a given folder. When you want to get a type out of nodey you have to pass it the same name as the filename (sans .js). 
The current version of Nodey will choke if you register two files that are named the same. So in an mvc app you can name your user controller "userController" and your model "user" and deal with the extra text in the route bootsrapping process.

###Simple example
Pass Nodey a set of folders in a path that you would like to register. Nodey will look through all of the folders and any of their subfolders and "require" all of the .js files.
```javascript
var nodey = require('nodey')
nodey.register(path, ["controllers", "models", "views"], callback);
```
Once the files are loaded Nodey can retrieve them via nodey.resolve.
```javascript
var nodey = require('nodey')
nodey.register(path, ["controllers", "models", "views"], callback);
var resolvedThing = nodey.resolve("myAwesomeController", callback);
```

###Express example
```javascript
var boostrapper = function(){
	nodey.register(path, ["controllers", "models", "views"], function(err){
		if(err){
			parentCallback(err);
			return;
		}
		var app = express.createServer();
		var myRouteHandler = new routeHandler(app, nodey);
	});
};
var routeHandler = function(expressApp, nodey){
	var router = function router(req, res, next) {
		var controllerName = req.params.controller ? req.params.controller : '';
		nodey.resolve(controllerName.toLowerCase() + 'Controller', function(err, controller){
			if(err){
				res.render('404');
				return;
			}
			controller(req, res, next);
		});
	}
	expressApp.get("/:controller?", router);
};
```