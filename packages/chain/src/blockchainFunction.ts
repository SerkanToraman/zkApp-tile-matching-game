import { Field, Poseidon, PublicKey } from "o1js";
import { TileMatchZkApp } from "./TileMatchZkApp";

// Function to convert a string (URL) to a Field-compatible number
function stringToField(str: string): Field {
  const charCodes = Array.from(str).map((char) =>
    Field(BigInt(char.charCodeAt(0)))
  );
  return Poseidon.hash(charCodes); // Hash the character codes using Poseidon
}

// You need the zkApp's PublicKey (address) from the deployment
const zkAppAddress = PublicKey.fromBase58(
  "B62qrF...(replace with actual address)"
); // Replace with the actual PublicKey of the zkApp

// Initialize zkApp instance with the address of the deployed zkApp
const zkApp = new TileMatchZkApp(zkAppAddress);

// Exported function to prove if two tiles match by comparing their URLs
export async function proveTilesMatch(
  tile1Url: string,
  tile2Url: string
): Promise<void> {
  // Convert the URLs to Field-compatible numbers using the helper function
  const tile1Hash = stringToField(tile1Url);
  const tile2Hash = stringToField(tile2Url);

  // Call zkApp to prove the match on the blockchain
  await zkApp.proveTilesMatch(tile1Hash, tile2Hash);

  console.log("Tiles successfully proved to be matching on the blockchain.");
}
