const User = require("../models/user");
const Web3 = require("web3");
const CONTRACT_ABI = require("../abis/Gallery.json")
const Art = require("../models/voter");
const webb3 = new Web3(
"wss://rinkeby.infura.io/ws/v3/cd40c7ca7ec8483e87db9562f1dea376");
const web3 = new Web3(
  "https://rinkeby.infura.io/v3/cd40c7ca7ec8483e87db9562f1dea376"
);

const updateUser = async (query, payload) => {
  try {
    let artistArtWorkAddedDetails = await User.findOneAndUpdate(
      { ...query },
      { ...payload },
      { new: true }
    )
      .populate("user_stripe_details")
      .lean();

    return { ...artistArtWorkAddedDetails._doc };
    //  user:user
  } catch (e) {
    throw "Failed to update artist artwork";
  }
};

const createEvent=async(CONTRACT_ADDRESS)=>{
  
  console.log(CONTRACT_ADDRESS)
  const contract = new webb3.eth.Contract(CONTRACT_ABI.abi, CONTRACT_ADDRESS);
   contract.events.Transfer({}, async function(error,event){
     
     if (event)
     {
      if(event?.returnValues['from'] !="0x0000000000000000000000000000000000000000")
    {
      console.log(event)
      let blockchainCurrentOwnerAddress=event.returnValues['to']
      let blockchainTokenId=event.returnValues['tokenId']
      let blockchainContractAddress=event.address

        Art.find({
          galleryContractAddress: blockchainContractAddress,
          token_id:blockchainTokenId
        }).exec((err, data) => {
          console.log(data?.length)
          data?.map(async (x) => {

            if (x.current_owner_wallet_address!=blockchainCurrentOwnerAddress)
            {
             x.current_owner_wallet_address=blockchainCurrentOwnerAddress            
             x.save((err, user) => {
               if (err) {
                 console.log(err);
               } else {
               console.log("wallet updated")
               }
             });
            }
          })})    
}
 }
 else
 {
   console.log(error)
 }
 })}

module.exports = {
  updateUser,
  createEvent
};