var async = require('async')
var fs = require('fs')
var filenameValidator = require('./filenameValidator')
var coffee = require('coffee-script')

var typeRegistrar = function(container){
	this.container = container;
	
	this.loadFolder = function(path, item, callback){
		var fileName = path + "/" + item;

		var registrar = this;
		fs.stat(fileName, function(err, stats){
			if(err){
				callback(err)
				return;
			}
			if(stats.isDirectory()){
				fs.readdir(fileName, function(err, dirContents){
					if(err){
						return;
					}
					async.forEach(dirContents, function(contents, iteratorCallback){
						registrar.loadFolder(fileName, contents, iteratorCallback);
					}, callback);
				});
			}
			else{
				registrar.loadFile(fileName, item, callback);
			}
		})
	};

	this.loadFile = function(filePath, fileName, callback){
		
		filenameValidator.validateForInjection(filePath, fileName, function(err, moduleName, item){
			if(err){
				callback();
				return;
			}
			console.log("  Loading " + moduleName + " into container");
			container[moduleName] = item;
			callback();
		});
	}
}

module.exports = typeRegistrar;

typeRegistrar.prototype = {
	register : function(path, folders, callback){
		console.log("Registering path " + path + " and folders " + folders);

		var registrar = this;
		async.forEach(folders, function(folder, iteratorCallback){
			registrar.loadFolder(path, folder, iteratorCallback);
		}, callback);
	}
}