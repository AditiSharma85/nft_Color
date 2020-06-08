// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
//pragma experimental ABIEncoderV2;

import "./ERC721.sol";

contract ColorToken is ERC721 {
	constructor () ERC721("ColorToken","CT") public {
	}
}