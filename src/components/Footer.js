import Link from "next/link";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { FaPhone, FaWrench } from "react-icons/fa";

const FooterContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 2em;
  bottom: -1px;

  background-color: darkred;
  color: white;

  display: flex;
  justify-content: flex-end;
  align-items: center;
  
  * {
    margin: auto 0;
  }
  p {
    padding: 0 0.4em 0.15em;
    margin-top: 0.27em;
    :hover {
        color: lightgray;    
    }
  }
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
`;

export default function Footer() {
  let isAdmin = useSelector(state => state.user.user?.admin);
  if (typeof window !== "undefined" && localStorage.user) {
    isAdmin = isAdmin || JSON.parse(localStorage.user).isAdmin;
  }

  return (
    <FooterContainer className="hfLinks">
      {isAdmin &&
        <Link href="/admin">
          <LinkContainer>
            <FaWrench />
            <p>Administrator Tools</p>
          </LinkContainer>
        </Link>
      }

      <Link href="/contact">
        <LinkContainer>
          <FaPhone />
          <p>Contact</p>
        </LinkContainer>
      </Link>
    </FooterContainer>
  );
}
