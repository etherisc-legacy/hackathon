/**
 * RSC Risk manager contract.
 * The risk manager contract takes care of the risk pools and
 * initiates token sales or buy-back as needed.(not implemented yet)
 * 
 * @title Auction of tokens
 * @author Christoph Mussenbrock
 * 
 */

pragma solidity ^0.4.0;

import "./RSC_Token.sol";
import "./RSC_Insurance.sol";
import "./RSC_SimpleSale.sol";

contract RSC_RiskManager {

	address public owner;
	RSC_Insurance insurance;
	RSC_SimpleSale simpleSale;
	
    modifier onlyOwner() {
        if (msg.sender != owner) {
            // Only owner is allowed to proceed
            throw;
        }
        _;
    }
	
	function RSC_RiskManager() {
		owner = msg.sender;
	}
	
	function fund_insurance(uint _amount) 
		onlyOwner 
		external {

		simpleSale.send_Funds(_amount);
		
	}
	
	function defund_insurance(uint _amount) 
		onlyOwner 
		external {

		insurance.send_Funds(_amount);
		
	}
	
	
	function setNewTotalSupply(uint _amount)
		onlyOwner {
		simpleSale.setNewTotalSupply(_amount);
	}
		

	function setContracts(address _insurance_address, address _simpleSale_address)
		onlyOwner
		external {
	
		insurance = RSC_Insurance(_insurance_address);
	    simpleSale= RSC_SimpleSale(_simpleSale_address);
		
	}

}