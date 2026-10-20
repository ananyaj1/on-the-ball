import { EIGHT_BALL_SAYINGS } from "../constants/eight-ball-sayings";

export function getEightBallSaying(hasPresale: boolean) {
  const sayings = hasPresale
    ? EIGHT_BALL_SAYINGS.upcoming
    : EIGHT_BALL_SAYINGS.none;

  return sayings[Math.floor(Math.random() * sayings.length)];
}
