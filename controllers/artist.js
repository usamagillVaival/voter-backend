const {
  addArtistProfile,
  getArtistProfile,
  updateArtistProfile,
  getArtistByGallery,
  fetchUserByProvidedDetails,
  saveArtistArtworkInUser,
  saveArtistWorkInArtWorks,
  updateArtistWorkInArtWorks, 
  getArtwork,
  getArtworkByGalleryProfile
} = require("../service/artistService");
const {notificationService} = require("../service/notificationService")
const { secret } = require("../config/otp");
const { saveOTP } = require("../service/otpService");
const ArtistArtWork = require("../models/artistArtWork");
const User = require("../models/user");
const CryptoJS = require("crypto-js");

const sgMail2 = require("@sendgrid/mail");

const addProfile = async (req, res) => {
  //   res.json({ file: req.file });
  const {
    username,
    yearOfBirth,
    nationality,
    biography,
    networkCategory,
    links,
  } = req.body;
  try {
    if (
      !username ||
      !yearOfBirth ||
      !nationality ||
      !biography ||
      //   !networkCategory ||
      //   !links ||
      !req.file
    ) {
      throw "All fields are required";
    }
    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
    return await addArtistProfile(
      req,
      res,
      { username, yearOfBirth, nationality, biography, networkCategory, links },
      req.file.filename
    );
  } catch (ex) {
    return res.status(400).json({
      error: ex,
    });
  }
};

const updateProfile = async (req, res) => {
  //   res.json({ file: req.file });
  const {
    username,
    yearOfBirth,
    nationality,
    biography,
    networkCategory,
    links,
  } = req.body;
  try {
    if (username) {
      throw "Can not update username";
    }
    if (
      !yearOfBirth ||
      !nationality ||
      !biography ||
      //   !networkCategory ||
      //   !links ||
      !req.file
    ) {
      throw "All fields are required";
    }
    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
    return await updateArtistProfile(
      req,
      res,
      {
        userId: req.params.userId,
        yearOfBirth,
        nationality,
        biography,
        networkCategory,
        links,
      },
      req.file.filename
    );
  } catch (ex) {
    return res.status(400).json({
      error: ex,
    });
  }
};

// to test image chunks are working
const viewProfile = (req, res) => {
  try {
    req.gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exists",
        });
      }

      // Check if image
      // Read output to browser
      const readstream = req.gfs.createReadStream(file.filename);
      readstream.pipe(res);
      //   res.json({ readstream });
    });
  } catch (ex) {
    res.status(400).json({ error: "No file exists" });
  }
  //   const { payload } = req.body;
  //   const {
  //     name,
  //     yearOfBirth,
  //     nationality,
  //     coverArt,
  //     biography,
  //     networkCategory,
  //     links,
  //   } = payload;
};

const getProfile = async (req, res) => {
  try {
    let user = await getArtistProfile(req, res, {
      _id: req.query.userId,
      account_type: "artist",
    });
  } catch (ex) {
    return res.status(400).json({
      error: ex,
    });
  }
};
const getApprovedArtist = async (req, res) => {
  try {
    getArtistByGallery(req, res, {
      invited_from: req.query.invited_from,
      invitation_status: 2,
    });
  } catch (ex) {
    return res.status(400).json({
      error: ex,
    });
  }
};

const getPendingArtist = async (req, res) => {
  try {
    getArtistByGallery(req, res, {
      invited_from: req.query.invited_from,
      invitation_status: 1,
    });
  } catch (ex) {
    return res.status(400).json({
      error: ex,
    });
  }
};

const getCancelledArtist = async (req, res) => {
  try {
    getArtistByGallery(req, res, {
      invited_from: req.query.invited_from,
      invitation_status: 3,
    });
  } catch (ex) {
    return res.status(400).json({
      error: ex,
    });
  }
};





const addArtistArtworkImage = async (req, res) => {
  try {
    if (!req.file) {
      throw "Failed to upload file";
    }
    if (!req.body.userId) {
      throw "User not found";
    }
    // res.status(200).json({
    //   message: "Artist artwork added successfully",
    //   data: { file: req.file.filename },
    // });
    let fetchArtist = await fetchUserByProvidedDetails({
      _id: req.body.userId,
      // account_type: "artist",
      // invited_from: req.query.invited_from,
      // approved: true,
    });
    if (fetchArtist) {
      let addArtistWork = await saveArtistWorkInArtWorks({
        file: req.file.filename,
        artDraftingStatus: req.body.artDraftingStatus,
        status: req.body.status,
        medium: req.body.medium,
      });
      let saveArtistWorkInUser = await saveArtistArtworkInUser(
        {
          _id: req.body.userId,
          // account_type: "artist",
          // invited_from: req.query.invited_from,
          // approved: true,
        },
        {
          $push: { artist_artwork: addArtistWork._id },
        }
      );
      console.log(addArtistWork);
      return res.status(200).json({
        ...saveArtistWorkInUser,
        artDetail: addArtistWork,

        // data: { file: req.file.filename },
      });
    } else {
      throw "User not found";
    }
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




const buyNft = async (req, res) => {
  try {
  
    if (!req.body.userId) {
      throw "User not found";
    }
   
    let fetchArtist = await fetchUserByProvidedDetails({
      _id: req.body.userId,
      // account_type: "artist",
      // invited_from: req.query.invited_from,
      // approved: true,
    });
    if (fetchArtist) {
      let addArtistWork = await saveArtistWorkInArtWorks({
        file: req.file.filename,
        artDraftingStatus: req.body.artDraftingStatus,
        status: req.body.status,
        medium: req.body.medium,
      });
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
      console.log(addArtistWork);
      return res.status(200).json({
        ...saveArtistWorkInUser,
        artDetail: addArtistWork,

        // data: { file: req.file.filename },
      });
    } else {
      throw "User not found";
    }
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

const updateArtistArtWorkDetails = async (req, res) => {
  console.log(req.body.sendToArtistDate)
  //   res.json({ file: req.file });
  const {
    title,
    description,
    status,
    revenueSplit,
    artistId,
    artistName,
    galleryName,
    galleryId,
    galleryContractAddress,
    sendToArtistDate,
    galleryProfile,

  } = req.body;
  try {
    if (!req.params.userId) {
      throw "User not found";
    }
    if (!req.params.artId) {
      throw "Artwork not found";
    }
    let updatedArtistArtWork = await checkAndUpdateArtistArtWork(
      req.params.userId,
      req.params.artId,
      {
        title,
        description,
        status,
        revenueSplit,
        artistId,
        artistName,
        galleryId,
        galleryName,
        galleryContractAddress,
        sendToArtistDate,
        galleryProfile
      }
    );
    return res.status(200).json({
      message: "Artist artwork updated successfully",
      data: { ...updatedArtistArtWork },
    });
    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const artworkDetail = async (req, res) => {
  try {
    console.log(req.params.artId);

    if (!req.body.artId) {
      throw "Artwork not found";
    }
    await ArtistArtWork.find({ _id: req.body.artId }).exec(function (err, art) {
      if (art) {
        return res.status(200).json({
          art,
        });
      } else {
        return res.status(200).json({
          message: "No Art Found",
        });
      }
    });
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
  }
};

const deleteArtwork = async (req, res) => {
  //   res.json({ file: req.file });
  const { title, description, status, revenueSplit, artistId } = req.body;
  try {
    if (!req.params.artId) {
      throw "Artwork not found";
    }

    let updatedArtistArtWork = await deleteArtworkById(req.params.artId);
    return res.status(200).json({
      message: "Artist deleted successfully",
      // data: { ...updatedArtistArtWork },
    });
    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};



const getArtworksById = async (req, res) => {
  try {
    console.log("ccc");
    let updatedArtistArtWork = await getArtwork(req, res, {
      userId: req.params.userId,
    });
    return res.status(200).json({
      message: "Artist artwork updated successfully",
      data: { ...updatedArtistArtWork },
    });
    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};





const getStoreFrontArtworksByProfile = async (req, res) => {
  try {
    console.log("ccc");
    let updatedArtistArtWork = await getArtworkByGalleryProfile(req, res, {
      gallery_profile: req.body.gallery_profile,
    });
    // return res.status(200).json({
    //   message: "Artist artwork updated successfully",
    //   data: { ...updatedArtistArtWork },
    // });
    // if (!req.file) {
    //   throw "Failed to add artist profile information";
    // }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const sendArtistArtWorkDetails = async (req, res) => {
  try {
    if (!req.body.userId) {
      throw "User not found";
    }
    if (!req.body.artId) {
      throw "Artwork not found";
    }
    let saveArtistWorkInUser = await saveArtistArtworkInUser(
      {
        _id: req.body.artistId,
        account_type: "artist",
        // invited_from: req.query.invited_from,
        // approved: true,
      },
      {
        $push: { artist_artwork: req.body.artId },
      }
    );
   
    if (!saveArtistWorkInUser.data) {
      throw "Not send because no such artist found";
    } else {
      let updatedArtistArtWork = await checkAndUpdateArtistArtWork(
        req.body.userId,
        req.body.artId,
        {
          status: 2,
        }
      );
console.log('updatee',updatedArtistArtWork)
      let saleNotification = await notificationService({
        notification_reciever: req.body.artistId,
        notification_sender : req.body.userId,
        nft:req.body.artId,
        notification_type:'approval',
        notification_title:'send to approval'
      });



      const email = saveArtistWorkInUser?.data?.email;
      

      const msg = {
        to: email,
        from: "info@dadavault.com",
        subject: "NFT Approval",
        text: `Test Email`,
        html: `<strong>
     Please Click on this Link to Approve NFT <br/>
       <a href=http://51.222.241.160:3000/NFTsDetailNew/${req.body.artId}> Click here</a>
      </strong>`,
      };
      sgMail2.setApiKey(
        "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"
      );
      sgMail2.send(msg).then(
        () => {
          console.log("email sended");
      
          // return res.status(200).json({
          //   message: "An email has been send To your email Address",
          // });
        },
        (error) => {
          console.error(error);
          if (error.response) {
            console.error(error.response.body);
          }
        }
      );

      return res.status(200).json({
        message: "Artist artwork sent successfully",
        data: { ...updatedArtistArtWork },
      });
    }
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const approveArtistArtWorkDetails = async (req, res) => {
  try {
    if (!req.body.userId) {
      throw "User not found";
    }
    if (!req.body.artId) {
      throw "Artwork not found";
    }
     const artistwalletaddress=req?.body?.artist_wallet_account
    let updatedArtistArtWork = await checkAndUpdateArtistArtWork(
      req.body.userId,
      req.body.artId,
      {
        artistApprovalDate: new Date(),
        status: 3,
        artist_wallet_account: artistwalletaddress,
    
      }
    );
         console.log(updatedArtistArtWork)


    let Notification = await notificationService({
      notification_reciever: updatedArtistArtWork?.invited_from,
      notification_sender :  updatedArtistArtWork?._id,
      nft: req.body.artId,
      notification_type:'nft',
      notification_title:'nft Approved'
    });



    return res.status(200).json({
      message: "Artist artwork approved successfully",
      data: { ...updatedArtistArtWork },
    });
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};


const listForSale = async (req, res) => {
  try {
    if (!req.body.userId) {
      throw "User not found";
    }
    if (!req.body.artId) {
      throw "Artwork not found";
    }
    let updatedArtistArtWork = await checkAndUpdateArtistArtWork(
      req.body.userId,
      req.body.artId,
      {
        price: req.body.price,
        nft_payment_method: req.body?.nft_payment_method,
        listing_hash:req.body.listing_hash,
        listing_hash_status:'pending',
        listing_pending_date:new Date()
      }
    );
    return res.status(200).json({
      message: "Artist artwork approved successfully",
      data: { ...updatedArtistArtWork },
    });
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const allArtworks = async (req, res) => {
  try {
    if (!req.body.userId) {
      throw "User not found";
    }
    if (!req.body.artId) {
      throw "Artwork not found";
    }
    let updatedArtistArtWork = await checkAndUpdateArtistArtWork(
      req.body.userId,
      req.body.artId
    );
    return res.status(200).json({
      message: "Artist artwork approved successfully",
      data: { ...updatedArtistArtWork },
    });
  } catch (ex) {
    if (ex.message) {
      return res.status(400).json({
        error: ex.message,
      });
    }
    return res.status(400).json({
      error: ex,
    });
  }
};

const updateCreatedArtistProfile = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const {
    name,
    password,
    email,
    artistName,
    yearOfBirth,
    nationality,
    biography,
    website,
    artsyProfile,
    twitter,
    instagram,
    signupStep,
    artist_profile,
    artist_wallet_account,
  } = req.body;

  User.findOne({ email: email, account_type: "artist" }, async (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    if (user) {
      (user.name = name?name: user.name),
        (user.password = password ? password : user.password),
        (user.account_type = "artist"),
        (user.artist_name = artistName ? artistName :user?.artistName),
        (user.artist_profile = artist_profile ? artist_profile : user?.artist_profile),
        (user.artist_year_of_birth = yearOfBirth ?yearOfBirth :user?.artist_year_of_birth),
        (user.artist_nationality = nationality ? nationality :user?.artist_nationality ),
        (user.artist_biography = biography ? biography : user?.artist_biography),
        (user.artist_website = website ?website : user?.artist_website),
        (user.artist_artsy_profile = artsyProfile ?artsyProfile :user?.artist_artsy_profile),
        (user.artist_twitter = twitter?twitter :user?.artist_twitter ),
        (user.artist_instagram = instagram ? instagram : user?.artist_instagram),
        (user.artist_signup_step = signupStep ?signupStep :user?.signupStep),
        (user.artist_head_shot =  req.file ? req.file.filename:user?.artist_head_shot),
        (user.artist_wallet_account=artist_wallet_account?artist_wallet_account:user?.artist_wallet_account);
    
    }
    user.save((err, updatedUser) => {
      if (err) {
        console.log("USER UPDATE ERROR", err);
        return res.status(400).json({
          error: "User update failed",
        });
      }
      res.json(updatedUser);
    });
  });
};


const getArtistProfileById = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  

  const { payload } = req.body;
  const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  const { userId } = decryptedData;

  User.findOne({ _id:userId, account_type: "artist" }, async (err, user) => {
    if (err || !user) {
      return res.status(200).json({
        error: "User not found",
      });
    }
    if (user) {
      res.json(user);

    }
  })
   
};

const getCollectorProfileById = (req, res) => {
  const { payload } = req.body;
  const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  const { userId } = decryptedData;

  User.findOne({ _id:userId, account_type: "collector" }, async (err, user) => {
    if (err || !user) {
      return res.status(200).json({
        error: "User not found",
      });
    }
    if (user) {
      res.json(user);

    }
  })
   
};


const checkAndUpdateArtistArtWork = async (userId, artId, payload) => {
  let fetchArtist = await fetchUserByProvidedDetails({
    _id: userId,
    // account_type: "artist",
    // invited_from: req.query.invited_from,
    // approved: true,
  });



  console.log('user data')
  
  if (fetchArtist) {
    let checkArtistId =
      fetchArtist.artist_artwork &&
      fetchArtist.artist_artwork.find((item) => item._id.toString() === artId);
    if (checkArtistId) {
      let addArtistWork = await updateArtistWorkInArtWorks(
        { _id: artId },
        {
          // _id: artId,
          ...payload,
          // file,

          // $set: {
          //   "artist_artwork.title": title,
          //   "artist_artwork.year": year,
          //   "artist_artwork.description": description,
          //   "artist_artwork.edition": edition,
          //   "artist_artwork.price": price,
          //   "artist_artwork.tags": tags,
          // },
        }
      );
      let updatedFetchArtist = await fetchUserByProvidedDetails({
        _id: userId,
        // account_type: "artist",
        // invited_from: req.query.invited_from,
        // approved: true,
      });
      return { ...updatedFetchArtist };
    } else {
      throw "Artwork not found";
    }
  } else {
    throw "User not found";
  }
};

const deleteArtworkById = async (artId) => {
  try {
    console.log(artId);
    let artistArtWorkAddedDetails = await ArtistArtWork.deleteOne({
      _id: artId,
    }).lean();
    return { ...artistArtWorkAddedDetails._doc };
    //  user:user
  } catch (e) {
    throw "Failed to delete artwork";
  }
};


const getArtWorksOfUserWithStatus = async (req, res) => {
  try {
    let { userId, status } = req.params;
    let artWorkStatus = getArtStatusForDBFromName(status);
    let updatedFetchArtist = await fetchUserByProvidedDetails(
      {
        _id: userId,
        // approved: true,
      },
      {
        path: "artist_artwork",
        // match: { status: { $eq: artWorkStatus } },
      }
    );
    return res.status(200).json({
      data: { ...updatedFetchArtist },
    });
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




const getSaleOfArtist = async (req, res) => {
  try {
    const { payload } = req.body;
    const bytes = CryptoJS.AES.decrypt(payload, "dvault@123");
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const { userId } = decryptedData;
    let updatedFetchArtist = await fetchUserByProvidedDetails(
      {
        _id: userId,
        // approved: true,
      },
      {
        path: "artist_artwork",
        // match: { status: { $eq: artWorkStatus } },
      }
    );
      let artData = updatedFetchArtist?.artist_artwork.filter((x)=>x.status==6)
   console.log('artttttttttt',artData)
    return res.status(200).json({
      data: { ...updatedFetchArtist },
    });
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




const getArtStatusForDBFromName = (status) => {
  switch (status) {
    case "draft":
      return 1;
    case "pending":
      return 2;
    case "approved":
      return 3;
  }
};

module.exports = {
  addProfile,
  viewProfile,
  getProfile,
  updateProfile,
  updateCreatedArtistProfile,
  getApprovedArtist,
  getPendingArtist,
  getCancelledArtist,
  addArtistArtworkImage,
  updateArtistArtWorkDetails,
  sendArtistArtWorkDetails,
  approveArtistArtWorkDetails,
  listForSale,
  getArtworksById,
  getArtWorksOfUserWithStatus,
  deleteArtwork,
  allArtworks,
  artworkDetail,
  getStoreFrontArtworksByProfile,
  getArtistProfileById,
  getCollectorProfileById,
  getSaleOfArtist
};
