import React, {useContext, useState, useEffect} from 'react';
import { ContractContext } from '../../../../App';
import "./AddProposal.css";
export default function AddProposal() {
    const context = useContext(ContractContext);
    const [input, setInput] = useState();

    const inputChanged = (e) => {
        setInput(e);
    }

    const addProposal = async () => {
        await context.ContractVar.contract.methods.addProposal(input).send({from:context.ContractVar.accounts[0]});
    }
  return (
    <form id="addProposal">
      <p>Let's propose something...</p>
        <input onChange={e => {inputChanged(e.target.value)}} type="text" placeholder='Proposal'/>
        <button onClick={addProposal} type="submit">Add</button>
    </form>
  )
}
