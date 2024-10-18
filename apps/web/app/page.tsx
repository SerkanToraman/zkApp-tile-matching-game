import Image from "next/image";
import { Button } from "@repo/ui/button";

import TileMatchGame from "@repo/tile-match/tileMatchGame";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <TileMatchGame />
    </div>
  );
}
