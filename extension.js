// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

function toUnderLine (text) {
	return text.replace(/([A-Z])/g, "_$1").toLowerCase();
}

function toHump (text) {
	return text.replace(/\_(\w)/g, function (all, letter) { return letter.toUpperCase();});
}

function toUpper (text) {
	return text.toUpperCase();
}

function toLower (text) {
	return text.toLowerCase();
}

function toMiddleLine (text) {
	return text.replace(/\_(\w)/g, function (all, letter) { return '-' + letter;});
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// 驼峰转下划线
	context.subscriptions.push(vscode.commands.registerCommand('formatter.dt', function() { doReplace(toUnderLine); }));
	// 下划线转驼峰
	context.subscriptions.push(vscode.commands.registerCommand('formatter.xt', function() { doReplace(toHump); }));
	// 转大写
	context.subscriptions.push(vscode.commands.registerCommand('formatter.up', function() { doReplace(toUpper); }));
	// 转小写
	context.subscriptions.push(vscode.commands.registerCommand('formatter.lower', function() { doReplace(toLower); }));
	// 转中划线
	context.subscriptions.push(vscode.commands.registerCommand('formatter.mt', function() { doReplace(toMiddleLine); }));
}

// this method is called when your extension is deactivated
function deactivate() {}


function doReplace (handler) {
	// 获取当前激活的编辑页面
	let editor = vscode.window.activeTextEditor;
	if (!editor) {
		return; // 没有打开编辑器
	}
	// 获取选中对象
	let selection = editor.selection;
	// 获取选中的文本
	let text = editor.document.getText(selection);
	// 替换文本，注意引号需要转义，并且需要开启RegExp的全局搜索标志，不然只会替换第一个引号
	let replacedText = handler(text);
	editor.edit( editBuilder => {
		// 替换内容，替换的位置可以有选中的对象获取
		editBuilder.replace(selection, replacedText);
	});
	// 给用户一个消息提示框
	vscode.window.showInformationMessage("替换成功!");
}

module.exports = {
	activate,
	deactivate
}
