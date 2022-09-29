import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  useCreateOrderMutation,
  useUpdateOrderMutation,
} from "../src/redux/reducers/apiSlice";
import { initializeCart } from "../src/redux/reducers/usersCart-slice";

const CheckoutContainer = styled.div`
  display: flex column;
  justify-content: center;
  text-align: center;
`;

const ProductsContainer = styled.div`
  border-top: 1px solid black;
`;

const Product = styled.div`
  border-bottom: 1px solid black;
  display: flex;
  justify-content: space-between;
  padding: 5px 15px 5px 15px;
`;

const TotalContainer = styled.div`
  // text-align: center;
`;

const Total = styled.h2``;

const ThirdPartyPaymentMethodContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const PaymentMethodContainer = styled.div``;

const Checkout = () => {
  const { cart } = useSelector((state) => state.cart);
  const { cart: usersCart, cartId } = useSelector((state) => state.usersCart);
  const { user } = useSelector((state) => state.user);
  const [updateOrder] = useUpdateOrderMutation();
  const [createNewOrder] = useCreateOrderMutation();
  console.log(usersCart);

  const dispatch = useDispatch();

  const checkout = async (id) => {
    console.log(id);
    await updateOrder({ data: { isCart: false }, id });
    let { data } = await createNewOrder({
      userId: user.id,
      isCart: true,
      address: "some address",
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
        {(usersCart ? usersCart.lineItems : cart).map((product) => (
          <>
            <Product>
              <p>
                {product.product.name} ({product.qty})
              </p>
              <p>
                {Math.round(
                  (product.product.price * product.qty + Number.EPSILON) * 100
                ) / 100}
              </p>
              {/* {setTotal(total + (product.price * product.quantity))} */}
            </Product>
            <br></br>
          </>
        ))}
      </ProductsContainer>
      <TotalContainer>
        <h2>Total:</h2>
        <Total>
          {Math.round(
            ((usersCart ? usersCart : cart).reduce(
              (prev, curr) => curr.product.price * curr.qty + prev,
              0
            ) +
              Number.EPSILON) *
              100
          ) / 100}
        </Total>
      </TotalContainer>
      <ThirdPartyPaymentMethodContainer>
        <button onClick={() => checkout(usersCart[0].orderId)}>Checkout</button>
      </ThirdPartyPaymentMethodContainer>
      <PaymentMethodContainer></PaymentMethodContainer>
    </CheckoutContainer>
  );
};

export default Checkout;
