// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "./ERC721.sol";

contract ColorToken is ERC721 {
	string[] public colors;
mapping(string=>bool) _colorExists;
constructor () ERC721("ColorToken","CT") public {
	}
	// E.G. color="#FFFFFF"
	function mint(string memory _color) public {
		//require unique color
		require(_colorExists[_color]==false,"Color token already exists");
		colors.push(_color);
		uint _id = colors.length - 1;
		_mint(msg.sender, _id);
		_colorExists[_color] = true;
		//Call the mint function
		//Track it
	}
}