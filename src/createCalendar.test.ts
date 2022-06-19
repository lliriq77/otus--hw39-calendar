import { createCalendar } from "./createCalendar";

describe("createCalendar", () => {
  const date = new Date();
  const months = [
    "January",
    "Fabruary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  beforeAll(async () => {
    document.body.append(document.createElement("div"));
    const div = document.querySelector("div") as HTMLDivElement;
    div.id = "root";
    createCalendar();
  });
  it("makes markup", () => {
    expect(document.querySelector(".calendar")?.innerHTML).toBeTruthy();
    expect(document.querySelectorAll("tr").length).toBe(7);
    expect(document.querySelectorAll("th").length).toBe(7);
    expect(document.querySelectorAll("td").length).toBe(42);
    expect(document.querySelectorAll("button").length).toBe(2);
  });
  it("shows current month and year", () => {
    expect(document.querySelector(".manager")?.innerHTML).toContain(
      `${date.getFullYear()}`
    );
    expect(document.querySelector(".manager")?.innerHTML).toContain(
      `${months[date.getMonth()]}`
    );
  });
});
