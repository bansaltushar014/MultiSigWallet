pragma solidity ^0.5.0;

contract MultiSigWallet{
    
    // This is the address who will deploy the contract 
    // Creater(owner) will add other addresses as valid owners
    // Owner will be in the list of onlyOwners, defined in constructor
    address private owner;

    // Any owner who is legal to participate will decided by this mapping
    // if(address => 1) means valid owner
    // if(address => 0) means not valid owner anymore
    mapping(address => uint) owners;
    uint noOfOwners = 1;
    
    struct Transaction { 
            address from;   // who is the sender
            address payable to;   // who is the receiver
            uint value;  // what is the value
            uint signatureCount; // How many people will sign this? 
            mapping(address => uint) signed; // Who has signed it and they are allowed to do it or not
            bool isValid;  // Is it pending or completed.
    }
    
    // Array of struct to keep all transaction
    Transaction[] pendingTransaction;
    uint transactionIdx = 0;  // How many transaction have been done? 
    
    // Condition to give permission to onlyOwners
    modifier onlyOwners {
      require(owners[msg.sender] == 1);
      _;
    }
    
    // Condition to give permission to add Owners 
    modifier Owner {
      require(owners[msg.sender] == 1);
      _;
    }
    
    constructor() public{
        owner = msg.sender;
        owners[msg.sender] = 1;   // By default creator is valid Owner
    }
    
    function creator() view public returns(address){
        return owner;
    }
    
    // To add Owners
    function addOwners(address newOwner) Owner public{
        require(owners[newOwner] != 1); // to check already exist or not with value 1
        require(owners[newOwner] != 0); // to check already exist or not with value 0
        owners[newOwner] = 1;
        noOfOwners++; 
    }
    
    function noOfOwner() view public returns(uint){
        return noOfOwners;
    }
    
    function removeOwner(address removeOwner) public{
        
    }
    
    // To deposit the fund to contract. 
    function deposit() payable public onlyOwners{
        
    }
    

    function transferAmount(address payable to, uint value) onlyOwners public{
        require(address(this).balance >= value);
        Transaction memory transaction;
        transaction.from = msg.sender;
        transaction.to = to;
        transaction.value = value;
        
        transaction.isValid = true;   // Newly created transaction is true, means pending
        
        pendingTransaction.push(transaction);
        transactionIdx++;
    }
    
    //  To sign the transaction where different address will call 
    // the same function with same parameter value
    function signTransaction(uint id) onlyOwners payable public{
        Transaction storage transaction = pendingTransaction[id];
        require(transaction.isValid == true);
        require(address(this).balance >= transaction.value);
        require(transaction.from != msg.sender);
        require(transaction.from != address(0));
        require(transaction.signed[msg.sender] != 1);  // To check the condition where same valid owner cant sign it again. 
        
        transaction.signed[msg.sender] = 1;
        transaction.signatureCount++;
        
        if(transaction.signatureCount >= 3){
            transaction.to.transfer(transaction.value);
            transaction.isValid = false;  // false means transaction completed 
            }
    }
    
    
    function walletBalance() view public returns(uint) {
        return address(this).balance;
    }
    
}