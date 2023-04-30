import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension is now active!');

	const disposable = vscode.commands.registerCommand(
		'myExtension.sayHello',
		() => {
			vscode.window.showInformationMessage('Hello World!');
		}
	);

	context.subscriptions.push(disposable);
}

export function deactivate() {
	console.log('Your extension has been deactivated.');
}
