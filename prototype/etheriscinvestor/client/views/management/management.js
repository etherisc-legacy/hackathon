var pageSession = new ReactiveDict();

Template.Management.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.Management.events({
	
});

Template.Management.helpers({
	
});

Template.ManagementManagementHowtoComponent.created = function() {

};

Template.ManagementManagementHowtoComponent.destroyed = function() {

};

Template.ManagementManagementHowtoComponent.rendered = function() {

};

Template.ManagementManagementHowtoComponent.helpers({

});

Template.ManagementManagementHowtoComponent.events({

});

Template.ManagementManagementForm.rendered = function() {
	

	pageSession.set("managementManagementFormInfoMessage", "");
	pageSession.set("managementManagementFormErrorMessage", "");

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

Template.ManagementManagementForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("managementManagementFormInfoMessage", "");
		pageSession.set("managementManagementFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var managementManagementFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(managementManagementFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("managementManagementFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("managementManagementFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Session.set('tx_Type', 'management');

var token_owner_token = $("input[name='token_owner_token']").val();
var risk_manager_token = $("input[name='risk_manager_token']").val();
var token_price_simplesale = $("input[name='token_price_simplesale']").val();
var token_contract_simplesale = $("input[name='token_contract_simplesale']").val();
var total_supply_simplesale = $("input[name='total_supply_simplesale']").val();
var risk_manager_insurance = $("input[name='risk_manager_insurance']").val();
var oracle_insurance = $("input[name='oracle_insurance']").val();

if (token_owner_token !== '') {
  Meteor.call(
    'SetTokenOwnerToken', 
    token_owner_token,
    method_Callback
  );
} else if (risk_manager_token !== '') {
  Meteor.call(
    'SetRiskManagerToken', 
    risk_manager_token,
    method_Callback
  );
} else if (token_price_simplesale !== '') {
  Meteor.call(
    'SetTokenPriceSimpleSale', 
    web3.toWei(token_price_simplesale, 'ether'),
    method_Callback
  );
} else if (token_contract_simplesale !== '') {
  Meteor.call(
    'SetTokenContractSimpleSale', 
    token_contract_simplesale,
    method_Callback
  );
} else if (total_supply_simplesale !== '') {
  Meteor.call(
    'SetTotalSupplySimpleSale', 
    total_supply_simplesale,
    method_Callback
  );
} else if (risk_manager_insurance !== '') {
  Meteor.call(
    'SetRiskManagerInsurance', 
    risk_manager_insurance,
    method_Callback
  );
} else if (oracle_insurance !== '') {
  Meteor.call(
    'SetOracleInsurance', 
    oracle_insurance,
    method_Callback
  );
}


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

Template.ManagementManagementForm.helpers({
	"infoMessage": function() {
		return pageSession.get("managementManagementFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("managementManagementFormErrorMessage");
	}
	
});

Template.ManagementManagementTransactioninfoComponent.created = function() {

};

Template.ManagementManagementTransactioninfoComponent.destroyed = function() {

};

Template.ManagementManagementTransactioninfoComponent.rendered = function() {

};

Template.ManagementManagementTransactioninfoComponent.helpers({
	
	tx_Info: function (elem) {
      if (typeof Session.get('tx_Info') != 'undefined') {
		return Session.get('tx_Info')[elem];
      }
    },
  
	showInfo: function () {
		return Session.get('tx_Type') == 'management';
	}
  
});

Template.ManagementManagementTransactioninfoComponent.events({

});
