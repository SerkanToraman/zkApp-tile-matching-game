import {
  Field,
  SmartContract,
  state,
  State,
  method,
  Bool,
  UInt64,
  Poseidon,
} from "o1js";

export class TileMatchZkApp extends SmartContract {
  @state(UInt64) duration = State<UInt64>(); // Duration in seconds
  @state(UInt64) totalTiles = State<UInt64>();
  @state(UInt64) matchedTilesCount = State<UInt64>();
  @state(Bool) isGameStarted = State<Bool>();

  // Initialize game settings based on selected level
  @method async initializeGame(levelTileCount: UInt64) {
    const gameStarted = this.isGameStarted.getAndRequireEquals();
    gameStarted.assertEquals(Bool(false), "Game already initialized.");

    // Set total tiles based on level, expecting pairs
    this.totalTiles.set(levelTileCount.mul(UInt64.from(2)));
    this.matchedTilesCount.set(UInt64.from(0));
    this.isGameStarted.set(Bool(false));
  }

  // Start the game
  @method async startGame() {
    const gameStarted = this.isGameStarted.getAndRequireEquals();
    gameStarted.assertEquals(Bool(false), "Game has already started.");

    this.isGameStarted.set(Bool(true));
  }

  // Verify that two tiles match by comparing their hashed URLs
  @method async verifyMatch(tile1Url: Field, tile2Url: Field) {
    const gameStarted = this.isGameStarted.getAndRequireEquals();
    gameStarted.assertEquals(Bool(true), "Game has not started.");

    const isMatch = Poseidon.hash([tile1Url]).equals(Poseidon.hash([tile2Url]));
    isMatch.assertTrue("Tiles do not match.");

    // Update matched tiles count
    const currentMatchedCount = this.matchedTilesCount.getAndRequireEquals();
    const newMatchedCount = currentMatchedCount.add(UInt64.from(1));
    this.matchedTilesCount.set(newMatchedCount);
  }

  // End the game, recording only the duration if all tiles have been matched
  @method async endGame(duration: UInt64) {
    const gameStarted = this.isGameStarted.getAndRequireEquals();
    gameStarted.assertEquals(
      Bool(true),
      "Game is not started or already ended."
    );

    // Ensure all pairs have been matched
    const totalTiles = this.totalTiles.getAndRequireEquals();
    const matchedTiles = this.matchedTilesCount.getAndRequireEquals();
    matchedTiles
      .equals(totalTiles.div(UInt64.from(2)))
      .assertTrue("Not all tile pairs have been matched.");

    // Store the duration (in seconds) calculated from the server
    this.duration.set(duration);
    this.isGameStarted.set(Bool(false));
  }
}
