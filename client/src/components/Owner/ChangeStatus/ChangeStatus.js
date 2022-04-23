import React, {useState, useContext, useEffect} from 'react'
import { ContractContext } from '../../../App';
import "./ChangeStatus.css";
export default function ChangeStatus() {
    const context = useContext(ContractContext);
    const [number, setNumber] = useState(parseInt(context.status));

    const increment = () => {
        setNumber(number + 1);
    }
    
    const handleChange = async () => {
        switch (number) {
            case 0 : console.log('status = 0')     
                break;
            case 1 : await context.ContractVar.contract.methods.startProposalsRegistering().send({from:context.ContractVar.accounts[0]}).then(console.log);     
                break;
            case 2 : await context.ContractVar.contract.methods.endProposalsRegistering().send({from:context.ContractVar.accounts[0]});      
                break;
            case 3 : await context.ContractVar.contract.methods.startVotingSession().send({from:context.ContractVar.accounts[0]});
            console.log('phase3')    
                break;
            case 4 : await context.ContractVar.contract.methods.endVotingSession().send({from:context.ContractVar.accounts[0]});      
                break;
            case 5 : await context.ContractVar.contract.methods.tallyVotes().send({from:context.ContractVar.accounts[0]});      
                break;
        
            default: console.log('Voting contract is over');
                break;
        }
    }
    useEffect(() => {
        if(number != context.status){
            handleChange();
        }  
    }, [number])
    console.log(number);
  return (
    <div id="changeStatus">

        { number < 5 ? <button onClick={increment}>{number == 4 ? "Tally votes" : "Next Phase"}</button> : ""}
    </div>
  )
}
