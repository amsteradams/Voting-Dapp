import React, {useContext} from 'react'
import { ContractContext } from '../../App';
import AddVoter from './AddVoter/AddVoter';
import ChangeStatus from './ChangeStatus/ChangeStatus';
import "./Owner.css";
export default function Owner() {
  const context = useContext(ContractContext);
  return (
    <div id="owner">
      <p>Owner settingss</p> 
      {context.status < 1 ? <AddVoter /> : ""}
      <ChangeStatus />
    </div>
  )
}
