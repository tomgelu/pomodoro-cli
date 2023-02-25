import { expect, test } from "bun:test";
import { format } from "path";
import { millisToMinutesAndSeconds } from "./format";

test("millis to minutes/seconds", () => {
  const millis = 60000;
  const res = millisToMinutesAndSeconds(millis);
  expect(res).toBe("1:00");

  const millis2 = 61000;
  const res2 = millisToMinutesAndSeconds(millis2);
  expect(res2).toBe("1:01");
});
