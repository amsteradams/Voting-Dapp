import React, {useContext, useState, useEffect} from 'react'
import { ContractContext } from '../../App';
import "./Content.css";
import DisplayProposals from './ProposalsRegistration/DisplayProposals/DisplayProposals';
import ProposalsRegistration from './ProposalsRegistration/ProposalsRegistration';
import RegisteringVoters from './RegisteringVoters/RegisteringVoters';
import Tallied from './Tallied/Tallied';
import Vote from './VotingSession/Vote';
export default function Content(props) {
  const context = useContext(ContractContext);
  const [proposals, setProposals] = useState([]);
  
  useEffect(() => {
    getProposals();
  }, [])
  
  const getProposals = async () => {
    let options = {
      fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
      toBlock: 'latest'
    };
    const listProposals = await context.ContractVar.contract.getPastEvents('ProposalRegistered', options);
    setProposals(listProposals);
    console.log('liste de proposition dans Content getProposal : ' + listProposals)
    await context.ContractVar.contract.events.ProposalRegistered()
          .on('data', event => {
            getProposals();
          })
          .on('changed', changed => console.log(changed))
          // .on('error', err => throw err)
          .on('connected', str => console.log(str))

    await context.ContractVar.contract.events.Voted()
          .on('data', event => {
            window.location.reload();
          })
          .on('changed', changed => console.log(changed))
          // .on('error', err => throw err)
          .on('connected', str => console.log(str))
  }
  switch (props.value) {
    case '0' : return(<div id="content"><RegisteringVoters /></div>)     
        break;
    case '1' : return(<div id="content"><ProposalsRegistration value={proposals}/></div>)     
        break;
    case '2' : return(<div id="content"><DisplayProposals value={proposals} /></div>)     
        break;
    case '3' : return(<div id="content-voting"><DisplayProposals value={proposals} /><Vote /></div>)     
        break;
    case '4' : return(<div id="content"><DisplayProposals value={proposals}/></div>)     
        break;
    case '5' : return(<div id="content-voting"><DisplayProposals value={proposals}/><Tallied /></div>)     
        break;

    default: return("error")
        break;
}
}
