import React, {useContext, useState, useEffect} from 'react';
import { ContractContext } from '../../../../App';
import "./AddProposal.css";
export default function AddProposal() {
    const context = useContext(ContractContext);
    const [input, setInput] = useState();
    const [registered, setRegistered] = useState(false);
    const getAccount = async ()=>{
        const account = await context.ContractVar.accounts;
        try {
            const tmp = await context.ContractVar.contract.methods.getVoter(account[0]).call({from:account[0]});
            setRegistered(tmp.isRegistered);
        } catch (error) {
            
        } 
    }
    useEffect(() => {
        getAccount();
    }, [])

    const inputChanged = (e) => {
        setInput(e);
    }

    const addProposal = async () => {
        await context.ContractVar.contract.methods.addProposal(input).send({from:context.ContractVar.accounts[0]});
    }
    if(registered){
      return (
        <form id="addProposal">
          <p>Let's propose something...</p>
            <input onChange={e => {inputChanged(e.target.value)}} type="text" placeholder='Proposal'/>
            <button onClick={addProposal} type="submit">Add</button>
        </form>
      )
    }
    else{
      return(<></>)
    }
  
}
