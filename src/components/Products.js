import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  useCreateLineItemMutation,
  useGetTagsQuery,
  useUpdateLineItemMutation,
} from "../../src/redux/reducers/apiSlice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "./";
import { addToUsersCart } from "../redux/reducers/usersCart-slice";
import { addToCart } from "../redux/reducers/cart-slice";

const BodyContainer = styled.div`
  display: flex;
`;

// TAGS
const TagContainer = styled.div`
  min-width: 6em;
  height: 21em;
  margin: 1.1em 1em;
  margin-right: 0.3em;
  padding: 0.3em 0 2em;

  display: flex;
  flex-direction: column;

  border-right: 1px solid rgb(200, 200, 200);

  .tagsHeader {
    font-size: 1.3em;
    margin-bottom: 0.35em;
  }
  p {
    width: 100%;
  }
  > .selected {
    text-decoration: underline;
  }
  /* this targets the 'clear' filter */
  * {
    :nth-last-child(1) {
      margin-top: 0.55em;
      font-style: italic;
      font-size: 0.94em;
    }
  }
`;

// PRODUCTS CONTAINER
const ProductsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;

  .productListHeader {
    flex: 2 2 200%;
    text-align: center;
    margin: 0.4em auto 0.2em;
  }
`;

// SINGLE PRODUCT IN LIST
const Product = styled.div`
  width: 175px;
  max-width: 175px;
  min-height: 225px;

  background-color: rgb(230, 230, 230);
  box-shadow: 1px 1px 7px rgba(100, 100, 100, 0.43);

  margin: 0.5em;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  img {
    /* using 'height' alone does not make some images the required height */
    min-height: 150px;
    max-height: 150px;
    width: 150px;

    object-fit: cover;
    margin: 0.7em auto 0.15em;

    box-shadow: 1px 1px 6px rgba(100, 100, 100, 0.31);
  }
  p {
    text-align: center;
    font-size: 0.85em;
    max-width: 75%;
    margin: 0.15em auto;

    &.productPrice {
      color: red;
    }
  }
  button {
    margin: 0.15em auto 0.7em;
  }
`;

const TagName = styled.div``;

// COMPONENT STARTS HERE
export default function Products({ products, isLoading }) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("");

  const { isLoggedIn, user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { cart: usersCart } = useSelector((state) => state.usersCart);


  const { data: tags, isSuccess } = useGetTagsQuery();
  const [createLineItem] = useCreateLineItemMutation();
  const [updateLineItem] = useUpdateLineItemMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(usersCart)
    setFilteredProducts(products);
  }, [products]);

  const tagFilter = (tag) => {
    if (tag === "clear") {
      setFiltered(false);
      setFilteredProducts(products);
      setCurrentFilter("");
    } else {
      setFiltered(true);
      setFilteredProducts(
        products?.filter((product) => product.tagName === tag)
      );
      setCurrentFilter(tag);
    }
  };

  // if a user is logged in
  const updateOrAddLineItem = (payload, num) => {
    console.log('PAYLOAD', payload);
    let newData = { ...payload };
    // keeping track of previous quantity
    let prevQty;
    // find out if the item exists in our redux store
    // if it does, we are able to call PUT
    // if it dosent, we are calling POST
    const existingItem = usersCart.lineItems.find(
      (item) => item.productId === payload.productId
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
          orderId: usersCart.id,
          productId: payload.productId,
          qty: (prevQty += num),
        },
      });
      dispatch(addToUsersCart({ newData, num }));
    };

    // add line item and sending it to redux store
    const add = async () => {
      console.log("creating", usersCart);
      let { data } = await createLineItem(payload);
      // clone data to make it muteable so we can add product and add into redux store
      newData = { ...data, product: payload.product };
      console.log(newData);
      dispatch(addToUsersCart({ newData, num }));
    };

    // if the lineitem found has an id (meaning it exists in our DB)
    // update it, if not, add new line item
    existingItem && existingItem.id ? update() : add();
  };

  if (isLoading) {
    return <Loading />;
  } else
    return (
      <BodyContainer>
        <TagContainer>
          <p className="tagsHeader">Filters</p>
          {products &&
            products.length &&
            isSuccess &&
            tags
              .filter((tag) => tag.tagType === products[0].type)
              .map((tag) => (
                <p onClick={(e) => tagFilter(tag.tagName)} key={tag.id} className={currentFilter === tag.tagName ? "selected" : ""}>
                  {tag.tagName.charAt(0).toUpperCase() + tag.tagName.slice(1)}
                </p>
              ))}
          <p onClick={(e) => tagFilter("clear")}>Clear</p>
        </TagContainer>
        {
          //TODO CHANGE PRODUCTS && TO ISLOADING ? BY MOVING TERNARY HERE
        }
        <ProductsContainer>
          <h2 className="productListHeader">
            {"Our "}
            {products &&
              products.length &&
              products[0].type.charAt(0).toUpperCase() +
                products[0].type.slice(1)}
          </h2>
          {(filtered ? filteredProducts : products).map((product) => (
            <Product key={product.id}>
              <Link href={`${product.type}/${product.id}`}>
                <img src={product.img} alt={product.name || "product"}/>
              </Link>
              <Link href={`${product.type}/${product.id}`}>
                <p className="productName">{product.name}</p>
              </Link>
              <p className="productPrice">{product.price + "/lb"}</p>

              {/* if a user is logged in, onClick will post new line items
              if user is not logged in, dispatch to redux store */}
              {isLoggedIn ? (
                <button
                  className="secondaryButton"
                  onClick={() =>
                    updateOrAddLineItem(
                      {
                        orderId: usersCart.id,
                        productId: product.id,
                        qty: 1,
                        product: product,
                      },
                      1
                    )
                  }
                >
                  Add To Carts
                </button>
              ) : (
                <button
                  className="secondaryButton"
                  onClick={() =>
                    dispatch(
                      addToCart({
                        orderId: null,
                        productId: product.id,
                        qty: 1,
                        product: product,
                      })
                    )
                  }
                >
                  Add To Cart
                </button>
              )}
            </Product>
          ))}
        </ProductsContainer>
      </BodyContainer>
    );
}
