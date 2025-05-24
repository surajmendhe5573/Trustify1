const User= require('../models/user.model');
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');
require('dotenv').config();

const signUp= async(req, res)=>{
    try {
        const {name, email, password}= req.body;
        
        if(!name || !email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        const userExist= await User.findOne({email});
        if(userExist){
            return res.status(409).json({messagee: 'User already exists.'});
        }

        const hashedPassword= await bcrypt.hash(password, 10);
        
        const newUser= new User({
            name, 
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({message: 'User created successfully', user:newUser});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const login= async(req, res)=>{
    try {
        const {email, password}= req.body;

        if(!email || !password){
            return res.status(400).json({message: 'Email and Password are required'});
        }

        const userExist= await User.findOne({email});
        if(!userExist){
            return res.status(401).json({message: 'Inavalid credentials'});
        }

        const isMatch= await bcrypt.compare(password, userExist.password);
        if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token= jwt.sign({id: userExist._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.status(200).json({message: 'User logged in successfully', token});
        
    } catch (error) {
        res.status(500).json({message: 'Internaal server error'});
    }
}

const getAllUsers= async(req, res)=>{
    try {
        const users= await User.find({}, '-password');

        if(users.length==0){
            return res.status(404).json({message: 'Users not found'});
        }

        res.status(200).json({message: 'User fetched successfully', data:users});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

const updateUser= async(req, res)=>{
    try {
        const {name, email, password}= req.body;
        // const {id}= req.params;

        const userId= req.user.id;

        // Ensure the user is updating their own details
        // if (req.user.id !== req.user.id) {
        //     return res.status(403).json({ message: 'You can only update your own account' });
        // }

        const updates= {};

        if(name) updates.name= name;
        if(email){
            const userExist= await User.findOne({email});
            if(userExist && userExist._id.toString() !== userId){
                return res.status(409).json({message: 'This email is already taken by another user'});
            }
            updates.email= email
        }

        if(password){
            const hashedPassword= await bcrypt.hash(password, 10);
            updates. password=hashedPassword;
        }

        const updateUser= await User.findByIdAndUpdate(userId, updates, {new:true}).select('-password');
        if(!updateUser){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({message: 'User updated successfully', user: updateUser});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

const deleteUser= async(req, res)=>{
    try {
        // const {id}= req.params;

        // Ensure the user is deleting their own account
        // if (req.user.id !== id) {
        //     return res.status(403).json({ message: 'You can only delete your own account' });
        // }


        const deleteUser= await User.findByIdAndDelete(req.user.id);
        if(!deleteUser){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({message: 'User deleted successfully'});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const getuserById= async(req, res)=>{
    try {
        const user= await User.findById(req.user.id);
        
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({message: 'User fetched successfully', user:user});

    } catch (error) {
        return res.status(500).json({message: 'Internal server error'});
    }
}

module.exports= {signUp, login, getAllUsers, updateUser, deleteUser, getuserById};