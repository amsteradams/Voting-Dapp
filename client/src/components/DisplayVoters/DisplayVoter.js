import React, {useState, useEffect, useContext} from 'react'
import "./DisplayVoters.css";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { ContractContext } from '../../App';
export default function DisplayVoter(props) {
  console.log(props)
  const context = useContext(ContractContext);
  const [voters, setVoters] = useState([]);
  const [oneVoter, setOneVoter] = useState();
  const [bool, setBool] = useState(false);
  const [state, setState] = useState({
    value: '',
    copied: false,
  })
  const [input, setInput] = useState();
  useEffect(() => {
    let tmp = [];
    props.value.forEach((element, key) => {
      tmp.push(<div key={key} className='voter'>{element.returnValues.voterAddress.slice(0,20)}...
       <CopyToClipboard text={element.returnValues.voterAddress}
      onCopy={() => setState({copied: true})}>
        <img 
      onClick={() => {}} 
      id='spot-copy'
      src={state.copied == true ? 'link-valid.png' : 'link.png'}/>
      </CopyToClipboard> </div>)
    });
    setVoters(tmp);
  }, [])
  
  //Get One
  const inputChanged = (e) => {
    setInput(e);
}

const getOneVoter = async () => {
    const voter = await context.ContractVar.contract.methods.getVoter(input).call({from:context.ContractVar.accounts[0]});
  setOneVoter(voter);
  setBool(true);
}
console.log(oneVoter);
  if(context.status >= 3){
    return (
    <div id="displayVoters">
      <p>Registered voters : </p>
      {voters}
  
    <p>Search</p>
    <input onChange={e => {inputChanged(e.target.value)}} type="text" id="search-input" placeholder='Voter address'/>
    <button onClick={getOneVoter}id="btn-search">
      Search
    </button>
    { bool ?
    <div id="displayOne">
    <p id="vot-text">{oneVoter.hasVoted}</p>
        <div id="vot-ctn">
        <p id="vot-id">Registered : {oneVoter.isRegistered == true ? <p className='green'>yes</p>: "no" }</p>
        <p id="vot-vote">Voted for : {oneVoter.votedProposalId}"</p>
        </div>
    </div>
    : ""
    }
    </div>
  )
  }
  else{
    return(
      <div id="displayVoters">
      <p>Registered voters : </p>
      {voters}
      </div>
    )
  }
}
