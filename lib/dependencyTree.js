var introspect = require("introspect")

var dependencyTree = function(container){
	this.container = container;
}

module.exports = dependencyTree;

dependencyTree.prototype = {
	findDependencies : function(func, callback){
		try{
			var params = introspect(func.toString());
		}
		catch(e){
			callback("Could not inspect function: " + func);
			return;
		}
		var recognizedParameters = new Array();
		for(var param in params){
			if(!this.container[params[param]]){
				callback("Could not resolve all params, failed at " + param);
				return;
			}
			recognizedParameters.push(this.container[params[param]])
		}
		
		callback(null, recognizedParameters);
	}
}
