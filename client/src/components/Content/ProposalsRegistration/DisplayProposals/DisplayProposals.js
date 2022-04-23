import React, {useContext, useState, useEffect} from 'react'
import { ContractContext } from '../../../../App';
import "./DisplayProposals.css";
export default function DisplayProposals(props) {
  const context = useContext(ContractContext);
  const [state, setState] = useState(new Set());
  
  useEffect(() => {
    getProposals();
  }, [props])
  
  const getProposals = async () => {
    if(state.size > 0){
      setState(new Set())
    }
    for (let i = 0; i < props.value.length; i++) {
      const proposal = await context.ContractVar.contract.methods.getOneProposal(props.value[i].returnValues.proposalId).call({from:context.ContractVar.accounts[0]});
      setState(previousState => new Set([...previousState, proposal]))
    }
  }
  return (
    <div id='displayProposals'>{Array.from(state).map((element, key) => (
      <div key={key} className="proposal">
        <p id="prop-text">{element.description}</p>
        <div id="prop-ctn">
        <p id="prop-id">Id : {key}</p>
        <p id="prop-vote">Vote count {element.voteCount}</p>
        </div>
      </div>
    ))}</div>
  )
}