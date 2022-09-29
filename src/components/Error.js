import React from "react";
import styled from "styled-components";
import Link from "next/link";

const ErrorContainer = styled.div`
  width: 18em;
  text-align: center;

  &#errorContainer {
    margin: 1.5em auto;
  }
  p {
    margin: 1em auto 0.2em;
  }
`;

export default function Error({ is500 }) {
  const statusText = is500 ?
    "Sorry, but it seems there was an internal server error while processing your request" :
    "Sorry, but the item you are looking for could not be found!"

  return (
    <ErrorContainer id="errorContainer">
      <p>{statusText}</p>
      {!is500 &&
      <Link href="/">
        <p className="returnHome">
          Return to <u>home page</u>
        </p>
      </Link>
      }
    </ErrorContainer>
  );
}
