export declare function onLongTask(cb: (item: longTaskItem) => void): void;
export interface longTaskItem {
    endTime: number;
    startTime: number;
    duration: number;
}
