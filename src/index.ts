import cliProgress from "cli-progress";
import colors from "ansi-colors";
import { millisToMinutesAndSeconds } from "./format";
import { Pomodoro, PomodoroSessionState, PomodoroState } from "./pomodoro";

const args = process.argv.slice(2);

let [workTime, breakTime] = args.map((arg) => parseInt(arg, 10));

if (isNaN(workTime)) {
  console.warn("Invalid work time, using default value of 25 minutes");
  workTime = 25;
}

if (isNaN(breakTime)) {
  console.warn("Invalid break time, using default value of 5 minutes");
  breakTime = 5;
}

let barState: PomodoroState | null = null;
let bar: cliProgress.SingleBar | null = null;

const getColorFromState = (state: PomodoroState) => {
  switch (state) {
    case PomodoroState.Work:
      return colors.cyan;
    case PomodoroState.Break:
      return colors.green;
  }
};

const pomodoro = new Pomodoro(
  workTime,
  breakTime,
  (sessionState: PomodoroSessionState) => {
    if (barState === null || barState !== sessionState.state) {
      barState = sessionState.state;
      bar = new cliProgress.SingleBar(
        {
          format: `{state} | ${getColorFromState(barState)(
            `{bar}`
          )} | {time} / {totalDuration}`,
          stopOnComplete: true,
          align: "center",
          fps: 10,
        },
        cliProgress.Presets.shades_classic
      );
      bar.start(sessionState.duration, 0, {
        state: sessionState.state === PomodoroState.Work ? "Work" : "Break",
      });
    }
    bar?.update(sessionState.time, {
      state: sessionState.state === PomodoroState.Work ? "Work" : "Break",
      time: millisToMinutesAndSeconds(sessionState.time),
      totalDuration: millisToMinutesAndSeconds(sessionState.duration),
    });
  }
);

pomodoro.startSession().then(() => {
  console.log("done!");
});
