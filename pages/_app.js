import "../styles/globals.css";
import "../src/styles.css";
// redux
import { Provider } from "react-redux";
import { apiSlice } from "../src/redux/reducers/apiSlice";
import { store, persistor } from "../src/redux/store/store";
import { PersistGate } from "redux-persist/integration/react";
import styled from "styled-components";
import { Header, Footer } from "../src/components";
import { AnimatePresence } from "framer-motion";

// maybe a max-width is all that's necessary to make the design work on desktop...?
const MainContainer = styled.div`
  position: relative;
  min-height: 100vh;
  padding-bottom: 2em;
  * {
    margin: 0;
    user-select: none;
  }
`;

const PageContainer = styled.div`
  max-width: 800px;
  margin: auto;
`;

function App({ Component, pageProps }) {
  return (
    <Provider api={apiSlice} store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainContainer>
          <Header />
          <PageContainer>
            <AnimatePresence mode="wait">
              <Component {...pageProps} key={Component.name} />
            </AnimatePresence>
          </PageContainer>
          <Footer />
        </MainContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
