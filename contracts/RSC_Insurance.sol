/**
 * Insurance skeleton.
 *
 *  This skeleton does not provide a real insurance, 
 *  instead, it serves as a mockup to demonstrate the investor backend.
 *
 */
 
pragma solidity ^0.4.0;

import "./RSC_ControlledFund.sol";

contract RSC_Insurance is RSC_ControlledFund {


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

        // 0 - the customer
        address customer;
        // 1 - premium
        uint premium;
        // 2 - some description of the risk
        string risk;
        // 3 - probability of default (PD), x 100 (2 Decimal Places; 0.01 == 1)
        uint probability;
        // 4 - the state of the policy
        policyState state;
        // 5 - time of last state change
        uint stateTime;
        // 6 - in case of a claim, we store the description of the claim
        string stateMessage;
        // 7 - calculated payout
        uint calculatedPayout;
		// 8 - actual Payout
        uint actualPayout;
    }

    address public oracle;
	
	uint public balance;

    // Table of policies
    policy[] public policies;
    // Lookup policyIds from customer addresses

    // constructor
    function RSC_Insurance () {

        owner = msg.sender;

    }

    function getPolicyCount(address _customer)
        constant returns (uint _count) {
        return policies.length;
    }

    // create new policy
    function newPolicy(string _risk) 
		external
		payable {

        // don't accept too low or too high policies

        if (msg.value < minPremium || msg.value > maxPremium) {
            LOG_PolicyDeclined(0, 'Invalid premium value');
            if (!msg.sender.send(msg.value)) {
                LOG_SendFail(0, 'newPolicy sendback failed (1)');
            }
            return;
        }

		balance += msg.value;
		
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
    
    function underwrite(uint _policyId, uint _probability, bool _doUnderwrite) 
		external
        onlyOracle { 

		policy p = policies[_policyId]; // throws if _policyId invalid
		if (p.state != policyState.Applied) {
			throw;
		}
		
		p.stateTime = now;
		if (_doUnderwrite) {
			p.probability = _probability; // 1% = 10000
			p.state = policyState.Accepted;
			p.stateMessage = 'Policy underwritten';
			LOG_PolicyAccepted(
				_policyId 
			);
		} else {
			p.state = policyState.Declined;
			p.stateMessage = 'Policy declined';			
			LOG_PolicyDeclined(
				_policyId,
				''
			);
		}
    }
    
	function expirePolicy(uint _policyId) {
        policy p = policies[_policyId];
		if (p.state != policyState.Accepted) {
			throw;
		}
		p.state = policyState.Expired;
        p.stateMessage = 'Policy expired';
        p.stateTime = now;
		LOG_PolicyExpired(_policyId);
	}



    function payOut(uint _policyId, uint _payout, string _claim)
		// external
        onlyOracle {

        policy p = policies[_policyId];
		if (p.state != policyState.Accepted) {
			throw;
		}
        
        if (_payout == 0) {
            p.state = policyState.Expired;
            p.stateMessage = 'Expired - no payout!';
            p.stateTime = now;
            LOG_PolicyExpired(_policyId);
        } else {

            p.calculatedPayout = _payout;

            if (_payout> maxPayout) {
                _payout= maxPayout;
            }

            if (_payout> balance) { // don't go for chapter 11
                _payout= balance;
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
				balance -= _payout;
                LOG_PolicyPaidOut(_policyId, _payout);
            }
        }

    }
    
	function setOracle(address _oracle)
		onlyOwner {
			
		oracle = _oracle;
	}

    // fallback function: don't accept ether
    function () {

        throw;

    }

    
}
