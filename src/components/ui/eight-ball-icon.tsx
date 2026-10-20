import Image from "next/image";

const ICON_SIZE = 28;

export function EightBallIcon() {
  return (
    <Image
      src="/brand/eight-ball.png"
      alt=""
      aria-hidden="true"
      width={ICON_SIZE}
      height={ICON_SIZE}
      className="size-7 shrink-0"
      unoptimized
    />
  );
}
