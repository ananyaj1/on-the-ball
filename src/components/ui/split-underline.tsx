import type { ReactNode } from "react";

import styles from "./split-underline.module.css";

type SplitUnderlineProps = Readonly<{
  children: ReactNode;
}>;

export function SplitUnderline({ children }: SplitUnderlineProps) {
  return (
    <span className={styles.label}>
      <span className={styles.text}>{children}</span>
    </span>
  );
}
