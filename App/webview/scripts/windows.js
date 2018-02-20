var ffi = require('ffi')
var ref = require('ref')
var robot = require('robotjs')

var voidPtr = ref.refType(ref.types.void)
var stringPtr = ref.refType(ref.types.CString)

var user32 = new ffi.Library('user32', {
  'GetTopWindow': ['long', ['long']],
  'FindWindowA': ['long', ['string', 'string']],
  'SetActiveWindow': ['long', ['long']],
  'SetForegroundWindow': ['bool', ['long']],
  'BringWindowToTop': ['bool', ['long']],
  'ShowWindow': ['bool', ['long', 'int']],
  'SwitchToThisWindow': ['void', ['long', 'bool']],
  'GetForegroundWindow': ['long', []],
  'AttachThreadInput': ['bool', ['int', 'long', 'bool']],
  'GetWindowThreadProcessId': ['int', ['long', 'int']],
  'SetWindowPos': ['bool', ['long', 'long', 'int', 'int', 'int', 'int', 'uint']],
  'SetFocus': ['long', ['long']],
  'EnumWindows': ['bool', [voidPtr, 'int32']],
  'GetWindowTextA': ['long', ['long', stringPtr, 'long']]
})

var kernel32 = new ffi.Library('Kernel32.dll', {
  'GetCurrentThreadId': ['int', []]
})

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
  var winToSetOnTop = user32.FindWindowA(null, 'Path of Exile')
  var foregroundHWnd = user32.GetForegroundWindow()
  var currentThreadId = kernel32.GetCurrentThreadId()
  var windowThreadProcessId = user32.GetWindowThreadProcessId(foregroundHWnd, null)
  user32.ShowWindow(winToSetOnTop, 9)
  // user32.SetWindowPos(winToSetOnTop, -1, 0, 0, 0, 0, 3)
  // user32.SetWindowPos(winToSetOnTop, -2, 0, 0, 0, 0, 3)
  user32.SetForegroundWindow(winToSetOnTop)
  user32.AttachThreadInput(windowThreadProcessId, currentThreadId, 0)
  user32.SetFocus(winToSetOnTop)
  user32.SetActiveWindow(winToSetOnTop)
}

module.exports = sendMessage
