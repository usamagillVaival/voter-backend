const {
getGalleries 
} = require("../service/galleryService");
const {getArtistByGallery,galleryNfts,getAdminDashboard} = require("../service/galleryService")
  



const getAdmin = async (req, res) => {
  try {
    getAdminDashboard(req, res, {
      invitation_status: 2,
      gallery_signup_step:3,
      pause_status:"unpaused"
    });
  } catch (ex) {
    return res.status(400).json({
      error: ex,
    });
  }
};


const getApprovedGallery = async (req, res) => {
    try {
      getGalleries(req, res, {
        invitation_status: 2,
        gallery_signup_step:3,
        pause_status:"unpaused"
      });
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };
  

  
  const getPendingGallery = async (req, res) => {
    try {
      getGalleries(req, res, {
        invitation_status: 1,
        pause_status:"unpaused"
      });
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };

  const getDeactiveGalleries = async (req, res) => {
    try {
      getGalleries(req, res, {
        invitation_status: 2,
        gallery_signup_step:3,
        pause_status:"paused"
      });
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };
  


  const getCancelledArtist = async (req, res) => {
    try {
      getGalleries(req, res, {
        invited_from: req.query.invited_from,
        invitation_status: 3,
      });
    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };



  const getDashboardStatistics = async (req, res) => {
    try {
      const {userId} = req.body
   let artistCount =  await getArtistByGallery({
        invited_from: userId,
        invitation_status: 2,
      });



      let nftDetail = await galleryNfts({
         userId:userId
      });

      

      
      
      return res.status(200).json({
        // ...saveArtistWorkInUser,
       artistCount:artistCount,
       nftCount:nftDetail?.nftsLength,
       gallery_last_login:nftDetail?.gallery_last_login,
       gallery_login_count:nftDetail?.gallery_login_count
        // data: { file: req.file.filename },
      });

    } catch (ex) {
      return res.status(400).json({
        error: ex,
      });
    }
  };


  




  module.exports = {
  
    getApprovedGallery,
    getPendingGallery,
    getCancelledArtist,
    getDashboardStatistics,
    getDeactiveGalleries,
    getAdmin
  
  };
  