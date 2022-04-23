import React from 'react'
import AddProposal from './AddProposal/AddProposal';
import DisplayProposals from './DisplayProposals/DisplayProposals';
import "./ProposalsRegistration.css";
export default function ProposalsRegistration(props) {
  return (
    <div id="proposalsRegistration">
        <DisplayProposals value={props.value}/>
        <AddProposal />
    </div>
  )
}
