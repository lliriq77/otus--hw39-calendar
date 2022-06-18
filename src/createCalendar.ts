import { store } from "./store";
import { createTodos } from "./createTodos";

export const createCalendar = async function createCalendar() {
  const date = new Date();
  const { months } = store.getState();
  (document.getElementById("root") as HTMLElement).innerHTML = `
    <div class='manager'>
        <span>${months[store.getState().month]} ${store.getState().year}</span>
        <button class ='manager__previous'><</button>
        <button class ='manager__next'>></button>
    </div>
    <table class='calendar'>
        <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </table>
    <div class='todos'></div>
    `;

  let n = 1;
  let day = 1;
  document.querySelectorAll("td").forEach((el) => {
    const firstDayOfCurrMonth = new Date(
      date.getFullYear(),
      store.getState().month,
      1
    );
    const lastDayOfCurrMonth = new Date(
      date.getFullYear(),
      store.getState().month + 1,
      0
    );

    if (
      n > firstDayOfCurrMonth.getDay() &&
      day <= lastDayOfCurrMonth.getDate()
    ) {
      el.innerHTML = `${day}`;
      n += 1;
      day += 1;
    } else n += 1;
  });

  (document.querySelector(".calendar") as HTMLTableElement).addEventListener(
    "click",
    (ev) =>
      createTodos(
        document.querySelector(".todos") as HTMLDivElement,
        `<span>Events on ${(ev.target as HTMLTableElement).innerHTML} ${
          store.getState().months[store.getState().month]
        } ${store.getState().year}</span>
                        <button class='todos__button'>+</button>`,
        ev
      )
  );
};
