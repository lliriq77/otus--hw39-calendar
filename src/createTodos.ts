import FuzzySearch from "fuzzy-search";
import { get, ref, child, push, update, remove } from "firebase/database";
import { database } from "./firebase";
import { store } from "./store";
import { render } from "./render";

export const createTodos = function createTodos(
  el: HTMLElement,
  elHeader: string,
  ev?: Event
) {
  let n = 0;
  el.innerHTML = "";

  const todo = document.createElement("div");
  todo.innerHTML = elHeader;
  el.append(todo);

  const tableHeader = document.createElement("table");
  tableHeader.classList.add("todos__table");
  tableHeader.innerHTML = `
    <thead>
        <tr>
            <th>Date</th>
            <th>
                <input class='table__input' value='Description'>
            </th>
            <th>
                <select>
                    <option>Any status</option>
                    <option value='Opened'>Opened</option>
                    <option value='Closed'>Closed</option>
                    <option value='Cancelled'>Cancelled</option>
                </select>
            </th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody></tbody>`;

  todo.append(tableHeader);
  const select = el.querySelector("select") as HTMLSelectElement;
  const input = el.querySelector(".table__input") as HTMLInputElement;
  const table = el.querySelector(".todos__table") as HTMLTableElement;
  select.value = store.getState().status;

  if (store.getState().events) {
    Object.keys(store.getState().events)
      .filter((item) =>
        `${new Date(
          store.getState().events[item].date
        ).getFullYear()}-${new Date(
          store.getState().events[item].date
        ).getMonth()}-${new Date(
          store.getState().events[item].date
        ).getDate()}`.includes(
          ev
            ? `${store.getState().year}-${store.getState().month}-${
                (ev.target as HTMLTableElement).innerHTML
              }`
            : `-`
        )
      )
      .filter((item) => {
        if (!select.value.includes("Any status")) {
          return store.getState().events[item].status.includes(select.value);
        }
        return true;
      })
      .forEach((key) => {
        const currentEv = store.getState().events[key];
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td>${new Date(currentEv.date).getDate()} ${
          store.getState().months[new Date(currentEv.date).getMonth()]
        } ${new Date(currentEv.date).getHours()} : ${new Date(
          currentEv.date
        ).getMinutes()}
                    </td>
                    <td>${currentEv.description}</td>
                    <td>${currentEv.status}</td>
                    <td>
                        <button class='todos__edit'>EDIT</button>
                        <button class='todos__delete'>DEL</button>
                    </td>
                `;

        table.tBodies[0].append(tr);

        const del = document.querySelectorAll(".todos__delete")[n];
        const edit = document.querySelectorAll(".todos__edit")[
          n
        ] as HTMLButtonElement;
        n += 1;

        (del as HTMLButtonElement).addEventListener("click", () => {
          remove(ref(database, `events/${key}`)).then(() => {
            get(child(ref(database), `/`))
              .then((snapshot) => {
                if (snapshot.exists()) {
                  store.dispatch({
                    type: "LOAD_EVENTS",
                    payload: snapshot.val(),
                  });
                } else {
                  store.dispatch({
                    type: "",
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          });
        });

        edit.addEventListener("click", () => editEv(el, key));
      });

    el.append(todo);
  }

  const eventsList = Array.from(table.tBodies[0].querySelectorAll("tr"));

  select.addEventListener("change", () =>
    store.dispatch({
      type: "LOAD_EVENTS",
      payload: { status: select.value },
    })
  );

  input.addEventListener("keyup", () => {
    const searcher = new FuzzySearch(eventsList, ["cells.1.innerHTML"]);
    const result = searcher.search(input.value);
    table.tBodies[0].innerHTML = "";
    result.forEach((elem) => table.tBodies[0].append(elem));
  });

  (
    document.querySelector(".todos__button") as HTMLButtonElement
  ).addEventListener("click", () => newEv(el, ev));
};

export const newEv = function newEv(el: HTMLElement, ev?: Event) {
  el.innerHTML = `
    <div>
        <p>Description<p/>
        <input class='todos__input'>
        <p>@</p>
        <input class='todos__date'>
        <span>Time</span>
        <input class='todos__hours'>
        <span>hh</span>
        <input class='todos__minutes'>
        <span>mm</span>
        <p>Status</p>
        <p>
            <select class='table__select'>
                <option selected disabled>Choose status</option>
                <option value='Opened'>Opened</option>
                <option value='Closed'>Closed</option>
                <option value='Cancelled'>Cancelled</option>
            </select>
    </div>
    <button class='todos__ok'>OK</button>
    <button class='todos__cancel'>Cancel</button>`;

  const ok = document.querySelector(".todos__ok") as HTMLButtonElement;
  const cancel = document.querySelector(".todos__cancel") as HTMLButtonElement;
  const todosInp = document.querySelector(".todos__input") as HTMLInputElement;
  const todosHours = document.querySelector(
    ".todos__hours"
  ) as HTMLInputElement;
  const todosMinutes = document.querySelector(
    ".todos__minutes"
  ) as HTMLInputElement;
  const todosDate = document.querySelector(".todos__date") as HTMLInputElement;
  const select = document.querySelector("select") as HTMLSelectElement;
  const day = ev
    ? (ev.target as HTMLTableElement).innerHTML
    : new Date().getDate();

  todosDate.value = `${day} ${store.getState().months[store.getState().month]}`;

  ok.addEventListener("click", () => {
    const evData = {
      date: new Date(
        store.getState().year,
        store.getState().month,
        +day,
        +todosHours.value,
        +todosMinutes.value
      ),
      timestamp: Date.now(),
      description: todosInp.value,
      status: select.value,
    };

    const newEvKey = push(child(ref(database), "events")).key;
    const updates: { [key: string]: typeof evData } = {};

    updates[`/events/${newEvKey}`] = evData;

    update(ref(database), updates).then(() => {
      get(child(ref(database), `/`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            store.dispatch({
              type: "LOAD_EVENTS",
              payload: snapshot.val(),
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  cancel.addEventListener("click", () => {
    render();
  });
};

export const editEv = function editEv(el: HTMLElement, key: string) {
  el.innerHTML = `
    <span>Editing ${store.getState().events[key].description} @ ${new Date(
    store.getState().events[key].date
  ).getHours()} : ${new Date(store.getState().events[key].date).getMinutes()}
    </span>
        <div>
            <p>Description<p/>
            <input class='edit__description' value='${
              store.getState().events[key].description
            }'>
                <span>Date</span>
                <input class='edit__date' value='${
                  store.getState().events[key].date
                }
            '>
            <p>Status</p>        
            <select>
                <option selected disabled>Choose status</option>
                <option value='Opened'>Opened</option>
                <option value='Closed'>Closed</option>
                <option value='Cancelled'>Cancelled</option>
            </select>
        </div>
            <button class='edit__ok'>OK</button>
            <button class='edit__cancel'>Cancel</button>
    `;

  const ok = document.querySelector(".edit__ok") as HTMLButtonElement;
  const cancel = document.querySelector(".edit__cancel") as HTMLButtonElement;

  ok.addEventListener("click", () => {
    const evData = {
      date: (el.querySelector(".edit__date") as HTMLInputElement).value,
      timestamp: Date.now(),
      description: (el.querySelector(".edit__description") as HTMLInputElement)
        .value,
      status: (el.querySelector("select") as HTMLSelectElement).value,
    };
    const updates: { [key: string]: typeof evData } = {};

    updates[`/events/${key}`] = evData;
    update(ref(database), updates).then(() => {
      get(child(ref(database), `/`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            store.dispatch({
              type: "LOAD_EVENTS",
              payload: snapshot.val(),
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });

  cancel.addEventListener("click", () => {
    render();
  });
};
