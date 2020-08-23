import Web3 from 'web3';

const Initialize = {
    web3 : null,
    initial:function () {
        if (typeof web3 !== 'undefined' && window.ethereum) {
            // Use Mist/MetaMask's provider
            console.log("metamask");
            this.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
          } else {
            console.log("called");
            this.web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
          }
    }
}

Initialize.initial();
export default Initialize.web3;