import { onLongTask } from "./delayObserver";
import type { longTaskItem } from "./delayObserver";

const currentTagInfo = {
  tagName: "",
  time: 0,
};

// 标记未来的 longtask 是由什么触发的
function tag(name: string) {
  currentTagInfo.tagName = name;
  currentTagInfo.time = Date.now();
}

export interface iLongtaskArg {
  duration: number;
  name: string;
}

export type iLongtaskHandler = (arg: iLongtaskArg) => void;
const eventList: iLongtaskHandler[] = [];

function on(cb: (arg: iLongtaskArg) => void) {
  if (eventList.includes(cb)) return;
  eventList.push(cb);
}

function off(cb: (arg: iLongtaskArg) => void) {
  const index = eventList.indexOf(cb);
  if (index > -1) {
    eventList.splice(index, 1);
  }
}

function removeAllListeners() {
  eventList.length = 0;
}

export default { on, off, removeAllListeners, tag };

onLongTask((longtask) => {
  if (isLongtaskTriggeredByTagTask(currentTagInfo.time, longtask.startTime)) {
    recordWithTagName(longtask);
  } else {
    // 未注册、未命名因素引起的 longtask
    recordWithoutTagName(longtask);
  }
  resetTagInfo();
});

function resetTagInfo() {
  currentTagInfo.time = 0;
  currentTagInfo.tagName = "";
}

function recordWithTagName(longtask: longTaskItem) {
  const info = { duration: longtask.duration, name: currentTagInfo.tagName };
  eventList.forEach((cb) => cb(info));
}

function recordWithoutTagName(longtask: longTaskItem) {
  const info = { duration: longtask.duration, name: "" };
  eventList.forEach((cb) => cb(info));
}

function isLongtaskTriggeredByTagTask(tagTime: number, taskStartTime: number) {
  return tagTime > taskStartTime - 40; // 40 是一个安全数，performance 的返回有一些误差
}
