import { adjustArrow } from "./arrowService";
import { drawObjectGuides, onObjectMoving } from "./guideLineService";

export const generateCanvasService = () => {
  return {};
}

function onObjectMoved(obj, canvas) {
  // Add the smart guides around the object
  drawObjectGuides(obj, canvas);
}

function onObjectAdded(obj, canvas) {
  // Add the smart guides around the object
  drawObjectGuides(obj, canvas);
}

const getResponsiveSizeOfWindow = () => {
  return {}
}

const initGrid = (canvas) => {
  return {}
}

