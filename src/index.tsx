import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./components/App/App";
import "./index.css";
import store from "./state/store";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
