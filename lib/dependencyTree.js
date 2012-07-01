var introspect = require("introspect")
var async = require("async")

var dependencyTree = function(container){
	this.container = container;
}

module.exports = dependencyTree;

dependencyTree.prototype = {
	findDependencies : function(objName, callback){
		console.log("Preparing to load: " + objName.toString());
	
		try{
			var params = introspect(this.container[objName].toString());
		}
		catch(e){
			callback("Could not inspect function: " + objName);
			return;
		}
		
		var recognizedParameters = new Array();
		var tree = this;
		async.forEachSeries(params, function (item, iteratorCallback){
			tree.resolve(item, function(err, dependency){
				if(err){
					iteratorCallback(err);
					return;
				}
				recognizedParameters.push(dependency);
			})
			iteratorCallback();
		}, function (err){
			if(err){
				callback("Error finding dependencies for " + objName + ". " + err);
				return;
			}
			callback(null, recognizedParameters);
		});
	},
	
	resolve : function(objName, callback){
		var constructor = this.container[objName];
		var container = this.container;
		
		if(!constructor){
			callback("Error resolving " + constructor);
			return;
		}
		
		if(typeof constructor == "object"){
			callback(null, constructor);
			return;
		}
	
		this.findDependencies(objName, function(err, dependencies){
			if(err){
				callback(err);
				return;
			}
			
			//Thanks T.J. Crowder, http://stackoverflow.com/users/157247/t-j-crowder
			var objectDefinition = Object.create(constructor.prototype);
			
			objectDefinition.constructor = constructor;
			constructor.apply(objectDefinition, dependencies);
			
			container[objName] = objectDefinition;
			callback(null, objectDefinition);
		});
	}
}
