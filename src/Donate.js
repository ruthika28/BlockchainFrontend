import './App.css';
import Web3 from 'web3';
import {useState,useEffect} from "react";
import Donation from './contracts/Donation.json';
import {Routes, Route, Link} from 'react-router-dom';
import { Form, Input, Button, Card } from 'antd';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

function Donate(props) {
  const {web3, contract, owner, accounts, contractNFT, currentUser} = props;
  const [donations, setDonations] = useState([]);
  const [fundraiser,setFundRaiser] = useState(null);
  const styles = {
    backgroundImage: 'url(/Donate.jpeg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
  };

 function handleClick()
 {
    fetch('https://blockchainbackend-render.onrender.com/getDonor/'+currentUser).then(response => response.json())
    .then(data => {setDonations(data); console.log('donations1: ', donations);});    
  }

  async function showDetails() {
    await contract.methods.getFundraiserDetails().call({from:currentUser})
      .then(result => {
        console.log(result); 
        setFundRaiser(result);
        if(result['isActive']==false) {
          alert('Goal Reached and It has been made Inactive!!!');
        }else{
          alert('Goal not reached yet !!!')
        }
    });
  }

  async function onFinish(values) {
    await contract.events.Print((error, result) => {
      if (!error){
        alert(result.returnValues['data']);
      }
    });  
    console.log('Form values:', values, currentUser);  
    let totalTokens = await contract.methods.totalCertificatesIssued().call({ from: accounts[0] });
    console.log('tokens: ',totalTokens);
    values['token']=totalTokens;
    values['owner']=currentUser;
    await contract.methods.currentPrice().call({from:currentUser})
    .then(result => {      
      values['value']=result;
      console.log(values); 
    });
    console.log('tokens: ',totalTokens); 
    try{
      await contract.methods.donateFunds(values.donatedTo.toString()).send({from:currentUser, value: Web3.utils.toWei(values.amount.toString(), "ether")});     
        fetch('https://blockchainbackend-render.onrender.com/insertDonor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
        .then(response => {
          console.log('response is :', response)
          if (!response.ok) {
            throw new Error('Failed to register certificate');
          }      
          console('Certificates registered or updated successfully');
        })
        .catch(error => {
          console.error(error);
        });
        toastr.success('Donation made successfully!!')
      } catch(error){
         toastr.error(error.message, 'Error', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-right',
          timeOut: 5000,
          extendedTimeOut: 2000,
          showEasing: 'swing',
          hideEasing: 'linear',
          showMethod: 'slideDown',
          hideMethod: 'slideUp',
          iconClasses: {
            error: 'toastr-red',
          },
        });
      }
    
  };


  return (
    
      <div style={styles}>
       <div style={{ display: 'flex', height: '100vh' }}>
  <div style={{ flex: 1 }}>
    {/* This is the content on the left side */}
    <div>
      <br></br>
      <br></br>
      <br></br>
          <button  type="primary" onClick={handleClick} style={{ backgroundColor: "black", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Check previous donations
          </button>
          <button  type="primary" onClick={showDetails} style={{ backgroundColor: "black", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer", margin:'10px'}}>
            Check Fund Status
          </button>
      
      <div>
       {donations.length>0 && donations.map(item => (
        <Card style={{width:'70%',margin:'50px 0px 10px 40px'}}>
          <p>Donated To: {item['donatedto']}</p>
          <p>Amount Donated: {item['amount']}</p>
        </Card>
      ))}
      </div>
      <div>{fundraiser &&
        <Card style={{width:'70%',margin:'50px 0px 10px 40px'}}>
          <p>My Address: {fundraiser['fundraiserAddress']}</p>
          <p>Amount Raised: {fundraiser['amountRaised']}</p>
          <p>Goal: {fundraiser['goalAmount']}</p>
        </Card> }
      </div>
    </div>
  </div>
  <div style={{ flex: 1 }}>
    {/* This is the content on the right side */}
    <Form onFinish={onFinish} style={{maxWidth:400,marginTop:'14rem'}}>
      <h2>Donate:</h2>
      <Form.Item name="donatedTo">
        <Input placeholder="Fundraiser address..." style={{height:'3rem'}}/>
      </Form.Item>
      {/* <Form.Item name="input2">
        <Input placeholder="Donor address..." style={{height:'3rem'}}/>
      </Form.Item> */}
      <Form.Item name="amount">
        <Input placeholder="Donate amount..." style={{height:'3rem'}}/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{backgroundColor:'black'}}>Donate</Button>
      </Form.Item>
    </Form>
  </div>
  </div>
</div>
);
}

export default Donate;