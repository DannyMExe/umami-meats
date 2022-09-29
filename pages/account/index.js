import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { RemoveSSRFromComponent } from "../../src/utils";
import { useSelector } from "react-redux";
import { useGetSingleUserQuery } from "../../src/redux/reducers/apiSlice";

const MainContainer = styled.div`
	max-width: 770px;
	margin: 0 auto;
`;

const AccountDetails = styled.div`
  margin: 1em;

  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
	height: fit-content;
  }
`;

const LineDivider = styled.hr`
  margin: 0 auto;
  width: 92%;
`;
const PreviousOrders = styled.div`
  margin: 1em;
  h2 {
    margin-bottom: 0.4em;
  }
  .orderList {
    .singleOrder {
      padding: 0.25em 0.5em;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .leftInfo {
        .order {
          font-weight: bold;
        }
        .itemCt {
          font-style: italic;
        }
      }
      .rightInfo {
        text-align: right;
        .price {
          font-weight: bold;
        }
        .date {
          font-style: italic;
        }
      }

      &:nth-child(odd) {
        background-color: lightgray;
      }
    }
  }
`;

function ViewAccount() {
  let user = JSON.parse(localStorage.getItem("user"));
  // 'user' does not have orders attached yet, so i have input some dummy data
  let orders = [];
  const { data: dbUser, isLoading } = useGetSingleUserQuery(user.id);
  if (!isLoading) {
    orders = dbUser.orders;
    console.log(orders);
  }

  return (
    <MainContainer>
      <AccountDetails>
        <div>
          <h2>Account Details</h2>
          {user ? (
            <>
              <p>{`${user.firstName} ${user.lastName}`}</p>
              <p>{user.email}</p>
            </>
          ) : (
            <>
              <p>Loading content...</p>
            </>
          )}
        </div>

        <Link href="/account/edit">
          <button className="secondaryButton">Edit Account Details</button>
        </Link>
      </AccountDetails>

      <LineDivider />

      <PreviousOrders>
        <h2>Order History</h2>
        <div className="orderList">
          {dbUser ? (
            <>
              {orders.map((order) => {
                return (
                  <div className="singleOrder" key={order.id}>
                    {/* clicking orderId should link to order page */}
                    <div className="leftInfo">
                      <p className="order">{`Order ${order.id} (${
                        order.isCart ? "In Cart" : "Purchased"
                      })`}</p>
                      <p className="itemCt">{`${order.lineItems.length} items`}</p>
                    </div>
                    <div className="rightInfo">
                      <p className="price">
                        $
                        {Math.round(
                          order.lineItems.reduce(
                            (prev, curr) =>
                              Number(curr.product.price) * Number(curr.qty) +
                              Number(prev),
                            0 + Number.EPSILON
                          ) * 100
                        ) / 100}
                      </p>
                      <p className="date">{order.date}</p>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <p>Loading content...</p>
            </>
          )}
        </div>
      </PreviousOrders>
	</MainContainer>
  );
}

// disabling server-side-rendering, since data is acquired from localStorage
export default RemoveSSRFromComponent(ViewAccount);
