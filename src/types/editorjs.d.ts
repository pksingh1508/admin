declare module "@editorjs/checklist";
declare module "@editorjs/marker";
declare module "@editorjs/link";
declare module "@editorjs/underline";

declare module "@editorjs/editorjs" {
  export default class EditorJS {
    constructor(config: any);
    isReady: Promise<void>;
    save(): Promise<any>;
    clear(): void;
    destroy(): void;
  }
}

declare module "@editorjs/header" {
  export default class Header {}
}

declare module "@editorjs/paragraph" {
  export default class Paragraph {}
}

declare module "@editorjs/list" {
  export default class List {}
}

declare module "@editorjs/marker" {
  export default class Marker {}
}

declare module "@editorjs/underline" {
  export default class Underline {}
}

declare module "@editorjs/link" {
  export default class LinkTool {}
}
