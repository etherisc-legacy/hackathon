Template.Home.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.Home.events({
	
});

Template.Home.helpers({
	
});

Template.HomeCustomerJumbotron.rendered = function() {
	
};

Template.HomeCustomerJumbotron.events({
	"click #jumbotron-button": function(e, t) {
		e.preventDefault();
		Router.go("insurance", {});
	}
	
});

Template.HomeCustomerJumbotron.helpers({
	
});

Template.HomeInvestorJumbotron.rendered = function() {
	
};

Template.HomeInvestorJumbotron.events({
	"click #jumbotron-button": function(e, t) {
		e.preventDefault();
		Router.go("investors", {});
	}
	
});

Template.HomeInvestorJumbotron.helpers({
	
});
