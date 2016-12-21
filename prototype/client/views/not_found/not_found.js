Template.notFound.rendered = function() {
	/*TEMPLATE_RENDERED_CODE*/
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.notFound.events({

});

Template.notFound.helpers({

});
