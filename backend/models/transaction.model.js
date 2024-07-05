
import mongoose from "mongoose";

const TransactionSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        enum:['income','expense'],
        required:false
    },
    category:{
        type:String,
        enum:["saving","expense","investment"],
        required:true
    },
    description:{
        type:String,
        required:false
    },
    date:{
        type:Date,
        requried:true
    },
    location:{
        type:String,
        required:false,
        default:"Unknown"
    },
    paymentType:{
        type:String,
        enum:['cash','card'],
        required:true
    }
});

const Transaction = mongoose.model("Transaction",TransactionSchema);
export default Transaction;