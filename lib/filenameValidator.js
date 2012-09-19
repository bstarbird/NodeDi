module.exports.validateForInjection = function(filePath, fileName, callback){
		var moduleName = fileName.replace(/.js$/gi, "");
		if(moduleName == fileName){
			moduleName = fileName.replace(/.coffee$/gi, "");
			if(moduleName == fileName){
				callback("Not a JS file");
				return;
			}
		}
		var item = require(filePath);
		callback(null, moduleName, item);	
	}