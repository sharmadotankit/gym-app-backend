const getTokenData = require('../utils/helper').getTokenData;
const SavedExerciseModel = require("../Models/SavedExercise");
const UserModel = require('../Models/User');

const saveExerciseToProfile = async(req,res)=>{
   try{
    if(!req.body){
        throw{
            message:"Missing required parameters"
        }
    }
    let data= req.body;
    data.selectedExercise = JSON.parse(data.selectedExercise)
    let userData = getTokenData(req);

    if(!userData){
        throw{
            message:"Invalid request.No user found for token"
        }
    }

    const isExerciseAlreadySaved = await SavedExerciseModel.find({userId:data.userId,exerciseid:data.selectedExercise.id})
    if(isExerciseAlreadySaved.length){
        throw{
            message:"Exercise is already saved."
        }
    }

    const response = await SavedExerciseModel.create({
        userId:data.userId,
        name:data.selectedExercise.name,
        bodyPart:data.selectedExercise.bodyPart,
        gifUrl:data.selectedExercise.gifUrl,
        target:data.selectedExercise.target,
        exerciseid:data.selectedExercise.id,
        equipment:data.selectedExercise.equipment,
    })

    if(response){
        return res.status(200).json({
            status:true,
            message:"Exercise saved successfully",
            data:response,
            error:null,
        })
    }else{
        throw{
            message:"Something went wrong while saving the exercise."
        }
    }
   }
   catch(err){
    console.log("error",err)
    return res.status(500).json({
        status: false,
        message: err.message,
        error: err,
        data:null,
      });
   }
}

const updateUserInformation = async(req,res)=>{
    try{
     if(!req.body){
         throw{
             message:"Missing required parameters"
         }
     }
     let data= req.body;
     let userData = getTokenData(req);
 
     if(!userData){
         throw{
             message:"Invalid request.No user found for token"
         }
     }
     
     const response = await UserModel.findByIdAndUpdate(data.id,data,{new:true});
 
     if(response){
         return res.status(200).json({
             status:true,
             message:"User updated successfully",
             data:response,
             error:null,
         })
     }else{
         throw{
             message:"Something went wrong while updating user information."
         }
     }
    }
    catch(err){
     console.log("error",err)
     return res.status(500).json({
         status: false,
         message: err.message,
         error: err,
         data:null,
       });
    }
 }

 const fetchSavedExercise = async(req,res)=>{
    try{
    let userId = req.params.id;
     if(!userId){
         throw{
             message:"Missing required parameters"
         }
     }

     let userData = getTokenData(req);
 
     if(!userData){
         throw{
             message:"Invalid request.No user found for token"
         }
     }
     
     const response = await SavedExerciseModel.find({userId:userId});
 
     if(response){
         return res.status(200).json({
             status:true,
             message:"Data fetched successfully",
             data:response,
             error:null,
         })
     }else{
         throw{
             message:"Something went wrong while fetching saved exercise."
         }
     }
    }
    catch(err){
     console.log("error",err)
     return res.status(500).json({
         status: false,
         message: err.message,
         error: err,
         data:null,
       });
    }
 }


 const connectToServer = async(req,res)=>{
    try{
         return res.status(200).json({
             status:true,
             message:"Connected To Server",
             data:"Connected To Server",
             error:null,
         })
    }
    catch(err){
     console.log("error",err)
     return res.status(500).json({
         status: false,
         message: err.message,
         error: err,
         data:null,
       });
    }
 }

module.exports = {
    saveExerciseToProfile,
    updateUserInformation,
    fetchSavedExercise,
    connectToServer,
}