//
//
//
//
//			Flight Delay Global Parameters
//
//
//

'use strict';

var globals = {};

var Web3 = require('web3');

var contract_ids = require('./contract_ids');
var networks = require('./networks');
var abi_bin = require('./abi_bin');


globals.getContractHash = function(contract) {

	return globals.web3.sha3(contract_ids.contracts[contract]);

}

globals.getContractAddress = function(contract) {

	return globals.AddressResolver.getAddr(globals.getContractHash(contract));

};

globals.getOraclize_OAR_Address = function () {
	
	var OAR = globals.web3.eth.contract(abi.OAR_Abi)
				.at(globals.network.OAR_Addr);
	return OAR.addr();
}

globals.getOraclize_CB_Address = function () {

	var OAI = globals.getOraclize_OAR_Address();	
	var OraclizeI = globals.web3.eth.contract(abi.OraclizeI_Abi)
				.at(OAI);
	return OraclizeI.cbAddress();
}

globals.init = function (network) {

	globals.network	= networks[network];
	globals.web3 = new Web3();
	globals.web3.setProvider(
		new globals.web3.providers.HttpProvider(networks[network].httpProvider));
	if (globals.network.AddressResolver_addr) {
		globals.AddressResolver = 
			globals.web3.eth.contract(abi_bin.abi['RSC_AddressResolver']).at(globals.network.AddressResolver_addr);
	}
}

module.exports = globals;