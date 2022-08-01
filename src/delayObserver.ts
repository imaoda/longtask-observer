const registry: Function[] = [];

export function onLongTask(cb: (item: longTaskItem) => void) {
  createGlobalObserverIfNeeded();
  registry.push(cb);
}

export interface longTaskItem {
  endTime: number;
  startTime: number;
  duration: number;
}

function emitLongTast(item: longTaskItem) {
  registry.forEach((fn) => fn(item));
}

const accumulatedTask: longTaskItem[] = [];

// 阻塞的多个 longTask 会在阻塞结束后一起派发出来，时间相差无几，因此做一下合并
function informLongTaskAndMerge(item: longTaskItem) {
  accumulatedTask.push(item);
  setTimeout(() => {
    if (accumulatedTask.length === 0) return;
    const mergedTask: longTaskItem = {
      endTime: 0,
      startTime: 0,
      duration: 0,
    };
    accumulatedTask.forEach((item) => {
      mergedTask.duration += item.duration;
      if (mergedTask.endTime < item.endTime) mergedTask.endTime = item.endTime;
    });
    mergedTask.startTime = mergedTask.endTime - mergedTask.duration;
    accumulatedTask.length = 0;
    emitLongTast(mergedTask);
  }, 48); // 这里用 48，48ms 不会被纳入 longtask
}

let Observer = window["PerformanceObserver"];
if (!Observer)
  Observer = class {
    disconnect() {}
    observe() {}
  } as any;

let globalObserver: PerformanceObserver;

function createGlobalObserverIfNeeded() {
  if (globalObserver) return;
  globalObserver = new Observer((list) => {
    const entries = list.getEntries();
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const duration = entry.duration;
      const endTime = Date.now();
      const startTime = endTime - duration;
      informLongTaskAndMerge({ duration, endTime, startTime });
    }
  });
  try {
    globalObserver.observe({
      entryTypes: ["longtask"],
      buffered: true,
    });
  } catch (error) {}
}
