import bcrypt from "bcryptjs";
import User from '../models/user.model.js';
import Transaction from '../models/transaction.model.js';

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
                const existingUser =  await User.findOne({where: {
                    username: username,
                  }});
                console.log('ExistingUser: ',existingUser);
                if(existingUser)
                    throw new Error(`User Already Exist: ${existingUser}`);

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
                if(!username || !password) throw new Error("All fields are required");
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
                context.req.session.destroy((err) => {
                    if(err)
                        throw err;
                }); 
                context.res.clearCookie("connect.sid");

                return {message:"Logged out successfully"};
            }catch(err)
            {
                console.log("Error in logout: ",err);
                throw new Error(err.message || "Internal server Error");
            }
        }
    },
    //ADDED USER - TRANSACTION RELATION
    User:{
        transactions : async(parent) => {
            try{
                const transactions = await Transaction.find({userId:parent._id});
                return transactions;
            }catch(error){
                console.log("Error in User Relation with transaction: ",error);
                throw new Error(error.message || "Internal server error");
            }
        }
    }
}

export default userResolver;