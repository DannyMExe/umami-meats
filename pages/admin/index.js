import React, { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useSelector } from "react-redux";
import authService from "../../src/services/auth.service";
import { RemoveSSRFromComponent } from "../../src/utils";
import { Loading } from "../../src/components";
import {
  ManageProducts,
  ManagePromos,
  ManageUsers,
  ToolList,
  UpdateFeatured,
} from "../../src/components/admin";

const AdminToolsContainer = styled.div`
  max-width: 700px;
  margin: 1.2em auto;

  &#noAccess {
    text-align: center;
    margin: 2em 3em;
    p {
      margin-bottom: 1.5em;
      &:last-child {
        font-style: italic;
      }
    }
  }
  /* margin: 1em; */

  h2 {
    text-align: center;
    margin-bottom: 0.5em;
  }
  .returnHome {
    font-size: 1.1em;
    font-style: italic;
    margin: 0 0.5em 0.5em;
  }
  .returnTools {
    font-style: italic;
    margin: 0 0.5em 0.5em;
    text-decoration: underline;
  }
  #toolHeader {
    margin-top: 0.5em;
  }
`;

function AdminTools() {
  // ADMIN VERIFICATION
  const [loading, setLoading] = useState(true);
  const [userVerified, setUserVerified] = useState(false);
  // checks token to ensure that the user is admin
  useEffect(() => {
    const verify = async (token) => {
      const { verifyToken } = authService;
      return await verifyToken(token);
    };
    if (localStorage?.user) {
      let token = JSON.parse(localStorage.user).token;
      if (verify(token)) {
        setUserVerified(true);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // TOOL SELECTION
  const [selectedTool, setSelectedTool] = useState("");

  const renderSelectedTool = () => {
    // cases: featured, products, promos, users
    switch (selectedTool) {
      case "featured":
        return <UpdateFeatured />;
      case "products":
        return <ManageProducts />;
      case "promos":
        return <ManagePromos />;
      case "users":
        return <ManageUsers />;
      default:
        return <ToolList select={setSelectedTool} />;
    }
  };

  if (loading) {
    return <Loading message={"Verifying admin..."} />;
  } else if (!loading && !userVerified) {
    return (
      <AdminToolsContainer id="noAccess">
        <p>
          You do not have the credentials to access this page. If you think this
          is a mistake, please try logging out and logging back in.
        </p>
        <Link href="/">
          <p className="returnHome">
            Return to <u>home page</u>
          </p>
        </Link>
      </AdminToolsContainer>
    );
  } else
    return (
      <AdminToolsContainer>
        {selectedTool ? (
          <>
            <p onClick={() => setSelectedTool("")} className="returnTools">
              Return to all tools
            </p>
            <h2 id="toolHeader">Placeholder</h2>
          </>
        ) : (
          <h2>Administrator Tools</h2>
        )}
        {renderSelectedTool()}
      </AdminToolsContainer>
    );
}

export default RemoveSSRFromComponent(AdminTools);
