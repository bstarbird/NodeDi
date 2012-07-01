var assert = require("assert")
var should = require("should")
var mockery = require("mockery")

describe('When using nodey', function(){
	var target, path, folders, callback, objName;
	var typeRegistrarMock = function (){ 
		return{
			register : function(expectedPath, expectedFolders, expectedCallback){
				path = expectedPath; 
				folders = expectedFolders;
				callback = expectedCallback;
			}
		}
	};
	
	var dependencyTreeMock = function (){ 
		return{
			resolve : function(expectedObjName, expectedCallback){
				objName = expectedObjName; 
				callback = expectedCallback;
			}
		}
	};
	
	beforeEach(function(){
		mockery.enable();
		mockery.registerAllowable('../lib/nodey');
		mockery.registerMock('./typeRegistrar', typeRegistrarMock);
		mockery.registerMock('./dependencyTree', dependencyTreeMock);
		target = require("../lib/nodey")
	})

	it('should call typeRegistrar to register', function(){
		target.register("a", "b", "c");
		path.should.equal("a")
		folders.should.equal("b")
		callback.should.equal("c")
	})
	
	it('should call dependencyTree to resolve', function(){
		target.resolve("objName", "callback");
		objName.should.equal("objName")
		callback.should.equal("callback")
	})
	
	afterEach(function(){
		mockery.disable();
		mockery.deregisterAll();
	});
})