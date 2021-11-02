import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import abi from './utils/HelloEthereum.json';

const App = () => {
  // state variable to store user's public wallet
  const [currentAccount, setCurrentAccount] = useState('');
  const [allInteractions, setInteractions] = useState([]);

  const [message, setMessage] = useState('');

  const contractAddress = '0x5F2fA4c3F04C29B58E99D5E8F7caFd64607bf815';
  const contractABI = abi.abi;

  const getAllInteractions = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const myContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const interactions = await myContract.getAllInteractions();

        let interactionsCleaned = [];
        interactions.forEach((interaction) => {
          interactionsCleaned.push({
            address: interaction.actor,
            message: interaction.message,
            timestamp: new Date(interaction.timestamp * 1000),
          });
        });
        setInteractions(interactionsCleaned);
        console.log(interactions);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const walletConnectionCheck = async () => {
    try {
      // we need access to window.ethereum
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Make sure you have Metamask installed!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }

      // check if we are authorized to access user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
        getAllInteractions();
      } else {
        console.log('No authorized account found.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // implementing connectWallet method
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Please install Metamask before proceeding.');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const interact = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const myContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await myContract.getTotalInteractions();
        console.log('Retrieved total interactions…', count.toNumber());

        // execute interaction from smart contract
        const interactTxn = await myContract.interact(message);
        console.log('Mining…', interactTxn.hash);

        await interactTxn.wait();
        console.log('Mined—', interactTxn.hash);

        count = await myContract.getTotalInteractions();
        console.log('Retrieved total interactions…', count.toNumber());
        window.location.reload();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    walletConnectionCheck();
  }, []);

  // Listen in for emitter events!
  // useEffect(() => {
  //   let myContract;

  //   const onNewInteraction = (actor, timestamp, message) => {
  //     console.log('NewInteraction', actor, timestamp, message);
  //     setInteractions((prevState) => [
  //       ...prevState,
  //       {
  //         address: actor,
  //         timestamp: new Date(timestamp * 1000),
  //         message: message,
  //       },
  //     ]);
  //   };

  //   if (window.ethereum) {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();

  //     myContract = new ethers.Contract(contractAddress, contractABI, signer);
  //     myContract.on('NewInteraction', onNewInteraction);
  //   }

  //   return () => {
  //     if (myContract) {
  //       myContract.off('NewInteraction', onNewInteraction);
  //     }
  //   };
  // }, []);

  return (
    <div className='mainContainer'>
      <div className='dataContainer'>
        <h1 className='header'>hello ethereum</h1>
        <h2 className='subheader'>Connect your Ethereum wallet to post!</h2>
        <textarea
          name='message'
          id='msgTextArea'
          placeholder='Enter a message'
          cols='5'
          rows='5'
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className='InteractButton' onClick={interact}>
          Post
        </button>
        {/* if there is no currentAccount render this button */}
        {!currentAccount && (
          <button className='InteractButton' onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allInteractions.map((interaction, index) => {
          return (
            <div key={index} className='messageCard'>
              <h3 className='message'>
                <span className='address'>Address:</span>{' '}
                <a
                  href={`http://rinkeby.etherscan.io/address/${interaction.address}`}
                >
                  {interaction.address}
                </a>
              </h3>
              <h4 className='message timestamp'>
                Time: {interaction.timestamp.toString()}
              </h4>
              <p className='message messageBody'>{interaction.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
