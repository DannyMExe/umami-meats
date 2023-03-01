import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Router from "next/router";
import styled from "styled-components";
import axios from "axios";
import { RemoveSSRFromComponent } from "../utils";
// redux
import { useSelector, useDispatch } from "react-redux";
import { storeUser, removeUser } from "../redux/reducers/user-slice";
import { clearUserCart } from "../redux/reducers/cart-slice";
import {
  useGetProductsQuery,
  useCreateOrderMutation,
  useGetSingleUserQuery,
} from "../redux/reducers/apiSlice";
import { initializeCart } from "../redux/reducers/usersCart-slice";

// react-icons
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { GiMeatCleaver } from "react-icons/gi";
import { BiLogIn, BiLogOut } from "react-icons/bi";

const headerMainHeight = "7em";
const headerTopHeight = "2em";

const HeaderContainer = styled.div`
  color: white;
  height: ${headerMainHeight + headerTopHeight};
  h1,
  p {
    :hover {
      color: lightgray;
    }
  }
`;
const HeaderTop = styled.div`
  height: ${headerTopHeight};
  background-color: black;

  display: flex;
  justify-content: flex-end;
  align-items: center;

  * {
    margin: auto 0;
  }
  p {
    margin-top: 0.27em;
    padding: 0 0.4em 0.15em;
  }
`;

const mobileLogoTextWidth = "3.62em";

const HeaderMain = styled.div`
  margin-top: -1px;
  width: 100%;
  height: ${headerMainHeight};
  background-color: #8b0000;

  @media screen and (min-width: 750px) {
    background-color: #7b0000;

    > div {
      width: 750px;
      margin: auto;
      background-color: #8b0000;
    }
  }

  > div {
    h1 {
      margin-top: 0.13em;
    }
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .headerIconButton {
    background-color: #7b0000;
    width: calc(${headerMainHeight} - 0.5em);
    height: ${headerMainHeight};

    display: flex;
    justify-content: center;
    align-items: center;
  }
  .headerIconButton:active {
    background-color: #660000;
  }
  /* #headerLogo {
    width: calc(${headerMainHeight} + ${mobileLogoTextWidth});
    padding-left: 0.25em;

    h1 {
      font-size: 1em;
      width: ${mobileLogoTextWidth};
      margin: 0 0.4em 0 0.5em;
    }
  } */
  .productType {
    font-size: 1.4em;
    padding: 0 0.2em;
    /* margin: 0 0.8em; */
  }

  #headerMainCenter {
    text-align: center;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;

    #siteTitle {
      width: fit-content;
      margin: 0.05em auto 0.15em;
      font-size: 2.1em;
      flex: 2 2 200%;
      border-bottom: 1px solid white;
    }
  }

  @media screen and (min-width: 800px) {
    // should expand logo to be wider, maybe at smaller width?
  }
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
`;

const searchBarWidth = "15em";

const SearchContainer = styled.div`
  position: absolute;
  width: 100%;
  height: calc(100% - 6em);
  top: ${headerMainHeight + headerTopHeight};
  z-index: 50;

  transition: background-color 0.2s;
  transition: opacity 0.2s;
  background-color: rgba(50, 50, 50, 0.4);

  padding-top: 1.2em;
  input {
    font-size: 1.1em;
    top: 1em;
    width: ${searchBarWidth};
    margin: 0 auto;
  }

  display: flex column;
  justify-content: center;
  align-items: center;
  text-align: center;

  .searchProductList {
    width: fit-content;
    margin: 0 auto;
    color: black;
    background-color: white;

    * {
      padding: 0.3em 0.7em;
      &:nth-child(even) {
        background-color: rgb(238, 238, 238);
      }
    }
  }

  &.hide {
    z-index: -100;
    opacity: 0;
    background-color: rgba(0, 0, 0, 0);
  }
`;

//COMPONENT STARTS HERE
function Header() {
  const { cart } = useSelector((state) => state.cart);
  const { cart: usersCart } = useSelector((state) => state.usersCart);
  const { user, isLoggedIn } = useSelector((state) => state.user);

  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [createNewOrder] = useCreateOrderMutation();
  // const { data: myUser } = useGetSingleUserQuery(user.id);

  const [isSearchOpen, toggleSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const { data: blah } = useGetSingleUserQuery(user?.id)


  // const [getUser] = useGetSingleUserQuery();

  const dispatch = useDispatch();

  useEffect(() => {
    // check users orders after sign in,

    const checkForCart = async () => {
      const { data: blah } = await axios.get(`/api/users/${user.id}`);
      // const lineItems = blah.orders.find(order => order.isCart === true).lineItems;
      
      const lastOrder = blah.orders.find(order => order.isCart === true);
      // if a user has 0 orders, create new order
      // or if last order in orders is false (checked out already)
      // last item in user orders shud always be the working order,
      // previous orders should all have isCart === false
      if (blah?.orders.length === 0 || !lastOrder) {
        console.log(blah)
        let { data } = await createNewOrder({
          userId: user.id,

          isCart: true,
          address: "address of user",
        });
        console.log(data)
        // initialize the new order id and line items to redux store
        // maybe somehow use apislice only depending on which has better preformance
        dispatch(initializeCart({...data, lineItems: []}));
      }

      // If the last order in the cart is still a cart, initialize the cartId into redux store
      // for useage all around the app
      else if (lastOrder && blah.orders.length > 0) {
        // initialize the new order id and line items to redux store
        // maybe somehow use apislice only depending on which has better preformance
        console.log("DB to redux", blah, lastOrder);
        dispatch(initializeCart(lastOrder));
      }
    };

    user?.id ? checkForCart() : console.log("sign in stoopid");
  }, [isLoggedIn]);

  let userStatusLink = "/login";
  if (typeof window !== "undefined") {
    if (isLoggedIn) {
      userStatusLink = "/account";
    } else if (localStorage.user && !user) {
      dispatch(storeUser(JSON.parse(localStorage.getItem("user"))));
      userStatusLink = "/account";
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(removeUser());
    localStorage.removeItem("persist:root");
    // clears the users cart in redux storage only on log out, workaround for removing persistence

    Router.push("/");
  };
  const searchRef = useRef();
  const inputRef = useRef();

  const toggle = (e) => {
    const target = e.target.tagName;
    if (target === "DIV" || target === "svg" || target === "path") {
      toggleSearch(!isSearchOpen);
      searchRef.current.classList.toggle("hide");
      setSearchTerm("");
      inputRef.current.focus();
    } else if (e.target.tagName === "P") {
      searchRef.current.classList.add("hide");

      setTimeout(() => {
        toggleSearch(false);
        setSearchTerm("");
      }, 300);
    }
  };

  // if we want to hide search when user switch pages, maybe should add 'isSearching' to redux store
  // also need to allow user to exit out by clicking elsewhere
  return (
    <HeaderContainer>
      <HeaderTop className="hfLinks">
        {isLoggedIn ? (
          <>
            {/* account link - displayed as email */}
            <Link href={userStatusLink}>
              <LinkContainer>
                <FaUser />
                <p>{user.email}</p>
              </LinkContainer>
            </Link>
            {/* logout link */}
            <Link href="/">
              <LinkContainer onClick={handleLogout}>
                <BiLogOut />
                <p>Logout</p>
              </LinkContainer>
            </Link>
          </>
        ) : (
          <>
            <Link href="/login">
              <LinkContainer>
                <BiLogIn />
                <p>Login</p>
              </LinkContainer>
            </Link>
          </>
        )}
        {isLoggedIn && usersCart ? (
          <Link href="/cart">
            <LinkContainer>
              <FaShoppingCart />
              <p>{`Cart (${usersCart.lineItems?.length})`}</p>
            </LinkContainer>
          </Link>
        ) : (
          <Link href="/cart">
            <LinkContainer>
              <FaShoppingCart />
              <p>{`Cart (${cart.length})`}</p>
            </LinkContainer>
          </Link>
        )}
      </HeaderTop>

      <HeaderMain>
        <div>
          <Link href="/">
            <div /*id="headerLogo"*/ className="headerIconButton">
              <GiMeatCleaver size="2.4em" />
              {/* <h1>Umami Meats</h1> */}
            </div>
          </Link>

          <div id="headerMainCenter">
            <Link href="/">
              <h1 id="siteTitle">Umami Meats</h1>
            </Link>

            <Link href="/steaks">
              <h1 className="productType">Steaks</h1>
            </Link>

            <Link href="/sushi">
              <h1 className="productType">Sushi</h1>
            </Link>
          </div>

          <div className="headerIconButton" onClick={toggle}>
            <FaSearch size="1.9em" />
          </div>
        </div>
      </HeaderMain>

      <SearchContainer className="hide" ref={searchRef} onClick={toggle}>
        <input
          type="text"
          className="search"
          ref={inputRef}
          placeholder="Search..."
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          value={searchTerm}
        ></input>
        <div className="searchProductList">
          {!isLoading &&
            !isError &&
            products
              .filter((product) => {
                if (searchTerm === "") {
                  return false;
                } else {
                  return product.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
                }
              })
              .map((product) => (
                <Link href={`/${product.type}/${product.id}`} key={product.id}>
                  <p onClick={toggle}>{product.name}</p>
                </Link>
              ))}
        </div>
      </SearchContainer>
    </HeaderContainer>
  );
}

// disabling SSR for the header, because its contents depend on the localStorage
export default RemoveSSRFromComponent(Header);
