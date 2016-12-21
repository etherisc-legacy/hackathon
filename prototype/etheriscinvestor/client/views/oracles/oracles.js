var pageSession = new ReactiveDict();

Template.Oracles.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.Oracles.events({
	
});

Template.Oracles.helpers({
	
});

Template.OraclesOraclesHowtoComponent.created = function() {

};

Template.OraclesOraclesHowtoComponent.destroyed = function() {

};

Template.OraclesOraclesHowtoComponent.rendered = function() {

};

Template.OraclesOraclesHowtoComponent.helpers({

});

Template.OraclesOraclesHowtoComponent.events({

});

Template.OraclesOraclesHowtoComponentUnderwriteOracleForm.rendered = function() {
	

	pageSession.set("oraclesOraclesHowtoComponentUnderwriteOracleFormInfoMessage", "");
	pageSession.set("oraclesOraclesHowtoComponentUnderwriteOracleFormErrorMessage", "");

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

Template.OraclesOraclesHowtoComponentUnderwriteOracleForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("oraclesOraclesHowtoComponentUnderwriteOracleFormInfoMessage", "");
		pageSession.set("oraclesOraclesHowtoComponentUnderwriteOracleFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var oraclesOraclesHowtoComponentUnderwriteOracleFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(oraclesOraclesHowtoComponentUnderwriteOracleFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("oraclesOraclesHowtoComponentUnderwriteOracleFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("oraclesOraclesHowtoComponentUnderwriteOracleFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Session.set('tx_Type', 'oracle');

var policyId = $("input[name='policy_id']").val();
var probability = $("input[name='probability']").val() * 10000;
var do_underwrite = $("select[name='do_underwrite']").val();

console.log(do_underwrite);

Meteor.call(
  'UnderwriteInsurance', 
  policyId,
  probability,
  do_underwrite,
  method_Callback
);
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.OraclesOraclesHowtoComponentUnderwriteOracleForm.helpers({
	"infoMessage": function() {
		return pageSession.get("oraclesOraclesHowtoComponentUnderwriteOracleFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("oraclesOraclesHowtoComponentUnderwriteOracleFormErrorMessage");
	}
	
});

Template.OraclesOraclesHowtoComponentRiskmanagerOracleForm.rendered = function() {
	

	pageSession.set("oraclesOraclesHowtoComponentRiskmanagerOracleFormInfoMessage", "");
	pageSession.set("oraclesOraclesHowtoComponentRiskmanagerOracleFormErrorMessage", "");

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

Template.OraclesOraclesHowtoComponentRiskmanagerOracleForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("oraclesOraclesHowtoComponentRiskmanagerOracleFormInfoMessage", "");
		pageSession.set("oraclesOraclesHowtoComponentRiskmanagerOracleFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var oraclesOraclesHowtoComponentRiskmanagerOracleFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(oraclesOraclesHowtoComponentRiskmanagerOracleFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("oraclesOraclesHowtoComponentRiskmanagerOracleFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("oraclesOraclesHowtoComponentRiskmanagerOracleFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				console.log('submit');
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.OraclesOraclesHowtoComponentRiskmanagerOracleForm.helpers({
	"infoMessage": function() {
		return pageSession.get("oraclesOraclesHowtoComponentRiskmanagerOracleFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("oraclesOraclesHowtoComponentRiskmanagerOracleFormErrorMessage");
	}
	
});

Template.OraclesOracleTransactioninfoComponent.created = function() {

};

Template.OraclesOracleTransactioninfoComponent.destroyed = function() {

};

Template.OraclesOracleTransactioninfoComponent.rendered = function() {

};

Template.OraclesOracleTransactioninfoComponent.helpers({

	tx_Info: function (elem) {
      if (typeof Session.get('tx_Info') != 'undefined') {
		return Session.get('tx_Info')[elem];
      }
    },
  
	showInfo: function () {
		return Session.get('tx_Type') == 'oracle';
	}

});

Template.OraclesOracleTransactioninfoComponent.events({

});
