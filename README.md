## introduction

[以用户为中心的性能指标](https://web.dev/user-centric-performance-metrics/) 中提出，与用户感知的指标包含：

- 加载速度
- 视觉稳定度
- 平滑度
- 👉 **运行时响应速度**

我们提供了 **运行时响应速度** 的解决方案，可以方便的监测你的某个任务阻塞了多长时间，便于性能统计与优化

## usage

```typescript
import longtaskObserver from "longtask-observer";

// 在点击时，进行打点
window.addEventListener("click", () => {
  longtaskObserver.tag("页面的点击");
});

// 绑定长时任务的回调
const handler = (longtaskInfo) => {
  console.log(longtaskInfo.name, longtaskInfo.duration);
  // 页面的点击  350
};

longtaskObserver.on(handler);
```

## Q&A

### Q：任务执行和 tag 的顺序是否要严格保障

A：无需特别留意，会进行智能匹配，例如下面两种写法，都是可以的：

写法 1

```typescript
longtaskObserver.tag("user click");
doSomeLongTask();
```

写法 2

```typescript
doSomeLongTask();
longtaskObserver.tag("user click");
```

这两中写法，都会统计到 user click 行为所耗费的时长，并且结果一致
