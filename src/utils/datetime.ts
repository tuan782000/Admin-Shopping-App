export class DateTimeFormat {
  static Date = (num: number) => {
    const d = new Date(num);
    return `${changeNumToString(d.getDate())}/${changeNumToString(
      d.getMonth() + 1
    )}/${d.getFullYear()}`;
  };
}

const changeNumToString = (num: number) => (num < 10 ? `0${num}` : num);
