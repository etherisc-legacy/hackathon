/**
 * ContractRegistry
 * (C) etherisc GmbH 2016
 * @license MIT
 */

contract ContractRegistryDB {

	/**
	 * The Registry Database
	 * @param  {uint16} 	Contract Id.
	 * @return {address}    Address of Contract.
	 */
	mapping (uint16 => address) public CR_DB;

	/**
	 * [CR_ID description]
	 * @type {Number}
	 */
	uint16 constant CR_ID = 0;

	/**
	 * Set a record.
	 * @param {uint16}  	_contractId Contract Id.
	 * @param {address}  	_addr       Address.
	 */
	function set(uint16 _contractId, address _addr) {

		if ((_contractId == 0 && CR_DB[CR_ID] != 0x0) ||
		    (_contractId != 0 && CR_DB[CR_ID] != msg.sender)) throw;
		CR_DB[_contractId] = _addr;
	}

	/**
	 * Retrieve a record from the DB.
	 * Provided automatically by compiler.
	 * @param  {uint16} 	_contractId 	Contract Id.
	 */
	// function get(uint16 _contractId) {
	//  	return CR_DB[_contractId];
	// }

}

contract Registered {
	address ContractRegistry_Addr;

	function setContractRegistry() {
		if (ContractRegistry_Addr != 0x0 && 
			ContractRegistry_Addr != msg.sender) throw;
		ContractRegistry_Addr = msg.sender;
	}

	function deregister() {
		if (msg.sender == ContractRegistry_Addr) {
			selfdestruct(ContractRegistry_Addr);
		}
	}

}

contract ContractRegistry {

	using ContractIds;

	/**
	 * Only root can do some things.
	 */
	modifier onlyRoot {
		if (msg.sender == root) {
			_;
		}

		// Alternative:
		// if (msg.sender != owner) {
		// 		throw;
		// }
		// _;

	}

	/**
	 * Address of owner ("root")
	 * @type {address}
	 */
	address root;

	/**
	 * The ContractRegistry itself has ID = 0
	 * @type {Number}
	 */
	uint16 constant CR_ID = 0;

	/**
	 * Address of ContractRegistryDB
	 * @type {address}
	 */
	address ContractRegistryDB_Addr;

	/**
	 * Constructor. Self-registers itself in the ContractRegistryDB.
	 * @param {address} 	_ContractRegistryDB_Addr Address of ContractRegistryDB
	 */
	function ContractRegistry (address _ContractRegistryDB_Addr) {
		root = msg.sender;
		ContractRegistryDB_Addr = _ContractRegistryDB_Addr;
		register(CR_ID, this.address);
	}

	/**
	 * Register a contract address.
	 * @param  {uint16} 	_contractId   Contract Id.
	 * @param  {address} 	_addr         Address of Contract to register.
	 */
	function register(uint16 _contractId, address _addr) onlyRoot {
		Registered(_addr).setContractRegistry(this.address);
		ContractRegistryDB(ContractRegistryDB_Addr).set(_contractId, _addr);
	}

	/**
	 * Remove a contract from register and selfdestruct him.
	 * @param  {uint16} 	_contractId    Contract to destroy
	 */
	function deregister(uint16 _contractId) onlyRoot {
		// selfdestruct and remove from directory 
		Registered(
			ContractRegistryDB(
				ContractRegistryDB_Addr)
					.CR_DB[_contractId]))
						.deregister();		
		register(_contractId, 0x0);
	}
}
