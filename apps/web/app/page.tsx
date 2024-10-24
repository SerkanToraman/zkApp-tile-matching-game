"use client";
import { useEffect, useState } from "react";
import TileMatchGame from "@repo/tile-match/tileMatchGame";
import { createClient } from "@repo/supabase/client";
import styles from "./page.module.css";

export default function Home() {
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const supabase = createClient(); // Call createClient to get the Supabase instance
      const { data, error } = await supabase
        .from("leaderBoard")
        .select("*")
        .order("score", { ascending: false });
      console.log(data);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className={styles.page}>
      <TileMatchGame />
    </div>
  );
}
