import React from 'react';

const HeaderInfo = (props) => {
    return ( <>
         <h6>Number of validOwners: {props.noOfOwner}</h6>
          <h6>Balance in the Contract: {props.balance} ether</h6>
          <h6>Creator is {props.creator}</h6>
          {props.pendingtrans.length > 0 &&
            <h6>Pending Transactions are at index {props.pendingtrans}</h6>
          }
    </> );
}
 
export default HeaderInfo;