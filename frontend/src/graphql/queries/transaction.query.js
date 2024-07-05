import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
    query GetTransactions{
        getTransactions{
            _id
            userId
            description
            paymentType
            category
            amount
            location
            date
        }        
    }
`;

export const GET_TRANSACTION = gql`
    query GetTransaction($id: ID!) {
        getTransaction(transactionId: $id) {
            _id
            userId
            description
            paymentType
            category
            amount
            location
            date
        }
    }
`;

export const CATEGORY_STATISTICS =gql`
    query CategoryStatistics {
        categoryStatistics {
            category
            amount
        }   
    }
`;