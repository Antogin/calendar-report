import React from "react";
import "./styles.css";
import eachDay from "date-fns/eachDayOfInterval";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import startOfMonth from "date-fns/startOfMonth";
import isSameDay from "date-fns/isSameDay";
import endOfMonth from "date-fns/endOfMonth";
import isSameMonth from "date-fns/isSameMonth";
import addMonths from "date-fns/addMonths";

const values = [
  ["2020-07-24T00:00:00Z", 419, 25],
  ["2020-07-26T00:00:00Z", 630, 39],
  ["2020-07-27T00:00:00Z", 675, 42],
  ["2020-07-28T00:00:00Z", 673, 41],
  ["2020-07-29T00:00:00Z", 673, 0],
  ["2020-07-30T00:00:00Z", 643, 0],
  ["2020-07-31T00:00:00Z", 604, 36],
  ["2020-08-01T00:00:00Z", 482, 30],
  ["2020-08-02T00:00:00Z", 496, 0],
  ["2020-08-03T00:00:00Z", 591, 0],
  ["2020-08-04T00:00:00Z", 622, 0],
  ["2020-08-05T00:00:00Z", 688, 28],
  ["2020-08-06T00:00:00Z", 613, 25],
  ["2020-08-07T00:00:00Z", 619, 0],
  ["2020-08-08T00:00:00Z", 557, 0],
  ["2020-08-09T00:00:00Z", 444, 0],
  ["2020-08-10T00:00:00Z", 599, 0],
  ["2020-08-11T00:00:00Z", 617, 26],
  ["2020-08-12T00:00:00Z", 599, 33],
  ["2020-08-13T00:00:00Z", 210, 10]
];

const getColor = (val) => {
  if (!val) {
    return "#dadada";
  }

  const ratio = val ? 1 - val[2] / val[1] : null;

  if (ratio === 1) {
    return "#8BF18B";
  }

  if (ratio > 0.95) {
    return "#FF8650";
  }

  return "#FF555E";
};

// out of the lib
const convertData = () => {
  const data = values.map((val) => {
    const ratio = val ? 1 - val[2] / val[1] : null;

    const color = getColor(ratio);

    return {
      date: val[0],
      color,
      onClick: () => null
    };
  });

  return data;
};

const daysOfTheWeek = () => {
  const now = new Date();

  const arr = eachDay({ start: startOfWeek(now), end: endOfWeek(now) });

  const days = arr.map((d) => {
    return format(d, "EEEEEE");
  });

  return days;
};

const daysOfTheMonth = (date) => {
  const arr = eachDay({ start: startOfMonth(date), end: endOfMonth(date) });

  return arr;
};

const firstDayOfMonth = (date) => {
  const firstDay = startOfMonth(date);
  return getDay(firstDay);
};

const getMonths = (start, end) => {
  const months = [];

  let current = start;
  while (true) {
    const firstday = firstDayOfMonth(current);

    const blanks = Array(firstday).fill();

    const days = daysOfTheMonth(current).map((d) => {
      const val = values.find((value) => {
        const date = new Date(value[0]);

        return isSameDay(date, d);
      });

      const getColor = (val) => {
        if (!val) {
          return "#dadada";
        }

        const ratio = val ? 1 - val[2] / val[1] : null;

        if (ratio === 1) {
          return "#8BF18B";
        }

        if (ratio > 0.95) {
          return "#FF8650";
        }

        return "#FF555E";
      };

      const color = getColor(val);

      return {
        day: d,
        color
      };
    });
    const squares = [...blanks, ...days];

    months.push({ title: format(current, "MMM"), days: squares });

    if (isSameMonth(current, end)) {
      break;
    }

    current = addMonths(current, 1);
  }

  console.log(months);

  return months;
};

export default function App() {
  const first = new Date(values[0][0]);
  const last = new Date(values[values.length - 1][0]);

  const weekDays = daysOfTheWeek();

  const months = getMonths(first, last);
  return (
    <div className="App">
      {months.map((month) => {
        return (
          <div className="wrapper" key={month.title}>
            <h1>{month.title}</h1>
            <hr />
            <div className="month">
              <div className="month-head">
                {weekDays.map((d) => {
                  return <div key={d} className="week-day"></div>;
                })}
              </div>

              <div className="month-days">
                {month.days.map((d, index) => {
                  if (!d) {
                    return <div className="empty" key={`blank-${index}`}></div>;
                  }
                  const day = format(d.day, "d");
                  return (
                    <div
                      className="day"
                      style={{
                        backgroundColor: d.color
                      }}
                      key={`day—${day}`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
