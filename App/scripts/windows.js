// const ffi = require('ffi')
// const ref = require('ref')
const robot = require('robotjs');
const showPoEWindow = require('show-poe-window/build/Release/addon.node');

// const voidPtr = ref.refType(ref.types.void)
// const stringPtr = ref.refType(ref.types.CString)

// const user32 = new ffi.Library('user32', {
//   'GetTopWindow': ['long', ['long']],
//   'FindWindowA': ['long', ['string', 'string']],
//   'SetActiveWindow': ['long', ['long']],
//   'SetForegroundWindow': ['bool', ['long']],
//   'BringWindowToTop': ['bool', ['long']],
//   'ShowWindow': ['bool', ['long', 'int']],
//   'SwitchToThisWindow': ['void', ['long', 'bool']],
//   'GetForegroundWindow': ['long', []],
//   'AttachThreadInput': ['bool', ['int', 'long', 'bool']],
//   'GetWindowThreadProcessId': ['int', ['long', 'int']],
//   'SetWindowPos': ['bool', ['long', 'long', 'int', 'int', 'int', 'int', 'uint']],
//   'SetFocus': ['long', ['long']],
//   'EnumWindows': ['bool', [voidPtr, 'int32']],
//   'GetWindowTextA': ['long', ['long', stringPtr, 'long']]
// })

// const kernel32 = new ffi.Library('Kernel32.dll', {
//   'GetCurrentThreadId': ['int', []]
// })

/*
windowProc = ffi.Callback('bool', ['long', 'int32'], function (hwnd, lParam) {
    const buf, name, ret;
    buf = new Buffer(255);
    ret = user32.GetWindowTextA(hwnd, buf, 255);
    name = ref.readCString(buf, 0);
    console.log(name, 'HWND', hwnd);
    return true;
});

user32.EnumWindows(windowProc, 0); */

function sendMessage() {
  bringGameIntoForeground();
  robot.keyTap('enter');
  robot.keyTap('v', 'control');
  robot.keyTap('enter');
}

function bringGameIntoForeground() {
  showPoEWindow.showWindow();
}

module.exports = sendMessage;
