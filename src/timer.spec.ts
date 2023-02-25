import { expect, test } from "bun:test";
import { PomodoroState } from "./pomodoro";
import { Timer } from "./timer";

test("Timer", async () => {
  const duration = 500;
  const timer = new Timer(duration, PomodoroState.Break);
  expect(timer.duration).toBe(duration);
  expect(timer.isRunning).toBe(false);
  const now = Date.now();
  const promise = timer.start();
  expect(timer.isRunning).toBe(true);
  await promise;
  expect(Date.now() - now).toBeGreaterThanOrEqual(duration);
  expect(timer.isRunning).toBe(false);
});

test("Timer.tick", async () => {
  const duration = 200;
  const timer = new Timer(duration, PomodoroState.Break);
  const generator = timer.tick();
  const now = Date.now();
  await generator.next();
  expect(Date.now() - now).toBeGreaterThanOrEqual(Timer.tickInterval);
  await generator.next();
  expect(Date.now() - now).toBeGreaterThanOrEqual(duration);
});

test("Multiple timers", async () => {
  const timerA = new Timer(100, PomodoroState.Break);
  const timerB = new Timer(200, PomodoroState.Work);
  const timerC = new Timer(300, PomodoroState.Break);
  const now = Date.now();
  await Promise.all([timerA.start(), timerB.start(), timerC.start()]);
  expect(Date.now() - now).toBeGreaterThanOrEqual(300);
  expect(timerA.isRunning).toBe(false);
  expect(timerB.isRunning).toBe(false);
  expect(timerC.isRunning).toBe(false);
});
