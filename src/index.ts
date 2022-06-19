import { get, ref, child } from "firebase/database";
import { database } from "./firebase";
import { store } from "./store";
import { Router, iArgs } from "./practice";
import { render } from "./render";

store.subscribe(render);

const createRender =
  (content: string) =>
  (...args: iArgs[]) => {
    console.info(`${content} args=${JSON.stringify(args)}`);
    (
      document.getElementById("root") as HTMLElement
    ).innerHTML = `<h2>${content}</h2>`;
  };

const router = Router();

const unsubscribe = router.on(/.*/, createRender("Loading..."));

router.on("/about", createRender("/about"));

document.body.addEventListener("click", (event) => {
  if (event.target && !(event.target as HTMLElement).matches("a")) {
    return;
  }
  event.preventDefault();
  const url = (event.target as HTMLElement).getAttribute("href") as string;
  router.go(url);
  unsubscribe();
});

window.addEventListener("load", () => {
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
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

window.addEventListener("popstate", () => {
  render();
});

document.body.addEventListener("click", (event) => {
  if (event.target && !(event.target as HTMLElement).matches("a")) {
    return;
  }
  event.preventDefault();
  const url =
    event.target && (event.target as HTMLElement).getAttribute("href");

  history.pushState({ foo: "bar", url }, document.title, url);
  render();
});
