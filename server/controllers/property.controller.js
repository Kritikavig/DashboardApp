import mongoose from 'mongoose';
import Property from '../mongodb/models/property.js';
import User from '../mongodb/models/user.js';

import * as dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const getAllProperties = async (req,res)=>{

    //refine sending all information for filtering of page to backend
    //destructuring all values through req.query
    const { _end, _order, _start, _sort, title_like = "", propertyType = "",} = req.query;
    const query = {};

    if (propertyType !== "") {  //check and set propertyType
        query.propertyType = propertyType;
    }

    if (title_like) {       //set title, options for case sensitivity
        query.title = { $regex: title_like, $options: "i" };
    }

    try {
        const count = await Property.countDocuments({query});
    
        const properties = await Property
        .find(query)
        .limit(_end)   //find all properties entered by user till end
        .skip(_start)
        .sort({[_sort]: _order })

        res.header('x-total-count',count);  //sent to frontend
        res.header('Acess-Control-Expose-Headers','x-total-count');

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({  message: error.message });
    }
};

const getPropertyDetails = async (req,res)=>{

    const {id} = req.params;
    const propertyExists = await Property.findOne({_id:id}).populate('creator');

    if(propertyExists) res.status(200).json(propertyExists);
    else res.status(404).json({message:'Property not found..'});
};

const createProperty = async (req,res)=>{

    try {
        //data coming from form
        const {title,description,propertyType,price,location,photo,email} = req.body;    
    
        //start session
        const session = await mongoose.startSession();
        session.startTransaction();
    
        //find user by email and start session with it
        const user = await User.findOne({email}).session(session);
        if(!user) throw new Error('User not found!!');

        const photoUrl = await cloudinary.uploader.upload(photo);   //upload photo through cloudinary

        //create new property using schema
        const newProperty = await Property.create({
            title,
            description,
            propertyType,
            location,
            price,
            photo: photoUrl.url,
            creator: user._id
        });

        user.allProperties.push(newProperty._id);
        await user.save({session});
        await session.commitTransaction();

        res.status(200).json({  message: 'Property created suceessfully' });
    } catch (error) {
        res.status(500).json({  message: error.message });
    }
};

const updateProperty = async (req,res)=>{

    try {
        const {id} = req.params;
        const {title,description,propertyType,location,price,photo } = req.body;
        const photoUrl = await cloudinary.uploader.upload(photo);   //again upload photo through cloudinary
        await Property.findByIdAndUpdate({_id:id}, {
            title,
            description,
            propertyType,
            location,
            price,
            photo: photoUrl.url || photo
        })
        res.status(200).json({message: 'Property updated successfully'});
        
    } catch (error) {
        res.status(500).json({message: error.message});      
    }
};

const deleteProperty = async (req,res)=>{
    try {
        const { id } = req.params;
        const propertyToDelete = await Property.findById({ _id: id }).populate( "creator",);

        if (!propertyToDelete) throw new Error("Property not found");

        const session = await mongoose.startSession();
        session.startTransaction();

        await Property.deleteOne({ _id: id }, { session });
        propertyToDelete.creator.allProperties.pull(propertyToDelete);

        await propertyToDelete.creator.save({ session });
        await session.commitTransaction();

        res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllProperties,
    getPropertyDetails,
    createProperty,
    updateProperty,
    deleteProperty
};
