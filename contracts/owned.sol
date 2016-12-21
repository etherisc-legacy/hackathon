
pragma solidity ^0.4.0;

contract owned {


    modifier onlyOwner {
        if (msg.sender != owner) {
            throw;
        } 

        _;

    }
	
	address public owner;
	
	
	function setOwner(address _newOwner) 
		onlyOwner {
		owner = _newOwner;	
	}
	
}