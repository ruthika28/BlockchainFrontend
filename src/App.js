import './App.css';
import Web3 from 'web3';
import {useState,useEffect} from "react";
import Donation from './contracts/Donation.json';
import {Routes, Route, Link} from 'react-router-dom';
import Register from './Register';
import Unregister from './Unregister';
import Donate from './Donate';
import SendCertificates from './SendCertificates';
import CertificateNFT from './contracts/CertificateNFT.json';
import { Button } from 'antd';
import Mytokens from './Mytokens';

function App() {
  const styles = {
    backgroundImage: 'url(/Donate.jpeg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
  };
  const [web3,setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [contractNFT, setContractNFT] = useState(null);
  const [owner, setOwner] = useState(null);
  const [currentUser, setcurrentUser] = useState(null);

  useEffect(()=>{
    async function template(){
      if (window.ethereum) {
        try {
          let weba3;
          if (window.ethereum) {
            weba3 =new Web3(Web3.givenProvider);
            setWeb3(weba3);
            await window.ethereum.enable();
            await window.ethereum.request({ method: 'eth_requestAccounts' });
          }
          else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
          }
          const accounts = await weba3.eth.getAccounts();
          console.log('accounts: ',accounts);  
          setAccounts(accounts);
          setcurrentUser(accounts[0]);
          console.log('account: ',accounts[0]);
          const networkId = await weba3.eth.net.getId();
          console.log('network id: ', networkId);
          const deployedNetwork = Donation.networks[networkId];
          const contract = new weba3.eth.Contract(Donation.abi, deployedNetwork.address,{
            from: accounts[0],
            gas: '3000000'
          });
          const deployedNetworkNFT = CertificateNFT.networks[networkId];
          const contractNFT = new weba3.eth.Contract(CertificateNFT.abi, deployedNetworkNFT.address,{
            from: accounts[0],
            gas: '3000000'
          });
          setWeb3(weba3);
          setContractNFT(contractNFT);
          setContract(contract);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error('Please install MetaMask!');
      }
    }
    template();
  },[]);


  return (
    <div className="App"  style={styles}>
      <nav id="nav-wrap" style={{background:'black',height:'3rem'}}>
      <ul id="nav" className="nav">
            <li className="current">
              <Link to="/">Home </Link>
            </li>
            <li>
              <Link to="/register">Register Fundraiser</Link>
            </li>
            <li>
              <Link to="/unregister">UnRegister Fundraiser</Link>
            </li>

            <li>
              <Link to="/donate">Donate</Link>
            </li>
            <li>
              <Link to="/send-certificates">Send Certificates</Link>
            </li>            
            <li>
              <Link to="/mytokens">My Tokens</Link>
            </li>
            </ul>
      </nav>
      <Routes>
      <Route path="/register" element={<Register web3={web3} contract={contract} owner={owner} accounts={accounts} contractNFT={contractNFT} currentUser={currentUser}/>} />
          <Route path="/unregister" element={<Unregister web3={web3} contract={contract} owner={owner} accounts={accounts} contractNFT={contractNFT} currentUser={currentUser}/>}/>
          <Route path="/donate" element={<Donate web3={web3} contract={contract} owner={owner} accounts={accounts} contractNFT={contractNFT} currentUser={currentUser}/>} />
          <Route path="/send-certificates" element={<SendCertificates web3={web3} contract={contract} owner={owner} accounts={accounts} contractNFT={contractNFT} currentUser={currentUser}/>} />
          <Route path="/mytokens" element={<Mytokens web3={web3} contract={contract} owner={owner} accounts={accounts} contractNFT={contractNFT} currentUser={currentUser}/>} />
        </Routes>
        <br></br>
        <br></br>
        <br></br>
        <h3>{currentUser ? <p>currentUser: {currentUser}</p> : <p>Loading...</p>}</h3>
    </div>
  );
}

export default App;
