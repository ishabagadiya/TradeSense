// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TradeSense - Pure Signal Storage
 * @dev Simple storage contract for users to store and retrieve their trading signals
 */
contract TradeSense {
    
    // Signal structure matching LLM response format
    struct Signal {
        string tokenSymbol;
        string signal; // "buy", "sell", "hold"
        uint256 tp1;
        uint256 tp2;
        uint256 sl;
        string signalTimeframe;
        uint8 confidence;
        string reasoning;
        uint256 timestamp;
    }
    
    // User signals: user address => token symbol => array of signals
    mapping(address => mapping(string => Signal[])) public userSignals;
    
    // Track all tokens a user has signals for
    mapping(address => string[]) public userTokens;
    
    // Events
    event SignalStored(address indexed user, string tokenSymbol, string signal, uint8 confidence);
    
    /**
     * @dev Store a new signal (called by user or their authorized app)
     */
    function storeSignal(
        string memory tokenSymbol,
        string memory signal,
        uint256 tp1,
        uint256 tp2,
        uint256 sl,
        string memory signalTimeframe,
        uint8 confidence,
        string memory reasoning
    ) external {
        
        // Create new signal for the caller
        Signal memory newSignal = Signal({
            tokenSymbol: tokenSymbol,
            signal: signal,
            tp1: tp1,
            tp2: tp2,
            sl: sl,
            signalTimeframe: signalTimeframe,
            confidence: confidence,
            reasoning: reasoning,
            timestamp: block.timestamp
        });
        
        // Add to caller's signals
        userSignals[msg.sender][tokenSymbol].push(newSignal);
        
        // Track token for user if first time
        if (userSignals[msg.sender][tokenSymbol].length == 1) {
            userTokens[msg.sender].push(tokenSymbol);
        }
        
        emit SignalStored(msg.sender, tokenSymbol, signal, confidence);
    }
    
    /**
     * @dev Get all signals for caller's specific token
     */
    function getMyTokenSignals(string memory tokenSymbol) 
        external view returns (Signal[] memory) {
        return userSignals[msg.sender][tokenSymbol];
    }
    
    /**
     * @dev Get all signals for any user's specific token (public read)
     */
    function getUserTokenSignals(address user, string memory tokenSymbol) 
        external view returns (Signal[] memory) {
        return userSignals[user][tokenSymbol];
    }
    
    /**
     * @dev Get all tokens caller has signals for
     */
    function getMyTokens() external view returns (string[] memory) {
        return userTokens[msg.sender];
    }
    
    /**
     * @dev Get all tokens a user has signals for
     */
    function getUserTokens(address user) external view returns (string[] memory) {
        return userTokens[user];
    }
    
    /**
     * @dev Get latest signal for caller's token
     */
    function getMyLatestSignal(string memory tokenSymbol) 
        external view returns (Signal memory) {
        Signal[] memory signals = userSignals[msg.sender][tokenSymbol];
        require(signals.length > 0, "No signals found");
        return signals[signals.length - 1];
    }
    
    /**
     * @dev Get latest signal for any user's token
     */
    function getUserLatestSignal(address user, string memory tokenSymbol) 
        external view returns (Signal memory) {
        Signal[] memory signals = userSignals[user][tokenSymbol];
        require(signals.length > 0, "No signals found");
        return signals[signals.length - 1];
    }
    
    /**
     * @dev Get number of signals for caller's token
     */
    function getMySignalCount(string memory tokenSymbol) 
        external view returns (uint256) {
        return userSignals[msg.sender][tokenSymbol].length;
    }
    
    /**
     * @dev Get number of signals for any user's token
     */
    function getUserSignalCount(address user, string memory tokenSymbol) 
        external view returns (uint256) {
        return userSignals[user][tokenSymbol].length;
    }
}