// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path = require('path');
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Loaded kristal.vscode-kristal');

	setLuaThirdParty(true);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Unloaded kristal.vscode-kristal');

	setLuaThirdParty(false);
}


function setLuaThirdParty(enable: boolean) {
	const extensionId = "kristal.vscode-kristal"; // this id is case sensitive
	const extensionPath = vscode.extensions.getExtension(extensionId)?.extensionPath;
	const folderPath = extensionPath + path.sep + "3rd" + path.sep;
	const config = vscode.workspace.getConfiguration("Lua", null);
	const library: string[] | undefined = config.get("workspace.userThirdParty");
	if (library && extensionPath) {
		// remove any older versions of our path e.g. "publisher.name-0.0.1"
		for (let i = library.length-1; i >= 0; i--) {
			const el = library[i];
			const isSelfExtension = el.indexOf(extensionId) > -1;
			const isCurrentVersion = el.indexOf(extensionPath) > -1;
			if (isSelfExtension) {
				if (isCurrentVersion) {
					return;
				}
				library.splice(i, 1);
			}
		}
		const index = library.indexOf(folderPath);
		if (enable) {
			if (index === -1) {
				library.push(folderPath);
			}
		}
		else {
			if (index > -1) {
				library.splice(index, 1);
			}
		}
		config.update("workspace.userThirdParty", library, true);
	}
}