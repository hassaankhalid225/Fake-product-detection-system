// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ProductVerification {
    
    struct Product {
        string serialNumber;
        string productHash;
        address company;
        uint256 timestamp;
        bool isRegistered;
    }
    
    mapping(string => Product) private products;
    
    // Event emitted when a new product is added
    event ProductAdded(string indexed serialNumber, string productHash, address indexed company, uint256 timestamp);
    
    // Register a new product
    function registerProduct(string memory _serialNumber, string memory _productHash) public {
        require(!products[_serialNumber].isRegistered, "Product serial number already registered.");
        
        products[_serialNumber] = Product({
            serialNumber: _serialNumber,
            productHash: _productHash,
            company: msg.sender,
            timestamp: block.timestamp,
            isRegistered: true
        });
        
        emit ProductAdded(_serialNumber, _productHash, msg.sender, block.timestamp);
    }
    
    // Verify a product
    function verifyProduct(string memory _serialNumber) public view returns (bool isRegistered, string memory productHash, address company, uint256 timestamp) {
        require(products[_serialNumber].isRegistered, "Product not found.");
        
        Product memory p = products[_serialNumber];
        return (p.isRegistered, p.productHash, p.company, p.timestamp);
    }
}
