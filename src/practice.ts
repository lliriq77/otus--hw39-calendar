/* eslint-disable */

export interface iListener {
  id?: number;
  match: iMatch;
  onEnter: ((...args: iArgs[]) => () => void) | (() => void);
  onLeave?: (() => string | void) | void;
  onBeforeEnter?: () => string | void;
}

export interface iArgs {
  currentPath: string;
  previousPath: string | null;
  state: string;
}

export type iOn = (
  match: iMatch,
  onEnter: ((...args: iArgs[]) => () => void) | (() => void),
  onLeave?: (() => string | void) | void,
  onBeforeEnter?: () => string | void
) => () => void;

type iMatch = RegExp | string | ((a?: string) => void | boolean);

export function Router() {
  let listeners: iListener[] = [];
  let currentPath = location.pathname;
  let previousPath: string | null = null;

  const isMatch = (match: iMatch, path: string) =>
    (match instanceof RegExp && match.test(path)) ||
    (typeof match === "function" && match(path)) ||
    (typeof match === "string" && match === path);

  const handleListener = ({
    match,
    onEnter,
    onLeave,
    onBeforeEnter,
  }: iListener) => {
    const args: iArgs = { currentPath, previousPath, state: history.state };

    onBeforeEnter && isMatch(match, currentPath) && onBeforeEnter();
    isMatch(match, currentPath) && onEnter(args);
    onLeave && isMatch(match, previousPath as string) && onLeave();
  };

  const handleAllListeners = () => listeners.forEach(handleListener);

  const generateId = () => {
    const getRandomNumber = () =>
      Math.floor(Math.random() * listeners.length * 1000);

    const doesExist = (id: number) =>
      listeners.find((listener) => listener.id === id);

    let id = getRandomNumber();
    while (doesExist(id)) {
      id = getRandomNumber();
    }
    return id;
  };

  const on: iOn = (match, onEnter, onLeave, onBeforeEnter) => {
    const id = generateId();

    const listener: iListener = { id, match, onEnter, onLeave, onBeforeEnter };
    listeners.push(listener);
    handleListener(listener);

    return () => {
      console.log("removed");
      listeners = listeners.filter((el) => el.id !== id);
    };
  };

  const go = (url: string, state?: string) => {
    previousPath = currentPath;
    history.pushState(state, url, url);
    currentPath = location.pathname;

    handleAllListeners();
  };

  return { on, go };
}
