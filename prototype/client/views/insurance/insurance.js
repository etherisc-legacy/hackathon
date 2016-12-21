var pageSession = new ReactiveDict();

Template.Insurance.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.Insurance.events({
	
});

Template.Insurance.helpers({
	
});

Template.InsuranceInsuranceHowtoComponent.created = function() {

};

Template.InsuranceInsuranceHowtoComponent.destroyed = function() {

};

Template.InsuranceInsuranceHowtoComponent.rendered = function() {

};

Template.InsuranceInsuranceHowtoComponent.helpers({

});

Template.InsuranceInsuranceHowtoComponent.events({

});

Template.InsuranceNewpolicyForm.rendered = function() {
	

	pageSession.set("insuranceNewpolicyFormInfoMessage", "");
	pageSession.set("insuranceNewpolicyFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.InsuranceNewpolicyForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("insuranceNewpolicyFormInfoMessage", "");
		pageSession.set("insuranceNewpolicyFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var insuranceNewpolicyFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(insuranceNewpolicyFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("insuranceNewpolicyFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("home", mergeObjects(Router.currentRouteParams(), {}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("insuranceNewpolicyFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Session.set('tx_Type', 'newPolicy');

var tx = {
  value: web3.toWei($("input[name='premium']").val(), 'ether')
};

contracts.RSC_Insurance.newPolicy(
  $("select[name='risk_description']").val(), 
  tx, 
  tx_Callback
);

			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("home", mergeObjects(Router.currentRouteParams(), {}));
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		Router.go("home", mergeObjects(Router.currentRouteParams(), {}));
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("home", mergeObjects(Router.currentRouteParams(), {}));
	}

	
});

Template.InsuranceNewpolicyForm.helpers({
	"infoMessage": function() {
		return pageSession.get("insuranceNewpolicyFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("insuranceNewpolicyFormErrorMessage");
	}
	
});

Template.InsuranceNewpolicyTransactioninfoComponent.created = function() {

};

Template.InsuranceNewpolicyTransactioninfoComponent.destroyed = function() {

};

Template.InsuranceNewpolicyTransactioninfoComponent.rendered = function() {

};

Template.InsuranceNewpolicyTransactioninfoComponent.helpers({

	tx_Info: function (elem) {
      if (typeof Session.get('tx_Info') != 'undefined') {
		return Session.get('tx_Info')[elem];
      }
    },
  
	showInfo: function () {
		return Session.get('tx_Type') == 'newPolicy';
	}
  
});

Template.InsuranceNewpolicyTransactioninfoComponent.events({

});
