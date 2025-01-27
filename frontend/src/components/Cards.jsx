import { useQuery } from "@apollo/client";
import Card from "./Card";
import { GET_TRANSACTIONS } from "../graphql/queries/transaction.query";
import { GET_AUTHENTICATED_USER, GET_USER_AND_TRANSACTIONS } from "../graphql/queries/user.query";

const Cards = () => {
	const {data,loading, error} = useQuery(GET_TRANSACTIONS);
	const {data: authUser} = useQuery(GET_AUTHENTICATED_USER);
	const {data:UserNTransactionData} = useQuery(GET_USER_AND_TRANSACTIONS,{
		variables:{
			userId:authUser?.authUser?._id
		}
	});
	console.log("User&Transaction", UserNTransactionData)

	if(error) return <p>Error. {error.message}</p>
	if(loading) return <p>Loading ...</p>

	console.log("Data: ",data.getTransactions);

	//TODO => Add Relationships
	return (
		<div className='w-full px-10 min-h-[40vh]'>
			<p className='text-5xl font-bold text-center my-10'>History</p>
			<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start mb-20'>				
				{!loading && data.getTransactions.map((transaction) => {	
					return <Card key={transaction._id} transaction={transaction} />
				})}

				{/* <Card cardType={"saving"} />
				<Card cardType={"expense"} />
				<Card cardType={"investment"} />
				<Card cardType={"investment"} />
				<Card cardType={"saving"} />
				<Card cardType={"expense"} /> */}
			</div>
			{!loading && data?.getTransactions?.length === 0  && <p className='text-2xl font-bold text-center w-full'>No Transactions history found!</p>}

		</div>
	);
};
export default Cards;