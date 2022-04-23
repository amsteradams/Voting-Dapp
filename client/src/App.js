import React, { useState, useEffect } from "react";
import VotingContract from "./contracts/Voting.json";
import { createContext } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import Title from "./components/Title/Title";
import UserDisplay from "./components/UserDisplay/UserDisplay";
import StateDisplay from "./components/StateDisplay/StateDisplay";
import DisplayVoters from "./components/DisplayVoters/DisplayVoter";
import Content from "./components/Content/Content";
import Owner from "./components/Owner/Owner";
export const ContractContext = createContext();

const App = () => {

  const [ContractVar, setContractVar] = useState({
    storageValue: [],
    web3: null,
    accounts: null,
    contract: null
  });

  const [owner, setOwner] = useState();
  const [status, setStatus] = useState(0);
  const [bool, setBool] = useState(false);
  const [voters, setVoters] = useState([]);
  useEffect(() => {
    getContractVar();
  }, []);

  const getContractVar = async () => {

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
        );
        const Owner = await instance.methods.owner().call();
        setOwner(Owner);
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        const currentStatut = await instance.methods.workflowStatus().call();
        setStatus(currentStatut);
        //event status listener
        await instance.events.WorkflowStatusChange()
          .on('data', event => {
            setStatus(event.returnValues[1]);
          })
          .on('changed', changed => console.log(changed))
          // .on('error', err => throw err)
          .on('connected', str => console.log(str))

        await instance.events.VoterRegistered()
          .on('data',async event => {
            if(event.returnValues.voterAddress == accounts[0]){
              setBool(true);
            };
            window.location.reload();
          })
          .on('changed', changed => console.log(changed))
          // .on('error', err => throw err)
          .on('connected', str => console.log(str))

          let options = {
            fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
            toBlock: 'latest'
          };
          const listAddress = await instance.getPastEvents('VoterRegistered', options);
          setVoters(listAddress);

        setContractVar({web3, accounts, contract: instance });

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
  };
  
  if(ContractVar.web3){
    return (
      
      <div className="body-container">
        <ContractContext.Provider value={{ ContractVar, setContractVar, owner, status }}>
        <div id="upPart">
          <Title />
          <StateDisplay value={status}/>
          <UserDisplay value={bool} />
        </div>
        <div id="downPart">
          <div id="left">
            <DisplayVoters value={voters} />
          </div>
          <Content value={status}/>
        {owner == ContractVar.accounts[0] ? <Owner /> : ""}
        </div>
      </ContractContext.Provider>
      </div>
    );
  }
  else{
    return (<>Loading Web3...</>)
  }
  
}

export default App;