/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { TEXT_NODE } from '../shared/HTMLNodeType';

/**
 * Gets the target node from a native browser event by accounting for
 * inconsistencies in browser DOM APIs.
 * 获取触发事件的目标DOM结点
 *
 * @param {object} nativeEvent Native browser event. 浏览器的原生事件对象
 * @return {DOMEventTarget} Target node. 触发事件的DOM结点
 */
function getEventTarget(nativeEvent) {
  // 在 IE9 下，目标为 nativeEvent.srcElement，以保证兼容性。
  // Fallback to nativeEvent.srcElement for IE9
  // https://github.com/facebook/react/issues/12506
  let target = nativeEvent.target || nativeEvent.srcElement || window;

  // Normalize SVG <use> element events #4963
  if (target.correspondingUseElement) {
    target = target.correspondingUseElement;
  }

  // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
  // @see http://www.quirksmode.org/js/events_properties.html
  // 兼容 Safari
  // 文本结点可能触发事件，此种情况下，获取它的父结点。
  return target.nodeType === TEXT_NODE ? target.parentNode : target;
}

export default getEventTarget;
