import { useState } from 'react';
import { Web3 } from 'web3';

function App() {
  const [connectedAccount, setConnectedAccount] = useState('');
  const [deployedAddress, setDeployedAddress] = useState('');
  const [tokenAllowance, setTokenAllowance] = useState('0');
  const [chainlinkPrice, setChainlinkPrice] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [errMsg, setErrMsg] = useState('');
  const [deposit, setDeposit] = useState('');

  async function connectMetamask() {
    //check metamask is installed
    if (window.ethereum) {
      // instantiate Web3 with the injected provider
      const web3 = new Web3(window.ethereum);

      //request user to connect accounts (Metamask will prompt)
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      //get the connected accounts
      const accounts = await web3.eth.getAccounts();

      //show the first connected account in the react page
      setConnectedAccount(accounts[0]);
    } else {
      alert('Please download metamask');
    }
  }

  

  return (
    <>
      {/* Button to trigger Metamask connection */}
      <button onClick={() => connectMetamask()}>Connect wallet</button>

      {/* Display the connected account */}
      <h2>Connected to: {connectedAccount}</h2>

      
    </>
  );
}

export default App;
