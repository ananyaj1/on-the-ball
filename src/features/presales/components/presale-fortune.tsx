import { io } from "next/cache";

import { MagicEightBall } from "@/components/ui/magic-eight-ball";

import { getEightBallSaying } from "../utils/get-eight-ball-saying";

type PresaleFortuneProps = Readonly<{
  hasPresale: boolean;
}>;

export async function PresaleFortune({ hasPresale }: PresaleFortuneProps) {
  await io();

  return <MagicEightBall saying={getEightBallSaying(hasPresale)} />;
}
