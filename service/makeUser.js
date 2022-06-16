const {
  toJson,
} = require("./utils");





module.exports = ({ User, authHelper }) => {
  const userService = {};

  async function getUserByEmail(email) {
    const user = await User.findOne({ email }, (err, user) => {});
    return toJson(user);
  }
  async function getUserByName(name) {
    const user = await User.findOne(
      { name },
      (err, user) => {}
    );
    return toJson(user);
  }





  async function createArtistUser(
    name,
    password,
    mobile,
    whatsapp,
    same,
    cnic,
    role,
    block_code,
    gender,
    district,
    tehsil,
    city,
    area,
    block_number,
    street_number,
    street_name,
    near,
    house_number,
    remarks,
    voter_type,
    na,
    pp,
    qualification,
    occupation,
    martial_status,
    relation,

    res
  ) {
    const user = new User({
      name,
      password,
      mobile,
      whatsapp,
      same,
      cnic,
      role,
      block_code,
      gender,
      district,
      tehsil,
      city,
      area,
      block_number,
      street_number,
      street_name,
      near,
      house_number,
      remarks,
      voter_type,

      na,
      pp,
      qualification,
      occupation,
      martial_status,
      relation,
  
      res
    });
    await user.save(async(err, user) => {

      if (err) {
        console.log(err);
        return res.status(400).json({
          // error: errorHandler(err)
          error: err.message,
        });
      }

    






      return res.status(200).json({
        message: "created",
        success:true,
        data:user
        // token: user.confirmationCode,
        //  user:user
      });
    });
  }


 
  
  userService.createUser = async (
    name,
    password,
    mobile,
    whatsapp,
    same,
    cnic,
    role,
    block_code, 
    gender,
    district,
    tehsil,
    city,
    area,
    block_number,
    street_number,
    street_name,
    near,
    house_number,
    remarks,
    voter_type,
    na,
    pp,
    qualification,
    occupation,
    martial_status,
    relation,
    res

  ) => {
    try {
      // const approveUser = await getUserByEmail(email);
      //    console.log('approve userrr',approveUser)
      

      // if (approveUser) {
      //   return res.status(200).json({
      //     error: "This Email Already Exist ",
      //   });
      // }
      
      
      const user = await createArtistUser(
        name,
        password,
        mobile,
        whatsapp,
        same,
        cnic,
        role,
        block_code, 
        gender,
        district,
        tehsil,
        city,
        area,
        block_number,
        street_number,
        street_name,
        near,
        house_number,
        remarks,
        voter_type,
        na,
        pp,
        qualification,
        occupation,
        martial_status,
        relation,
        res
    
      );
    } catch (e) {
      const errorName = e.name;
    }
  };

  
  return userService;
};
 