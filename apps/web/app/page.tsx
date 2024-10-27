// pages/index.js or Home.js
import dynamic from "next/dynamic";

// Import `HomeContent` dynamically to prevent SSR
const TileGame = dynamic(() => import("../components/TileGame"), {
  ssr: false,
});

export default function Home() {
  return <TileGame />;
}
