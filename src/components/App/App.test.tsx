import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../state/store";
import App from "./App";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

test("matches snapshot", () => {
  const { container } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(container).toMatchSnapshot();
});
