var pageSession = new ReactiveDict();

Template.Investors.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.Investors.events({
	
});

Template.Investors.helpers({
	
});

Template.InvestorsInvestorsHowtoComponent.created = function() {

};

Template.InvestorsInvestorsHowtoComponent.destroyed = function() {

};

Template.InvestorsInvestorsHowtoComponent.rendered = function() {

};

Template.InvestorsInvestorsHowtoComponent.helpers({

});

Template.InvestorsInvestorsHowtoComponent.events({

});

Template.InvestorsTokensaleForm.rendered = function() {
	

	pageSession.set("investorsTokensaleFormInfoMessage", "");
	pageSession.set("investorsTokensaleFormErrorMessage", "");

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

Template.InvestorsTokensaleForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("investorsTokensaleFormInfoMessage", "");
		pageSession.set("investorsTokensaleFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var investorsTokensaleFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(investorsTokensaleFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("investorsTokensaleFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("home", mergeObjects(Router.currentRouteParams(), {}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("investorsTokensaleFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Session.set('tx_Type', 'tokenSale');

var tx = {
  value: web3.toWei($("input[name='amount']").val(), 'ether')
};

contracts.RSC_SimpleSale.tokenSale(tx,tx_Callback);
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

Template.InvestorsTokensaleForm.helpers({
	"infoMessage": function() {
		return pageSession.get("investorsTokensaleFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("investorsTokensaleFormErrorMessage");
	}
	
});

Template.InvestorsBalanceofForm.rendered = function() {
	

	pageSession.set("investorsBalanceofFormInfoMessage", "");
	pageSession.set("investorsBalanceofFormErrorMessage", "");

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

Template.InvestorsBalanceofForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("investorsBalanceofFormInfoMessage", "");
		pageSession.set("investorsBalanceofFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var investorsBalanceofFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(investorsBalanceofFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("investorsBalanceofFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("investorsBalanceofFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				contracts.RSC_Token.balanceOf(
  $("input[name='balance_of']").val(),
  function(error, result) {
    console.log(result);
    Session.set('balanceOf', result.toNumber());
  });
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

Template.InvestorsBalanceofForm.helpers({
	"infoMessage": function() {
		return pageSession.get("investorsBalanceofFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("investorsBalanceofFormErrorMessage");
	}
	
});

Template.InvestorsShowTokenbalanceComponent.created = function() {

};

Template.InvestorsShowTokenbalanceComponent.destroyed = function() {

};

Template.InvestorsShowTokenbalanceComponent.rendered = function() {

};

Template.InvestorsShowTokenbalanceComponent.helpers({
	balanceOf: function() {
      return Session.get('balanceOf');
    }
});

Template.InvestorsShowTokenbalanceComponent.events({

});

Template.InvestorsTokensaleTransactioninfoComponent.created = function() {

};

Template.InvestorsTokensaleTransactioninfoComponent.destroyed = function() {

};

Template.InvestorsTokensaleTransactioninfoComponent.rendered = function() {

};

Template.InvestorsTokensaleTransactioninfoComponent.helpers({

	tx_Info: function (elem) {
      if (typeof Session.get('tx_Info') != 'undefined') {
		return Session.get('tx_Info')[elem];
      }
    },
  
	showInfo: function () {
		return Session.get('tx_Type') == 'tokenSale';
	}
  
});

Template.InvestorsTokensaleTransactioninfoComponent.events({

});
