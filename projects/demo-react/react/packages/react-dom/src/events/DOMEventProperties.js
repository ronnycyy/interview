/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { DOMEventName } from './DOMEventNames';

import { registerTwoPhaseEvent } from './EventRegistry';
import {
  ANIMATION_END,
  ANIMATION_ITERATION,
  ANIMATION_START,
  TRANSITION_END,
} from './DOMEventNames';

import { enableCreateEventHandleAPI } from 'shared/ReactFeatureFlags';

export const topLevelEventsToReactNames: Map<
  DOMEventName,
  string | null,
  > = new Map();

// NOTE: Capitalization is important in this list!
//
// E.g. it needs "pointerDown", not "pointerdown".
// This is because we derive both React name ("onPointerDown")
// and DOM name ("pointerdown") from the same list.
//
// Exceptions that don't match this convention are listed separately.
//
// prettier-ignore
// by ronny
// 注意：在这个列表中大写很重要！
// 例如，它需要“pointerDown”，而不是“pointerDown”。
// 这是因为我们派生了两个React名称（“onPointerDown”）和同一列表中的DOM名称（“pointerdown”）。
// 不符合此约定的例外情况单独列出。

// 这个插件列出了所有简单的事件
const simpleEventPluginEvents = [
  'abort',
  'auxClick',
  'cancel',
  'canPlay',
  'canPlayThrough',
  'click',
  'close',
  'contextMenu',
  'copy',
  'cut',
  'drag',
  'dragEnd',
  'dragEnter',
  'dragExit',
  'dragLeave',
  'dragOver',
  'dragStart',
  'drop',
  'durationChange',
  'emptied',
  'encrypted',
  'ended',
  'error',
  'gotPointerCapture',
  'input',
  'invalid',
  'keyDown',
  'keyPress',
  'keyUp',
  'load',
  'loadedData',
  'loadedMetadata',
  'loadStart',
  'lostPointerCapture',
  'mouseDown',
  'mouseMove',
  'mouseOut',
  'mouseOver',
  'mouseUp',
  'paste',
  'pause',
  'play',
  'playing',
  'pointerCancel',
  'pointerDown',
  'pointerMove',
  'pointerOut',
  'pointerOver',
  'pointerUp',
  'progress',
  'rateChange',
  'reset',
  'resize',
  'seeked',
  'seeking',
  'stalled',
  'submit',
  'suspend',
  'timeUpdate',
  'touchCancel',
  'touchEnd',
  'touchStart',
  'volumeChange',
  'scroll',
  'toggle',
  'touchMove',
  'waiting',
  'wheel',
];

if (enableCreateEventHandleAPI) {
  // Special case: these two events don't have on* React handler
  // and are only accessible via the createEventHandle API.
  // 特殊情况：这两个事件没有on*React处理程序，只能通过createEventHandleAPI访问。
  topLevelEventsToReactNames.set('beforeblur', null);
  topLevelEventsToReactNames.set('afterblur', null);
}

// domEventName: 原生事件名称
// reactName: React合成事件名称
function registerSimpleEvent(domEventName, reactName) {
  topLevelEventsToReactNames.set(domEventName, reactName);
  // 原生事件做成一个数组传入，注册冒泡、捕获 2 个阶段的事件
  registerTwoPhaseEvent(reactName, [domEventName]);
}

// 注册所有简单的事件
export function registerSimpleEvents() {
  for (let i = 0; i < simpleEventPluginEvents.length; i++) {
    // React合成事件名称
    const eventName = ((simpleEventPluginEvents[i]: any): string);
    // 原生事件名称
    const domEventName = ((eventName.toLowerCase(): any): DOMEventName);
    // React合成事件在需要小驼峰式
    const capitalizedEvent = eventName[0].toUpperCase() + eventName.slice(1);
    // 注册事件
    registerSimpleEvent(domEventName, 'on' + capitalizedEvent);
  }
  // Special cases where event names don't match.
  // 注册一些没有包含在`简单事件插件`中的事件，以提供兼容性。
  registerSimpleEvent(ANIMATION_END, 'onAnimationEnd');
  registerSimpleEvent(ANIMATION_ITERATION, 'onAnimationIteration');
  registerSimpleEvent(ANIMATION_START, 'onAnimationStart');
  registerSimpleEvent('dblclick', 'onDoubleClick');
  registerSimpleEvent('focusin', 'onFocus');
  registerSimpleEvent('focusout', 'onBlur');
  registerSimpleEvent(TRANSITION_END, 'onTransitionEnd');
}
