import React, {useContext, useState, useEffect} from 'react'
import { ContractContext } from '../../../App';
import "./Tallied.css";
export default function Tallied() {
    const context = useContext(ContractContext);
    const [winner, setWinner] = useState();
    const [proposal, setProposal] = useState();
    useEffect(async () => {
        const winningProposal = await context.ContractVar.contract.methods.winningProposalID().call({from:context.ContractVar.accounts[0]});
        setWinner(winningProposal);
    }, []);
    
  return (
    <div id="winning">Winning proposal id : {winner}</div>
  )
}
