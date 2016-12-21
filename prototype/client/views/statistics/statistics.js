Template.Statistics.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.Statistics.events({
	
});

Template.Statistics.helpers({
	
});

Template.StatisticsStatisticsHowtoComponent.created = function() {

};

Template.StatisticsStatisticsHowtoComponent.destroyed = function() {

};

Template.StatisticsStatisticsHowtoComponent.rendered = function() {

};

Template.StatisticsStatisticsHowtoComponent.helpers({

});

Template.StatisticsStatisticsHowtoComponent.events({

});


Template.StatisticsContractsDetailsComponent.created = function() {

};

Template.StatisticsContractsDetailsComponent.destroyed = function() {

};

Template.StatisticsContractsDetailsComponent.rendered = function() {

};

Template.StatisticsContractsDetailsComponent.helpers({
  
	contract_var_ids: function () {
      if (typeof Session.get('Contract_var_ids') !== 'undefined') {
		return Session.get('Contract_var_ids').map(function(x) {return x.id;});
      } else {
        return [];
      }
    },

	contract_var_ad: function(id) {
      var cvids = Session.get('Contract_var_ids');
      return cvids.find(function(x) {return x.id == id; }).ad;
    },
  
    contract_vars: function(id) {
      return Session.get(id);
    }
  

});

Template.StatisticsContractsDetailsComponent.events({

  'click #refreshVars': function () {
	Meteor.call('RefreshContracts');
    getContractVars(); 
    
  }
  
});


