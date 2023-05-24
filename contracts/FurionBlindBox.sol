// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract FurionBlindBox is Ownable, ERC721 {
    uint256 public constant STATUS_INIT = 0;
    uint256 public constant STATUS_CLAIM = 1;

    uint256 public status;

    bytes32 public merkleRoot;

    string public baseURI;

    // Total minted amount
    uint256 public mintedAmount;

    // User address => Already minted
    mapping(address => bool) public claimed;

    event BlindBoxClaimed(address indexed user, uint256 amount);

    constructor() ERC721("FurionBlindBox", "FBB") {}

    function isAllowedToClaim(
        address _user,
        uint256 _amount,
        bytes32[] calldata _proof
    ) public view returns (bool) {
        return
            MerkleProof.verify(
                _proof,
                merkleRoot,
                keccak256(abi.encodePacked(_user,_amount))
            );
    }

    function start() external onlyOwner {
        status = STATUS_CLAIM;
    }

    function stop() external onlyOwner {
        status = STATUS_INIT;
    }

    function setRoot(bytes32 _merkleRoot) external onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function setBaseURI(string calldata baseURI_) external onlyOwner {
        baseURI = baseURI_;
    }

    function claim(uint256 _amount, bytes32[] calldata _proof) external {
        require(status == STATUS_CLAIM, "FurionBlindBox: not claim time");
        require(!claimed[msg.sender], "FurionBlindBox: already claimed");
        require(
            isAllowedToClaim(msg.sender,_amount, _proof),
            "FurionBlindBox: not allowed to claim"
        );
        
        claimed[msg.sender] = true;

        _mint(msg.sender, _amount);

        emit BlindBoxClaimed(msg.sender,_amount );
    }

       /**
     * @notice BaseURI
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }


        /**
     * @notice Mint multiple NFTs
     *
     * @param  _to     Address to mint NFTs to
     * @param  _amount Amount to mint
     */
    function _mint(address _to, uint256 _amount) internal override {
        uint256 alreadyMinted = mintedAmount;

        for (uint256 i ; i < _amount; ) {
            super._mint(_to, ++alreadyMinted);

            unchecked {
                ++i;
            }
        }

        unchecked {
            mintedAmount += _amount;
        }
    }
}
