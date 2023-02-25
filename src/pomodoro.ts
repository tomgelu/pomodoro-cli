import { Timer } from "./timer";

export enum PomodoroState {
  Work,
  Break,
}

export type PomodoroSessionState = {
  state: PomodoroState;
  time: number;
  duration: number;
};

export class Pomodoro {
  private state: PomodoroState = PomodoroState.Break;
  private workTimer!: Timer;
  private breakTimer!: Timer;

  constructor(
    public readonly workDuration: number, // minutes
    public readonly breakDuration: number, // minutes
    private readonly tickCallback?: (sessionState: PomodoroSessionState) => void
  ) {}

  public async startSession(): Promise<void> {
    this.state = PomodoroState.Work;
    this.workTimer = new Timer(this.workDuration * 60 * 1000, this.state);
    await this.workTimer.start(this.tickCallback);
    this.state = PomodoroState.Break;
    this.breakTimer = new Timer(this.breakDuration * 60 * 1000, this.state);
    await this.breakTimer.start(this.tickCallback);
  }

  public getState(): PomodoroState {
    return this.state;
  }

  public getSessionState(): PomodoroSessionState {
    return {
      state: this.state,
      time:
        this.state === PomodoroState.Work
          ? this.workTimer.currentTime
          : this.breakTimer.currentTime,
      duration:
        this.state === PomodoroState.Work
          ? this.workDuration * 60 * 1000
          : this.breakDuration * 60 * 1000,
    };
  }
}
