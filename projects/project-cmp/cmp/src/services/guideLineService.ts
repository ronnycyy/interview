
// 绘制引导线
export function drawObjectGuides(obj, canvas) {
  const w = obj.getScaledWidth();
  const h = obj.getScaledHeight();
  drawGuide("top", obj.top, obj, canvas);
  drawGuide("left", obj.left, obj, canvas);
  drawGuide("centerX", obj.left + w / 2, obj, canvas);
  drawGuide("centerY", obj.top + h / 2, obj, canvas);
  drawGuide("right", obj.left + w, obj, canvas);
  drawGuide("bottom", obj.top + h, obj, canvas);
  obj.setCoords();
}

function drawGuide(side, pos, obj, canvas) {
  return {};
}

export function onObjectMoving(e, canvas) {
  return {};
}

function inRange(a, b) {
  return Math.abs(a - b) <= 10;
}

function snapObject(obj, side, pos, canvas) {
  obj.set(side, pos);
  obj.setCoords();
  drawObjectGuides(obj, canvas);
}
