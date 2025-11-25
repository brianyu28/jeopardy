import React, { ChangeEvent } from "react";
import JSZip from "jszip";

import { Game, GameData, GameRound } from "../types";
import sample_game from "../assets/sample_game.json";
import { logEvent } from "../util/analytics";

import "./GameLoader.css";

interface GameLoaderProps {
  updateGame: (game: GameData) => void;
}

function GameLoader(props: GameLoaderProps) {
  const { updateGame } = props;

  function validateGame(data: any): GameData | null {
    if (data?.game === undefined) {
      console.log("Game key not found in JSON payload.");
      return null;
    }
    return data as GameData;
  }

  async function handleGameUpload(event: ChangeEvent<HTMLInputElement>) {
    logEvent("Upload Game");
    if (event.target.files === null || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    try {
      const data = await parseGameFile(file);
      if (data !== null) {
        updateGame(data);
      } else {
        console.log("Invalid game.");
      }
    } catch (error) {
      console.error("Failed to load game:", error);
    } finally {
      event.target.value = "";
    }
  }

  function isZipFile(file: File) {
    const name = file.name.toLowerCase();
    const type = (file.type || "").toLowerCase();
    return (
      name.endsWith(".zip") ||
      type === "application/zip" ||
      type === "application/x-zip-compressed"
    );
  }

  async function parseGameFile(file: File): Promise<GameData | null> {
    if (isZipFile(file)) {
      return parseGameBundle(file);
    }
    return parsePlainJson(file);
  }

  async function parsePlainJson(file: File): Promise<GameData | null> {
    const text = await file.text();
    const data: any = JSON.parse(text);
    return validateGame(data);
  }

  async function parseGameBundle(file: File): Promise<GameData | null> {
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const gameEntries = zip.file(/game\.json$/i);
    if (gameEntries.length === 0) {
      return null;
    }

    const gameText = await gameEntries[0].async("text");
    const data: any = JSON.parse(gameText);
    const validated = validateGame(data);
    if (validated === null) {
      return null;
    }

    const assetMap = await extractAssetMap(zip, gameEntries[0].name);
    injectBundleAssets(validated.game, assetMap);
    return validated;
  }

  async function extractAssetMap(zip: JSZip, skipEntryName: string) {
    const assets = new Map<string, string>();
    const entries = Object.entries(zip.files).filter(([, entry]) => !entry.dir);
    for (const [name, entry] of entries) {
      if (name === skipEntryName) {
        continue;
      }
      const blob = await entry.async("blob");
      const normalized = normalizeAssetPath(name);
      assets.set(normalized, URL.createObjectURL(blob));
    }
    return assets;
  }

  function injectBundleAssets(game: Game, assets: Map<string, string>) {
    const rounds: GameRound[] = [];
    if (game.single) rounds.push(game.single);
    if (game.double) rounds.push(game.double);

    rounds.forEach((round) => {
      round.forEach((category) => {
        category.clues.forEach((clue) => {
          if (clue.image && clue.image.startsWith("$")) {
            const normalized = normalizeAssetPath(clue.image.slice(1));
            const asset = assets.get(normalized);
            if (asset) {
              clue.image = asset;
            }
          }
        });
      });
    });
  }

  function normalizeAssetPath(path: string) {
    return path.replace(/\\/g, "/").replace(/^\.\//, "").toLowerCase();
  }

  function downloadSampleGame() {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(sample_game, null, 4)], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "sample_game.json";
    document.body.appendChild(element);
    element.click();
  }

  return (
    <div className="game-loader">
      <h1>Jeopardy Player</h1>
      <p>Designed by Brian Yu</p>
      <hr />
      <h2>Play a Game</h2>
      <input
        type="file"
        name="file"
        accept=".json,.zip,application/json,application/zip"
        onChange={handleGameUpload}
      />
      <hr />
      <h2>Create a Game</h2>
      <div className="create-your-own">
        To create a Jeopardy game, download the below game configuration file,
        edit it to include your desired clues, and re-upload it here.
        <div>
          <button onClick={downloadSampleGame}>Download Configuration</button>
        </div>
      </div>
    </div>
  );
}

export default GameLoader;
