import './App.css';
import {useState,useEffect} from "react";
import { Form, Input, Button,Select, Card } from 'antd';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const { Option } = Select;
function Register(props) {
  const {web3, contract, owner, accounts, contractNFT, currentUser} = props;
  console.log(accounts);
  const [ fundRaiser, setFundRaiser] = useState([]);
  const styles = {
    backgroundImage: 'url(/Donate.jpeg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
  };
  
  function handleClick()
  {
     fetch('https://blockchainbackend-render.onrender.com/allFundraisers').then(response => response.json())
     .then(data => {
      setFundRaiser(data);
      if(data['error']=='User not found') 
      {
        alert('No data found');
        return;
      }
      console.log('setFundRaiser: ', data);
    });
 
   }

  async function onFinish(values) {
    console.log(contract.events, contract.methods);
    // await contract.events.Print((error, result) => {
    //   if (!error){
    //     alert(result.returnValues['data']);
    //   }
    // });   
    try{
      await contract.methods
      .register(values.address, values.goalAmount)
      .send({ from: currentUser });  
       
        fetch('https://blockchainbackend-render.onrender.com/registerFundraiser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
        .then(response => {
          console.log('response is :', response)
          if (!response.ok) {
            throw new console.error('Failed to register user');
          }      
          console('Fundraiser registered or updated successfully');
        })
        .catch(error => {
          console.error(error);
        });
        toastr.success('Fundraiser Registered successfully!!')
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
    
  } 


  return (
    
      <div style={styles}>
       <div style={{ display: 'flex', height: '100vh' }}>
  <div style={{ flex: 1 }}>
    <br></br>
      <br></br>
      <br></br>
          <button  type="primary" onClick={handleClick}  style={{ backgroundColor: "black", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}
>
            Click me to check Registered Fundraisers
          </button>
      
      {fundRaiser.length>0 && <div>
       {fundRaiser.map(item => (
        <Card style={{width:'70%',margin:'50px 0px 10px 40px'}}>
          <p>Fundraiser Address: {item['address']}</p>
          <p>Amount Requested: {item['goalAmount']}</p>
        </Card>
      ))}
    </div>}
   
  </div>
  <div style={{ flex: 1 }}>
    {/* This is the content on the right side */}
    <Form onFinish={onFinish} style={{maxWidth:400,marginTop:'14rem'}}>
      <h2>Register Fundraiser:</h2>
      <Form.Item name="address">
        <Input placeholder="Fundraiser address..." style={{height:'3rem'}}/>
      </Form.Item>
      {/* <Form.Item name="address" style={{display:'flex'}}>
      <div style={{ flex: 1 }}>
      <Select onChange={(e)=>setFundRaiser(e)} style={{width:'400px'}}placeholder="Fundraiser address...">
        {accounts.slice(1).map((account,index) => (
          <Option key={index} value={account}>
            {account}
          </Option>
        ))}
      </Select>
      </div>
    </Form.Item> */}
      <Form.Item name="goalAmount">
        <Input placeholder="Goal amount..." style={{height:'3rem'}}/>
      </Form.Item>
      <Form.Item name="fundDescription">
        <Input placeholder="Description..." style={{height:'3rem'}}/>
      </Form.Item>
      <Form.Item name="raisedBy">
        <Input placeholder="Fundraiser Name..." style={{height:'3rem'}}/>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{backgroundColor:'black'}}>Register</Button>
      </Form.Item>
    </Form>
  </div>
</div>


      
      </div>
        );
}

export default Register;
