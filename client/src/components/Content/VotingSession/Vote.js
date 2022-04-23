import React, {useContext, useState, useEffect} from 'react';
import { ContractContext } from '../../../App';
import "./Vote.css";
export default function Vote() {
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

    const Vote = async () => {
        await context.ContractVar.contract.methods.setVote(input).send({from:context.ContractVar.accounts[0]});
    }
    if(registered){
  return (
    <form id="vote">
        <input onChange={e => {inputChanged(e.target.value)}} type="text" placeholder='Proposal id'/>
        <button onClick={Vote} type="submit">Vote</button>
    </form>
  )
    }else{
      return(<></>)
    }
}
