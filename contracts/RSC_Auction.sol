/**
 * 
 * @title Auction of tokens
 * @author Christoph Mussenbrock
 *
 */

pragma solidity ^0.4.0;
import "Tokens/AbstractToken.sol";

contract RSC_Auction {

    /**
     * Restrict function call to owner.
     */
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
    modifier onlyAtSale {
        if (auctionFinished) {
            throw;
        }        
    }

    /**
     * Restrict function call to after sales period.
     */
    modifier onlyAfterSale {
        if (!auctionFinished) {
            throw;
        }
        _;
    }

    /**
     * Log every bid with investor, amount, chargeable
     */
    event Log_Bid(address indexed investor, uint256 amount, uint256 chargeable);

    /**
     * The underlying token.
     */
    Token public RSC_Token;

    /**
     * For every bid, we record amount (the value sent) and chargeable 
     * (what part of the amount counts for the token distribution).
     */
    struct bid {
        uint amount;
        uint chargeable;
    }

    /**
     * We calculate a day with 5760 Blocks (15sec Blocktime), 
     * and don't care for small deviations
     */

    uint constant public MINIMUM_SALE_BLOCK   = 7 * 5760;
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
     * Degression: 
     * 
     * Funds which are invested later count less.
     * This puts a little incentive to invest early.
     * For this, we provide a linear degression scheme.
     * Funds at the beginning count full (with factor 1.0),
     * Funds at the end count with factor 0.3,
     * in between there is linear degression.
     * @type {uint}
     */

    uint constant public DEGRESSION           =       300; // =0.3

    /**
     * The starting block. Anytime between end of January 2017 and March 2017.
     * @type {uint}
     */
    uint constant public STARTBLOCK           =   3141592;

    /**
     * The total amount raised.
     */
    uint public totalRaised;

    /**
     * The total amound charged (after degression)
     */
    uint public totalCharged;

    /**
     * Token price.
     */
    uint public tokenPrice;

    /**
     * True if auction is finished
     */
    bool public auctionFinished;

    /**
     * Mapping with individual bids.
     * @param  {address} Address of investor
     * @return {bid}     bid struct.
     */
    mapping (address => bid) public bids;

    /**
     * Calculate the degression
     * @param  {uint} _amount       Invested amount
     * @return {uint} _chargeable   Degressioned amount
     */
    function calcDegression(uint _amount) constant returns (uint _chargeable) {
        uint average = (2 * totalRaised + _amount) / 2;
        return 
            (DEGRESSION 
              * average + 1000 * (FUNDING_GOAL - average)
            ) * _amount 
            / FUNDING_GOAL;
    }

    /**
     * Calculate token count (only after auction has ended)
     * @param  {uint} _chargeable   Degressioned amount
     * @return {uint} _tokenCount   Token Count
     */
    function calcTokenCount(uint _chargeable) constant 
        returns (uint _tokenCount) {
        return _chargeable / tokenPrice;
    }

    /**
     * The bidding function.
     * Finalizes auction if called after auction has ended 
     * (because FUNDING_GOAL has been reached or auction ends)
     * @return {[type]} [description]
     */
    function bid()
        public
        onlyAtSale
        payable
    {
        uint amount = msg.value;
        if (auctionFinished 
            || amount == 0 
            || block.number < STARTBLOCK 
            || block.number > STARTBLOCK + MAXIMUM_SALE_BLOCK) {
            // too early, too late, or no investment
            throw;
        }

        bid newBid;
        newBid.amount = msg.value;
        newBid.chargeable = 
        bids[msg.sender] = newBid;
        totalRaised += amount;
        Log_Bid(msg.sender, amount, newBid.chargeable);
        if ((totalRaised > FUNDING_GOAL 
            && block.number > STARTBLOCK + MINIMUM_SALE_BLOCK) 
            || block.number > STARTBLOCK + MAXIMUM_SALE_BLOCK) {
            endAuction();
        }
    }

    /**
     * Finish the auction.
     */
    function endAuction()
        private
    {
        auctionFinished = true;
    }

    /**
     * After the sale has ended, investors can claim their tokens.
     */
    function claimTokens()
        public
        onlyAfterSale
    {
        uint tokenCount = calcTokenCount(bids[msg.sender].chargeable);
        uint charge = tokenCount * tokenPrice;
        bids[msg.sender].chargeable = 0;
        bids[msg.sender].amount -= charge;
        totalCharged += charge;
        RSC_Token.transfer(msg.sender, tokenCount);
    }

    /**
     * After token have been claimed, the remaining money
     * can be claimed.
     */
    function claimChange() 
        public
        onlyAfterSale {
        change = bids[msg.sender].amount
        bids[msg.sender].amount = 0;
        if (bids[msg.sender].chargeable != 0 
            || change = 0
            || !msg.sender.send(bids[msg.sender].amount)) {
            throw;
        } 
    }

    /**
     * Set the Token contract.
     * @param {[type]} address _RSC_Token [description]
     */
    function setTokenContract(address _RSC_Token)
        external
        onlyOwner
    {
        RSC_Token = Token(_RSC_Token);
    }

    function RSC_Auction() {
        owner = msg.sender;
    }

}
