### MultiSigWallet
It is a multi signature wallet where for any transaction at least 3 valid address are required to sign a transaction. 

### Idea 
[Visit](https://github.com/bansaltushar014/MultiSigWallet/wiki/MultiSigWallet)

### How to start

#### First 
* Run Ganache
* Connect Ganache to Metamask at 7545

#### Second
* git clone 
* cd MultiSigWallet
* npx truffle compile
* npx truffle migrate
* npm install
* cd frontend && npm install
* cd ..
* npm start

#### Notes

* Application can run using Ganache or using Ropsten network. Application is by default is set using with the Ganache. To change to ropsten network, changes need to be done in helper.js file where ropsten URL need to be given and inside the app.js where inside the InitializeContract function. Changes will be made for the response.data.network, 3 is used for the ropsten network and 5777 for the Ganache. 

### How to Contribute
<p>Feel free to create issue and start contibuting :)</p>
