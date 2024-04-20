// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED
 * VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract DataConsumerV3 is Ownable {
    using SafeERC20 for IERC20;

    event DoneStuff(address from);

    AggregatorV3Interface internal dataFeed;
    uint256 public unlockTime;
    ERC20 public token;

    /**
     * Network: Sepolia
     * Aggregator: LINK/USD
     * Address: 0x779877A7B0D9E8603169DdbD7836e478b4624789
     */
    constructor(uint256 _unlockTime, address _token) Ownable(msg.sender) {
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");
        unlockTime = _unlockTime;
        dataFeed = AggregatorV3Interface(0x779877A7B0D9E8603169DdbD7836e478b4624789);
        token = ERC20(_token);
    }

    /**
     * Returns the latest price for LINK/USD pair.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }
    
    function getAllowance() public view returns (uint256) {
        return token.allowance(msg.sender, address(this));
    }

    function getSCAllowance() public view returns (uint256) {
        return token.allowance(address(this), msg.sender);
    }

    function deposit(uint256 amount) external {
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "Token allowance too low"
        );
        token.transferFrom(msg.sender, address(this), amount);
        emit DoneStuff(msg.sender);
    }

    function getTokenBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function withdraw() public onlyOwner {
        require(
            block.timestamp >= unlockTime,
            "Funds are locked for now. Please try again later."
        );
        uint256 amount = token.balanceOf(address(this));
        token.transfer(msg.sender, amount);
        emit DoneStuff(address(this));
    }
}