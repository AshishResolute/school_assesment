import joi from "joi";
import db from "../database/db.js";
import { AppError } from "../ErrorHandler/Errorhandler.js";

let schoolInputSchema = joi.object({
  name: joi.string().trim().min(3).max(255).required().messages({
    "string.min": ` School name must be atleast 3 characters long!`,
    "string.max": `School name must be less than 255 characters`,
    "string.empty": `School name required,cannot be empty`,
  }),
  address: joi.string().min(3).max(255).required().messages({
    "any.only": `Invalid School address,must be atleast 3 characters long and less than 255 characters`,
  }),
  latitude: joi.number().min(-90).max(90).required().messages({
    "number.min": `latitude cannot be less than -90`,
    "number.max": `latitude cannot be more than 90`,
  }),
  longitude: joi.number().min(-180).max(180).required().messages({
    "number.min": `longitude cannot be less than -180`,
    "number.max": `longitude cannot be more than 180`,
  }),
});

let addSchool = async (req, res, next) => {
  try {
    let { error, value } = schoolInputSchema.validate(req.body);
    if (error)
      return next(new AppError(`Invalid Input Provided`, 400, error.message));
    const { name, address, latitude, longitude } = value;
    let [addSchoolInfo] = await db.query(
      `insert into schools(name,address,latitude,longitude) values(?,?,?,?)`,
      [name, address, latitude, longitude],
    );
    res.status(201).json({
      success: true,
      message: `School data recorded!`,
      SchoolId: addSchoolInfo.insertId,
      timeStamp: new Date().toLocaleString(),
    });
  } catch (err) {
    if(err.code==='ER_DUP_ENTRY')
    {
        return next(new AppError(`School already exists`,409,`Duplicate Entry!`)) 
    }
    console.error(err.message);
    next(err);
  }
};

let userCo_ordinates = joi.object({
     latitude: joi.number().min(-90).max(90).required().messages({
    "number.min": `latitude cannot be less than -90`,
    "number.max": `latitude cannot be more than 90`,
  }),
  longitude: joi.number().min(-180).max(180).required().messages({
    "number.min": `longitude cannot be less than -180`,
    "number.max": `longitude cannot be more than 180`,
  })
});


const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};

let listSchools = async(req,res,next)=>{
    try{
        let {error,value} = userCo_ordinates.validate(req.query);
        if(error) return next(new AppError(`Invalid user co-ordinates provided`,400,error.message));
        let {latitude:userLatitude,longitude:userLongitude} = value
        let [allSchoolsData] = await db.query(`select * from schools`);
        if(allSchoolsData.length===0) return res.status(200).json({
            message:`No School Data is present yet!`,
            timeStamp:new Date().toLocaleString()
        })

        allSchoolsData.sort((a,b)=>{
              let distA = getDistance(userLatitude,userLongitude,a.latitude,a.longitude);
              let distB = getDistance(userLatitude,userLongitude,b.latitude,b.longitude);
              a.distance = `${distA.toFixed(2)} kms`
              b.distance = `${distB.toFixed(2)} kms`
            return distA-distB
        })
        res.status(200).json({
            success:true,
            message:`List of near by schools:`,
            userCo_ordinates:`${userLatitude},${userLongitude}`,
            schoolsCount:allSchoolsData.length,
            schools:allSchoolsData,
            timeStamp:new Date().toLocaleString()
        })
    }
    catch(err)
    {
        console.error(err.message);
        next(err)
    }
}
export {addSchool,listSchools}