import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducers/cart-slice";
import { addToUsersCart } from "../redux/reducers/usersCart-slice";

import {
  useCreateLineItemMutation,
  useUpdateLineItemMutation,
} from "../redux/reducers/apiSlice";
import { Loading } from "./";

const MainProductContainer = styled.div`
  max-width: 100%;
  margin: 0 1.1em;
  overflow-wrap: break-word;

  > p {
    text-align: center;
    font-style: italic;
    margin: 0.4em;
  }
  .desc {
    font-style: normal;
    text-align: justify;
    margin-top: 0.8em;
  }
`;
const ProductContainerTop = styled.div`
  background-color: rgb(230, 230, 230);
  box-shadow: 1px 1px 7px rgba(100, 100, 100, 0.43);
  padding: 0.5em;

  img {
    width: 55%;
    object-fit: cover;
  }
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`;
const ProductInfoRight = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 0.1em;
`;
const BuyProductContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;

  > .incrementContainer {
    margin: 0.5em 0;
  }
`;

// COMPONENT STARTS HERE
function SingleItemView({ type, data }) {
  const [currentQty, setCurrentQty] = React.useState(1);
  const { cart } = useSelector((state) => state.cart);
  const { cart: usersCart, cartId } = useSelector((state) => state.usersCart);
  const { isLoggedIn } = useSelector((state) => state.user);
  const [createLineItem] = useCreateLineItemMutation();
  const [updateLineItem] = useUpdateLineItemMutation();

  const dispatch = useDispatch();

  const incrementAmt = (num) => {
    if (currentQty > 1) {
      setCurrentQty(currentQty + num);
    } else if (currentQty === 1 && num > 0) {
      setCurrentQty(currentQty + num);
    }
  };

  const printAvailability = () => {
    // this number can be changed
    if (data.qty > 10) {
      return "in stock!";
    } else if (data.qty <= 0) {
      return "out of stock!";
    } else {
      return `${data.qty} left in stock!`;
    }
  };

  const updateOrAddLineItem = (payload) => {
    // keeping track of previous quantity
    let newData = { ...payload };
    let prevQty;
    // find out if the item exists in our redux store
    // if it does, we are able to call PUT
    // if it dosent, we are calling POST
    console.log(usersCart);
    const existingItem = usersCart.lineItems.find(
      ({ productId }) => productId === payload.productId
    );

    // setting the previous quantity to the quantity of the exisiting
    // in the database
    if (existingItem && existingItem.qty) prevQty = existingItem.qty;

    // update line item and sending it to redux store
    const update = async () => {
      console.log("editing");
      await updateLineItem({
        id: existingItem.id,
        data: {
          id: existingItem.id,
          orderId: cartId,
          productId: payload.productId,
          qty: (prevQty += payload.qty),
        },
      });
      dispatch(addToUsersCart({ newData, num: payload.qty }));
    };

    // add line item and sending it to redux store
    const add = async () => {
      console.log("creating");
      let { data } = await createLineItem(payload);
      newData = { ...data, product: payload.product };
      dispatch(addToUsersCart({ newData, currentQty }));
    };

    // if the lineitem found has an id (meaning it exists in our DB)
    // update it, if not, add new line item
    existingItem && existingItem.id ? update() : add();
    console.log("checking my cart", usersCart);
  };

  return (
    <>
      {data ? (
        <>
          <MainProductContainer>
            <p>
              <i>{"Availability: " + printAvailability()}</i>
            </p>
            <ProductContainerTop>
              <img src={data.img} alt={data.name || "product"} />

              <ProductInfoRight>
                <div>
                  <h2>{data.name}</h2>
                  <p>
                    <i>{`${data.price} / lb`}</i>
                  </p>
                </div>

                <BuyProductContainer>
                  <div className="incrementContainer">
                    <button
                      onClick={() => incrementAmt(-1)}
                      className="incrementButton"
                    >
                      -
                    </button>
                    <p>{currentQty}</p>
                    <button
                      onClick={() => incrementAmt(1)}
                      className="incrementButton"
                    >
                      +
                    </button>
                  </div>

                  {/* if a user is logged in, onClick will post new line items
              if user is not logged in, dispatch to redux store */}
                  {isLoggedIn ? (
                    <button
                      className="mainButton"
                      onClick={() =>
                        updateOrAddLineItem({
                          orderId: cartId,
                          productId: data.id,
                          qty: currentQty,
                          product: data,
                        })
                      }
                    >
                      Add To Cart
                    </button>
                  ) : (
                    <button
                      className="mainButton"
                      onClick={() =>
                        dispatch(
                          addToCart({
                            orderId: null,
                            productId: data.id,
                            qty: currentQty,
                            product: data,
                          })
                        )
                      }
                    >
                      Add To Cart
                    </button>
                  )}
                </BuyProductContainer>
              </ProductInfoRight>
            </ProductContainerTop>

            <p className="desc productDesc ">{data.desc}</p>
          </MainProductContainer>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default SingleItemView;
