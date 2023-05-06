import './App.css';
import Web3 from 'web3';
import {useState,useEffect} from "react";
import Donation from './contracts/Donation.json';
import {Routes, Route, Link} from 'react-router-dom';
import { Form, Input, Button,Select, Card } from 'antd';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const { Option } = Select;
function Mytokens(props) {
  const [form] = Form.useForm();
  const {web3, contract, owner, accounts, contractNFT, currentUser} = props;
  const [tokens,setTokens]=useState([]);
  const [selectedToken, setSelectedToken] =useState([]);
  function handleClick()
 {
    fetch('https://blockchainbackend-render.onrender.com/getDonor/'+currentUser).then(response => response.json())
    .then(data => {setTokens(data['rows']);}).catch(error => {
        console.error(error);
      });

  }
  function transferNFT(data) {
    console.log(data);
    setSelectedToken(data);
  }
  function onFinish(values) {
    console.log('selected: ', values);
    contract.methods.buyNFT(values['seller'], values['buyer'], Number(values['token']), values['amount']).send({ from: values['seller'], value: values['amount'] })
    .on('transactionHash', function(hash) {
      console.log('Transaction hash:', hash);
      handleClick();
      fetch('https://blockchainbackend-render.onrender.com/updateDonor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({token:values['token'], owner:values['buyer']})}).then(response => response.json())
      .then(data => {setTokens(data['rows']);}).catch(error => {
          console.error(error);
        });
      alert('Ownership transferred to ', values['buyer']);
    })
    .on('receipt', function(receipt) {
      console.log('Transaction receipt:', receipt);
    })
    .on('error', function(error, receipt) {
      console.log('Transaction error:', error);
    });
  }

  return (
    
       <div style={{ display: 'flex', height: '100vh' }}>
         <div style={{ flex: 1 }}>
    <br></br>
      <br></br>
      <br></br>
          <button  type="primary" onClick={handleClick}  style={{ backgroundColor: "black", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}
>
            Click me to show my Tokens
          </button>
      
      {tokens.length > 0 && <div>
       {tokens.map(item => (
        <Card style={{width:'50%',margin:'20px 0px 10px 20px'}}>
          <p>Token: {item['token']}</p>
          <p>Donated To: {item['donatedto']}</p>
          <p>NFT Value: {item['value']}</p>
          <p>Owner Address: {item['owner']}</p>
          <button  type="primary" onClick={() => transferNFT(item)}  style={{ backgroundColor: "black", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}
            >NFT Details
          </button>
        </Card>
      ))}
    </div>}
   </div>
   <div style={{ flex: 1 }}>
   <Form form={form} onFinish={onFinish} style={{maxWidth:400,marginTop:'14rem'}} >
      <h2>Transfer NFT:</h2>
      <Form.Item name="seller">
        <Input placeholder="Seller address..." style={{height:'3rem'}}/>
      </Form.Item>
      <Form.Item name="buyer">
        <Input placeholder="Buyer Address..." style={{height:'3rem'}}/>
      </Form.Item>
      <Form.Item name="amount">
        <Input placeholder="NFT Value..." style={{height:'3rem'}}/>
      </Form.Item>
      <Form.Item name="token">
        <Input placeholder="Token Id..." style={{height:'3rem'}}/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{backgroundColor:'black'}}>Transfer</Button>
      </Form.Item>
    </Form>
   </div>
</div>
    );
}

export default Mytokens;
