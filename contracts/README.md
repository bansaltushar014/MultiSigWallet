### Contract MultiSigWallet.sol

#### Constructor 
Deployer of this contract becomes one of the owner of wallet by defualt. Mapping `mapping(address => uint) owners;`  is used maintain the record & to know the validity of address. <br/>
if(address => 1) means valid owner <br/>
if(address => 2) means not valid owner anymore <br/>

#### creator
It returns who is the creator 

#### getvalue
It returns 0,1 or 2. where 0 for non existing, 1 for valid & 2 for not valid. 

#### addOwners
It takes the parameter address and push the address to mapping owners & to array addedOwners. Variable noOfOwners stores the number of valid owners. 

#### noOfOwner
It returns the number of valid owners. 

#### getAddedOwners
It returns the array of added owners 

#### removeOwner
It takes the address as parameter the remove the address from the array addedOwners and change the uint value "1" to "2" in mapping owners. 

#### deposit
It is the payable function which gets called to store the ether in the contract. 

#### transferAmount
This function creates a transaction which will get signed by other valid owners. Array createdTransaction will contain the complete transaction where `transaction.isValid` will determine whether the transaction is valid or not. Its role is important in signTransaction function. Array pendingTransaction will contain the transaction value like 0,1,2,3,4,5..... 

#### signTransaction
The function will be called by only other valid owners. When this function will be called by three different valid owners for same transactionId then the particular transaction can succeed. 

#### removeTransaction
This function removes the completed transaction. It is internal function which can be called from inside only. 

#### getPendingTransaction
It returns the array of pending transactions existing at index like 0,2,3,5

#### getTransaction
It returns the complete transaction that is pending. It takes the index of transaction as parameter. 

#### walletBalance
It returns the amount of ether stored in the wallet. 