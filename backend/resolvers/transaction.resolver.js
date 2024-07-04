import Transaction from '../models/transaction.model.js';

const transactionResolver = {
    Query:{
        getTransactions: async(_,__,context) => {
            try{
                if(!context.getUser()) throw new Error("Unauthorized");
                const userId = context.getUser()._id;
                const transactions = Transaction.find({userId});
            }catch(err){
                console.log("Error in All Gettransactions Query: ",err);
                throw new Error(err.message || "Internal server Error");
            }
        },  
        getTransaction: async(_,{transactionId}) => {
            try{    
                const transaction = await Transaction.findById(transactionId);
                if(!transaction) throw new Error("Transaction not found");
                return transaction;
            }catch(err){
                console.log("Error in Gettransaction Query: ",err);
                throw new Error(err.message || "Internal server Error");
            }
        },
        //TODO => ADD CATEGORY-STATISTICS RELATION
    },
    Mutation: {
        createTransaction: async(_,{input},context) => {
            try{
                if(!context.getUser()) throw new Error("Unauthorized");
                const userId = context.getUser()._id;
                const transaction = new Transaction(input);
                transaction.userId = userId;
                            //or
                //const newTransaction = new Transaction({
                    //    ...input,
                    //    userId
                //});

                const newTransaction = await transaction.save();
                return newTransaction;
            }catch(err){
                console.log("Error in CreateTransaction Mutation: ",err);
                throw new Error(err.message || "Internal server Error");
            }
        },
        updateTransaction: async(_,{input},context) => {
            try{
                if(!context.getUser()) throw new Error("Unauthorized");
                const userId = context.getUser()._id;
                const transaction = await Transaction.findByIdAndUpdate(input.transactionId,input,{new:true});
                if(!transaction) throw new Error("Transaction not found");
                return transaction;
            }catch(err){
                console.log("Error in UpdateTransaction Mutation: ",err);
                throw new Error(err.message || "Internal server Error");
            }
        },
        deleteTransaction: async(_,{transactionId},context) => {
            try{
                if(!context.getUser()) throw new Error("Unauthorized");
                const transaction = await Transaction.findByIdAndDelete(transactionId);
                if(!transaction) throw new Error("Transaction not found");
                return transaction;
            }catch(err){
                console.log("Error in DeleteTransaction Mutation: ",err);
                throw new Error(err.message || "Internal server Error");    
            }
        },
    },
    //TODO ADD USER-TRANSACTION RELATION
}

export default transactionResolver;