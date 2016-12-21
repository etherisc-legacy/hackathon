/*
You should inherit from StandardToken or, for a token like you would want to
deploy in something like Mist, see HumanStandardToken.sol.
(This implements ONLY the standard functions and NOTHING else.
If you deploy this, you won't have anything useful.)

Implements ERC 20 Token standard: https://github.com/ethereum/EIPs/issues/20
.*/

pragma solidity ^0.4.0;

import "./Token.sol";

contract StandardToken is Token {

    /**
     * Transfer token. 
     * @param _to           Recipient address.
     * @param _value        Amount of tokens.
     * @return success      True if transfer was successful.
     */
    function transfer(address _to, uint256 _value) returns (bool success) {
        //Default assumes totalSupply can't be over max (2^256 - 1).
        //If your token leaves out totalSupply and can issue more tokens as time goes on, you need to check if it doesn't wrap.
        //Replace the if with this one instead.
        //if (balances[msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
        if (balances[msg.sender] >= _value && _value > 0) {
            balances[msg.sender] -= _value;
            balances[_to] += _value;
            Transfer(msg.sender, _to, _value);
            return true;
        } else { return false; }
    }

    /**
     * TransferFrom: Transfer in behalf of other person.
     * @param _from         Sender address.
     * @param _to           Recipient address.
     * @param _value        Amount of tokens.
     * @return success       True if transfer was successful.
     */
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        //same as above. Replace this line with the following if you want to protect against wrapping uints.
        //if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && balances[_to] + _value > balances[_to]) {
        if (balances[_from] >= _value && allowed[_from][msg.sender] >= _value && _value > 0) {
            balances[_to] += _value;
            balances[_from] -= _value;
            allowed[_from][msg.sender] -= _value;
            Transfer(_from, _to, _value);
            return true;
        } else { return false; }
    }

    /**
     * Get balance of address.
     * @param _owner        Address of which balance is to be received. 
     * @return balance       The balance
     */
    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }

    /**
     * Approve someone else to perform a token transfer. 
     * @param _spender      Spender
     * @param _value        value
     * @return success       Always true
     */
    function approve(address _spender, uint256 _value) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    /**
     * Get amount of allowance for a owner/spender pair.
     * @param _owner        Token owner. 
     * @param _spender     Spender of the token.
     * @return remaining     Remaining allowance
     */
    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
      return allowed[_owner][_spender];
    }

    /**
     * Balances. In this table the balances of the token owners are kept.
     * @param address Owner's address
     * @return Balance of owner 
     */
    mapping (address => uint256) balances;

    /**
     * Allowance. Keeps track of allowances.
     * @param address    Token owner
     * @param address    Spender of token
     * @return Allowance
     */
    mapping (address => mapping (address => uint256)) allowed;
}

