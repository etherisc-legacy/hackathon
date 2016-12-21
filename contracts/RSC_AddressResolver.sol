/*
Adapted from the original OraclizeAddrResolver 
https://github.com/oraclize/ethereum-api/blob/master/connectors/addressResolver.sol
Copyright (c) 2015-2016 Oraclize srl, Thomas Bertani
*/

pragma solidity ^0.4.0;

contract RSC_AddressResolver {

    mapping(bytes32 => address) public addresses;
    
    address public owner;
    
    function RSC_AddressResolver(){
        owner = msg.sender;
    }
    
    function changeOwner(address _newowner) external {
        if (msg.sender != owner) throw;
        owner = _newowner;
    }
    
    function getAddress(bytes32 hash) constant returns (address _oaddr){
        return addresses[hash];
    }
    
    function setAddr(bytes32 hash, address _newaddr) external {
        if (msg.sender != owner) throw;
        addresses[hash] = _newaddr;
    }
    
}


