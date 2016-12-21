this.App = {};
this.Helpers = {};

this.globalOnRendered = function() {
	
	animateVisible();
};

Meteor.startup(function() {
	
console.log('client startup');

contract_ids = require('../both/lib/contract_ids.js');
abi_bin = require('../both/lib/abi_bin.js');
networks = require('../both/lib/networks.js');

Session.set('web3_Connected', false);

contracts = {};


/*
Meteor.setInterval(
  function() {
      web3_Connect();      
  },
  3 * 1000   // interval in milliseconds
);
*/

console.log('client startup finished');

var getContract = function(contract) {
    web3.eth.contract(abi_bin.abi.RSC_AddressResolver)
			.at(networks.ropsten.AddressResolver_addr).getAddress(
      web3.sha3(contract), 
      function (error, result) {
		contracts[contract] = web3.eth.contract(abi_bin.abi[contract]).at(result);
      }
    ); 
};

var getAllContracts = function () {
  for (var contract in contract_ids.contracts) {
    getContract(contract);
  }
};

tx_Callback = function(error, result) {
	console.log('tx_Callback');
    if (error) {
      Session.set(
        'tx_Info', {
          success: false, 
          error: error.message.slice(0, error.message.indexOf('\n')),
          hash: ''
        });
    } else {
      Session.set(
        'tx_Info', {
          success: true, 
          error: '',
          hash: result
        });
    }

};

method_Callback = function(error, result) {
    if (error) {
      Session.set(
        'tx_Info', {
          success: false, 
          error: error.message.slice(0, error.message.indexOf('\n')),
          hash: ''
        });
    } else if (result.success) {
      Session.set(
        'tx_Info', {
          success: true, 
          error: '',
          hash: result.txHash
        });
    } else {
      Session.set(
        'tx_Info', {
          success: false, 
          error: result.error,
          hash: ''
        });
    }
};


var web3_Connect = function() {

	if (typeof web3 !== 'undefined') {
		web3 = new Web3(web3.currentProvider);
		web3.eth.getBalance(
          web3.eth.accounts[0], 
          function (error, result) {
            Session.set('web3_Connected', true);	
            Session.set('balance', web3.fromWei(result).toFixed(2));
            Session.set('account', web3.eth.accounts[0]);
			getAllContracts();
          });
    }
};

web3_Connect();

getContractVars = function () { // global callable, by clicking "refresh"
  
  var Contract_var_ids = [

    {id: 'RSC_Token_owner', ad: true},
    {id: 'RSC_Token_riskManager', ad: true},
    {id: 'RSC_Token_totalSupply', ad: false},
    {id: '', ad: false}, 
    {id: 'RSC_Insurance_owner', ad: true},
    {id: 'RSC_Insurance_oracle', ad: true},
    {id: 'RSC_Insurance_riskManager', ad: true},
    {id: 'RSC_Insurance_policies', ad: false}, 
    {id: '', ad: false}, 
    {id: 'RSC_SimpleSale_owner', ad: true},
    {id: 'RSC_SimpleSale_RSC_Token_Contract', ad: true},
    {id: 'RSC_SimpleSale_tokenPrice', ad: false},
    {id: 'RSC_SimpleSale_totalRaised', ad: false},
    {id: 'RSC_SimpleSale_FUNDING_GOAL', ad: false},
    {id: 'RSC_SimpleSale_STARTBLOCK', ad: false},
    {id: 'RSC_SimpleSale_MAXIMUM_SALE_BLOCK', ad: false},
    // {id: 'RSC_SimpleSale_TOTAL_TOKENS', ad: false} // not used
    {id: 'RSC_SimpleSale_saleFinished', ad: false},
    ''    
  ];
  
  for (var contract in contract_ids.contracts) {
    Contract_var_ids.push({id: contract + '_Address', ad: true});
    Session.set(contract + '_Address',contracts[contract].address);
  }
  
  Session.set('Contract_var_ids', Contract_var_ids);
  
  var policies = [];
  var policyCount = 0;
  var getPolicy = function(index, cb) {
    if (index >= policyCount) {
      Session.set('RSC_Insurance_policies', policies);
      return;
    }
    contracts.RSC_Insurance.policies(index, function (error, result) {
      policies.push(JSON.stringify(result));
      cb(index+1, getPolicy);
    });
  };
     
  contracts.RSC_Token.totalSupply(function (error, result) {
    Session.set('RSC_Token_totalSupply', result.toNumber());});
  contracts.RSC_Token.owner(function (error, result) {
    Session.set('RSC_Token_owner', result);});
  contracts.RSC_Token.riskManager(function (error, result) {
    Session.set('RSC_Token_riskManager', result);});
  
  contracts.RSC_Insurance.owner(function (error, result) {
    Session.set('RSC_Insurance_owner', result);});
  contracts.RSC_Insurance.oracle(function (error, result) {
    Session.set('RSC_Insurance_oracle', result);});
  contracts.RSC_Insurance.riskManager(function (error, result) {
    Session.set('RSC_Insurance_riskManager', result);});
  contracts.RSC_Insurance.getPolicyCount(
    '',
    function(error,result) {
      policyCount = result.toNumber();
      getPolicy(0, getPolicy);
    });
  contracts.RSC_Insurance.policies(function (error, result) {
    Session.set('RSC_Insurance_policies', JSON.stringify(result));});

  contracts.RSC_SimpleSale.owner(function (error, result) {
    Session.set('RSC_SimpleSale_owner', result);});
  contracts.RSC_SimpleSale.FUNDING_GOAL(function (error, result) {
    Session.set('RSC_SimpleSale_FUNDING_GOAL', web3.fromWei(result).toFixed(4));});
  contracts.RSC_SimpleSale.MAXIMUM_SALE_BLOCK(function (error, result) {
    Session.set('RSC_SimpleSale_MAXIMUM_SALE_BLOCK', result.toFixed(0));});
  contracts.RSC_SimpleSale.RSC_Token_Contract(function (error, result) {
    Session.set('RSC_SimpleSale_RSC_Token_Contract', result);});
  contracts.RSC_SimpleSale.STARTBLOCK(function (error, result) {
    Session.set('RSC_SimpleSale_STARTBLOCK', result.toFixed(0));});
  contracts.RSC_SimpleSale.TOTAL_TOKENS(function (error, result) {
    Session.set('RSC_SimpleSale_TOTAL_TOKENS', result.toFixed(0));});
  contracts.RSC_SimpleSale.saleFinished(function (error, result) {
    Session.set('RSC_SimpleSale_saleFinished', result.toString());});
  contracts.RSC_SimpleSale.tokenPrice(function (error, result) {
    Session.set('RSC_SimpleSale_tokenPrice', web3.fromWei(result).toFixed(4));});
  contracts.RSC_SimpleSale.totalRaised(function (error, result) {
    Session.set('RSC_SimpleSale_totalRaised', web3.fromWei(result).toFixed(4));});
  
};


	$(window).on("scroll resize", function() {
		animateVisible();
	});
});

this.menuItemClass = function(routeName, params) {
	if(!Router.current() || !Router.current().route) {
		return "";
	}

	if(!Router.routes[routeName]) {
		return "";
	}

	if(Router.current().route.getName() == routeName) {
		if(params && params.hash && Router.current().data().params) {
			var eq = true;
			for(var key in params.hash) {
				if(Router.current().data().params[key] != params.hash[key]) {
					eq = false;
				}
			}
			return eq ? "active" : "";
		}
		return "active";
	}

	var currentPath = Router.routes[Router.current().route.getName()].handler.path;
	var routePath = Router.routes[routeName].handler.path;

	if(routePath === "/") {
		return (currentPath == routePath || Router.current().route.getName().indexOf(routeName + ".") == 0) ? "active" : "";
	}

	return currentPath.indexOf(routePath) === 0 ? "active" : "";
};

Helpers.menuItemClass = function(routeName, params) {
	return menuItemClass(routeName, params);
};

Helpers.randomString = function(strLen) {
	return Random.id(strLen);
};

Helpers.secondsToTime = function(seconds, timeFormat) {
	return secondsToTime(seconds, timeFormat);
};

Helpers.integerDayOfWeekToString = function(day) {
	if(_.isArray(day)) {
		var s = "";
		_.each(day, function(d, i) {
			if(i > 0) {
				s = s + ", ";
			}
			s = s + ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d];
		});
		return s;
	}
	return ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][day];
};

Helpers.formatDate = function(date, dateFormat) {
	if(!date) {
		return "";
	}

	var f = dateFormat || "MM/DD/YYYY";

	if(_.isString(date)) {
		if(date.toUpperCase() == "NOW") {
			date = new Date();
		}
		if(date.toUpperCase() == "TODAY") {
			var d = new Date();
			date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
		}
	}

	return moment(date).format(f);
};

Helpers.booleanToYesNo = function(b) {
	return b ? "Yes" : "No";
};

Helpers.integerToYesNo = function(i) {
	return i ? "Yes" : "No";
};

Helpers.integerToTrueFalse = function(i) {
	return i ? "True" : "False";
};

// Tries to convert argument to array
//   array is returned unchanged
//   string "a,b,c" or "a, b, c" will be returned as ["a", "b", "c"]
//   for other types, array with one element (argument) is returned
//   TODO: implement other types to array conversion
Helpers.getArray = function(a) {
	a = a || [];
	if(_.isArray(a)) return a;
	if(_.isString(a)) {
		var array = a.split(",") || [];
		_.each(array, function(item, i) { array[i] = item.trim(); });
		return array;
	}
	if(_.isObject(a)) {
		// what to return? keys or values?
	}

	var array = [];
	array.push(a);
	return array;
};

Helpers.cursorEmpty = function(cursor) {
	return cursor && cursor.count();
};

_.each(Helpers, function (helper, key) {
	Handlebars.registerHelper(key, helper)
});
