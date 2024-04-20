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

  async function deploySC(): Promise<void> {
    const bytecode: string = "BIN OF YOUR SC GOES HERE";
    
    const abi = require('./MyContractAbi.json');
    const web3 = new Web3(window.ethereum);

    const myContract: any = new web3.eth.Contract(abi);
    myContract.handleRevert = true;
    console.log('deployer account:', connectedAccount);
    const contractDeployer: any = myContract.deploy({
      data: '0x' + bytecode,
      arguments: [1],
    });
  
    try {
      const tx: any = await contractDeployer.send({
        from: connectedAccount,
        gas: 1000000,
        gasPrice: '10000000000',
      });
      setDeployedAddress(tx.options.address);
      console.log('Contract deployed at address: ' + tx.options.address);
    } catch (error) {
      console.error(error);
    }
   
  }

  async function interactSC(): Promise<void> {
    const deployedAddress: string = "0x40d9B3101C0565b39407c3C14C479E6F8bfCBa7B";

    // Create a new contract object using the ABI and bytecode
    const abi: any = require('./MyContractAbi.json');
    const web3 = new Web3(window.ethereum);
    const myContract: any = new web3.eth.Contract(abi, deployedAddress);
    myContract.handleRevert = true;

    try {
      // Get the current value of chainlink
      const response: string = await myContract.methods.getChainlinkDataFeedLatestAnswer().call();
      setChainlinkPrice(response.toString());
    } catch (error) {
      console.error(error);
    }
  }

  

  return (
    <>
      {/* Button to trigger Metamask connection */}
      <button onClick={() => connectMetamask()}>Connect wallet</button>

      {/* Display the connected account */}
      <h2>Connected to: {connectedAccount}</h2>

      {/* Button to trigger SC deployment */}
      <button onClick={() => deploySC()}>Deploy smart contract</button>
      <h2>SC deployed at: {deployedAddress}</h2>

      {/* Button to interact with SC */}
      {/* <button onClick={() => interactSC()}>Interact with deployed smart contract</button> */}
      
      
    </>
  );
}

export default App;
