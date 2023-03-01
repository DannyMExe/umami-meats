import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useUpdateOrderMutation } from '../src/redux/reducers/apiSlice';

const CheckoutContainer = styled.div`
	max-width: 675px;
	margin: 2em auto;

	display: flex column;
	justify-content: center;
	text-align: center;
`;

const ProductsContainer = styled.div`
	background-color: rgb(230, 230, 230);
	box-shadow: 1px 1px 7px rgba(100, 100, 100, 0.2);
	font-size: 1.05em;

	.product {
		margin: 0.4em 0 0.1em;
		padding: 0.5em 0.8em;

		display: flex;
		justify-content: space-between;
		align-items: center;
		.lineItemPrice {
			font-size: 1.12em;
			/* font-weight: bold; */
		}
	}
	hr {
		width: 97%;
		margin: auto;
	}
`;

const TotalContainer = styled.div`
	margin: 1.1em 0 0.5em;
`;

const ConfirmOrder = styled.div`
	display: flex;
	justify-content: space-around;
`;

const Checkout = () => {
	const { cart } = useSelector((state) => state.cart);
	const { cart: usersCart, cartId } = useSelector((state) => state.usersCart);
	const [updateOrder] = useUpdateOrderMutation();
	console.log(usersCart);

	const checkout = async (id) => {
		console.log(id);
		updateOrder({ data: { isCart: false }, id });
		//maybe redirect to home page
		let { data } = await createNewOrder({
			userId: user.id,
			isCart: true,
			address: 'some address',
		});
		//maybe redirect to home page
		dispatch(initializeCart({ ...data, lineItems: [] }));
	};

	// const [total, setTotal] = useState(0)

	return (
		<CheckoutContainer>
			<h2>Checkout</h2>
			<br></br>
			<ProductsContainer>
				{(usersCart ? usersCart : cart).lineItems.map((product) => (
					<>
						<div className='product'>
							<p>
								{product.product.name} ({product.qty})
							</p>
							<p>
								{Math.round(
									(product.product.price * product.qty +
										Number.EPSILON) *
										100
								) / 100}
							</p>
							{/* {setTotal(total + (product.price * product.quantity))} */}
						</div>
						<br></br>
					</>
				))}
			</ProductsContainer>
			<TotalContainer>
				<h2>Total:</h2>
				{Math.round(
					((usersCart ? usersCart : cart).lineItems.reduce(
						(prev, curr) => curr.product.price * curr.qty + prev,
						0
					) +
						Number.EPSILON) *
						100
				) / 100}
			</TotalContainer>
			<ConfirmOrder>
				<button
					onClick={() => checkout(usersCart.id)}
					className='mainButton'
				>
					Confirm Order
				</button>
			</ConfirmOrder>
		</CheckoutContainer>
	);
};

export default Checkout;
