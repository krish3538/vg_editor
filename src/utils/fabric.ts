import { ALIGN_OPTIONS, SNAP_CHECK_DIRECTION, CANVAS_PRESET_OPTIONS_DIMENSIONS } from "@/utils/constants";
import { fabric } from "fabric";

// export const checkVSnap = (
//   lineV: fabric.Line | null,
//   artBoardLeft: number,
//   artBoardWidth: number,
//   a: number,
//   b: number,
//   snapZone: number,
//   e: fabric.IEvent<MouseEvent>,
//   type: number
// ) => {
//   if (a > b - snapZone && a < b + snapZone) {
//     const height = e.target?.get("height") as number;
//     const scaleY = e.target?.get("scaleY") as number;
//     lineV!.opacity = 1;
//     lineV?.bringToFront();
//     let value = b;

//     if (type == SNAP_CHECK_DIRECTION.BOTTOM) {
//       value = b - (height * scaleY) / 2;
//     } else if (type == SNAP_CHECK_DIRECTION.TOP) {
//       value = b + (height * scaleY) / 2;
//     }

//     e.target
//       ?.set({
//         top: value
//       })
//       .setCoords();
//     lineV!
//       .set({
//         y1: b,
//         x1: artBoardLeft,
//         y2: b,
//         x2: artBoardWidth + artBoardLeft
//       })
//       .setCoords();
//   }
// };

// export const checkHSnap = (
//   lineH: fabric.Line | null,
//   artBoardTop: number,
//   artBoardHeight: number,
//   a: number,
//   b: number,
//   snapZone: number,
//   e: fabric.IEvent<MouseEvent>,
//   type: number
// ) => {
//   if (a > b - snapZone && a < b + snapZone) {
//     const width = e.target?.get("height") as number;
//     const scaleX = e.target?.get("scaleX") as number;
//     lineH!.opacity = 1;
//     lineH?.bringToFront();
//     let value = b;

//     if (type == SNAP_CHECK_DIRECTION.BOTTOM) {
//       value = b - (width * scaleX) / 2;
//     } else if (type == SNAP_CHECK_DIRECTION.TOP) {
//       value = b + (width * scaleX) / 2;
//     }

//     e.target
//       ?.set({
//         left: value
//       })
//       .setCoords();
//     lineH!
//       .set({
//         x1: b,
//         y1: artBoardTop,
//         x2: b,
//         y2: artBoardHeight + artBoardTop
//       })
//       .setCoords();
//   }
// };

export const getObjectById = (
  fabricCanvas: fabric.Canvas | null,
  id: string
) => {
  let object = null;
  const allObjects = fabricCanvas!.getObjects();
  for (let i = 0; i < fabricCanvas!.size(); i++) {
    if (allObjects[i].get("type") == "group") {
      //@ts-ignore
      if (allObjects[i].get("id") && allObjects[i].get("id") === id) {
        object = allObjects[i];
        break;
      }
      const wip = i;
      //@ts-ignore
      for (let o = 0; o < allObjects[i]._objects.length; o++) {
        if (
          //@ts-ignore
          allObjects[wip]._objects[o].id &&
          //@ts-ignore
          allObjects[wip]._objects[o].id === id
        ) {
          //@ts-ignore
          object = allObjects[wip]._objects[o];
          break;
        }
      }
      //@ts-ignore
    } else if (allObjects[i].id && allObjects[i].id === id) {
      object = allObjects[i];
      break;
    }
  }
  return object;
};

export const centerLines = (
  e: fabric.IEvent<MouseEvent>,
  lineH: fabric.Line | null,
  lineV: fabric.Line | null,
  fabricCanvas: fabric.Canvas | null,
  artBoardTop: number,
  artBoardLeft: number,
  artBoardWidth: number,
  artBoardHeight: number
) => {
  lineH!.opacity = 0;
  lineV!.opacity = 0;
  fabricCanvas!.renderAll();

  const snapZone = 5;
  const targetLeft = e.target?.left as number;
  const targetTop = e.target?.top as number;
  const targetWidth =
    (e.target?.get("width") as number) * (e.target?.get("scaleX") as number);
  const targetHeight =
    (e.target?.get("height") as number) * (e.target?.get("scaleY") as number);

  fabricCanvas!.forEachObject((obj) => {
    if (obj != e.target && obj != lineH && obj != lineV) {
      const left = obj.get("left") as number;
      const top = obj.get("top") as number;
      const width = obj.get("width") as number;
      const height = obj.get("height") as number;
      const scaleX = obj.get("scaleX") as number;
      const scaleY = obj.get("scaleY") as number;

      //@ts-ignore
      // if (obj.get("id") == "centerH" || obj.get("id") == "centerV") {
      //   checkHSnap(
      //     lineH,
      //     artBoardTop,
      //     artBoardHeight,
      //     targetLeft,
      //     left,
      //     snapZone,
      //     e,
      //     1
      //   );
      //   checkVSnap(
      //     lineV,
      //     artBoardLeft,
      //     artBoardWidth,
      //     targetTop,
      //     top,
      //     snapZone,
      //     e,
      //     1
      //   );
      //   fabricCanvas?.renderAll();
      // } else {
      //   const checkLeft = [
      //     [targetLeft, left, SNAP_CHECK_DIRECTION.MIDDLE],
      //     [
      //       targetLeft,
      //       left + (width * scaleX) / 2,
      //       SNAP_CHECK_DIRECTION.MIDDLE
      //     ],
      //     [
      //       targetLeft,
      //       left - (width * scaleX) / 2,
      //       SNAP_CHECK_DIRECTION.MIDDLE
      //     ],
      //     [targetLeft + targetWidth / 2, left, SNAP_CHECK_DIRECTION.BOTTOM],
      //     [
      //       targetLeft + targetWidth / 2,
      //       left + (width * scaleX) / 2,
      //       SNAP_CHECK_DIRECTION.BOTTOM
      //     ],
      //     [
      //       targetLeft + targetWidth / 2,
      //       left - (width * scaleX) / 2,
      //       SNAP_CHECK_DIRECTION.BOTTOM
      //     ],
      //     [targetLeft - targetWidth / 2, left, SNAP_CHECK_DIRECTION.TOP],
      //     [
      //       targetLeft - targetWidth / 2,
      //       left + (width * scaleX) / 2,
      //       SNAP_CHECK_DIRECTION.TOP
      //     ],
      //     [
      //       targetLeft - targetWidth / 2,
      //       left - (width * scaleX) / 2,
      //       SNAP_CHECK_DIRECTION.TOP
      //     ]
      //   ];

      //   const checkTop = [
      //     [targetTop, top, SNAP_CHECK_DIRECTION.MIDDLE],
      //     [targetTop, top + (height * scaleY) / 2, SNAP_CHECK_DIRECTION.MIDDLE],
      //     [targetTop, top - (height * scaleY) / 2, SNAP_CHECK_DIRECTION.MIDDLE],
      //     [targetTop + targetHeight / 2, top, SNAP_CHECK_DIRECTION.BOTTOM],
      //     [
      //       targetTop + targetHeight / 2,
      //       top + (height * scaleY) / 2,
      //       SNAP_CHECK_DIRECTION.BOTTOM
      //     ],
      //     [
      //       targetTop + targetHeight / 2,
      //       top - (height * scaleY) / 2,
      //       SNAP_CHECK_DIRECTION.BOTTOM
      //     ],
      //     [targetTop - targetHeight / 2, top, SNAP_CHECK_DIRECTION.TOP],
      //     [
      //       targetTop - targetHeight / 2,
      //       top + (height * scaleY) / 2,
      //       SNAP_CHECK_DIRECTION.TOP
      //     ],
      //     [
      //       targetTop - targetHeight / 2,
      //       top - (height * scaleY) / 2,
      //       SNAP_CHECK_DIRECTION.TOP
      //     ]
      //   ];

      //   for (let i = 0; i < checkLeft.length; i++) {
      //     const [aLeft, bLeft, type1] = checkLeft[i];
      //     const [aTop, bTop, type2] = checkTop[i];
      //     checkHSnap(
      //       lineH,
      //       artBoardTop,
      //       artBoardHeight,
      //       aLeft,
      //       bLeft,
      //       snapZone,
      //       e,
      //       type1
      //     );
      //     checkVSnap(
      //       lineV,
      //       artBoardLeft,
      //       artBoardWidth,
      //       aTop,
      //       bTop,
      //       snapZone,
      //       e,
      //       type2
      //     );
      //   }
      // }
    }
  });
};

// export const setCanvasAspectRatio = (
//   fabricCanvas: fabric.Canvas | null,
//   artBoard: fabric.Rect | null,
//   aspectRatio: keyof typeof CANVAS_ASPECT_RATIOS
// ) => {
//   if (fabricCanvas && artBoard) {
//     const dimensions = CANVAS_ASPECT_RATIOS[aspectRatio];
    
//     artBoard.set({
//       width: dimensions.width,
//       height: dimensions.height,
//       left: fabricCanvas.getWidth() / 2 - dimensions.width / 2,
//       top: fabricCanvas.getHeight() / 2 - dimensions.height / 2
//     });

//     artBoard.center();
//     fabricCanvas.renderAll();
    
//     return dimensions;
//   }
//   return null;
// };

export const setCanvasFormat = (
  fabricCanvas: fabric.Canvas | null,
  artBoard: fabric.Rect | null,
  format: string
) => {
  if (fabricCanvas && artBoard) {
    const selectedFormat = CANVAS_PRESET_OPTIONS_DIMENSIONS.find(f => f.value === format);
    if (selectedFormat) {
      const { width, height } = selectedFormat.dimensions;
      
      artBoard.set({
        width,
        height,
        left: fabricCanvas.getWidth() / 2 - width / 2,
        top: fabricCanvas.getHeight() / 2 - height / 2
      });

      artBoard.center();
      fabricCanvas.renderAll();
      
      return selectedFormat.dimensions;
    }
  }
  return null;
};

// export const setCanvasPreset = (
//   fabricCanvas: fabric.Canvas | null,
//   artBoard: fabric.Rect | null,
//   preset: string
// ) => {
//   if (fabricCanvas && artBoard) {
//     const dimensions = CANVAS_PRESET_OPTIONS_DIMENSIONS[preset];
    
//     // Update artboard dimensions
//     artBoard.set({
//       width: dimensions.width,
//       height: dimensions.height,
//       left: fabricCanvas.getWidth() / 2 - dimensions.width / 2,
//       top: fabricCanvas.getHeight() / 2 - dimensions.height / 2
//     });

//     // Center artboard and update canvas
//     artBoard.center();
//     fabricCanvas.renderAll();
    
//     return dimensions;
//   }
//   return null;
// };

export const initializeFabric = (
  canvas: HTMLCanvasElement | null,
  width: number,
  height: number,
  backgroundColor: string,
  format: string = CANVAS_PRESET_OPTIONS_DIMENSIONS[0].value
) => {
  const fCanvas = new fabric.Canvas(canvas, {
    width,
    height,
    backgroundColor,
    preserveObjectStacking: true,
    stateful: true,
    selection: false,
    controlsAboveOverlay: true,
    selectionColor: "#2e73fc10",
    selectionBorderColor: "#629bff80",
    selectionLineWidth: 1.5
  });

  // Set default object properties
  fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: "#51B9F9",
    cornerColor: "#FFF",
    borderScaleFactor: 2.5,
    cornerStyle: "circle",
    cornerStrokeColor: "#0E98FC",
    borderOpacityWhenMoving: 1
  });

  // Apply format dimensions
  const selectedFormat = CANVAS_PRESET_OPTIONS_DIMENSIONS.find(f => f.value === format);
  if (selectedFormat) {
    fCanvas.setDimensions(selectedFormat.dimensions);
  }

  return fCanvas;
};

export const calculateTextWidth = (
  canvasContext: CanvasRenderingContext2D,
  text: string,
  font: string
) => {
  canvasContext.font = font;
  return canvasContext.measureText(text).width + 10;
};

// export const alignActiveObject = (
//   activeObject: fabric.Object | null,
//   option: number,
//   artBoard: fabric.Rect | null,
//   canvas: fabric.Canvas | null
// ) => {
//   if (activeObject && artBoard && canvas) {
//     const objectHeight = activeObject.get("height") as number;
//     const objectWidth = activeObject.get("width") as number;
//     const objectScaleY = activeObject.get("scaleY") as number;
//     const objectScaleX = activeObject.get("scaleX") as number;
//     const isTextBox = activeObject.type === "textbox";
//     const artBoardTop = artBoard.get("top") as number;
//     const artBoardLeft = artBoard.get("left") as number;
//     const artBoardHeight = artBoard.get("height") as number;
//     const artBoardWidth = artBoard.get("width") as number;

//     // switch (option) {
//     //   case ALIGN_OPTIONS.TOP:
//     //     activeObject.set(
//     //       "top",
//     //       artBoardTop + (objectHeight * objectScaleY) / 2
//     //     );
//     //     break;
//     //   case ALIGN_OPTIONS.CENTER_V:
//     //     activeObject.set(
//     //       "top",
//     //       artBoardTop +
//     //         artBoardHeight / 2 -
//     //         (isTextBox ? 0 : (objectHeight * objectScaleY) / 2)
//     //     );
//     //     break;
//     //   case ALIGN_OPTIONS.BOTTOM:
//     //     activeObject.set(
//     //       "top",
//     //       artBoardTop + artBoardHeight - (objectHeight * objectScaleY) / 2
//     //     );
//     //     break;
//     //   case ALIGN_OPTIONS.LEFT:
//     //     activeObject.set(
//     //       "left",
//     //       artBoardLeft + (objectWidth * objectScaleX) / 2
//     //     );
//     //     break;
//     //   case ALIGN_OPTIONS.CENTER_H:
//     //     activeObject.set(
//     //       "left",
//     //       artBoardLeft +
//     //         artBoardWidth / 2 -
//     //         (isTextBox ? 0 : (objectWidth * objectScaleX) / 2)
//     //     );
//     //     break;
//     //   case ALIGN_OPTIONS.RIGHT:
//     //     activeObject.set(
//     //       "left",
//     //       artBoardLeft + artBoardWidth - (objectWidth * objectScaleX) / 2
//     //     );
//     //     break;
//     // }
//     canvas.renderAll();
//   }
// };
