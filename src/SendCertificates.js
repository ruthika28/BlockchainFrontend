import './App.css';
import Web3 from 'web3';
import {useState,useEffect} from "react";
import Donation from './contracts/Donation.json';
import {Routes, Route, Link} from 'react-router-dom';
import { Form, Input, Button, Select } from 'antd';


function SendCertificates(props) {
  const {web3, contract, owner, accounts, contractNFT, currentUser} = props;
  const { Option } = Select;
  const [currentValue, setcurrentValue] = useState(100);
  const styles = {
    backgroundImage: 'url(/Donate.jpeg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
  };
  async function handleClick() {
    await contract.methods.currentPrice().call({from:owner})
    .then(result => {
      setcurrentValue(result);
      console.log(result); 
    });
  }

  async function appreciateNFT () {   
    await contract.methods.setNFT(Number(currentValue)+1).send({from:owner});
  };
  
  async function depreciateNFT () {
    await contract.methods.setNFT(Number(currentValue)-1).send({from:owner});
  };

  async function onFinish(values) {
    console.log('Form values:', values);
    await contract.methods
      .sendCertificates()
      .send({ from: currentUser });
    let totalTokens = await contract.methods.totalCertificatesIssued().call({ from: accounts[0] });
    console.log('total certificates: ', totalTokens);
    for(let i=0;i<totalTokens;i++) {
      contractNFT.methods.ownerOf(i).call()
      .then(owner => {
        console.log("Owner of token ID", i, "is", owner);
      })
      .catch(error => {
        console.error("Error getting owner of token ID", i, ":", error);
      });      
    }   
    alert("certificates sent successfully!!!")
  };


  return (
    
      <div style={styles}>
       <div style={{ display: 'flex', height: '100vh' }}>
  <div style={{ flex: 1 , marginTop:'150px'}}>
    {/* This is the content on the left side */}
    <br></br>
    <br></br>
    <br></br>
    <h1>NFT operations:</h1>
    <button  type="primary" onClick={handleClick}  style={{ backgroundColor: "black", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Click me to check current NFT value:
          </button>
    <h4>Current NFT value: {currentValue}</h4>
    <button  type="primary" onClick={appreciateNFT}  style={{ backgroundColor: "black", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}
>
      Appreciate NFT
    </button>
    <button  type="primary" onClick={depreciateNFT}  style={{ backgroundColor: "black", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer", margin:"10px" }}
>
      Depreciate NFT
    </button>
  </div>
  <div style={{ flex: 1 }}>
    {/* This is the content on the right side */}
    <Form onFinish={onFinish} style={{maxWidth:400,marginTop:'14rem'}}>
    <h2>Send Certificates:</h2>
      <Form.Item name="input1">
        <Input placeholder="Fundraiser Address" style={{height:'4rem'}}/>
      </Form.Item>
      <Form.Item name="input2">
        <Input placeholder="Where were funds used?" style={{height:'4rem'}}/>
      </Form.Item>
      <Form.Item name="input3">
        <Input placeholder="Goal Amount" style={{height:'4rem'}}/>
      </Form.Item>      
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{backgroundColor:'black'}}>SendCertificates</Button>
      </Form.Item>
    </Form>
  </div>
</div>


      
      </div>
        );
}

export default SendCertificates;
