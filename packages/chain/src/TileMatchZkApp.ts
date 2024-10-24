import { SmartContract, Field, state, State, method } from "o1js";

export class TileMatchZkApp extends SmartContract {
  // State to store the last proved match hash
  @state(Field) matchedTileHash = State<Field>();

  // Method to prove that two tiles match
  @method async proveTilesMatch(
    tile1Hash: Field,
    tile2Hash: Field
  ): Promise<void> {
    // Get the current state (the last matched hash)
    const currentHash = this.matchedTileHash.get();

    // Ensure the current hash matches the stored state
    this.matchedTileHash.requireEquals(currentHash);

    // Assert that the two hashes are equal
    tile1Hash.assertEquals(tile2Hash);

    // If the hashes match, store the hash in the contract's state
    this.matchedTileHash.set(tile1Hash);

    // No return value, just returning Promise<void>
    return;
  }
}
