export interface iAppState {
  month: number;
  months: string[];
  year: number;
  status: string;
  events: {
    [key: string]: {
      date: Date;
      timestamp: number;
      description: string;
      status: string;
    };
  };
}

export const initialState: iAppState = {
  month: new Date().getMonth(),
  months: [
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
  ],
  year: new Date().getFullYear(),
  status: "Any status",
  events: {},
};
