/* eslint-disable */
import { store } from "./store";
import { createCalendar } from "./createCalendar";
import { createTodos } from "./createTodos";

// 0. Create a render function for visual debugging purposes
export const render = async () => {
  const route = window.location.pathname;

  let m = store.getState().month;
  if (route.match("/calendar")) {
    await createCalendar();

    (
      document.querySelector(".manager__previous") as HTMLButtonElement
    ).addEventListener("click", () => {
      m = m - 1;

      if (m < 0) {
        m = 11;
      }

      store.dispatch({
        type: "CHANGE_MONTH",
        payload: { month: m },
      });
    });
    (
      document.querySelector(".manager__next") as HTMLButtonElement
    ).addEventListener("click", () => {
      m = m + 1;

      if (m > 11) {
        m = 0;
      }

      store.dispatch({
        type: "CHANGE_MONTH",
        payload: { month: m },
      });
    });

    return;
  } else if (route.match("/about")) {
    return ((
      document.getElementById("root") as HTMLElement
    ).innerHTML = `<h2>${route}</h2>`);
  } else if (route.match("/")) {
    return createTodos(
      document.getElementById("root") as HTMLElement,
      `<span>All Events</span>
     <button class='todos__button'>+</button>`
    );
  }
};
