Template.loading.rendered = function() {
	/*TEMPLATE_RENDERED_CODE*/
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.loading.events({

});

Template.loading.helpers({

});
