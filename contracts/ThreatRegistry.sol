// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Aegis ThreatRegistry (Token Curated Registry)
 * @dev A decentralized registry of verified Indicators of Compromise (IoCs).
 * Implements a staking and challenging mechanism to maintain absolute data integrity
 * without relying on a centralized authority.
 */

// Minimal ERC20 interface for staking
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

// Minimal ReentrancyGuard for security
abstract contract ReentrancyGuard {
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != ENTERED, "ReentrancyGuard: reentrant call");
        _status = ENTERED;
        _;
        _status = NOT_ENTERED;
    }
}

contract ThreatRegistry is ReentrancyGuard {
    IERC20 public immutable aegisToken;
    
    // Core parameters (Configurable via DAO in production)
    uint256 public constant MIN_STAKE = 100 * 10**18; // 100 AEGIS Tokens required to bond
    uint256 public constant VOTING_PERIOD = 3 days;
    
    enum Status { None, Pending, Challenged, Verified, Rejected }
    
    struct Submission {
        string ipfsCid;         // Evidence package containing dynamic analysis & metadata
        address proposer;
        uint256 stakeAmount;
        Status status;
        uint256 timestamp;
        address challenger;
        uint256 challengeTimestamp;
        uint256 votesFor;       // Votes agreeing with Proposer (Malicious)
        uint256 votesAgainst;   // Votes agreeing with Challenger (Benign/False Positive)
    }
    
    // Mapping of IoC Hash (e.g., SHA-256 of an APK or Deepfake) to Submission state
    mapping(bytes32 => Submission) public submissions;
    
    // Prevent double voting: IoC Hash => Voter Address => bool
    mapping(bytes32 => mapping(address => bool)) public hasVoted;
    
    event Proposed(bytes32 indexed iocHash, address indexed proposer, string ipfsCid, uint256 stake);
    event Challenged(bytes32 indexed iocHash, address indexed challenger, uint256 stake);
    event Voted(bytes32 indexed iocHash, address indexed voter, bool support);
    event Resolved(bytes32 indexed iocHash, Status finalStatus);

    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid token address");
        aegisToken = IERC20(_tokenAddress);
    }
    
    /**
     * @dev Propose a new malicious artifact hash to the registry.
     * @param _iocHash Cryptographic hash (SHA-256) of the artifact.
     * @param _ipfsCid The IPFS Content Identifier linking to the evidence.
     */
    function propose(bytes32 _iocHash, string memory _ipfsCid) external nonReentrant {
        require(submissions[_iocHash].status == Status.None, "IoC already exists in registry");
        
        // Lock the financial Integrity Bond
        require(aegisToken.transferFrom(msg.sender, address(this), MIN_STAKE), "Stake transfer failed");
        
        submissions[_iocHash] = Submission({
            ipfsCid: _ipfsCid,
            proposer: msg.sender,
            stakeAmount: MIN_STAKE,
            status: Status.Pending,
            timestamp: block.timestamp,
            challenger: address(0),
            challengeTimestamp: 0,
            votesFor: 0,
            votesAgainst: 0
        });
        
        emit Proposed(_iocHash, msg.sender, _ipfsCid, MIN_STAKE);
    }
    
    /**
     * @dev Challenge a pending proposal if it is believed to be a false positive.
     * @param _iocHash The hash of the artifact being challenged.
     */
    function challenge(bytes32 _iocHash) external nonReentrant {
        Submission storage sub = submissions[_iocHash];
        require(sub.status == Status.Pending, "IoC is not in pending state");
        require(msg.sender != sub.proposer, "Proposer cannot challenge their own submission");
        
        // Challenger must match the proposer's bond
        require(aegisToken.transferFrom(msg.sender, address(this), sub.stakeAmount), "Stake transfer failed");
        
        sub.status = Status.Challenged;
        sub.challenger = msg.sender;
        sub.challengeTimestamp = block.timestamp;
        
        emit Challenged(_iocHash, msg.sender, sub.stakeAmount);
    }
    
    /**
     * @dev Vote on a challenged submission.
     * @param _iocHash The hash being voted on.
     * @param _support True if supporting the proposer (Malicious), False if supporting the challenger (Benign).
     */
    function vote(bytes32 _iocHash, bool _support) external {
        Submission storage sub = submissions[_iocHash];
        require(sub.status == Status.Challenged, "IoC is not currently being challenged");
        require(block.timestamp <= sub.challengeTimestamp + VOTING_PERIOD, "Voting period has ended");
        require(!hasVoted[_iocHash][msg.sender], "Address has already voted");
        
        // Note for Hackathon: Simplified 1-wallet = 1-vote mechanism.
        // In a production mainnet, voting weight would be proportional to token balance (staked weight).
        if (_support) {
            sub.votesFor += 1;
        } else {
            sub.votesAgainst += 1;
        }
        
        hasVoted[_iocHash][msg.sender] = true;
        emit Voted(_iocHash, msg.sender, _support);
    }
    
    /**
     * @dev Resolve a challenge after the voting period has ended and distribute slashed bonds.
     * @param _iocHash The hash of the artifact to resolve.
     */
    function resolve(bytes32 _iocHash) external nonReentrant {
        Submission storage sub = submissions[_iocHash];
        require(sub.status == Status.Challenged, "IoC is not currently challenged");
        require(block.timestamp > sub.challengeTimestamp + VOTING_PERIOD, "Voting period is still active");
        
        uint256 totalStake = sub.stakeAmount * 2; // Proposer's bond + Challenger's bond
        
        if (sub.votesFor >= sub.votesAgainst) {
            // VERIFIED: Proposer was correct.
            // Slashing execution: Challenger loses bond. Proposer receives their bond back + challenger's bond as a reward.
            sub.status = Status.Verified;
            require(aegisToken.transfer(sub.proposer, totalStake), "Reward transfer failed");
        } else {
            // REJECTED: Challenger was correct (It was a false positive/clean app).
            // Slashing execution: Proposer loses bond. Challenger receives their bond back + proposer's bond as a reward.
            sub.status = Status.Rejected;
            require(aegisToken.transfer(sub.challenger, totalStake), "Reward transfer failed");
        }
        
        emit Resolved(_iocHash, sub.status);
    }
}
