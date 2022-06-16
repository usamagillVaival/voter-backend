const Notification = require("../models/Notification");
const User = require("../models/user")


const getNotificationService = async (req, res, userId) => {
  try {
    console.log(userId)
    let notification = await Notification.find({
      notification_reciever:userId,
      isSeen:false
    })
    .populate("notification_sender",'email name artist_head_shot')
    // .populate("gallery")   
    .populate("nft", 'title file price')
      .lean();
      console.log(notification)
    if (notification) {
      return res.status(200).json({
        data: notification,
      });
    }
    throw "User not found";
  } catch (ex) {
    throw "User not found";
  }
};


const isSeenNotification = async (req, res, userId) => {
  try {
    
    console.log(userId)
    let notification = await Notification.updateMany(
      {
      notification_reciever:userId,
      isSeen:false}
      ,
      { $set: { isSeen: true,}
    })
    .populate("notification_sender",'email name artist_head_shot')
    // .populate("gallery")   
    .populate("nft", 'title file price')
      .lean();
      console.log(notification)
      return res.status(200).json({
        data: 'updated',
      });
   
  //  throw "User not found";
  } catch (ex) {
    return res.status(200).json({
      error: 'something went wrong',
    });
  }
};



const deleteNotification = async (req, res, userId) => {
  try {
    
    console.log(userId)
    let notification = await Notification.findOneAndUpdate(
      {
      _id:userId,
      isSeen:false
    }
      ,
      { $set: { isSeen: true,}
    })
    .populate("notification_sender",'email name artist_head_shot')
    // .populate("gallery")   
    .populate("nft", 'title file price')
      .lean();
      console.log(notification)
      return res.status(200).json({
        data: 'updated',
      });
   
  //  throw "User not found";
  } catch (ex) {
    return res.status(200).json({
      error: 'something went wrong',
    });
  }
};



const saleNotificationService = async (payload) => {
    try {
      const notification = new Notification({
        ...payload,
      });
      let notificationDetail = await notification.save();
      return { ...notificationDetail._doc };
      //  user:user
    } catch (e) {
      throw "Failed to update sale";
    }
  };



  const notificationService = async (payload) => {
    try {
      const notification = new Notification({
        ...payload,
      });
      let notificationDetail = await notification.save();
      return { ...notificationDetail._doc };
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
    getNotificationService,
    saleNotificationService,
    notificationService,
    isSeenNotification,
    deleteNotification



  };
  