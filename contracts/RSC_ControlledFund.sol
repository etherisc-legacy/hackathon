/**
 * Controlled Fund - 
 * 
 * @title Controlled Fund
 * @author Christoph Mussenbrock
 *
 */

pragma solidity ^0.4.0;

import "./owned.sol";


contract RSC_ControlledFund is owned {

    /**
     * Restrict function call to riskManager.
     */
    modifier onlyRiskManager() {
        if (msg.sender != riskManager) {
            // Only owner is allowed to proceed
            throw;
        }
        _;
    }

    /**
     * Restrict function call to funder.
     */
    modifier onlyFunder() {
        if (msg.sender != funder) {
            // Only owner is allowed to proceed
            throw;
        }
        _;
    }
	
	address public riskManager;
	address public funder;
	
	RSC_ControlledFund pool;
	
	uint public fundingBalance;
	
	function setup(address _riskManager, address _funder) 
		onlyOwner {
		riskManager = _riskManager;
		funder = _funder;
		pool = RSC_ControlledFund(funder);
	}
	
	function send_Funds(uint _amount) 
		onlyRiskManager {
		fundingBalance -= _amount;
		pool.receive_Funds.value(_amount)();
	
	}

	function receive_Funds() 
		onlyFunder
		payable {
		fundingBalance += msg.value;
		
	}

}
