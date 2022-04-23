import React, {useState, useContext} from 'react'
import { ContractContext } from '../../../App';
import "./AddVoter.css";
export default function AddVoter() {
    const context = useContext(ContractContext);
    const [input, setInput] = useState();

    const inputChanged = (e) => {
        setInput(e);
    }

    const addVoter = async () => {
        await context.ContractVar.contract.methods.addVoter(input).send({from:context.ContractVar.accounts[0]});
    }
  return (
    <form id="addVoter">
        <input onChange={e => {inputChanged(e.target.value)}} type="text" placeholder='Voter address'/>
        <button id="btn-add" onClick={addVoter} type="submit">Add</button>
    </form>
  )
}
