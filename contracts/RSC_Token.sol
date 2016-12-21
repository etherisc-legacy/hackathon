/**
 * RSC-FDD Token, ERC-20 compliant
 */

pragma solidity ^0.4.0;

import "./StandardToken.sol";

contract RSC_Token is StandardToken {

    modifier onlyOwner() {
        if (msg.sender != owner) {
            // Only owner is allowed to proceed
            throw;
        }
        _;
    }

    /**
     * Restrict function call to sale period.
     */
    modifier onlyRiskManager {
        if (msg.sender != riskManager) {
            throw;
        }        
        _;
    }

    /**
     * Contract owner.
     */
    address public owner;
    
    /**
     * Address of RiskManager Contract
     */
    address public riskManager;

    function () {
        throw;
    }

    /**
     * Name of the token
     * @type {String}
     */
    string constant public name     = 'RSC-FDD';

    /**
     * Number of decimals. 
     * TODO: to be discussed.
     * @type {uint8}
     */
    uint8 constant public decimals  = 18;
    
    /**
     * Three-letter Symbol (for exchanges, ticker et al.)
     * @type {String}
     */
    string public Symbol            = 'RSC';

    /**
     * Version of the token. 
     * TODO: Do we need this?
     * @type {String}
     */
    string public version           = 'H0.1';

    /**
     * Constructor.
     * @param _initialAmount Initial token supply.
     */
    function RSC_Token(
        uint256 _initialAmount
        ) {

        owner = msg.sender;

        balances[owner] = _initialAmount; // Give the creator all initial tokens
        totalSupply = _initialAmount;     // Update total supply

    }

    // TODO: Not sure if we need this. If not, discard it.
    /**
     * Approves and then calls the receiving contract
     * @param _spender      Receiving contract
     * @param _value        Amount of tokens
     * @param _extraData    Extra Data for call
     * @return success       True if call was successfull. 
     */
    function approveAndCall(
        address _spender, 
        uint256 _value, 
        bytes _extraData) 
		external
        returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);

        // call the receiveApproval function on the contract you want to be 
        // notified. This crafts the function signature manually so one doesn't 
        // have to include a contract in here just for this.
        // receiveApproval(address _from, uint256 _value, address 
        // _tokenContract, bytes _extraData)
        // it is assumed that when does this that the call *should* succeed, 
        // otherwise one would use vanilla approve instead.
        if(!_spender.call(
            bytes4(
                bytes32(
                    sha3("receiveApproval(address,uint256,address,bytes)"))), 
            msg.sender, 
            _value, 
            this, 
            _extraData)
        ) { 
            throw; 
        }
        return true;
    }

    /**
     * Adjust the totalSupply. _newTokenSupply can be larger or smaller than
     * the current totalSupply. If it is lower, we can only burn the
     * token owners remaining tokens.
     * TODO: Does this function belong in this contract? or in the 
     * RiskManager contract?
     * @param _newTotalSupply The new totalSupply
     */
    function setNewTotalSupply(uint256 _newTotalSupply) external
        onlyRiskManager {
        if (_newTotalSupply > totalSupply) {
            // increase totalSupply; owner gets new tokens 
            balances[owner] = balances[owner] + (_newTotalSupply - totalSupply);
            totalSupply = _newTotalSupply;
        } else if (totalSupply - _newTotalSupply > balances[owner]) {
            // reduce totalSupply; owner burns tokens
            balances[owner] = balances[owner] - (totalSupply - _newTotalSupply);
            totalSupply = _newTotalSupply;
        } else {
            // _newTotalSupply is too high; burning all remaining unsold tokens.
            totalSupply = totalSupply - balances[owner];
            balances[owner] = 0;
        }

    }

    function setRiskManager(address _newRiskManager) external
        onlyOwner {
        riskManager = _newRiskManager;
    }

    function setOwner(address _newOwner) external
        onlyOwner {
        owner = _newOwner;
    }

}
