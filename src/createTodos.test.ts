import { createTodos } from "./createTodos";

describe("createTodos", () => {
  document.body.append(document.createElement("div"));
  const div = document.querySelector("div") as HTMLDivElement;

  it("is a function", () => {
    expect(createTodos).toBeInstanceOf(Function);
  });

  it("creates markup", () => {
    createTodos(
      div,
      `<span>All Events</span>
     <button class='todos__button'>+</button>`
    );
    expect(div.innerHTML).toBeTruthy();
    expect(document.querySelector("table")).toBeTruthy();
    expect(document.querySelectorAll("input").length).toBe(1);
    expect(document.querySelectorAll("select").length).toBe(1);
    expect(document.querySelectorAll("th")[0].innerHTML).toBe("Date");
    expect(document.querySelectorAll("th")[3].innerHTML).toBe("Action");
  });
});
