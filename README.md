# vscode-extension-utils

A small grab-bag VS Code extension for personal utilities. Expandable — add a command, contribute it in `package.json`, register it in `extension.js`.

## Features

### Terminal marker cycle

VS Code's `workbench.action.terminal.changeColor` / `changeIcon` commands **ignore any value passed via keybinding args** (they always open a picker), and the extension API exposes no way to recolor/re-icon an existing terminal. The one tab property that *is* settable from a command is the **name** (`workbench.action.terminal.renameWithArg`), so this extension prepends a colored emoji marker to the active terminal's name as a stand-in for a color/icon cycle.

| Command | ID | What it does |
|---|---|---|
| Terminal: Cycle Marker | `extensionUtils.cycleTerminalMarker` | Strips any existing marker, prepends the next one in the configured list. |
| Terminal: Clear Marker | `extensionUtils.clearTerminalMarker` | Strips the marker, restoring the bare name. |

Cycling reads the terminal's current name, removes a previously-applied marker (so they never stack), and prepends the next — preserving the real shell/process name after the emoji.

## Settings

```jsonc
"extensionUtils.terminalMarkers": ["🟢", "🟡", "🔵", "🟣", "🟠"]  // default
```

## Suggested keybinding

```jsonc
{
  "key": "ctrl+alt+c",
  "command": "extensionUtils.cycleTerminalMarker",
  "when": "terminalFocus"
}
```

## Install (no marketplace needed)

This is a no-build, plain-JS extension. Two options:

**A. Dev-folder install (simplest).** Point a directory junction from your VS Code
extensions dir at this repo, so edits here go live on the next window reload (no admin needed):

```cmd
:: Windows (cmd) — junction, repo stays the source of truth
mklink /J "%USERPROFILE%\.vscode\extensions\vscode-extension-utils-0.1.0" "%USERPROFILE%\claude-code\vscode-extension-utils"
```

**B. Package a .vsix:**

```bash
npx @vscode/vsce package
code --install-extension vscode-extension-utils-0.1.0.vsix
```

Reload the window (`Developer: Reload Window`) after installing.

## Remote-SSH / WSL / Containers

This extension is declared `"extensionKind": ["ui"]`, so it runs in the **local** extension
host and stays active inside Remote-SSH, WSL, and Container windows — without needing to be
installed on the remote server. Renaming a terminal tab is a workbench/renderer operation and
`window.activeTerminal` is synced to every extension host, so it correctly marks *remote*
terminals too. The single local junction install covers every window type.

(If it had a default `workspace` kind, it would instead need to be installed on each remote
host's `~/.vscode-server/extensions`, which a local dev junction does not provide.)
