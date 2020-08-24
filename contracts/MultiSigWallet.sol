pragma solidity ^0.5.0;

contract MultiSigWallet{
    
    // This is the address who will deploy the contract 
    // Creater(owner) will add other addresses as valid owners
    // Owner will be in the list of onlyOwners, defined in constructor
    address private owner;

    // Any owner who is legal to participate will decided by this mapping
    // if(address => 1) means valid owner
    // if(address => 2) means not valid owner anymore
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
    Transaction[] createdTransaction;
    uint transactionIdx = 0;  // How many transaction have been done? 
    uint[] pendingTransaction; 
    
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
    
    function getvalue(address ad) view public returns(uint){
        return owners[ad];
    }
    
    // To add Owners
    function addOwners(address newOwner) Owner public{
        require(owners[newOwner] != 1);
        owners[newOwner] = 1;
        noOfOwners++; 
    }
    
    function noOfOwner() view public returns(uint){
        return noOfOwners;
    }
    
    function removeOwner(address removeOwner) public{
        // to remove it make the flag 2
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
        
        createdTransaction.push(transaction);
        pendingTransaction.push(transactionIdx);
        transactionIdx++;
    }
    
    //  To sign the transaction where different address will call 
    // the same function with same parameter value
    function signTransaction(uint id) onlyOwners payable public{
        Transaction storage transaction = createdTransaction[id];
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
            removeTransaction(id);
            }
    }
    
    function removeTransaction(uint id) public{
        uint replace = 0;
        uint i;
        for( i=0; i< pendingTransaction.length; i++){
            if(replace == 1){
                pendingTransaction[i-1] = pendingTransaction[i];
            }
            if(pendingTransaction[i]==id){
                replace = 1;
            }
        }
        delete pendingTransaction[i-1];
        pendingTransaction.length = pendingTransaction.length -1;
    }
    
    function getPendingTransaction() public returns(uint[] memory){
        return pendingTransaction; 
    }
    
    
    function getTransaction(uint id) public onlyOwners returns(address, address, uint, uint, bool) {
        //  address from;   // who is the sender
        //     address payable to;   // who is the receiver
        //     uint value;  // what is the value
        //     uint signatureCount; // How many people will sign this? 
        //     mapping(address => uint) signed; // Who has signed it and they are allowed to do it or not
        //     bool isValid;  // Is it pending or completed.
             return(
             createdTransaction[id].from,
             createdTransaction[id].to, 
             createdTransaction[id].value,
             createdTransaction[id].signatureCount,
             createdTransaction[id].isValid);
    }
    
    
    function walletBalance() view public returns(uint) {
        return address(this).balance;
    }
    
}