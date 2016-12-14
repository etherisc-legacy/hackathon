pragma solidity ^0.4.0;
import "Tokens/AbstractToken.sol";



/// @title Dutch auction of tokens, inspired by Gnosis Token sale.
/// @author Christoph Mussenbrock
contract RSC_Auction {

    modifier onlyOwner() {
        if (msg.sender != owner) {
            // Only owner is allowed to proceed
            throw;
        }
        _;
    }

    modifier onlyAtSale {
        if (auctionFinished) {
            throw;
        }        
    }

    modifier onlyAfterSale {
        if (!auctionFinished) {
            throw;
        }
        _;
    }

    event Log_Bid(address indexed investor, uint256 amount, uint256 chargeable);

    Token public RSC_Token;

    struct bid {
        uint amount;
        uint chargeable;
    }

    // we calculate a day with 5760 Blocks (15sec Blocktime), and don't care for small deviations

    uint constant public MINIMUM_SALE_BLOCK   = 7 * 5760;
    uint constant public MAXIMUM_SALE_BLOCK   = 28 * 5760;
    uint constant public FUNDING_GOAL         =   1000000 ether;
    uint constant public TOTAL_TOKENS         = 100000000; // 100M
    uint constant public MAX_TOKENS_SOLD      =  90000000; // 90M

    // Degression: 
    // 
    // Funds which are invested later count less.
    // 
    // For this, we provide a linear degression scheme. 

    uint constant public DEGRESSION           =       300; // =0.3
    uint constant public STARTBLOCK           =   3141592;

    uint public totalRaised;
    uint public totalCharged;
    uint public tokenPrice;
    bool public auctionFinished;

    mapping (address => bid) public bids;

    function calcDegression(uint _amount) constant returns (uint _chargeable) {
        uint average = (2 * totalRaised + _amount) / 2;
        return (DEGRESSION * average + 1000 * (FUNDING_GOAL - average)) * _amount / FUNDING_GOAL;
    }

    function calcTokenCount(uint _chargeable) constant returns (uint _tokenCount) {
        return _chargeable / tokenPrice;
    }

    /// @dev Allows to send a bid to the auction.
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
        if ((totalRaised > FUNDING_GOAL && block.number > STARTBLOCK + MINIMUM_SALE_BLOCK) 
            || block.number > STARTBLOCK + MAXIMUM_SALE_BLOCK) {
            finalizeAuction();
        }
    }

    function finalizeAuction()
        private
    {
        auctionFinished = true;
    }

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

    function setup(address _RSC_Token)
        external
        onlyOwner
    {
        RSC_Token = Token(_RSC_Token);
    }

    function RSC_Auction() {
        owner = msg.sender;
    }

}
