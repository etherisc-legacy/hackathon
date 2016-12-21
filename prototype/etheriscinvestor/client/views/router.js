Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading"
});

var freeRoutes = [
	"home",
	"faucet",
	"insurance",
	"investors",
	"statistics",
	"management",
	"oracles"
];

Router.currentRouteParams = function() {
	var route = Router ? Router.current() : null;
	if(!route) {
		return {};
	}

	var params = {};
	for(var key in route.params) {
		params[key] = JSON.parse(JSON.stringify(route.params[key]));
	}

	return params;
};

Router.onBeforeAction(function() {
	// loading indicator here
	if(!this.ready()) {
		$("body").addClass("wait");
		this.render("loading");
	} else {
		$("body").removeClass("wait");
		this.next();
	}
});

Router.map(function () {

	this.route("home", {path: "/", controller: "HomeController"});
	this.route("faucet", {path: "/faucet", controller: "FaucetController"});
	this.route("insurance", {path: "/insurance", controller: "InsuranceController"});
	this.route("investors", {path: "/investors", controller: "InvestorsController"});
	this.route("statistics", {path: "/statistics", controller: "StatisticsController"});
	this.route("management", {path: "/management", controller: "ManagementController"});
	this.route("oracles", {path: "/oracles", controller: "OraclesController"});
});
