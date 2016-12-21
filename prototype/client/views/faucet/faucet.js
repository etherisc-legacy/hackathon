var pageSession = new ReactiveDict();

Template.Faucet.rendered = function() {
	Session.set('faucet_error', false);
Session.set('faucet_success', false);
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.Faucet.events({
	
});

Template.Faucet.helpers({
	
});

Template.FaucetFaucetHowtoComponent.created = function() {

};

Template.FaucetFaucetHowtoComponent.destroyed = function() {

};

Template.FaucetFaucetHowtoComponent.rendered = function() {

};

Template.FaucetFaucetHowtoComponent.helpers({

});

Template.FaucetFaucetHowtoComponent.events({

});

Template.FaucetFaucetComp.created = function() {

};

Template.FaucetFaucetComp.destroyed = function() {

};

Template.FaucetFaucetComp.rendered = function() {
	console.log('custom_comp rendered');
};

Template.FaucetFaucetComp.helpers({
  
	web3_Connected: function() { 
		return Session.get('web3_Connected'); 
    },

    balance: function() {
		return Session.get('balance');
    }, 
  
	account: function() {
		return Session.get('account');
    },
  
	balance_too_high: function() {
		return Session.get('balance') > 10.0;
    },
  
    show_faucet: function() {
		return Session.get('web3_Connected') && Session.get('balance') <= 10.0;
    }
});

Template.FaucetFaucetComp.events({

});

Template.FaucetFaucetCompFaucetForm.rendered = function() {
	

	pageSession.set("faucetFaucetCompFaucetFormInfoMessage", "");
	pageSession.set("faucetFaucetCompFaucetFormErrorMessage", "");

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

Template.FaucetFaucetCompFaucetForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("faucetFaucetCompFaucetFormInfoMessage", "");
		pageSession.set("faucetFaucetCompFaucetFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var faucetFaucetCompFaucetFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(faucetFaucetCompFaucetFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("faucetFaucetCompFaucetFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("home", mergeObjects(Router.currentRouteParams(), {}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("faucetFaucetCompFaucetFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Session.set('tx_Type', 'faucet');

Meteor.call(
  'Faucet', 
  web3.toWei($("input[name='faucet_amount']").val(), 'ether'),
  web3.eth.accounts[0], 
  method_Callback
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

Template.FaucetFaucetCompFaucetForm.helpers({
	"infoMessage": function() {
		return pageSession.get("faucetFaucetCompFaucetFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("faucetFaucetCompFaucetFormErrorMessage");
	}
	
});

Template.FaucetFaucetTransactioninfoComponent.created = function() {

};

Template.FaucetFaucetTransactioninfoComponent.destroyed = function() {

};

Template.FaucetFaucetTransactioninfoComponent.rendered = function() {
	
};

Template.FaucetFaucetTransactioninfoComponent.helpers({

	tx_Info: function (elem) {
      if (typeof Session.get('tx_Info') != 'undefined') {
		return Session.get('tx_Info')[elem];
      }
    },
  
	showInfo: function () {
		return Session.get('tx_Type') == 'faucet';
	}
  
});

Template.FaucetFaucetTransactioninfoComponent.events({

});
