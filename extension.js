const vscode = require('vscode');

function getMarkers() {
	const markers = vscode.workspace.getConfiguration('extensionUtils').get('terminalMarkers');
	return Array.isArray(markers) && markers.length ? markers : ['🟢', '🟡', '🔵'];
}

function escapeRegex(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Returns { base, current }: the name with any leading configured marker stripped,
// and which marker (if any) was present.
function stripMarker(name, markers) {
	const re = new RegExp('^(' + markers.map(escapeRegex).join('|') + ')\\s+');
	const match = name.match(re);
	return { base: match ? name.slice(match[0].length) : name, current: match ? match[1] : null };
}

function rename(name) {
	return vscode.commands.executeCommand('workbench.action.terminal.renameWithArg', { name });
}

function activeOrWarn() {
	const term = vscode.window.activeTerminal;
	if (!term) {
		vscode.window.showWarningMessage('Extension Utils: no active terminal.');
	}
	return term;
}

function activate(context) {
	context.subscriptions.push(
		vscode.commands.registerCommand('extensionUtils.cycleTerminalMarker', async () => {
			const term = activeOrWarn();
			if (!term) return;
			const markers = getMarkers();
			const { base, current } = stripMarker(term.name, markers);
			const next = markers[(markers.indexOf(current) + 1) % markers.length]; // indexOf(null)=-1 → starts at 0
			await rename(`${next} ${base}`);
		}),
		vscode.commands.registerCommand('extensionUtils.clearTerminalMarker', async () => {
			const term = activeOrWarn();
			if (!term) return;
			await rename(stripMarker(term.name, getMarkers()).base);
		})
	);
}

function deactivate() {}

module.exports = { activate, deactivate };
