var app=angular.module("myApp",["ngRoute","homeCtrl"]).config(["$routeProvider",function(e){"use strict";e.when("/",{controller:"HomeCtrl"}).otherwise({redirectTo:"/"})}]);angular.module("homeCtrl",[]).controller("HomeCtrl",["$scope",function(e){"use strict";e.menuToggle=function(){this.menuState=!this.menuState},console.log("home ctrl")}]);
//# sourceMappingURL=../js/app.js.map