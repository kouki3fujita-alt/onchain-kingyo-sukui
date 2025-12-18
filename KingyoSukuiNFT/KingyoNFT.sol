// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title KingyoNFT
 * @dev 金魚すくいの結果を記録するNFTコントラクト
 * @notice すべてのプレイ結果（成功・失敗・無）がNFTとしてMintされる
 */
contract KingyoNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // ユーザーごとの本日のMint数を記録
    mapping(address => uint256) public dailyMintCount;
    mapping(address => uint256) public lastMintDate;
    
    uint256 public constant MAX_DAILY_MINTS = 10;
    
    // イベント
    event KingyoMinted(
        address indexed player,
        uint256 indexed tokenId,
        string result,
        string tokenURI
    );
    
    constructor() ERC721("Kingyo Sukui NFT", "KINGYO") Ownable(msg.sender) {}
    
    /**
     * @dev 金魚すくい結果をNFTとしてMint
     * @param to ミント先アドレス
     * @param _tokenURI メタデータURI（IPFS）
     * @param result 結果（"Success", "Failure", "Timeout"）
     */
    function mintResult(
        address to,
        string memory _tokenURI,
        string memory result
    ) public onlyOwner returns (uint256) {
        // 日次制限チェック
        require(canMintToday(to), "Daily mint limit reached");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        // 日次カウント更新
        updateDailyCount(to);
        
        emit KingyoMinted(to, tokenId, result, _tokenURI);
        
        return tokenId;
    }
    
    /**
     * @dev 今日まだMint可能かチェック
     */
    function canMintToday(address user) public view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        
        if (lastMintDate[user] < today) {
            return true; // 新しい日
        }
        
        return dailyMintCount[user] < MAX_DAILY_MINTS;
    }
    
    /**
     * @dev 残りMint回数を取得
     */
    function remainingMintsToday(address user) public view returns (uint256) {
        if (!canMintToday(user)) {
            return 0;
        }
        
        uint256 today = block.timestamp / 1 days;
        
        if (lastMintDate[user] < today) {
            return MAX_DAILY_MINTS; // 新しい日
        }
        
        return MAX_DAILY_MINTS - dailyMintCount[user];
    }
    
    /**
     * @dev 日次カウントを更新
     */
    function updateDailyCount(address user) private {
        uint256 today = block.timestamp / 1 days;
        
        if (lastMintDate[user] < today) {
            // 新しい日なのでリセット
            dailyMintCount[user] = 1;
            lastMintDate[user] = today;
        } else {
            dailyMintCount[user]++;
        }
    }
    
    /**
     * @dev 次回Mint可能時刻を取得（秒単位）
     */
    function nextMintAvailableAt(address user) public view returns (uint256) {
        if (canMintToday(user)) {
            return block.timestamp; // 今すぐ可能
        }
        
        // 次の日の00:00 UTC
        uint256 today = block.timestamp / 1 days;
        return (today + 1) * 1 days;
    }
    
    // Override required by Solidity
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
