import React, {useState, useEffect, useContext} from 'react'
import { ContractContext } from '../../App'
import "./UserDisplay.css";
export default function UserDisplay(props) {
    const context = useContext(ContractContext);
    const owner = context.owner;
    const [usedAccount, setUsedAccount] = useState();
    const [registered, setRegistered] = useState(false);
    const getAccount = async ()=>{
        const account = await context.ContractVar.accounts;
        try {
            const tmp = await context.ContractVar.contract.methods.getVoter(account[0]).call({from:account[0]});
            setRegistered(tmp.isRegistered);
        } catch (error) {
            
        } 
        setUsedAccount(account[0]);
    }
    useEffect(() => {
        getAccount();
    }, [])

    useEffect(() => {
    getAccount();
    }, [props])
    
  return (
    <div id="userDisplay">
        <div id="infos">
            <p>{usedAccount}</p>
            <div id="span"><img id="spot" src={registered ? "valid.png" : "failed.png"}/>{owner == usedAccount ? <img id='spot' src='roi.png' /> : ""}<p>{registered ? "registered" : "Anon"}</p></div>
        </div>
        {/* <img id="pp" src={usedAccount == owner ? "king.png" : "prince.png"}></img> */}
    </div>
  )
}
