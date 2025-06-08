import ScrollToTop from "./base-components/ScrollToTop";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { AuthContextProvider } from './context/AuthContext';
import { store } from "./stores/store";
import Router from "./router";
import "./assets/css/app.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <AuthContextProvider>
      <Provider store={store}>
        <ScrollToTop />
        <Router />
      </Provider>
    </AuthContextProvider>
  </BrowserRouter>
);
