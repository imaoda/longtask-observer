declare function tag(name: string): void;
export interface iLongtaskArg {
    duration: number;
    name: string;
}
export declare type iLongtaskHandler = (arg: iLongtaskArg) => void;
declare function on(cb: (arg: iLongtaskArg) => void): void;
declare function off(cb: (arg: iLongtaskArg) => void): void;
declare function removeAllListeners(): void;
declare const _default: {
    on: typeof on;
    off: typeof off;
    removeAllListeners: typeof removeAllListeners;
    tag: typeof tag;
};
export default _default;
