import styles from "./magic-eight-ball.module.css";

type MagicEightBallProps = Readonly<{
  saying: string;
}>;

export function MagicEightBall({ saying }: MagicEightBallProps) {
  return (
    <div
      role="img"
      aria-label={saying ? `Magic 8 ball says: ${saying}` : "Magic 8 ball"}
      className={styles.ball}
    >
      <div aria-hidden="true" className={styles.window}>
        <div className={styles.triangle}>
          <span className={styles.prediction}>{saying}</span>
        </div>
      </div>
    </div>
  );
}
