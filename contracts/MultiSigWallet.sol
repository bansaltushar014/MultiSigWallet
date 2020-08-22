pragma solidity ^0.5.0;

contract MultiSigWallet{
    
    address private owner;
    mapping(address => uint) owners;
    
    
    
    struct Transaction { 
            address from;
            address payable to;
            uint value;
            uint signatureCount; 
            mapping(address => uint) signed;
            bool isValid;
    }
    
    Transaction[] pendingTransaction;
    uint transactionIdx = 0;
    
    modifier onlyOwners {
      require(owners[msg.sender] == 1);
      _;
    }
    
    modifier Owner {
      require(owners[msg.sender] == 1);
      _;
    }
    
    constructor() public{
        owner = msg.sender;
        owners[msg.sender] = 1;
    }
    
    function creator() view public returns(address){
        return owner;
    }
    
    function addOwners(address newOwner) Owner public{
        owners[newOwner] = 1;
    }
    
    function removeOwner(address removeOwner) public{
        
    }
    
    function deposit() payable public onlyOwners{
        
    }
    
    function transferAmount(address payable to, uint value) onlyOwners public{
        require(address(this).balance >= value);
        Transaction memory transaction;
        transaction.from = msg.sender;
        transaction.to = to;
        transaction.value = value;
        
        transaction.isValid = true;
        
                
        
        pendingTransaction.push(transaction);
        transactionIdx++;
        
    }
    
    function signTransaction(uint id) onlyOwners payable public{
        
        Transaction storage transaction = pendingTransaction[id];
        require(transaction.isValid == true);
        require(address(this).balance >= transaction.value);
        require(transaction.from != msg.sender);
        require(transaction.from != address(0));
        require(transaction.signed[msg.sender] != 1);
        
        transaction.signed[msg.sender] = 1;
        transaction.signatureCount++;
        
        if(transaction.signatureCount >= 3){
            transaction.to.transfer(transaction.value);
            transaction.isValid = false;
            
        }

    }
    
    
    function walletBalance() view public returns(uint) {
        return address(this).balance;
    }
    
}