import { expect, test } from "bun:test";
import { Pomodoro, PomodoroState } from "./pomodoro";
import { Timer } from "./timer";

test("Pomodoro", async () => {
  const pomodoro = new Pomodoro(1 / 600, 1 / 600);
  expect(pomodoro.workDuration).toBe(1 / 600);
  expect(pomodoro.breakDuration).toBe(1 / 600);

  const promise = pomodoro.startSession();
  expect(pomodoro.getState()).toBe(PomodoroState.Work);
  await promise;
  expect(pomodoro.getState()).toBe(PomodoroState.Break);
});

test("Pomodoro.timers", async () => {
  let callbackCount = 0;
  const callback = () => {
    callbackCount++;
  };
  const pomodoro = new Pomodoro(1 / 120, 1 / 120, callback);
  let tickCount = 0;
  const promise = pomodoro.startSession();
  const interval = setInterval(() => {
    const sessionState = pomodoro.getSessionState();
    if (
      tickCount ===
      sessionState.duration / (Timer.tickInterval * tickCount)
    ) {
      interval.unref();
    }
    tickCount++;
  }, Timer.tickInterval);
  await promise;
  expect(tickCount).toBe(10);
  expect(callbackCount).toBe(10);
});
