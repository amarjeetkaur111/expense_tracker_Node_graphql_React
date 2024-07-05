
const transactionTypeDef = `#graphql
    type Transaction{
        _id:ID!
        userId: ID!
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
        date: String!
    }

    type Query{
        getTransactions: [Transaction!]
        getTransaction(transactionId: ID!): Transaction
        categoryStatistics:[CategoryStatics!]
    }

    type Mutation{
        createTransaction(input: CreateTransactionInput!): Transaction!
        updateTransaction(input: UpdateTransactionInput!): Transaction!
        deleteTransaction(transactionId: ID!): Boolean!
    }

    input CreateTransactionInput{
        description: String!
        paymentType: String!
        category: String!
        amount: Float!
        location: String
        date: String!
    }

    input UpdateTransactionInput{
        transactionId: ID!
        description: String
        paymentType: String
        category: String
        amount: Float
        location: String
        date: String
    }

    type CategoryStatics{
        category: String!
        amount: Float!
    }
`

export default transactionTypeDef;