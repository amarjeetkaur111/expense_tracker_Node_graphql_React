import {users} from './../dummyData/data.js';
import bcrypt from "bcryptjs";
import User from '../models/user.model.js';

const userResolver = {
    Query:{
        // users: (_,_,{req, res}) => {
        //     // return User.find().then(users => users.map(user => user.toObject()));
        //     return users;
        // },
        authUser:async(_,__,context) => {
            try{
                const user = context.getUser(); //check graphql-passport doc. all context.functions are coming from passport
                return user;
            }catch(err){        
                console.log("Error in AuthUser: ",err);
                throw new Error(err.message || "Internal server Error");
            }   
        },
        user:async(_,{userId}) => {
            try{
                const user = User.findById(userId);
                if(!user)
                    throw new Error("User not found");
                return user;
            } catch(err){        
                console.log("Error in User Query: ",err);
                throw new Error(err.message || "Internal server Error");
            }  
        }
    },
    Mutation:  {
        signUp: async(_,{input},context) => {
            try{
                const {username, name, password, gender} = input;
                if(!username || !name || !password || !gender)
                    throw new Error("All Fields are required");                
                const existingUser = User.findOne({username});
                if(existingUser)
                    throw new Error("User Already Exist");

                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password,salt);
                
                const girlProfilePic = 'https://avatar.iran.liara.run/public/girl?username=${username}';
                const boyProfilePic = 'https://avatar.iran.liara.run/public/boy?username=${username}';

                const newUser = new User({
                    username, 
                    name,
                    password: hashPassword,
                    gender,
                    profilePicture:gender === "male" ? boyProfilePic : girlProfilePic,
                });

                await newUser.save();
                await context.login(newUser);
                return newUser;

            }catch(err){        
                console.log("Error in signUp: ",err);
                throw new Error(err.message || "Internal server Error");
            }   
        },

        login: async(_,{input},context) => {
            try{
                const {username,password} = input;
                const { user } = await context.authenticate("graphql-local",{username, password});
                await context.login(user);
                return user;
            }catch(err)
            {
                console.log("Error in login: ",err);
                throw new Error(err.message || "Internal server Error");
            }
        },
        logout: async(_,__,context) => {
            try{
                await context.logout();
                req.session.destroy((err) => {
                    if(err)
                        throw err;
                }); 
                res.clearCookie("connect.sid");

                return {message:"Logged out successfully"};
            }catch(err)
            {
                console.log("Error in logout: ",err);
                throw new Error(err.message || "Internal server Error");
            }
        }
    },
    //TODO: ADD USER - TRANSACTION RELATION
}

export default userResolver;