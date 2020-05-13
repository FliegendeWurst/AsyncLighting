# AsyncLighting

This mod moves Minecraft's light engine processing to another thread, fixing MC-162253.

MC-123584 is also fixed by simply moving all rendering off the main thread. It is recommended to enable the Forge "alwaysSetupTerrainOffThread" option to avoid rendering issues.

Also included is a fix for opening screenshots using the chat link (vanilla behaviour: freezing the game until image viewer is closed).

Forge version this mod was tested to work with: 31.1.27. Version 31.1.87 is currently incompatible.

## Known issues

Block light in single player worlds is not rendered until the light source receives a block update.

Multiplayer worlds do not have this issue.
