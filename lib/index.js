"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delayObserver_1 = require("./delayObserver");
const currentTagInfo = {
    tagName: "",
    time: 0,
};
// 标记未来的 longtask 是由什么触发的
function tag(name) {
    currentTagInfo.tagName = name;
    currentTagInfo.time = Date.now();
}
const eventList = [];
function on(cb) {
    if (eventList.includes(cb))
        return;
    eventList.push(cb);
}
function off(cb) {
    const index = eventList.indexOf(cb);
    if (index > -1) {
        eventList.splice(index, 1);
    }
}
function removeAllListeners() {
    eventList.length = 0;
}
exports.default = { on, off, removeAllListeners, tag };
(0, delayObserver_1.onLongTask)((longtask) => {
    if (isLongtaskTriggeredByTagTask(currentTagInfo.time, longtask.startTime)) {
        recordWithTagName(longtask);
    }
    else {
        // 未注册、未命名因素引起的 longtask
        recordWithoutTagName(longtask);
    }
    resetTagInfo();
});
function resetTagInfo() {
    currentTagInfo.time = 0;
    currentTagInfo.tagName = "";
}
function recordWithTagName(longtask) {
    const info = { duration: longtask.duration, name: currentTagInfo.tagName };
    eventList.forEach((cb) => cb(info));
}
function recordWithoutTagName(longtask) {
    const info = { duration: longtask.duration, name: "" };
    eventList.forEach((cb) => cb(info));
}
function isLongtaskTriggeredByTagTask(tagTime, taskStartTime) {
    return tagTime > taskStartTime - 40; // 40 是一个安全数，performance 的返回有一些误差
}
