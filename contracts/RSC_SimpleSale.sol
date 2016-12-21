/**
 * Simple Sale Contract - not for use in production, 
 * serves only as mockup for the RSC Whitepaper.
 * 
 * @title Simple Token Sale Contract
 * @author Christoph Mussenbrock
 *
 */

pragma solidity ^0.4.0;

import "./RSC_Token.sol";
import "./RSC_ControlledFund.sol";

contract RSC_SimpleSale is RSC_ControlledFund {

    /**
     * Restrict function call to sale period.
     */
    modifier onlyAtSale {
        if (saleFinished) {
            throw;
        }        
        _;
    }

    /**
     * Restrict function call to after sales period.
     */
    modifier onlyAfterSale {
        if (!saleFinished) {
            throw;
        }
        _;
    }

    /**
     * Log every bid with investor, amount, chargeable
     */
    event Log_Sale(address indexed investor, uint256 amount);

    /**
     * The underlying token.
     */
    RSC_Token public RSC_Token_Contract;

    /**
     * We calculate a day with 5760 Blocks (15sec Blocktime), 
     * and don't care for small deviations
     */

    uint constant public MAXIMUM_SALE_BLOCK   = 28 * 5760;

    /**
     * The funding goal - 1M Ether.
     * @type {uint}
     */
    uint constant public FUNDING_GOAL         =   1000000 ether;

    /**
     * The targeted token number: 100M 
     * @type {uint}
     */
    uint constant public TOTAL_TOKENS         = 100000000; // 100M

    /**
     * The starting block. Anytime between end of January 2017 and March 2017.
     * @type {uint}
     */
    uint constant public STARTBLOCK           =   181000; // 3141592;

    /**
     * The total amount raised.
     */
    uint public totalRaised;

    /**
     * Token price.
     */
    uint public tokenPrice;

    /**
     * True if auction is finished
     */
    bool public saleFinished;

    /**
     * Constructor
     */
    function RSC_SimpleSale() {
        owner = msg.sender;
    }
	
    /**
     * The Sale function.
     */
    function tokenSale()
        public
        onlyAtSale
        payable
    {
        uint amount = msg.value;
        if (saleFinished 
            || amount == 0 
			|| tokenPrice == 0
            || block.number < STARTBLOCK 
            || block.number > STARTBLOCK + MAXIMUM_SALE_BLOCK) {
            // too early, too late, or no investment
            throw;
        }

        if (totalRaised + amount > FUNDING_GOAL) {
            amount = FUNDING_GOAL - totalRaised;
        }

        // Calculate the possible amount.
        uint tokenCount = amount / tokenPrice;
        amount = tokenCount * tokenPrice;
        totalRaised += amount;
		
		// TODO: check for amount > 0 
		
        // Send back any change
        amount = msg.value - amount;
        if (!msg.sender.send(amount)) {
            throw;
        }

        // Now everything is ok. We can safely transfer the tokens.
        RSC_Token_Contract.transfer(msg.sender, tokenCount);
        Log_Sale(msg.sender, amount);
        if (totalRaised > FUNDING_GOAL) {
            endSale();
        }


    }

    /**
     * Finish the auction and set the initial token price.
     */
    function endSale()
        private {
        saleFinished = true;
    }

    /**
     * Set the Token contract.
     * @param _RSC_Token The token contract
     */
    function setTokenContract(address _RSC_Token) 
        external
        onlyOwner {
        RSC_Token_Contract = RSC_Token(_RSC_Token);
    }
	
    function setPrice(uint _tokenPrice) 
        external
        onlyRiskManager
        onlyAtSale {
        tokenPrice = _tokenPrice;
    }

	function setNewTotalSupply(uint _amount)
		onlyRiskManager 
		external {
		RSC_Token_Contract.setNewTotalSupply(_amount);
	}
	
}
