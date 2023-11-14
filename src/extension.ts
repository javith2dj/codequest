import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    let findTicketsDisposable = vscode.commands.registerCommand('codequest.findTickets', async () => {
        try {
            const filename = await vscode.window.showInputBox({ prompt: 'Enter path to the AllObjects.txt file:' });
            if (!filename) return;

            const output_file = await vscode.window.showInputBox({ prompt: 'Enter path to the output CSV file:' });
            if (!output_file) return;

            const pattern = await vscode.window.showInputBox({ prompt: 'Enter the regex pattern to search for:' });
            if (!pattern) return;

            // Get encoding from config
            const config = vscode.workspace.getConfiguration('allObjects');
            const encoding: string = config.get('encoding', 'latin1');

            // Path to compiled JS script
            const scriptPath = `${context.extensionPath}/out/findticketids.js`;

            // Display progress dialog
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Searching the All Objects file:",
                cancellable: true
            }, (progress, token) => {
                return new Promise<void>((resolve, reject) => {
                    // Check for cancelation
                    token.onCancellationRequested(() => {
                        console.log("User canceled the operation");
                        reject(new Error("Canceled by user"));
                    });

                    setTimeout(() => progress.report({ message: "⏳ Oops this is taking some time..." }), 10000);
                    setTimeout(() => progress.report({ message: "⏰ Alright.Set an alarm and come back later..." }), 30000);

                    exec(`node "${scriptPath}" "${filename}" "${output_file}" "${pattern}" "${encoding}"`, (error, stdout, stderr) => {
                        if (error) {
                            vscode.window.showErrorMessage(`Error executing script: ${error.message}`);
                            reject(error);
                            return;
                        }
                        vscode.window.showInformationMessage(stdout);
                        resolve();
                    });
                });
            });
        } catch (error) {
            if (error && typeof error === 'object' && 'message' in error) {
                vscode.window.showErrorMessage(`An error occurred: ${error.message}`);
            } else {
                vscode.window.showErrorMessage(`An error occurred: ${error}`);
            }
        }
    });

    let findTicketsByObjectDisposable = vscode.commands.registerCommand('codequest.getTicketObjectList', async () => {
        try {
            // For demonstration purposes, I'm using the same prompts, but you should change them as per your needs
            const filename = await vscode.window.showInputBox({ prompt: 'Enter path to the AllObjects.txt file for byObject search:' });
            if (!filename) return;

            const ticketfilename = await vscode.window.showInputBox({ prompt: 'Enter path to the ticket csv file for byObject search:' });
            if (!ticketfilename) return;

            const output_file = await vscode.window.showInputBox({ prompt: 'Enter path to the output CSV file for byObject search:' });
            if (!output_file) return;

            // Get encoding from config
            const config = vscode.workspace.getConfiguration('allObjects');
            const encoding: string = config.get('encoding', 'latin1');

            // Path to your compiled JS script specific for findTicketsbyObject
            const scriptPathByObject = `${context.extensionPath}/out/findticketobjects.js`;

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Searching the All Objects file:",
                cancellable: true
            }, (progress, token) => {
                return new Promise<void>((resolve, reject) => {
                    // Check for cancelation
                    token.onCancellationRequested(() => {
                        console.log("User canceled the operation");
                        reject(new Error("Canceled by user"));
                    });

                    setTimeout(() => progress.report({ message: "Oops this is taking some time ⏳" }), 10000);
                    setTimeout(() => progress.report({ message: "Alright.Set an alarm and come back later ⏰" }), 40000);
                    setTimeout(() => progress.report({ message: "Don't worry I am not sleeping, but you can 💤" }), 80000);
                    setTimeout(() => progress.report({ message: "Hey, If you have the time stone please fast forward this 💎" }), 160000);
                    setTimeout(() => progress.report({ message: "Do not cancel. It will create a branch from the sacred timeline 🕛" }), 320000);

                    exec(`node "${scriptPathByObject}" "${filename}" "${ticketfilename}" "${output_file}" "${encoding}"`, (error, stdout, stderr) => {
                        if (error) {
                            vscode.window.showErrorMessage(`Error executing script: ${error.message}`);
                            reject(error);
                            return;
                        }
                        vscode.window.showInformationMessage(stdout);
                        resolve();
                    });
                });
            });
        } catch (error) {
            if (error && typeof error === 'object' && 'message' in error) {
                vscode.window.showErrorMessage(`An error occurred in byObject: ${error.message}`);
            } else {
                vscode.window.showErrorMessage(`An error occurred in byObject: ${error}`);
            }
        }
    });

    let findTicketCountByObjectDisposable = vscode.commands.registerCommand('codequest.getTicketCountbyObjects', async () => {
        try {
            // For demonstration purposes, I'm using the same prompts, but you should change them as per your needs
            const filename = await vscode.window.showInputBox({ prompt: 'Enter path to the AllObjects.txt file for byObject search:' });
            if (!filename) return;

            const ticketfilename = await vscode.window.showInputBox({ prompt: 'Enter path to the ticket csv file for byObject search:' });
            if (!ticketfilename) return;

            const output_file = await vscode.window.showInputBox({ prompt: 'Enter path to the output CSV file for byObject search:' });
            if (!output_file) return;

            // Get encoding from config
            const config = vscode.workspace.getConfiguration('allObjects');
            const encoding: string = config.get('encoding', 'latin1');

            // Path to your compiled JS script specific for findTicketsbyObject
            const scriptPathByObject = `${context.extensionPath}/out/findticketcount.js`;

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Searching the All Objects file:",
                cancellable: true
            }, (progress, token) => {
                return new Promise<void>((resolve, reject) => {
                    // Check for cancelation
                    token.onCancellationRequested(() => {
                        console.log("User canceled the operation");
                        reject(new Error("Canceled by user"));
                    });

                    setTimeout(() => progress.report({ message: "Oops this is taking some time ⏳" }), 10000);
                    setTimeout(() => progress.report({ message: "Alright.Set an alarm and come back later ⏰" }), 40000);
                    setTimeout(() => progress.report({ message: "Don't worry I am not sleeping, but you can 💤" }), 80000);
                    setTimeout(() => progress.report({ message: "Hey, If you have the time stone please fast forward this 💎" }), 160000);
                    setTimeout(() => progress.report({ message: "Do not cancel. It will create a branch from the sacred timeline 🕛" }), 320000);

                    exec(`node "${scriptPathByObject}" "${filename}" "${ticketfilename}" "${output_file}" "${encoding}"`, (error, stdout, stderr) => {
                        if (error) {
                            vscode.window.showErrorMessage(`Error executing script: ${error.message}`);
                            reject(error);
                            return;
                        }
                        vscode.window.showInformationMessage(stdout);
                        resolve();
                    });
                });
            });
        } catch (error) {
            if (error && typeof error === 'object' && 'message' in error) {
                vscode.window.showErrorMessage(`An error occurred in byObject: ${error.message}`);
            } else {
                vscode.window.showErrorMessage(`An error occurred in byObject: ${error}`);
            }
        }
    });

    let letanalyzedeltafilesDisposable = vscode.commands.registerCommand('codequest.analyzedeltafiles', async () => {
        try {
            const filepath = await vscode.window.showInputBox({ prompt: 'Enter folder path to the DELTA files:' });
            if (!filepath) return;

            const output_file = await vscode.window.showInputBox({ prompt: 'Enter path to the output CSV file:' });
            if (!output_file) return;


            // Path to compiled JS script
            const scriptPath = `${context.extensionPath}/out/analyzedeltafiles.js`;

            // Display progress dialog
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Searching the All Objects file:",
                cancellable: true
            }, (progress, token) => {
                return new Promise<void>((resolve, reject) => {
                    // Check for cancelation
                    token.onCancellationRequested(() => {
                        console.log("User canceled the operation");
                        reject(new Error("Canceled by user"));
                    });

                    setTimeout(() => progress.report({ message: "⏳ Oops this is taking some time..." }), 10000);
                    setTimeout(() => progress.report({ message: "⏰ Alright.Set an alarm and come back later..." }), 30000);

                    exec(`node "${scriptPath}" "${filepath}" "${output_file}"`, (error, stdout, stderr) => {
                        if (error) {
                            vscode.window.showErrorMessage(`Error executing script: ${error.message}`);
                            reject(error);
                            return;
                        }
                        vscode.window.showInformationMessage(stdout);
                        resolve();
                    });
                });
            });
        } catch (error) {
            if (error && typeof error === 'object' && 'message' in error) {
                vscode.window.showErrorMessage(`An error occurred: ${error.message}`);
            } else {
                vscode.window.showErrorMessage(`An error occurred: ${error}`);
            }
        }
    });

    context.subscriptions.push(findTicketsDisposable,findTicketsByObjectDisposable,findTicketCountByObjectDisposable);
}

export function deactivate() {}
