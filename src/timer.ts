import { PomodoroSessionState, PomodoroState } from "./pomodoro";

export class Timer {
  public isRunning: boolean;
  public currentTime: number;
  public static readonly tickInterval: number = 100;
  constructor(
    public readonly duration: number,
    public readonly state: PomodoroState
  ) {
    this.isRunning = false;
    this.currentTime = 0;
  }

  public async start(
    callback?: (sessionState: PomodoroSessionState) => void
  ): Promise<void> {
    const generator = this.tick();
    this.isRunning = true;
    let done;
    do {
      const v = await generator.next();
      done = v.done;
      if (done) {
        this.isRunning = false;
        break;
      }
      this.currentTime += Timer.tickInterval;
      if (callback) {
        callback({
          state: this.state,
          time: this.currentTime,
          duration: this.duration,
        });
      }
    } while (!done);
  }

  public async *tick(): AsyncGenerator<number, number, number> {
    while (this.currentTime < this.duration) {
      yield await new Promise((resolve) =>
        setTimeout(() => resolve(this.currentTime), Timer.tickInterval)
      );
    }
    return this.currentTime;
  }
}
