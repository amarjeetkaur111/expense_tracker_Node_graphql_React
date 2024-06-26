import {users} from './../dummyData/data.js';

const userResolver = {
    Query:{
        users: (_,_,{req, res}) => {
            // return User.find().then(users => users.map(user => user.toObject()));
            return users;
        },
        user:(_,{userId}) => {
            return users.find((user => user._id === userId));
        }
    },
    Mutation: {}
}

export default userResolver;