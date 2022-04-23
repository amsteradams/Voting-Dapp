import React, {useContext, useState, useEffect} from 'react';
import { ContractContext } from '../../../App';
import "./Vote.css";
export default function Vote() {
    const context = useContext(ContractContext);
    const [input, setInput] = useState();

    const inputChanged = (e) => {
        setInput(e);
    }

    const Vote = async () => {
        await context.ContractVar.contract.methods.setVote(input).send({from:context.ContractVar.accounts[0]});
    }
  return (
    <form id="vote">
        <input onChange={e => {inputChanged(e.target.value)}} type="text" placeholder='Proposal id'/>
        <button onClick={Vote} type="submit">Vote</button>
    </form>
  )
}
