import web3 from '../helper';

const metamaskAccount = () => {
    var promise = new Promise(function (resolve, reject) {
      web3.eth.getAccounts()
        .then(r => {
          console.log("first account is " + r[0]);
          resolve(r[0]);
        })
        .catch(e => {
          reject();
        })
    })
    return promise;
  }

  export default metamaskAccount;