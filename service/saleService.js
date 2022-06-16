const Sale = require("../models/Sale");
const User = require("../models/user")



const saveSalesinSale = async (payload) => {
    try {
      const sale = new Sale({
        ...payload,
      });
      let saleDetail = await sale.save();
      return { ...saleDetail._doc };
      //  user:user
    } catch (e) {
      throw "Failed to update sale";
    }
  };

 

   
  

  const saveSaleInUser = async (query, payload) => {
    try {
      console.log(query);
      let updatedDetailsWithSale = await User.findOneAndUpdate(
        { ...query },
        { ...payload },
        { new: true }
      )
        .populate("artist_artwork")
        .populate("Sale")
        .lean();
      return {
        message: "Artist artwork added successfully",
        data: updatedDetailsWithSale,
  
        //  user:user
      };
    } catch (e) {
      throw "Failed to update artist artwork";
    }
  };

  {$or: [{expires: {$gte: new Date()}}, {expires: null}]}

  const getSaleByGalleryService = async (req, res, userId) => {
    try {
      let userDetails = await Sale.find({
        // approved: true,
        gallery:userId,
        $or: [{sale_status: 'completed'}, {offered_status: 1}]
      })
      .populate("collector")
      .populate("gallery")
      .populate("artist_artwork")
        .lean();
      if (userDetails) {
        return res.status(200).json({
          data: userDetails,
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };

  const getSaleByArtistService = async (req, res, userId) => {
    try {
      let userDetails = await Sale.find({
        // approved: true,
        artist:userId,
        $or: [{sale_status: 'completed'}, {offered_status: 1}]
      })
      .populate("collector")
      .populate("artist")
      .populate("gallery")
      .populate("artist_artwork")
        .lean();

      if (userDetails) {
        return res.status(200).json({
          data: userDetails,
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };


  const getSaleIdByArtwork = async (req, res, artId) => {
    try {
      let userDetails = await Sale.findOne({
        // approved: true,
        artist_artwork:artId,
        $or: [{sale_status: 'completed'}, {offered_status: 1}]
      })
      .populate("collector")
      .populate("artist")
      .populate("gallery")
      .populate("artist_artwork")
        .lean();
      if (userDetails) {
        console.log('userDetailsssss',userDetails?._id)
        return res.status(200).json({
          data: userDetails?._id,
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };



  const getSaleById = async (req, res, userId) => {
    try {
      let userDetails = await Sale.findOne({
        // approved: true,
        _id: userId
      })
      .populate("collector")
      .populate("gallery")
      .populate("artist_artwork")
        .lean();
      if (userDetails) {
        return res.status(200).json({
          data: userDetails,
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };





  const getTotalSaleByGallery = async (req, res, userId) => {
    try {
      let userDetails = await Sale.find({
        // approved: true,
        gallery:userId,
        $or: [{sale_status: 'completed'}, {offered_status: 1}]
       
      })
     
        .lean();
      if (userDetails) {
      const buying =  userDetails.filter((x)=>x?.sale_status== 'completed')


        const totalBuying  =  buying.reduce(function (acc, obj) { return acc + obj?.sale_price; }, 0);
console.log(totalBuying)


const offers =  userDetails.filter((x)=>x?.offered_status== 1)


        const totalOffers  =  offers.reduce(function (acc, obj) { return acc + obj?.offered_price          ; }, 0);
console.log(totalOffers)
         
        return res.status(200).json({
          saleCount: totalBuying+totalOffers,
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };


  const getTotalSaleByArtist = async (req, res, userId) => {
    try {
      let userDetails = await Sale.find({
        // approved: true,
        artist:userId,
        $or: [{sale_status: 'completed'}, {offered_status: 1}]
       
      })
     
        .lean();
      if (userDetails) {
      const buying =  userDetails.filter((x)=>x?.sale_status== 'completed')


        const totalBuying  =  buying.reduce(function (acc, obj) { return acc + obj?.sale_price; }, 0);
console.log(totalBuying)


const offers =  userDetails.filter((x)=>x?.offered_status== 1)


        const totalOffers  =  offers.reduce(function (acc, obj) { return acc + obj?.offered_price          ; }, 0);
console.log(totalOffers)
         
        return res.status(200).json({
          saleCount: totalBuying+totalOffers,
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };


  const getTotalSaleByCollector = async (req, res, userId) => {
    try {
      let userDetails = await Sale.find({
        // approved: true,
        collector:userId,
        $or: [{sale_status: 'completed'}, {offered_status: 1}]
       
      })
     
        .lean();
      if (userDetails) {
      const buying =  userDetails.filter((x)=>x?.sale_status== 'completed')


        const totalBuying  =  buying.reduce(function (acc, obj) { return acc + obj?.sale_price; }, 0);
console.log(totalBuying)


const offers =  userDetails.filter((x)=>x?.offered_status== 1)


        const totalOffers  =  offers.reduce(function (acc, obj) { return acc + obj?.offered_price          ; }, 0);
console.log(totalOffers)
         
        return res.status(200).json({
          saleCount: totalBuying+totalOffers,
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };

  const getCanceledByGalleryService = async (req, res, userId) => {
    try {
      let userDetails = await Sale.find({
        gallery:userId,
        purchase_option:"offer",
        offered_status: 2
      })
      .populate("collector")
      .populate("gallery")
      .populate("artist_artwork")
        .lean();
      if (userDetails) {
        return res.status(200).json({
          data: userDetails,
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };
 

  const getCancelledByCollectorService = async (req, res, userId) => {
    try {
      let userDetails = await Sale.find({
        collector:userId,
        purchase_option:"offer",
        offered_status: 2
      })
      .populate("collector")
      .populate("gallery",'name email gallery_logo')
      .populate("artist_artwork")
        .lean();
      if (userDetails) {
        return res.status(200).json({
          data: userDetails,
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };

  const getPurchaseByCollectorService = async (req, res, userId) => {
 
    try {
      let userDetails = await Sale.find({
        // approved: true,
        collector:userId,
        $or: [{sale_status: 'completed'}, {offered_status: 1}]
      })
      .populate("collector")
      .populate("gallery",'name email gallery_logo')
      .populate("artist_artwork")
        .lean();
      if (userDetails) {
        return res.status(200).json({
          data: userDetails,
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };


  const getNftByCollectorService = async (req, res, userId) => {
    try {
      let userDetails = await Sale.find({
        // approved: true,
        collector:userId,
        purchase_option:"buy",
        sale_status: "completed"
      })
      .populate("collector")
      .populate("artist_artwork")
        .lean();
      if (userDetails) {
        console.log(userDetails)
       const userNfts = userDetails.map((x)=>{return x?.artist_artwork})

        return res.status(200).json({
          
          userNfts
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };






  const cancelOfferService = async (req, res, offerId,reason) => {
    try {
      console.log("helloo: ",offerId, reason);
      Sale.findOneAndUpdate(
        { _id: offerId },
        { $set: { offered_status: 2, cancelled_reason:reason} }
      )
        .then((user) => { 
          if (!user) {
            return res.status(200).json({
              error: 'something went wrong',
            });
          }
          return res.status(200).json({
            message: 'Offered Cancelled Successfully',
          });
        })
        .catch((e) => console.log("error", e));
        
    } catch (ex) {
      throw "User not found";
    }
  };

  const getOfferByGalleryService = async (req, res, userId) => {
    try {
      let userDetails = await Sale.find({
        // approved: true,
        gallery:userId,
        purchase_option:"offer",
        offered_status:0
      })
      .populate("collector")
      .populate("gallery")
      .populate("artist_artwork")
        .lean();
      if (userDetails) {
        return res.status(200).json({
          data: userDetails,
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };

  const getOfferByCollectorService = async (req, res, userId) => {
    try {
      let userDetails = await Sale.find({
        // approved: true,
        collector:userId,
        purchase_option:"offer",
        offered_status:0
      })
      .populate("collector")
      .populate("gallery",'name email gallery_logo')
      .populate("artist_artwork")
      
        .lean();
      if (userDetails) {
        return res.status(200).json({
          data: userDetails,
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };

  const getAllSaleService = async (req, res) => {
    try {
      let userDetails = await Sale.find({
        // approved: true,
       
      })
        .populate("collector")
        .populate("gallery")
        .populate("artist_artwork")
         .lean();
      if (userDetails) {
        // userDetails.populated('User'); // truthy
        return res.status(200).json({
          data: userDetails,
        });
      }
      throw "User not found";
    } catch (ex) {
      throw "User not found";
    }
  };

  module.exports = {
    saveSalesinSale,
    getAllSaleService,
    saveSaleInUser,
    getSaleByGalleryService,
    getOfferByGalleryService,
    getOfferByCollectorService,
    cancelOfferService,
    getPurchaseByCollectorService,
    getNftByCollectorService,
    getCanceledByGalleryService,
    getCancelledByCollectorService,
    getTotalSaleByGallery,
    getTotalSaleByArtist,
    getSaleById,
    getSaleByArtistService,
    getSaleIdByArtwork,
    getTotalSaleByCollector
  };
  