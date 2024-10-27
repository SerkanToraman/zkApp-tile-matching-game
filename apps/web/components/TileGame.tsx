// HomeContent.js
"use client";
import { useEffect } from "react";
import TileMatchGame from "@repo/tile-match/tileMatchGame";
import { createClient } from "@repo/supabase/client";
import { useWalletStore } from "@repo/zustand/walletStore";
import styles from "../app/page.module.css";

export default function TileGame() {
  const { connect, disconnect, walletInfo, isLoading, error } =
    useWalletStore();

  // Log wallet info to the console
  useEffect(() => {
    if (walletInfo) {
      console.log("Current Wallet Info:", walletInfo);
    }
  }, [walletInfo]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("leaderBoard")
        .select("*")
        .order("score", { ascending: false });

      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else {
        console.log("Leaderboard data:", data);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className={styles.page}>
      <TileMatchGame />
      {/* Wallet connection status */}
      <div style={{ marginTop: "20px" }}>
        {isLoading ? (
          <p>Loading wallet...</p>
        ) : (
          <>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            <p>
              Status:{" "}
              <strong>
                {walletInfo.isConnected ? "Connected" : "Not Connected"}
              </strong>
            </p>
            {!walletInfo.isConnected ? (
              <button onClick={connect} disabled={isLoading}>
                {isLoading ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : (
              <button onClick={disconnect}>Disconnect Wallet</button>
            )}
          </>
        )}
        {walletInfo.isConnected && (
          <div style={{ marginTop: "20px" }}>
            <h3>Wallet Info</h3>
            <p>
              <strong>Account:</strong> {walletInfo.account || "No account"}
            </p>
            <p>
              <strong>Network:</strong>{" "}
              {walletInfo.network?.networkID || "Unknown network"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
