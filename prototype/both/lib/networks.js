//
//
//
//
//		Network definitions for hack.ether.camp
//
//
//



var networks = {
	
	testrpc : {	
		desc: 					'testrpc',
		ownerAddress:			'',
		AddressResolver_addr:	'0xe20fd9d31d5e8647836ac3310dd3602708ece6b3',
		OAR_Addr: 				'',
		multisig: 				'0xDC7cFc4e9864fEaB8aa07be7C4608DA91cc1f36b',
		httpProvider:			'http://testrpc.etherisc.com',
	},
	
	ropsten : {
		desc:					'ropsten',
		ownerAddress:			'0xffc614ee978630d7fb0c06758deb580c152154d3',
		AddressResolver_addr:	'0xc3463b1aaa94ee0332d480860231c04a52cf108d',
		OAR_Addr: 				'0xc03a2615d5efaf5f49f60b7bb6583eaec212fdf1',
		multisig: 				'0xffc614ee978630d7fb0c06758deb580c152154d3',
		httpProvider:			'http://localhost:8645',
		etherscan_url: 			(address) => 'https://testnet.etherscan.io/address/' + address,
		etherscan_tx_url: 		(tx) => 'https://testnet.etherscan.io/tx/' + tx,
		oraclizeQueryApi: 		(queryId) => 'https://api.oraclize.it/api/v1/query/eth_testnet_' + queryId + '/status',
	},

	mainnet : {
		desc:					'mainnet',
		ownerAddress:			'',
		AddressResolver_addr:	'',
		OAR_Addr: 				'0x1d3b2638a7cc9f2cb3d298a3da7a90b67e5506ed',
		multisig: 				'0x5cb5F46a655C02889172323760d12d0e5D83CDAf',
		httpProvider:			'http://localhost:8545',
		etherscan_url: 			(address) => 'https://www.etherscan.io/address/',
		etherscan_tx_url: 		(tx) => 'https://etherscan.io/tx/' + tx,
		oraclizeQueryApi: 		(queryId) => 'https://api.oraclize.it/api/v1/query/eth_mainnet_' + queryId + '/status',
	},

}

module.exports = networks;