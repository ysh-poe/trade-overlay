// var ffi = require('ffi')
// var ref = require('ref')
var robot = require('robotjs')
var showPoEWindow = require('show-poe-window/build/Release/addon.node')

// var voidPtr = ref.refType(ref.types.void)
// var stringPtr = ref.refType(ref.types.CString)

// var user32 = new ffi.Library('user32', {
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

// var kernel32 = new ffi.Library('Kernel32.dll', {
//   'GetCurrentThreadId': ['int', []]
// })

/*
windowProc = ffi.Callback('bool', ['long', 'int32'], function (hwnd, lParam) {
    var buf, name, ret;
    buf = new Buffer(255);
    ret = user32.GetWindowTextA(hwnd, buf, 255);
    name = ref.readCString(buf, 0);
    console.log(name, 'HWND', hwnd);
    return true;
});

user32.EnumWindows(windowProc, 0); */

function sendMessage () {
  console.log('window.sendmessage')
  bringGameIntoForeground()
  robot.keyTap('enter')
  robot.keyTap('v', 'control')
  robot.keyTap('enter')
}

function bringGameIntoForeground () {
  showPoEWindow.showWindow()
}

module.exports = sendMessage
