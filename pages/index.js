import React, { useEffect } from "react";
//next
import Link from "next/link";
// can maybe use <picture></picture> to remove 'img' error from next.js
// redux
import {
  useCreateOrderMutation,
  useGetProductsQuery,
  useGetSingleUserQuery,
} from "../src/redux/reducers/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
import { initializeCart } from "../src/redux/reducers/usersCart-slice";
import { Loading, Error } from "../src/components";
// design
import styled from "styled-components";
import { motion } from "framer-motion";
import axios from "axios";

// need to clean up this CSS/styled-components
const customGray = "rgba(120, 120, 120, 0.1)";

const HomePageContainer = styled.div`
  @media screen and (min-width: 800px) {
    .carouselItem > img {
      border-left: 1px solid ${customGray};
      border-right: 1px solid ${customGray};
      border-bottom: 1px solid rgba(120, 120, 120, 0.25);
      box-shadow: 1px 1px 7px rgba(120, 120, 120, 0.5);
    }
  }

  .carouselItem {
    min-width: 100%;
    width: 100%;
    height: 15rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;
const CarouselContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
`;
const CarouselButton = styled.button`
  z-index: 40;
  position: absolute;
  width: 25px;
  height: 25px;
  top: 19em;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.7);
  border: 0;

  :hover {
    background-color: rgba(0, 0, 0, 0.8);
    color: rgba(255, 255, 255, 1);
    transition: background-color 500ms linear;
    transition: color 500ms linear;
  }

  &#leftBtn {
    border-radius: 0 3px 3px 0;
    left: 0;
    padding: 0;
  }

  &#rightBtn {
    border-radius: 3px 0 0 3px;
    right: 0;
    padding: 0;
  }

  @media screen and (min-width: 800px) {
    &#leftBtn {
      left: calc(50% - 400px);
    }
    &#rightBtn {
      right: calc(50% - 400px);
    }
  }
`;

// PRODUCTS CONTAINER
const ListContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;

  ::after {
    content: "";
    flex: auto;
  }

  margin: 0.5em;
`;

// SINGLE PRODUCT IN LIST
const ListItemContainer = styled.div`
  width: 160px;
  max-width: 160px;
  min-height: 250px;

  margin: 0.6em;
  padding-bottom: 0.5em;
  background-color: rgb(230, 230, 230);
  box-shadow: 1px 1px 7px rgba(100, 100, 100, 0.43);

  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  img {
    min-height: 130px;
    max-height: 130px;
    width: 130px;

    object-fit: cover;
    box-shadow: 1px 1px 6px rgba(100, 100, 100, 0.31);

    margin: 0.4em auto 0;
  }
  p {
    text-align: center;
    max-width: 80%;
    margin: 0.15em auto;

    &.productName {
      font-size: 1em;
      font-weight: bold;
      margin: auto;
    }
    &.productPrice {
      font-size: 0.85em;
      font-style: italic;
      /* color: red; */
      margin: 0 auto 0.2em;
    }
  }

  button {
    margin: 0.15em auto 0.7em;
  }
`;

export default function HomePage() {
  const { data, isLoading, error } = useGetProductsQuery();
  const { user, isLoggedIn } = useSelector((state) => state.user);

  const [createNewOrder] = useCreateOrderMutation();
  const dispatch = useDispatch();

  const [carouselIdx, setCarouselIdx] = React.useState(0);

  const carouselScroll = (idx) => {
    if (carouselIdx <= 0 && idx < 0) {
      setCarouselIdx(data.length - 1);
    } else if (carouselIdx >= data.length - 1 && idx > 0) {
      setCarouselIdx(0);
    } else {
      setCarouselIdx(carouselIdx + idx);
    }
  };

  useEffect(() => {
    if (!isLoading && !error) {
      let interval = setInterval(() => carouselScroll(1), 5000);
      return () => clearInterval(interval);
    }
  });

  if (isLoading) {
    return <Loading />;
  } else if (error) {
    return <Error is500={error.status === 500}/>
  } else
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <HomePageContainer>
          <CarouselContainer>
            {data.map((itm, idx) => (
              <Link href={`/${itm.type}/${itm.id}`} key={itm.id}>
                <div
                  className="carouselItem"
                  key={idx}
                  style={{
                    transform: `translate(${carouselIdx * -100}%`,
                    transition: "0.4s",
                  }}
                >
                  {/* <>{itm.name}</> */}
                  <img src={itm.img} alt={itm.name || "product"} />
                </div>
              </Link>
            ))}
          </CarouselContainer>
          <CarouselButton onClick={() => carouselScroll(-1)} id="leftBtn">
            {"<"}
          </CarouselButton>
          <CarouselButton onClick={() => carouselScroll(1)} id="rightBtn">
            {">"}
          </CarouselButton>

          <ListContainer>
            {data?.map((itm) => {
              return (
                <Link href={`/${itm.type}/${itm.id}`} key={itm.id}>
                  <ListItemContainer>
                    <img src={itm.img} alt={itm.name || "product"} />
                    <p className="productName">{itm.name}</p>
                    <p className="productPrice">${itm.price}/lb</p>
                  </ListItemContainer>
                </Link>
              );
            })}
          </ListContainer>
        </HomePageContainer>
      </motion.div>
    );
}
