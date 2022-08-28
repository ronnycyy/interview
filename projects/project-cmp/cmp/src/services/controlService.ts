import { adjustArrow, initArrow } from "./arrowService";

const deleteHandler = (eventData, transform) => {
  const target = transform.target;
  const c = target.canvas;
  c.remove(target);
  c.requestRenderAll();

  return true;
}

const addHandler = (eventData, transform) => {
  const target = transform.target;
  const canvas = target.canvas;

  target.clone((cloned) => {

  });

  return true;
}

const initControls = () => {

}

export default initControls;
