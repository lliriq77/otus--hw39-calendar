import { render } from "./render";

describe("render", () => {
  const originalWindow = { ...window };
  const windowSpy = jest.spyOn(global, "window", "get");
  windowSpy.mockImplementation(
    () =>
      ({
        ...originalWindow,
        location: {
          ...originalWindow.location,
          href: "http://localhost:9000/otus--hw39-calendar/calendar",
          pathname: "/otus--hw39-calendar/calendar",
        },
      } as Window & typeof globalThis)
  );

  const div = document.createElement("div");
  div.id = "root";
  document.body.append(div);

  afterAll(() => {
    windowSpy.mockRestore();
  });

  it("makes murkup", async () => {
    await render();

    expect(
      (document.querySelector(".calendar") as HTMLTableElement).innerHTML
    ).toBeTruthy();
  });

  it("month name change after button push", async () => {
    const beforeClick = (
      document.querySelector(".manager") as HTMLButtonElement
    ).innerHTML;
    (document.querySelector(".manager__next") as HTMLButtonElement).click();
    await render();
    const afterClick = (document.querySelector(".manager") as HTMLButtonElement)
      .innerHTML;

    expect(beforeClick?.includes(afterClick)).toBeFalsy();
  });

  it("creates todolist", () => {
    document.querySelector("td")?.click();

    expect(document.querySelector(".todos")?.innerHTML).toBeTruthy();
  });
});
