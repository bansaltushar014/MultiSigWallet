import Web3 from 'web3';

const Initialize = {
    web3 : null,
    initial:function () {
        if (typeof web3 !== 'undefined' && window.ethereum) {
            // Use Mist/MetaMask's provider
            console.log("Metamask!");
            this.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
          } else {
            console.log("Ropsten Network!");
            // Infura Ropsten link need to be given here. 
            this.web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/cdfba71cda344898bfcfeaee923cf849"));
          }
    }
}

Initialize.initial();
export default Initialize.web3;