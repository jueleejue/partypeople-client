import React, { Component } from 'react';

import '../../App.css';
import Web3 from 'web3';
import axios from 'axios';
import {ip} from "../../store/ip"
import ethers from 'ethers';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { hot } from 'react-hot-loader'


let parepeopleAddress='0x4DB50ffd951e814cbf1b87448b2533b8c22423DA';
let parepeopleABI=[ { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" } ], "name": "buyerrequest", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" } ], "name": "buyfleamarket", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" }, { "name": "_sellerid", "type": "bytes32" }, { "name": "_buyerid", "type": "bytes32" }, { "name": "_price", "type": "uint256" } ], "name": "createContract", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getBuyerAddress", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getBuyerID", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getfee", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getSellerAddress", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getSellerID", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getstep", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" } ], "name": "productsend", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" } ], "name": "returnfee", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_contractId", "type": "uint256" }, { "name": "_sellerid", "type": "bytes32" }, { "name": "_buyerid", "type": "bytes32" }, { "name": "_price", "type": "uint256" } ], "name": "sellerapprove", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "contractInfo", "outputs": [ { "name": "contractId", "type": "uint256" }, { "name": "buyerAddress", "type": "address" }, { "name": "sellerAddress", "type": "address" }, { "name": "buyerid", "type": "bytes32" }, { "name": "sellerid", "type": "bytes32" }, { "name": "price", "type": "uint256" }, { "name": "state", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_id", "type": "uint256" } ], "name": "getContractInfo", "outputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "bytes32" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]


class modal extends Component{


  constructor(props) {
    super(props);

    this.state = {
      //contract??? ?????? ???????????????
      tradeNum: 0, 
      stage: 0,
      stage_str: '',
      contractAddress: '',
      sellerAddress: '',
      buyerAddress: '',
      fee:0,
      boardId:1, //????????? ?????? ????????? 
      sellerId: '',
      buyerId: window.sessionStorage.getItem('id'),
      open:false,

      //?????? ????????? ???????????? ?????????ID(????????? ????????? ?????????),?????????ID(??????)

      //????????? ?????? ???????????????  
      
      viewType : this.props.viewType,
      q_ownerID: '',
      q_borrowerID: '',
      q_ownerNum: 0,
      q_borrowerNum: 0,
      q_fee: 0
    };

    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClose = this.handleClose.bind(this);
  }


  handleClickOpen() {
    this.setState({
    open: true
    });} // ?????? ?????? 
    
    handleClose() {
    this.setState({
    open: false
    });} //?????? ?????? 



  async componentDidMount(){ //????????? 
    await this.initWeb3()   
  }

  //--------------------------------------?????? ????????? ?????? ---------------------------------------------//

  initWeb3 = async() =>{
    if(window.ethereum){
      this.web3 =new Web3(window.ethereum);

      try{
        await window.ethereum.enable();
      }catch(error){
      
      }
    }

    else if(window.web3){
      this.web3=new Web3(Web3.currentProvider);
    }
    else{
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask');
    }


    this.parepeopleContract=new this.web3.eth.Contract(parepeopleABI,parepeopleAddress);


  }


//------------------------------------- ?????? ?????? ---------------------------------------------//

  getInfo = async () =>{

    let stage = await this.parepeopleContract.methods.getstep(this.state.tradeNum).call()
    let stage_str;
    if(stage === "0") {stage_str = "?????? ?????? ?????? ??????"}
    if(stage === "1") {stage_str = "????????? ?????? ?????? ??????"}
    if(stage === "2") {stage_str = "????????? ?????? ?????? ??????"}
    if(stage === "3") {stage_str = "????????? ?????? ?????? ??????"}
    if(stage === "4") {stage_str = "?????? ???"}
    if(stage === "5") {stage_str = "?????? ?????? ??????[?????? ??????]"}
   
       this.setState({
         stage: stage,
         stage_str: stage_str,

       })


  }



  //--------------------------------------?????? ?????? !  ---------------------------------------------//



    buyerrequest= async () => {    //???????????? 
  
      // ??????????????? ?????????ID ?????? ???????????? (????????? ID ????????????)
      const accounts = await this.web3.eth.getAccounts();
      this.buyeraccount = accounts[0]; // ?????? ????????? owner
  
      axios
      .get(ip+"/contract/board", { 
        params: {
          boardId: this.state.boardId //????????? ID ?????? ????????? 
      },
      })
      .then((data) => {
        const boarddata = data.data[0];
          this.setState({
            
            sellerId: boarddata[0].sellerId, //??????????????????
            fee:boarddata[0].price,
        }); // end of setState
        
      //----------------------------????????? , ?????? get--------------------------------------//

        const contract = { //?????????ID,??????,?????????ID,?????????ID,??????
          boardId:this.state.boardId,
          fee:this.state.fee,
          buyerId:this.state.buyerId,
          sellerId: this.state.sellerId,
          state: 0,
        };
    
                axios.post(ip+"/contract/contract", { contract }).then((res) => {

                });

        
      });   

   

      //---------------------------?????? DB ?????? --------------------------------------//



      axios.get(ip+"/contract/contract").then((data) => {
      
        const tradedata = data.data[0];
        this.setState({
          tradeNum: tradedata[0],
      }); // end of setState
       });



      this.parepeopleContract.methods.buyerrequest(this.state.tradeNum).send({ from: this.buyeraccount});
      
        this.setState({
          buyerAddress:this.buyeraccount
        })

    
    
        this.getInfo()   
        let trade =this.parepeopleContract.methods.getContractInfo(this.state.tradeNum).call();
  
    }



  sellerapprove = async () => { //????????? ?????? (???)

    const accounts = await this.web3.eth.getAccounts();
    this.selleraccount = accounts[0]; // ?????? ????????? owner
    axios
      .get(ip+"/contract", { 
        params: {
        tradeNum: this.state.tradeNum //??????????????? 
      },
      })
      .then((data) => {
        const contractData = data.data[0];
          this.setState({
            
              id: contractData[0].id, //??????????????????
              fee: contractData[0].board_price, //??????
              sellerId: contractData[0].seller_id, 
              buyerId:contractData[0].buyer_id,
              state:contractData[0].state
        
        }); // end of setState


        //?????? ID??? ?????? ?????? 
        let sellerId32= ethers.utils.formatBytes32String(this.state.sellerId);//????????? ????????? 
        let buyerId32= ethers.utils.formatBytes32String(this.state.buyerId);//????????? ?????????

        let board_price = this.state.fee * 10 ** 18;
        let fee_str = String(board_price) //??????
        //await this.parepeopleContract.methods.getContractInfo(1).call()


        this.parepeopleContract.methods.sellerapprove(this.state.tradeNum,sellerId32,buyerId32, fee_str).send({ from: this.selleraccount});

        //????????????????????? sellerAddress ????????? ?????? ?????? ! 
        this.setState({
          sellerAddress:this.selleraccount
        })
        this.getInfo()
        let trade =this.parepeopleContract.methods.getContractInfo(this.state.tradeNum).call();
      });    
  }




  //?????? ?????? (???)
  buyfleamarket = async() =>{

    let cost = this.state.fee * 1000000000000000000 //????????? ?????????
    this.parepeopleContract.methods.buyfleamarket(this.state.tradeNum).send({ from: this.state.buyerAddress, value: cost});
    await this.getInfo()  
  }

  //?????? ?????? (???)
  productsend = async() =>{
    this.parepeopleContract.methods.productsend(this.state.tradeNum).send({ from: this.state.sellerAddress});
    await this.getInfo()  
  }

  //?????? ??????(???)
  returnfee = async() =>{
    this.parepeopleContract.methods.returnfee(this.state.tradeNum).send({ from: this.state.buyerAddress});
    await this.getInfo()  
  }

  render(){
  return (
    <div>
      <Button variant="contained" color="secondary" onClick={this.handleClickOpen}>
        ?????? ?????? 
      </Button>

      <Dialog onClose={this.handleClose} open={this.state.open} >
      <DialogTitle align="center">????????????</DialogTitle>
      <Divider variant="middle" style={{ marginBottom: 25 }} />
        <DialogContent> 
            <Typography gutterBottom>???????????? : {this.state.tradeNum}</Typography>
            <Typography gutterBottom>???????????? : {this.state.stage_str}</Typography>
            <Typography gutterBottom>???    ???(Ether) : {this.state.fee}</Typography>
            <Typography gutterBottom>SELLER ???????????? : {this.state.sellerAddress === "0x0000000000000000000000000000000000000000"? "????????? ??? ???????????? ?????? ???????????????." : this.state.sellerAddress}</Typography>
            <Typography gutterBottom>BUYER ???????????? :{this.state.buyerAddress === "0x0000000000000000000000000000000000000000"? "????????? ??? ???????????? ?????? ???????????????." : this.state.buyerAddress}</Typography>
            <Typography gutterBottom>SELLER ????????? : {this.state.sellerId}</Typography>
            <Typography gutterBottom>BUYER  ????????? : {this.state.buyerId}</Typography>
            <Divider variant="middle" style={{ marginBottom: 25 }} />
        </DialogContent>
        
        <DialogActions>
                <Button variant="outlined" color="secondary" onClick={this.buyerrequest}>????????????</Button>
                <Button variant="outlined" color="secondary" onClick={this.sellerapprove}>(???)????????????</Button>
                <Button variant="outlined" color="secondary" onClick={this.buyfleamarket}>?????? ??????</Button>
                <Button variant="outlined" color="secondary" onClick={this.productsend}>?????? ??????</Button>
                <Button variant="outlined" color="secondary" onClick={this.returnfee}>?????? ??????</Button>
                <Button variant="outlined" color="primary" onClick={this.handleClose}>??????</Button>
       </DialogActions>
      </Dialog>
    </div>

    );
  } 
}
export default hot(module)(modal);