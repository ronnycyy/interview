import { Dispatch } from 'redux';
import { generateCanvasService } from '../../services/canvasService';

export enum EDITOR_ACTION {
  INIT_CANVAS = '[EDITOR] INIT CANVAS',
  ADD_SHAPE = '[EDITOR] ADD SHAPE'
}

// dispatch一个对象
const initCanvas = (canvas) => ({
  type: EDITOR_ACTION.INIT_CANVAS,
  payload: canvas
});

const addShape = (shape) => ({
  type: EDITOR_ACTION.ADD_SHAPE,
  payload: shape
});

// dispatch一个函数
// redux副作用写法
const createInitCanvasAction = () => (dispatch: Dispatch<EditorActionType>) => {
  const canvas = generateCanvasService();
  dispatch(initCanvas(canvas));
}

export const editorAction = {
  createInitCanvasAction,
  addShape,
}

export type EditorActionType =
  ReturnType<typeof initCanvas> |
  ReturnType<typeof addShape>
  ;





