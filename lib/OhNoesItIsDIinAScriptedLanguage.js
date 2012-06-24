var fs = require('fs')
var async = require('async')
var container = new Array();
var dependencyTree = new (require('./dependencyTree'))(container)

module.exports.register = function(path, folders, callback){

	console.log("Registering path " + path + " and folders " + folders)

	async.forEach(folders, function(folder, iteratorCallback){
		loadFolder(path, folder, iteratorCallback);
	}, callback);
}

module.exports.resolve = function(item, callback){
	var constructor = container[item];
	
	if(typeof constructor == "object"){
		callback(null, constructor)
		return;
	}

	dependencyTree.findDependencies(constructor, function(err, dependencies){
		if(err){
			console.log("  !Error Loading " + item + " : " + err)
			callback(err)
			return;
		}
		
		var objectDefinition = Object.create(constructor.prototype);
		
		objectDefinition.constructor = constructor;

		constructor.apply(objectDefinition, dependencies);
		
		container[item] = objectDefinition;
		callback(null, objectDefinition)
	});
}

var loadFolder = function(path, item, callback){
	var fileName = path + "/" + item
	
	fs.stat(fileName, function(err, stats){
		if(err){
			return;
		}
		if(stats.isDirectory()){
			fs.readdir(fileName, function(err, dirContents){
				if(err){
					return;
				}
				async.forEach(dirContents, function(contents, iteratorCallback){
					loadFolder(fileName, contents, iteratorCallback);
				}, callback);
			});
		}
		else{
			loadFile(fileName, item, callback);
		}
	})
};

var loadFile = function(filePath, fileName, callback){
	
	validateForInjection(filePath, fileName, function(err, moduleName, item){
		if(err){
			callback();
			return;
		}
		console.log("  Loading " + moduleName + " into container");
		container[moduleName] = item;
		callback();
	});
}

var validateForInjection = function(filePath, fileName, callback){
	var moduleName = fileName.replace(/.js$/gi, "");
	if(moduleName == fileName){
		callback("Not a JS file");
		return;
	}
	var item = require(filePath);
	callback(null, moduleName, item);	
}