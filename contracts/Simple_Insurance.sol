/**
 * Insurance skeleton.
 *
 *  This skeleton does not provide a real insurance, 
 *  instead, it serves as a mockup to demonstrate the investor backend.
 *
 */

pragma solidity ^0.4.0;


contract Simple_Insurance {

    modifier onlyOracle {
        if (msg.sender != oracle) {
            throw;
        } 

        _;

    }

    enum policyState {Applied, Accepted, Revoked, PaidOut,
					  Expired, Declined, SendFailed}


    event LOG_PolicyApplied(
        uint policyId,
        address customer,
        string risk,
        uint premium
    );

    event LOG_PolicyAccepted(
        uint policyId
    );

    event LOG_PolicyPaidOut(
        uint policyId,
        uint amount
    );

    event LOG_PolicyExpired(
        uint policyId
    );

    event LOG_PolicyDeclined(
        uint policyId, 
        string reason
    );

    event LOG_SendFail(
        uint policyId, 
        string reason
    );
    uint minPremium = 50 finney;
    uint maxPremium = 50 ether;
    uint maxPayout  = 500 ether;


    struct policy {

        // the customer
        address customer;
        // premium
        uint premium;
        // some description of the risk
        string risk;
        // probability of default (PD), x 100 (2 Decimal Places; 0.01 == 1)
        uint probability;
        // the state of the policy
        policyState state;
        // time of last state change
        uint stateTime;
        // in case of a claim, we store the description of the claim
        string stateMessage;
        // calculated payout
        uint calculatedPayout;
        uint actualPayout;
    }

    address public owner;
    address public oracle;

    // Table of policies
    policy[] public policies;
    // Lookup policyIds from customer addresses

    // constructor
    function Simple_Insurance (address _owner, address _oracle) {

        owner = _owner;
        oracle = _oracle;

    }

    function getPolicyCount(address _customer)
        constant returns (uint _count) {
        return policies.length;
    }


    // create new policy
    function newPolicy(
        string _risk 
        ) payable {

        // don't accept too low or too high policies

        if (msg.value < minPremium || msg.value > maxPremium) {
            LOG_PolicyDeclined(0, 'Invalid premium value');
            if (!msg.sender.send(msg.value)) {
                LOG_SendFail(0, 'newPolicy sendback failed (1)');
            }
            return;
        }

        // store or update policy
        uint policyId = policies.length++;
        policy p = policies[policyId];

        p.customer = msg.sender;
        // the remaining premium after deducting reserve and reward
        p.premium = msg.value;
        p.risk = _risk;

        // now we have successfully applied
        p.state = policyState.Applied;
        p.stateMessage = 'Policy applied by customer';
        p.stateTime = now;
        LOG_PolicyApplied(policyId, msg.sender, _risk, p.premium);

        // call oraclize to get Flight Stats; this will also call underwrite()
        // getFlightStats(policyId, _carrierFlightNumber);
    }
    
    function underwrite(uint _policyId) 
        onlyOracle { 

        policy p = policies[_policyId]; // throws if _policyId invalid

        p.state = policyState.Accepted;
        p.stateMessage = 'Policy underwritten';
        p.stateTime = now;

        LOG_PolicyAccepted(
            _policyId 
        );

    }
    
    function payOut(uint _policyId, string _claim, uint _payout)
        onlyOracle {

        policy p = policies[_policyId];
        
        if (_payout == 0) {
            p.state = policyState.Expired;
            p.stateMessage = 'Expired - no payout!';
            p.stateTime = now;
            LOG_PolicyExpired(_policyId);
        } else {

            p.calculatedPayout = _payout;

            if (_payout > maxPayout) {
                _payout = maxPayout;
            }

            if (_payout > this.balance) { // don't go for chapter 11
                _payout = this.balance;
            }

            p.actualPayout = _payout;

            if (!p.customer.send(_payout))  {
                p.state = policyState.SendFailed;
                p.stateMessage = 'Payout, send failed!';
                p.actualPayout = 0;
                LOG_SendFail(_policyId, 'payout sendfail');
            }
            else {
                p.state = policyState.PaidOut;
                p.stateMessage = 'Payout successful!';
                p.stateTime = now; // won't be reverted in case of errors
                LOG_PolicyPaidOut(_policyId, _payout);
            }
        }

    }
    
    // fallback function: don't accept ether
    function () {

        throw;

    }

    
}
