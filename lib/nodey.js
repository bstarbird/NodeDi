var container = new Array();
var dependencyTree = new (require('./dependencyTree'))(container)
var typeRegistrar = new (require('./typeRegistrar'))(container)

module.exports.register = function(path, folders, callback){
	typeRegistrar.register(path, folders, callback);
}

module.exports.resolve = function(item, callback){
	dependencyTree.resolve(item, callback);
}