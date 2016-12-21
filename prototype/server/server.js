Meteor.startup(function() {
	// read environment variables from Meteor.settings
	if(Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
		for(var variableName in Meteor.settings.env) {
			process.env[variableName] = Meteor.settings.env[variableName];
		}
	}

	
contract_ids = require('../both/lib/contract_ids.js');
abi_bin = require('../both/lib/abi_bin.js');
networks = require('../both/lib/networks.js');

network = 'ropsten';

var Web3 = require('web3');

var passwd = require('./passwd.js');

var coinbase = networks[network].ownerAddress;

web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8645"));

var RSC_AddressResolver = web3.eth.contract(abi_bin.abi.RSC_AddressResolver)
			.at(networks.ropsten.AddressResolver_addr);

var server_contracts = {};

var getContract = function(contract) {
	server_contracts[contract] = 
      web3.eth.contract(abi_bin.abi[contract])
		.at(RSC_AddressResolver.getAddress(web3.sha3(contract)));
};

var getAllContracts = function () {
  for (var contract in contract_ids.contracts) {
    getContract(contract);
  }
};

getAllContracts();

console.log('Server started');
console.log(web3.eth.blockNumber);

Meteor.methods({
  
  RefreshContracts : function() {

    getAllContracts();

  },

  Faucet: function(amount, address) {

    console.log(amount);
    console.log(address);
    
    if (amount > 2*Math.pow(10,18)) {
      return({success: false, error: 'Error: Don\'t cheat!'});
    }
    
    var password = passwd[coinbase];
    web3.personal.unlockAccount(coinbase, password);
    
    var transaction = {
      from: coinbase,
      to: address,
      value: amount, 
      data: web3.fromUtf8('From etherisc with love!')
    };

    var sendTx = Meteor.wrapAsync(web3.eth.sendTransaction);
    return ({success: true, txHash: sendTx(transaction)});
    
  },
  
  SetTokenPriceSimplesale: function(amount) {

    console.log(amount);
        
    var password = passwd[coinbase];
    web3.personal.unlockAccount(coinbase, password);
    
    var transaction = {
      from: coinbase
    };
    
    var setPrice = Meteor.wrapAsync(server_contracts.RSC_SimpleSale.setPrice);
    return ({success: true, txHash: setPrice(amount, transaction)});
    
  },

  SetTokenContractSimplesale: function(address) {

    console.log(address);
        
    var password = passwd[coinbase];
    web3.personal.unlockAccount(coinbase, password);
    
    var transaction = {
      from: coinbase
    };
    
    var setTokenContract = Meteor.wrapAsync(server_contracts.RSC_SimpleSale.setTokenContract);
    return ({success: true, txHash: setTokenContract(address, transaction)});
    
  },

  SetTokenOwnerToken: function(address) {

    console.log(address);
        
    var password = passwd[coinbase];
    web3.personal.unlockAccount(coinbase, password);
    
    var transaction = {
      from: coinbase
    };
    
    var setOwner = Meteor.wrapAsync(server_contracts.RSC_Token.setOwner);
    return ({success: true, txHash: setOwner(address, transaction)});
    
  },

  SetRiskManagerToken: function(address) {

    console.log(address);
        
    var password = passwd[coinbase];
    web3.personal.unlockAccount(coinbase, password);
    
    var transaction = {
      from: coinbase
    };
    
    var setRiskManager = Meteor.wrapAsync(server_contracts.RSC_Token.setRiskManager);
    return ({success: true, txHash: setRiskManager(address, transaction)});
    
  },

  SetTotalSupplySimplesale: function(amount) {

    console.log(amount);
        
    var password = passwd[coinbase];
    web3.personal.unlockAccount(coinbase, password);
    
    var transaction = {
      from: coinbase
    };
    
    var setNewTotalSupply = Meteor.wrapAsync(server_contracts.RSC_SimpleSale.setNewTotalSupply);
    return ({success: true, txHash: setNewTotalSupply(amount, transaction)});
    
  },

  UnderwriteInsurance: function(policyId, probability, underwriting_action) {

    console.log(policyId);
    console.log(probability);
    console.log(underwriting_action);
        
    var password = passwd[coinbase];
    web3.personal.unlockAccount(coinbase, password);
    
    var transaction = {
      from: coinbase
    };
    
    var underwrite = Meteor.wrapAsync(server_contracts.RSC_Insurance.underwrite);
    return ({success: true, txHash: underwrite(policyId, probability, underwriting_action, transaction)});
    
  },

  SetRiskManagerInsurance: function(address) {

    console.log(address);
        
    var password = passwd[coinbase];
    web3.personal.unlockAccount(coinbase, password);
    
    var transaction = {
      from: coinbase
    };
    
    var setRiskManager = Meteor.wrapAsync(server_contracts.RSC_Insurance.setRiskManager);
    return ({success: true, txHash: setRiskManager(address, transaction)});
    
  },

  SetOracleInsurance: function(address) {

    console.log(address);
        
    var password = passwd[coinbase];
    web3.personal.unlockAccount(coinbase, password);
    
    var transaction = {
      from: coinbase
    };
    
    var setOracle = Meteor.wrapAsync(server_contracts.RSC_Insurance.setOracle);
    return ({success: true, txHash: setOracle(address, transaction)});
    
  }

});
  

});

Meteor.methods({
	"sendMail": function(options) {
		this.unblock();

		Email.send(options);
	}
});