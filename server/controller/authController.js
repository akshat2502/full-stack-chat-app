import { request, response } from "express";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from 'fs';

const maxAge= 2 * 24 * 60 * 60 * 60 ;

const createToken = (email,userId) => {
    return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn: maxAge,});
}

export const signup= async (request,response,next)=> {
    try {
        const {email,password}= request.body;
        if(!email || !password){
            return response.status(400).send("Email and password are required!")
        }
        const user = await User.create({email, password});
            
            if(user){
            response.cookie("jwt", createToken(email, user.id),{
                maxAge,
                secure: true,
                sameSite: "None",
            });
            return response.status(201).json({
                user: {
                    id: user.id,
                    email:user.email,
                    profileSetup: user.profileSetup
                }
            });
        }  
    
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal server error.");
    }
}

export const login = async (request,response,next)=> {
    try {
        const {email,password}= request.body;
        if(!email || !password){
            return response.status(400).send("Email and Password are required!")
        }

        const user = await User.findOne({email});
            if(!user){
                return response.status(404).send("User with the given email not exist")
            }

            const auth = await compare(password,user.password);
            if(!auth){
                return response.status(400).send("Password is incorrect!")
            }

            response.cookie("jwt", createToken(email, user.id),{
                maxAge,
                secure: true,
                sameSite: "None",
            });
            
            
            return response.status(200).json({
                user: {
                    id: user.id,
                    email:user.email,
                    profileSetup: user.profileSetup,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    color: user.color,
                    image: user.image,
                }
            }); 
    
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal server error.");
    }
}

export const logOut = async (request,response,next)=> {
    try {
            response.cookie("jwt","",{
                maxAge:1,
                secure: true,
                sameSite: "None",
            });   
            return response.status(200).send("logout successfull") 
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal server error.");
    }
}

export const getUserInfo = async (request,response,next)=> {
    try {
        const userData = await User.findById(request.userId);

        if(!userData) {
            return response.status(404).send("User with the given id not found")
        }
            return response.status(200).json(
                 {
                    id: userData.id,
                    email:userData.email,
                    profileSetup: userData.profileSetup,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    image: userData.image,
                    color: userData.color,
                }); 
    
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal server error.");
    }
}

export const updateprofile = async (request,response,next)=> {
    try {
        const { userId } = request;
        const { firstName, lastName, color, image} = request.body;
        if(!firstName || !lastName ) {
            return response.status(400).send("firstname, lastname and color is required!")
        }

        const userData = await User.findByIdAndUpdate(userId, 
            {
                firstName,
                lastName,
                color,
                profileSetup: true,
            }, {new: true, runValidators: true});

            return response.status(200).json(
                 {
                    id: userData.id,
                    email:userData.email,
                    profileSetup: userData.profileSetup,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    color: userData.color,
                    image: userData.image,
                }); 
    
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal server error.");
    }
}

export const addprofileimage = async (request,response,next)=> {
    try {
        if(!request.file){
            return response.status(400).send("Please upload an image");
        }
        const date = Date.now();
        const fileName = "uploads/profiles/"+ date+ request.file.originalname;
        renameSync(request.file.path, fileName);

        const updateUser = await User.findByIdAndUpdate(request.userId, 
            {image:fileName}, {new: true, runValidators: true});

            return response.status(200).json(
                 {
                    image: updateUser.image,
                }); 
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal server error, sorry!");
    }
}

export const removeprofileimage = async (request,response,next)=> {
    try {
        const { userId } = request;
        const userData = await User.findById(userId);
        if(!userData) {
            return response.status(404).send("User not found!");
        }
        if(userData.image){
            unlinkSync(userData.image);
        }

        userData.image = null;
        await userData.save();

        return response.status(200).send("Profile image removed successfully!")
    
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal server error.");
    }
}