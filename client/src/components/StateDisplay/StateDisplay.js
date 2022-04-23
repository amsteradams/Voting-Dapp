import React, {useState, useEffect} from 'react'
import "./stateDisplay.css"
export default function StateDisplay(props) {
    const [status, setStatus] = useState();
    const getStatus = (props) => {
        switch (props.value) {
            case '0' : setStatus("Registering voters")     
                break;
            case '1' : setStatus("Proposals registration")     
                break;
            case '2' : setStatus("Proposals registration ended")     
                break;
            case '3' : setStatus("Voting session")     
                break;
            case '4' : setStatus("Voting session ended")     
                break;
            case '5' : setStatus("Votes tallied")     
                break;
        
            default: setStatus("error")
                break;
        }
    }

    useEffect(() => {
      getStatus(props);
    }, [])
    useEffect(() => {
        getStatus(props);
    }, [props])
    
  return (
    <div id="StateDisplay">
        {status}
        <div id="Progress-bar">
            <div style={{width: props.value * 20 + '%'}} id="remplissage">

            </div>
        </div>
    </div>
  )
}
