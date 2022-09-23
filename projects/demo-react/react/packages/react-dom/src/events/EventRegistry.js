/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { DOMEventName } from './DOMEventNames';

import { enableCreateEventHandleAPI } from 'shared/ReactFeatureFlags';

export const allNativeEvents: Set<DOMEventName> = new Set();

if (enableCreateEventHandleAPI) {
  allNativeEvents.add('beforeblur');
  allNativeEvents.add('afterblur');
}

/**
 * Mapping from registration name to event name
 * React合成事件映射成原生事件列表，如
 * {
 *   onAbort: ['abort'],
 *   onClick: ['click'],
 * }
 */
export const registrationNameDependencies = {};

/**
 * Mapping from lowercase registration names to the properly cased version,
 * used to warn in the case of missing event handlers. Available
 * only in __DEV__.
 * @type {Object}
 */
export const possibleRegistrationNames = __DEV__ ? {} : (null: any);
// Trust the developer to only use possibleRegistrationNames in __DEV__

// 注册冒泡、捕获 2 个阶段的事件
// registrationName: React事件
// dependencies: 原生事件列表
export function registerTwoPhaseEvent(
  registrationName: string,
  dependencies: Array<DOMEventName>,
): void {
  // 冒泡
  registerDirectEvent(registrationName, dependencies);
  // 捕获
  registerDirectEvent(registrationName + 'Capture', dependencies);
}

export function registerDirectEvent(
  registrationName: string,
  dependencies: Array<DOMEventName>,
) {
  if (__DEV__) {
    if (registrationNameDependencies[registrationName]) {
      console.error(
        'EventRegistry: More than one plugin attempted to publish the same ' +
        'registration name, `%s`.',
        registrationName,
      );
    }
  }

  // React合成事件 映射 它依赖的原生事件列表，如
  // {
  //   onAbort: ['abort'],
  //   onClick: ['click'],
  //   onChange: ['change', 'click', 'focusin', 'focusout', 'input', 'keydown', 'keyup', 'selectionchange'],
  //   ...
  // }
  registrationNameDependencies[registrationName] = dependencies;

  if (__DEV__) {
    const lowerCasedName = registrationName.toLowerCase();
    possibleRegistrationNames[lowerCasedName] = registrationName;

    if (registrationName === 'onDoubleClick') {
      possibleRegistrationNames.ondblclick = registrationName;
    }
  }

  for (let i = 0; i < dependencies.length; i++) {
    // 把所有原生事件加入到集合里，后续注册时，遍历此集合即可。
    allNativeEvents.add(dependencies[i]);
  }
}
