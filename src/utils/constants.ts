import { SelectItem, TabItem } from "@/models/common";

export const LANGUAGES = {
  ENGLISH: "en",
  CROATIAN: "hr"
};

export const TABS = {
  UPLOADS: 1,
  OBJECTS: 2,
  IMAGES: 3,
  TEXT: 4,
  VIDEOS: 5,
  AUDIO: 6
};

export const TAB_ITEMS: Record<number, TabItem> = {
  [TABS.UPLOADS]: {
    value: TABS.UPLOADS,
    name: "Uploads",
    icon: "cloud-upload"
  },
  [TABS.OBJECTS]: {
    value: TABS.OBJECTS,
    name: "Objects",
    icon: "circle-multiple"
  },
  [TABS.IMAGES]: {
    value: TABS.IMAGES,
    name: "Images",
    icon: "image"
  },
  [TABS.TEXT]: {
    value: TABS.TEXT,
    name: "Text",
    icon: "format-text"
  },
  [TABS.VIDEOS]: {
    value: TABS.VIDEOS,
    name: "Videos",
    icon: "video"
  },
  [TABS.AUDIO]: {
    value: TABS.AUDIO,
    name: "Audio",
    icon: "music-note"
  }
};

export const EMOJIS = [
  "neutral",
  "devil",
  "nerd",
  "thinking",
  "rock",
  "clown",
  "sick",
  "laugh",
  "facepalm",
  "raised-eyebrow",
  "shrug",
  "yawn",
  "cry",
  "hot",
  "freeze",
  "groncho",
  "bait",
  "disco",
  "hand",
  "point",
  "alert",
  "blitz",
  "raised-finger",
  "fist",
  "wave"
];

export const SHAPES = [
  "arrow",
  "circle",
  "heart",
  "hexagon",
  "polygon",
  "rectangle",
  "star",
  "triangle"
];

export const AUDIO = ["beep", "epic-cinematic-trailer"];
export const IMAGES = ["drunkDriving", "redPill", "pizzaHat"];
export const VIDEOS = ["cats", "oldMan", "sigma", "risitas"];
export const SIZES = ["b", "kB", "MB", "GB", "TB"];

export const ALIGN_OPTIONS: Record<string, number> = {
  TOP: 1,
  CENTER_V: 2,
  BOTTOM: 3,
  LEFT: 4,
  CENTER_H: 5,
  RIGHT: 6
};

export const TIME_OPTIONS: SelectItem<number>[] = [
  {
    title: "0.5x",
    value: 1
  },
  {
    title: "1x",
    value: 2
  },
  {
    title: "1.5x",
    value: 3
  },
  {
    title: "2x",
    value: 4
  }
];

export const OUTPUT_FORMAT_OPTIONS: SelectItem<string>[] = [
  {
    title: "mp4",
    value: "mp4"
  }
];

export const CANVAS_PRESET_OPTIONS: SelectItem<string>[] = [
  {
    title: "Custom",
    value: "custom"
  },
  {
    title: "Youtube video",
    value: "ytVideo"
  },
  {
    title: "Facebook post",
    value: "fbPost"
  },
  {
    title: "Instagram video",
    value: "igVideo"
  },
  {
    title: "Twitter video",
    value: "twVideo"
  }
];

// export const CANVAS_PRESET_OPTIONS_DIMENSIONS: Record<
//   string,
//   { width: number; height: number }
// > = {
//   [CANVAS_PRESET_OPTIONS[0].value]: {
//     width: 800,
//     height: 450
//   },
//   [CANVAS_PRESET_OPTIONS[1].value]: {
//     width: 1920,
//     height: 1080
//   },
//   [CANVAS_PRESET_OPTIONS[2].value]: {
//     width: 1280,
//     height: 720
//   },
//   [CANVAS_PRESET_OPTIONS[3].value]: {
//     width: 1080,
//     height: 1920
//   },
//   [CANVAS_PRESET_OPTIONS[4].value]: {
//     width: 1280,
//     height: 720
//   }
// };

export const SNAP_CHECK_DIRECTION: Record<string, number> = {
  MIDDLE: 1,
  BOTTOM: 2,
  TOP: 3
};

export const LAYER_TYPE: Record<string, string> = {
  IMAGE: "image",
  TEXT: "text",
  EMOJI: "emoji",
  SHAPE: "shape",
  VIDEO: "video",
  UPLOAD: "upload",
  AUDIO: "audio"
};

export const LAYER_TYPE_ICON: Record<string, string> = {
  [LAYER_TYPE.IMAGE]: "🖼️",
  [LAYER_TYPE.TEXT]: "✏️",
  [LAYER_TYPE.VIDEO]: "🎥",
  [LAYER_TYPE.AUDIO]: "🎵"
};

export const LAYER_TYPE_COLOR: Record<string, string> = {
  [LAYER_TYPE.IMAGE]: "blue",
  [LAYER_TYPE.TEXT]: "pink",
  [LAYER_TYPE.VIDEO]: "transparent",
  [LAYER_TYPE.AUDIO]: "green"
};

const BASE_FORMATS = {
  horizontal: {
    width: 640,
    height: 360
  },
  vertical: {
    width: 360,
    height: 640
  },
  square: {
    width: 480,
    height: 480
  }
};

// Scale factors for different zoom levels
// const ZOOM_SCALE = {
//   '100': 0.75,  // At 100% zoom, scale down by 25%
//   '75': 1,      // At 75% zoom, use original size
//   '50': 1.5     // At 50% zoom, scale up by 50%
// };

export const CANVAS_PRESET_OPTIONS_DIMENSIONS = [
  {
    title: 'Horizontal (16:9)',
    value: 'horizontal',
    dimensions: {
      width: 640, 
      height: 360
    },
    image: 'public/assets/horizontal.svg',
  },
  {
    title: 'Vertical (9:16)',
    value: 'vertical',
    dimensions: {
      width: 360,
      height: 640
    },
    image: 'public/assets/portrait.svg',
  },
  {
    title: 'Square (1:1)',
    value: 'square',
    dimensions: {
      width: 480,
      height: 480
    },
    image: 'public/assets/square.svg',
  }
];

export const INITIAL_CANVAS_FORMAT = {
  width: 1920,
  height: 1080,
  format: 'horizontal'
};

// Validation
export const FILE_SIZE_LIMIT = 10_485_760; // 10 MB
export const MAX_ALLOWED_VIDEO_DURATION = 12_000; // 10 seconds

export const DEFAULT_DURATION = 20_000;
export const DEFAULT_ASSET_DURATION = 3_000;

export const DRAWER_WIDTH = 480;
export const LAYOUT_WIDTH = 380;
