import './App.css';
import Web3 from 'web3';
import {useState,useEffect} from "react";
import Donation from './contracts/Donation.json';
import {Routes, Route, Link} from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

function Unregister(props) {
  const {web3, contract, owner, accounts, contractNFT, currentUser} = props;
  const styles = {
    backgroundImage: 'url(/Donate.jpeg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
  };
  
  async function onFinish (values) {
    console.log('Form values:', values);
    await contract.events.Print((error, result) => {
      if (!error){
        alert(result.returnValues['data']);
      }
    });  
    try{
      await contract.methods
      .unRegister(values.address)
      .send({ from: currentUser });
          fetch('http://localhost:8001/deleteFundraiser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
        .then(response => {
          console.log('response is :', response)
          if (!response.ok) {
            throw new Error('Failed to register user');
          }      
        })
        .catch(error => {
          console.error(error);
        });
        toastr.success('Fundraiser deleted successfully!!')
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
   
  </div>
  <div style={{ flex: 1 }}>
    {/* This is the content on the right side */}
    <Form onFinish={onFinish} style={{maxWidth:400,marginTop:'14rem'}}>
      <h2>Unregister Fundraiser:</h2>
      <Form.Item name="address">
        <Input placeholder="Fundraiser address..." style={{height:'3rem'}}/>
      </Form.Item>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{backgroundColor:'black'}}>Unregister</Button>
      </Form.Item>
    </Form>
  </div>
</div>


      
      </div>
        );
}

export default Unregister;
