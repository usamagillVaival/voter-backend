const {saveSalesinSale,getAllSaleService,saveSaleInUser,getSaleByGalleryService,getSaleByArtistService,getOfferByGalleryService,cancelOfferService,getPurchaseByCollectorService,getNftByCollectorService,getCanceledByGalleryService,getOfferByCollectorService,getCancelledByCollectorService,
  getTotalSaleByGallery,
  getSaleById,
  getTotalSaleByArtist,
  getSaleIdByArtwork,
  getTotalSaleByCollector
} = require('../service/saleService')
const {saleNotificationService} = require('../service/notificationService')
const User = require("../models/user");
const Art =  require("../models/artistArtWork")
const {
  toJson,
  
} = require("../service/utils");
const CryptoJS = require("crypto-js");


async function getGalleryByProfile(gallery_profile) {
  const user = await User.findOne(
    { gallery_profile },
    (err, user) => {}
  );
  return toJson(user);
}

async function getArtistByArtId(artId) {
  const user = await Art.findOne(
    { _id:artId },
    (err, user) => {}
  );
  return toJson(user);
}


async function getGalleryByEmail(email) {
  const user = await User.findOne(
    { email },
    (err, user) => {}
  );
  return toJson(user);
}
const buyNft = async (req, res) => {
    try {

      const { payload } = req.body;
  const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  const { userId,purchase_option,sale_price,artworkId,galleryProfile,sale_status } = decryptedData;

      if (!userId) {
        throw "User not found";
      }

      const gallery = await getGalleryByProfile(galleryProfile);
      const artistId = await getArtistByArtId(artworkId);

     if(gallery)
      //update The Status of NFT
      {
        let saleDetail = await saveSalesinSale({
            purchase_option,
            sale_price,
            collector:userId,
            gallery: gallery?._id,
            artist_artwork:artworkId,
            sale_status: sale_status,
            artist: artistId?.artistId
        });

       if(saleDetail){
          let saleNotification = await saleNotificationService({
            notification_reciever: gallery?._id,
            notification_sender : userId,
            nft:artworkId,
            sale :  saleDetail._id,
            notification_type:'sale',
            notification_title:'buy'
          });
        }


        
        let saveUserSale = await saveSaleInUser(
            {
              _id: userId,
              // account_type: "artist",
              // invited_from: req.query.invited_from,
              // approved: true,
            },
            {
              $push: { Sale: saleDetail._id },
            }
          );
          return res.status(200).json({
            // ...saveArtistWorkInUser,
            artDetail: saleDetail,
            User:saveUserSale
    
            // data: { file: req.file.filename },
          });
      }
      else{
        return res.status(200).json({
          // ...saveArtistWorkInUser,
        error:'Something went wrong'
  
          // data: { file: req.file.filename },
        });
      }

        // let saveArtistWorkInUser = await saveArtistArtworkInUser(
        //   {
        //     _id: req.body.userId,
        //     // account_type: "artist",
        //     // invited_from: req.query.invited_from,
        //     // approved: true,
        //   },
        //   {
        //     $push: { artist_artwork: addArtistWork._id },
        //   }
        // );
        
      
    } catch (ex) {
      if (ex.message) {
        return res.status(400).json({
          error: ex.message,
        });
      } else {
        return res.status(400).json({
          error: ex,
        });
      }
    }
  };











  const makeOffer = async (req, res) => {
    try {

      const { payload } = req.body;
  const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  
  const { userId,purchase_option,sale_price,artworkId,galleryProfile,sale_status,offered_price,offered_status,collector_offer_account,offered_signature,hash } = decryptedData;

      if (!userId) {
        throw "User not found";
      }
      const gallery = await getGalleryByProfile(galleryProfile);
      const artistId = await getArtistByArtId(artworkId);

     if(gallery)
      //update The Status of NFT
      {
        
        let saleDetail = await saveSalesinSale({
            purchase_option,
            sale_price,
            offered_price,
            offered_status,
            collector:userId,
            gallery: gallery?._id,
            artist_artwork:artworkId,
            sale_status: sale_status,
            artist: artistId?.artistId,
            collector_offer_account,
            offered_signature,
            tx_status:"pending",
            tx_hash:hash,
            offer_pending_date : new Date()
        });


        if(saleDetail){
          let saleNotification = await saleNotificationService({
            notification_reciever: gallery?._id,
            notification_sender : userId,
            nft:artworkId,
            sale :  saleDetail._id,
            notification_type:'offer',
            notification_title:'offer'
          });
        }

        let saleNotification = await saleNotificationService({
          notification_reciever: gallery?._id,
          notification_sender : userId,
          nft:artworkId,
          sale :  saleDetail._id,
          notification_type:'offer',
          notification_title:'offer submitted'
        });
        let saveUserSale = await saveSaleInUser(
            {
              _id: userId,
              // account_type: "artist",
              // invited_from: req.query.invited_from,
              // approved: true,
            },
            {
              $push: { Sale: saleDetail._id },
            }
          );
          return res.status(200).json({
            // ...saveArtistWorkInUser,
            artDetail: saleDetail,
            User:saveUserSale
    
            // data: { file: req.file.filename },
          });
      }
      else{
        return res.status(200).json({
          // ...saveArtistWorkInUser,
        error:'Something went wrong'
  
          // data: { file: req.file.filename },
        });
      }

        // let saveArtistWorkInUser = await saveArtistArtworkInUser(
        //   {
        //     _id: req.body.userId,
        //     // account_type: "artist",
        //     // invited_from: req.query.invited_from,
        //     // approved: true,
        //   },
        //   {
        //     $push: { artist_artwork: addArtistWork._id },
        //   }
        // );
        
      
    } catch (ex) {
      if (ex.message) {
        return res.status(400).json({
          error: ex.message,
        });
      } else {
        return res.status(400).json({
          error: ex,
        });
      }
    }
  };
  



  
 


  const cancelOffer = async (req, res) => {
    try {
      const { payload } = req.body;
   
      const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const { offerId,reason,userId ,galleryProfile,artworkId} = decryptedData;
   
      
      console.log("profile: ", galleryProfile)

      if(reason=='Collector cancelled'){

        const gallery = await getGalleryByEmail(galleryProfile);
        let user = await cancelOfferService(req, res,offerId,reason)

  let saleNotification = await saleNotificationService({
          notification_reciever: gallery?._id,
          notification_sender : userId,
          nft:artworkId,
          notification_type:'collector rejected',
          notification_title:'offer rejected'
        });

      }


      if(reason=='Gallery rejected'){

        const gallery = await getGalleryByProfile(galleryProfile);
        let user = await cancelOfferService(req, res,offerId,reason)
    let saleNotification = await saleNotificationService({
          notification_reciever: userId,
          notification_sender : gallery?._id ,
          nft:artworkId,
          notification_type:'gallery rejected',
          notification_title:'offer rejected'
        });

      }

      
    }
     catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  }; 


  const getSaleByGallery = async (req, res) => {
    try {
      const { payload } = req.body;
      const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const { userId } = decryptedData;
      let user = await getSaleByGalleryService(req, res,userId)
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };



  const getSaleByArtist = async (req, res) => {
    try {
      const { payload } = req.body;
      const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const { userId } = decryptedData;
      let user = await getSaleByArtistService(req, res,userId)
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };




  const getSaleId = async (req, res) => {
    try {


      const { payload } = req.body;
      const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const { userId } = decryptedData;
      let user = await getSaleById(req, res,userId)
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };



  const getSaleByArt = async (req, res) => {
    try {
      const { artId } = req.body;
      // const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      // const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // const { userId } = decryptedData;
      let user = await getSaleIdByArtwork(req, res,artId)
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };




  const getTotalSale = async (req, res) => {
    try {
      const { userId } = req.body;
      // const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      // const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // const { userId } = decryptedData;
      let user = await getTotalSaleByGallery(req, res,userId)
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };


  const getTotalSaleArtist = async (req, res) => {
    try {
      const { userId } = req.body;
       // const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      // const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // const { userId } = decryptedData;
      let user = await getTotalSaleByArtist(req, res,userId)
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };



  const getTotalSaleCollector = async (req, res) => {
    try {
      const { userId } = req.body;
       // const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      // const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // const { userId } = decryptedData;
      let user = await getTotalSaleByCollector(req, res,userId)
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };




  const getCanceledByGallery = async (req, res) => {
    try {


      // const { userId } = req.body;
      const { payload } = req.body;
      const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const { userId } = decryptedData;
      let user = await getCanceledByGalleryService(req, res,userId)
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };



  const getCancelledByCollector = async (req, res) => {
    try {


      // const { userId } = req.body;
      const { payload } = req.body;
      const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const { userId } = decryptedData;
      let user = await getCancelledByCollectorService(req, res,userId)
    } catch (ex) {

      
      return res.status(400).json({
        error: ex,
      });
    }
  };

  const getPurchaseByCollector = async (req, res) => {
    try {

      // const { userId } = req.body;
      const { payload } = req.body;
      const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const { userId } = decryptedData;
      let user = await getPurchaseByCollectorService(req, res,userId)
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };



  const getOfferByGallery = async (req, res) => {
    try {

      const { payload } = req.body;
      const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const { userId } = decryptedData;
    
      let user = await getOfferByGalleryService(req, res,userId)
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };


  const getOfferByCollector = async (req, res) => {
    try {

      const { payload } = req.body;
      const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const { userId } = decryptedData;
    
      let user = await getOfferByCollectorService(req, res,userId)
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };


  
  const getNFTByCollector = async (req, res) => {
    try {
      const { userId } = req.body;
      // const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
      // const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // const { userId } = decryptedData;
    
      let user = await getNftByCollectorService(req, res,userId)
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };


  
  const getAllSale = async (req, res) => {
    try {
      let user = await getAllSaleService(req, res, {
        // _id: req.body.userId,
      });
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };

 
  









  module.exports = {
    buyNft,
    getAllSale,
    getSaleByGallery,
    getCanceledByGallery,
    makeOffer,
    getOfferByGallery,
    getOfferByCollector,
    cancelOffer,
    getPurchaseByCollector,
    getNFTByCollector,
    getCancelledByCollector,
    getTotalSale,
    getSaleId,
    getSaleByArtist,
    getTotalSaleArtist,
    getSaleByArt,
    getTotalSaleCollector
  }  