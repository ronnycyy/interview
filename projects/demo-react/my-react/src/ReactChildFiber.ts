import { Deletion, Placement } from './ReactFiberFlags';
import { IFiber, IProps, IReactElement } from "./models";
import { REACT_ELEMENT_TYPE } from "./ReactSymbols";
import { createFiberFromElement, createWorkInProgress } from './ReactFiber';

/**
 * 协调子 fiber 结点。
 * 
 * @param shouldTrackSideEffects 是否追踪副作用
 */
function childReconciler(shouldTrackSideEffects: boolean) {
  // 函数里面又声明函数，你看 React 也这么写。。

  /**
   * 老fiber 的真实DOM，在新 DOM 树里不存在了，标记老fiber为删除。
   * @param returnFiber workInProgress (新child的爹)
   * @param childToDelete current的某个child
   */
  function deleteChild(returnFiber: IFiber, childToDelete: IFiber) {
    // 初次挂载不需要判断
    if (!shouldTrackSideEffects) {
      return;
    }
    // 把自己这个副作用添加到父 effectList 尾。
    const lastEffect = returnFiber.lastEffect;
    if (lastEffect) {
      // 父有 effectList, 追加到尾。
      lastEffect.nextEffect = childToDelete;
      // 更新尾指针
      returnFiber.lastEffect = childToDelete;
    } else {
      // 父没有 effectList，新建一条。
      returnFiber.lastEffect = returnFiber.firstEffect = childToDelete;
    }
    // 要删掉了所以清空副作用链
    childToDelete.nextEffect = null;
    // 标记删除
    childToDelete.flags = Deletion;
  }

  /**
   * 自己和弟弟们都标记为删除
   * @param returnFiber 父结点
   * @param childToDelete 自己
   */
  function deleteRemainingChildren(returnFiber: IFiber, childToDelete: IFiber) {
    while (childToDelete) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
  }

  /**
   * 根据新属性复用老fiber
   * @param oldFiber 待复用的老fiber
   * @param pendingProps 新属性
   */
  function useFiber(oldFiber: IFiber, pendingProps: IProps) {
    const clone = createWorkInProgress(oldFiber, pendingProps);
    clone.sibling = null;
    return clone;
  }

  /**
   * 
   * 单结点 DIFF
   * 
   * 🔥🔥🔥 所谓单/多结点 DIFF，指的是新结点！新结点单个就是单结点diff，新结点多个就是多结点diff!
   * 
   * 协调单个子结点 (单个子结点指的是: 新虚拟DOM是单结点，老fiber可能有多个。)
   * 
   * 比如:
   * 更新前 li1,li2,li3,li4
   * 更新后 li2
   * 那么就比较 li1<->li2❌(Deletion), li2<->li2✅(复用), li3(Deletion), li4(Deletion)
   * 
   * @param returnFiber 新产生 fiber 的 父结点 (workInProgress)
   * @param currentFirstChild 老 fiber 的大儿子 (current.child)
   * @param newChild 要渲染的虚拟DOM (单个ReactElement)
   */
  function reconcileSingleElement(returnFiber: IFiber, currentFirstChild: IFiber | null, newChild: IReactElement) {

    // 新虚拟DOM的key (key主要用来处理`移动`的情况，更新前后key一样说明是同一个元素)
    const newKey = newChild.key;
    // 第一个老fiber结点
    let child = currentFirstChild;
    while (child) {
      if (child.key === newKey) {
        // 如果 老fiber的key 和 新fiber的key 相同，说明新老结点是同一个元素。

        if (child.type === newChild.type) {
          // type 还相同，复用child，child的弟弟们都不要了(key绝对不同)，全标记为删除。

          // 从child的弟弟开始，往后都标记删除。
          deleteRemainingChildren(returnFiber, child.sibling);
          // 根据新属性，复用 child。
          // 注意🔥🔥🔥 这时新老fiber的stateNode都指向老视图！后续更新就是在老视图上更新!
          const existing = useFiber(child, newChild.props);
          // 产生的是 workInProgress 的子结点，所以连上 workInProgress。
          existing.return = returnFiber;
          // 使用这个复用的结点，下面的流程都不用走了。
          return existing;
        }
        else {
          // type 不同，自己和弟弟们都标记为删除 (自己type不同，弟弟们key不同)。
          deleteRemainingChildren(returnFiber, child);
          // 都删了，后面弟弟们不用匹配了
          // 直接跳到外面，这一层老的都没有能用的，所以新建 fiber 结点。
          break;
        }
      }
      else {
        // 如果 老fiber的key 和 新fiber的key 不相同，说明新老结点不是同一个元素，更新后又是单结点，说明老结点已经不存在了，标记删除。
        // 老大不要了，接下来和老二比较，老二是有可能和 新fiber 相同的。
        // 比如: 更新前 li1,li2,li3;  更新后 li2, 那么 li1 可以标记删除。
        deleteChild(returnFiber, child);
      }
      // 新虚拟DOM继续和弟弟们比较
      child = child.sibling;
    }

    // 根据 虚拟DOM 创建 fiber 结点。
    const created = createFiberFromElement(newChild);
    // 作为 子结点 连上 workInRrogress
    created.return = returnFiber;
    return created;
  }

  /**
   * @param newFiber 新创建的 Fiber 结点 (workInProgress.child)
   */
  function placeSingleChild(newFiber: IFiber) {
    if (shouldTrackSideEffects && !newFiber.alternate) {
      // 要追踪副作用 而且 替身不存在, 说明这是一个新增的结点，需要插入 DOM。
      // 打上`插入`标记，在`提交阶段`插入新的 DOM。
      // 删除的副作用在 reconcileSingleElement 里已经标记了，所以`删`先放进的 effectList，最后执行 DOM 操作的顺序是: 先删后建。
      newFiber.flags = Placement;
    }
    return newFiber;
  }

  /**
   * 根据虚拟DOM创建 returnFiber 的 子fiber
   * @param returnFiber 待创建子结点的父fiber
   * @param newChild 子结点来源: 虚拟DOM
   */
  function createChild(returnFiber: IFiber, newChild: IReactElement) {
    // ReactElement 转 Fiber
    const created = createFiberFromElement(newChild);
    created.return = returnFiber;
    returnFiber.child = created;
    return created;
  }

  /**
   * 根据老fiber和新虚拟DOM，复用/新建 fiber 返回新fiber。
   * 
   * @param returnFiber workInProgress  新ul
   * @param oldFiber current.child  老liA
   * @param newReactElement 新虚拟DOM  新liA
   */
  function updateElement(returnFiber: IFiber, oldFiber: IFiber, newReactElement: IReactElement) {
    if (oldFiber) {
      if (oldFiber.type === newReactElement.type) {
        // key,type都一样，复用, 如  liA => liA
        // TODO: 调试一下，复用了 stateNode?
        const existing = useFiber(oldFiber, newReactElement.props);
        existing.return = returnFiber;
        return existing;   // 新liA
      }
    }
    // 如果没有老fiber, 创建一个fiber结点。如 null -> pB
    // 如果老fiber的type 和 新fiber的type 不同，如 liB -> pB, 也创建一个新fiber (pB)。
    const created = createFiberFromElement(newReactElement);
    created.return = returnFiber;
    return created;
  }

  /**
   * 1. 把新fiber放在newIdx索引的位置，为`移动`的情况作准备
   * 2. 给新建的 fiber加 Placement 标记
   * 3. 返回最近的`被复用的oldFiber`的索引。
   * 
   * @param newFiber 新fiber
   * @param lastPlacedIndex 上一个被复用的老fiber的索引
   * @param newIdx 新索引
   */
  function placeChild(newFiber: IFiber, lastPlacedIndex: number, newIdx: number) {
    newFiber.index = newIdx;
    if (!shouldTrackSideEffects) {
      // mountChildFibers
      return lastPlacedIndex;
    }
    const current = newFiber.alternate;
    if (current) {
      // update
      // 如果有 current 说明是复用老结点的DOM，不会添加 flags。
      // 比如 liA#1 => liA#1, key,type 都相同，进到这里，所以，仅仅是加了一个 index 而已。
      // 本次被复用的老fiber的索引
      const thisReuseOldIndex = current.index;
      // 多结点 DOM DIFF 精髓
      if (thisReuseOldIndex < lastPlacedIndex) {
        // 移动DOM
        // 结点是从左往右遍历的，index 不断变大，`本次复用的oldFiber`本应该在`最后一个可复用的oldFiber`右边，却发现它在`最后一个可复用的oldFiber`左边，说明`本次复用的oldFiber`在更新后向右移动了。
        // Placement 最终调用 appendChild 或 insertBefore，在有老DOM的情况下，表现出来就是`移动`，所以这里用 Placement 没错。
        newFiber.flags |= Placement;
        return lastPlacedIndex;
      } else {
        // `本次复用的oldFiber`就在`最后一个可复用的oldFiber`右边，正常，无需移动。
        // 返回`本次复用的oldFiber`的索引，给上层函数更新 `本轮DOM DIFF的最后一个可复用的oldFiber`。
        return thisReuseOldIndex;
      }
    } else {
      // mount
      // 插入DOM
      // 如 liB -> pB, pB 这个 fiber 是新建的，就在这里加了 Placement。
      // 加标记，就在 beginWork 的 DOM DIFF 阶段💡
      newFiber.flags = Placement;
      // 新增的结点，没有老结点对应，维护原来的`本轮DOM DIFF的最后一个可复用的oldFiber`。
      return lastPlacedIndex;
    }
  }

  /**
   * 生成 workInProgress.child, 看看能不能复用 current.child。
   * @param returnFiber workInProgress  新ul
   * @param oldFiber current.child  老liA
   * @param newReactElement 新虚拟DOM  新liA
   */
  function updateSlot(returnFiber: IFiber, oldFiber: IFiber, newReactElement: IReactElement) {
    const key = oldFiber ? oldFiber.key : null;
    if (newReactElement.key === key) {
      // key 一样说明更新前后是同一个元素
      // 可能 type 相同，也可能 type 不同，但是，总要返回一个 fiber。
      return updateElement(returnFiber, oldFiber, newReactElement);
    } else {
      return null;
    }
  }

  /**
   * 多结点 DIFF  
   * 
   * React Dom Diff 的三个规则:
   * 1. 只比较同级元素，不对比不同层级。
   * 2. 不同类型对应不同元素，如 div 和 span。
   * 3. 通过 key 来标识更新前后是同一个结点。
   * 
   * 时间复杂度 O(N)  同一层上的编辑距离问题？
   * 第一轮遍历 (处理更新)
   * 第二轮遍历 (处理新增和删除)
   * 第三轮遍历 (处理移动)
   * 
   * 情况一、处理更新:  
   * 更新前
   * ul
   * liA liB liC
   * 更新后
   * ul
   * liA pB liC
   * 流程 
   * liA <-> liA  key,type 都相同  => 复用
   * liB <-> pB   key相同,但是type不同  => 不能复用，删除老结点，插入新结点
   * liC <-> liC  key,type 都相同  => 复用
   * 副作用链是啥？ 删除B,复用A,新建P,复用C
   * 
   * 
   * 情况二、处理新增
   * liA,liB,liC  => liA,liB,liC,liD
   * 
   * 
   * 
   * 🔥🔥🔥 所谓单/多结点 DIFF，指的是新结点！新结点单个就是单结点diff，新结点多个就是多结点diff!
   * 
   * @param returnFiber workInProgress，是即将新生成的这群结点的父, 如 ul。
   * @param currentFirstChild 老 fiber 的大儿子，如 null  (本次更新: ul>null => ul>li*3)
   * @param newReactElements 多个新的虚拟DOM，用来和 oldChilds 比较，如 [liA,liB,liC]。
   */
  function reconcileChildrenArray(returnFiber: IFiber, currentFirstChild: IFiber | null, newReactElements: Array<IReactElement>) {
    // 将要返回的第一个新fiber
    let resultingFirstChild = null;
    // 上一个新fiber
    let perviousNewFiber: IFiber = null;
    // 第一个老fiber
    let oldFiber = currentFirstChild;
    // 下一个老fiber
    let nextOldFiber = null;
    // 新的虚拟DOM的索引
    let newIdx = 0;
    // 多对多比较过程，最后一个可复用的结点在 oldFibers 中的位置索引。
    let lastPlacedIndex = 0;

    // 第一步，同时遍历新老结点，处理更新 (newIdx++, oldFiber = oldFiber.sibling)
    // 第一轮遍历，处理`更新`的情况: 老fiber和新fiber都存在  liA,liB,liC => liA,pB,liC
    // 遍历新fiber (实际上是新的ReactElement)
    for (; oldFiber && newIdx < newReactElements.length; newIdx++) {
      // 先缓存下一个老fiber
      nextOldFiber = oldFiber.sibling;
      // 试图复用老fiber
      const newFiber = updateSlot(returnFiber, oldFiber, newReactElements[newIdx]);
      if (!newFiber) {
        // key不一样，直接跳出第一轮循环。
        break;
      }
      // liB -> pB，删掉 liB
      if (oldFiber && !newFiber.alternate) {
        // newFiber是新建的，如上例的 pB
        // 删掉 oldFiber (主要是删真实DOM)，如上例的 liB
        deleteChild(returnFiber, oldFiber);
      }
      // key一样
      // 核心是给 新fiber 加一个 Placement 标记。 比如 liB -> pB，pB是新建的fiber，需要加一个 Placement。
      // 所以，liB -> pB 的例子，副作用顺序是: 删除liB, 插入pB
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      // 新儿子用sibling连起来
      if (!perviousNewFiber) {
        // 如果没有上一个新fiber, 说明这一个是大儿子。
        resultingFirstChild = newFiber;
      } else {
        // 上一个连上这一个，最后所有新的子结点连起来: liA->liB->liC->null
        perviousNewFiber.sibling = newFiber;
      }
      // 给下一个新的子结点使用
      perviousNewFiber = newFiber;
      // 继续循环，去看下一组新老fiber  liA,liB,liC => liA,pB,liC   (老走到liB, 新走到pB(newIdx++))
      oldFiber = nextOldFiber;
    }

    // 第二步，删除多余的老结点 (遍历剩余老结点)

    // 新的已经遍历完了，剩下还有很多老的，都不会再用了，都标记为删除。
    if (newIdx === newReactElements.length) {
      deleteRemainingChildren(returnFiber, oldFiber);
      // 把新的大儿子返回，本情况的 DOM DIFF 结束。
      return resultingFirstChild;
    }

    // 第三步，增加新来的结点 (遍历剩余新结点)

    // 没有 oldFiber了，进第二轮循环，处理`增加`的情况
    if (!oldFiber) {
      // 如果没有老fiber了，循环虚拟DOM数组，为每个虚拟DOM创建一个新Fiber。
      // 0(老) 对 多(新)
      for (; newIdx < newReactElements.length; newIdx++) {
        // 第一轮循环对于这个例子 liA,liB,liC => liA,liB,liC,liD, 有如下情况:
        // liA 对 liA, liB 对 liB, liC 对 liC, 最后 空 对 liD, 这时候的 liD 就走到这里来了
        // 创建一个 liD, 给 liD 加 Placement 标记
        const newFiber = createChild(returnFiber, newReactElements[newIdx]);  // liA
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        // newFiber.flags = Placement;  [首次挂载]  源码没有在这里加标记, 而是到 ReactFiberCompleteWork.ts 里去: completeWork.appendAllChildren
        if (!perviousNewFiber) {
          // 如果没有上一个新fiber, 说明这一个是大儿子。
          resultingFirstChild = newFiber;
        } else {
          // 上一个连上这一个，最后所有新的子结点连起来: liA->liB->liC->null
          perviousNewFiber.sibling = newFiber;
        }
        // 给下一个新的子结点使用
        perviousNewFiber = newFiber;
      }
      // 返回大儿子
      return resultingFirstChild;
    }


    // 第四步，处理移动的情况

    /**
     * 第三轮循环，处理`移动` (精华!!) 
     * 
     * 例子:
     * liA,liB,liC,liD,liE,liF  => liA,liC,liE,liB,liG,liD
     *  0   1   2   3   4   5       0   1   2   3   4   5
     * 
     * 最终结果: 
     * (删除_li#F)->(插入_li#B)->(插入_li#G)->(插入_li#D)->null
     *               移动                       移动
     * 特点:
     * React 总是先删除结点, 然后按从左往右的顺序，插入结点，`插入`在老DOM存在的情况下，就是`移动`。
     * 
     * 步骤:
     * 0. 第一轮循环，liA => liA 复用。
     * 1. key 不同跳出, 此时比较的是 liB => liC, newIdx为1。
     * 2. 新的还没有遍历完，所以不会进 deleteRemainingChildren(..)。
     * 3. 还有 oldFiber，所以，跳过第二轮循环。
     * 4. 将剩下的 oldFibers 都放入 oldMap 中(<oldFiber.key || oldFiber.index, oldFiber>), 得到  Map{(B,liB), (C,liC), (D,liD), (E,liE), (F,liF)}
     * 5. 遍历新结点, 在 oldMap 中找是否有可复用的老结点, (可复用指key相同、并且type相同)。
     *    5.1 如果有，复用老 fiber，在 oldMap 中删掉老 fiber (已经复用过了，没有再查找的必要)。
     *  同时，比较 oldFiber.index 和 lastPlacedIndex (lastPlacedIndex 代表`最后一个可复用的结点在 oldFibers 中的位置索引`), 
     * 由于结点是从左往右遍历的，在没有移动的情况下，新老 index 应该同步变大，`本次复用的oldFiber`应该在`最后一个可复用的oldFiber`右边，
     * 也就是说 oldFiber.index 应该 >= lastPlacedIndex，但是比较结果有两种情况:
     * 
     *     5.1.1 oldFiber.index < lastPlacedIndex, 说明 `本次复用的oldFiber` 在`最后一个可复用的oldFiber`左边，
     * 也就说明`本次复用的oldFiber`在更新后向右移动了，所以 newFiber 标记为`移动`, lastPlacedIndex 不变。
     *     5.1.2 oldFiber.index >= lastPlacedIndex, 说明 `本次复用的oldFiber` 在`最后一个可复用的oldFiber`右边，
     * 这说明 `本次复用的oldFiber` 没有移动, 本次复用的oldFiber`要作为`最后一个可复用的oldFiber`给下一轮循环的 oldFiber 作参照物，
     * 所以更新 lastPlacedIndex 为 oldFiber.index。
     *     
     *    5.2 如果没有，创建新的 fiber。
     * 
     *                  0        1       2              3                 4             5
     *                  A        B       C              D                 E             F   
     *                  A        C       E              B                 G             D
     *                 复用     复用     复用         复用(移动)            插入        复用(移动)
     * lastPlaceIndex   0        2       4              4                 4             4
     *                 >=       >=      >=    oldIndex < lastPlacedIndex       oldIndex < lastPlacedIndex
     * 
     * 现象: 
     * React 会把 DOM结点往后移动, 不会往前移动。
     * 
     * 比如: 
     * liA,liB,liC,liD,liE => liE,liA,liB,liC,liD, lastPlacedIndex 一开始就来到最大的`4`，后面都比它小，全部移动，
     * 也就是说，实际DOM操作是: liE不动，liA,liB,liC,liD 全部向后移动。
     * 
     * 启发:
     * 我们在开发过程要尽量少把结点往前移动，因为实际上 React 不会动该结点，而是把它右边的结点，全部往后移。
     * 
     * 6. 删除 oldMap 中剩余的结点。
    */
    // 剩下的老的放进 map
    const oldExistingChildMap = mapRemainingChildren(returnFiber, oldFiber);  // oldFiber 及其往后是剩余的老fiber
    for (; newIdx < newReactElements.length; newIdx++) {
      /**
       * 查找有没有可复用的老结点:
       *    如果没有, 新建结点，插入。
       *    如果有，复用老结点，检查老结点是否移动。
       * 注意: 插入和移动都是 Placement 标记，因为 appendChild 和 insertBefore 在老DOM存在的情况下，表现出来就是`移动`。
       * 
       
       */
      const newFiber = updateFromMap(oldExistingChildMap, returnFiber, newIdx, newReactElements[newIdx]);
      if (newFiber) {
        if (newFiber.alternate) {
          // 新fiber复用了老fiber, 因为如果没有复用，新fiber的 alternate 是null。
          // 老 fiber 已经找到对应的新 fiber，没有再查找的必要了 删掉 map 里的老 fiber。
          oldExistingChildMap.delete(newFiber.key || newIdx as unknown as string);
        }
        // 如果 oldFiber.index >= lastPlacedIndex，更新 lastPlacedIndex;
        // 如果 oldFiber.index <  lastPlacedIndex，维持 lastPlacedIndex。(标记移动)
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        // 新儿子用sibling连起来
        if (!perviousNewFiber) {
          // 如果没有上一个新fiber, 说明这一个是大儿子。
          resultingFirstChild = newFiber;
        } else {
          // 上一个连上这一个，最后所有新的子结点连起来: liA->liB->liC->null
          perviousNewFiber.sibling = newFiber;
        }
        // 给下一个新的子结点使用
        perviousNewFiber = newFiber;
      }
    }
    // 新结点遍历完了，删除剩余的老结点
    oldExistingChildMap.forEach(child => deleteChild(returnFiber, child));
    // 返回大儿子
    return resultingFirstChild;
  }

  /**
   * newReactElement 查找对应的 oldFiber，复用/新建 fiber，返回。
   * 
   * @param oldExistingChildMap oldFiber 表
   * @param returnFiber workInProgress
   * @param newIdx 新 fiber 的位置索引
   * @param newReactElement 新虚拟DOM
   */
  function updateFromMap(oldExistingChildMap: Map<string, IFiber>, returnFiber: IFiber, newIdx: number, newReactElement: IReactElement) {
    const matchedOldFiber = oldExistingChildMap.get(newReactElement.key || newReactElement.index);
    return updateElement(returnFiber, matchedOldFiber, newReactElement);
  }

  /**
   * 把 oldRemainingChild 和  oldRemainingChild 往后的所有弟弟, 都放入 map 中。
   * 
   * @param returnFiber workInProgress
   * @param oldRemainingChild 当前遍历到 current某一个 child
   */
  function mapRemainingChildren(returnFiber: IFiber, oldRemainingChild: IFiber) {
    const map = new Map<string, IFiber>();
    let existingChild = oldRemainingChild;
    while (existingChild) {
      // 有 key 用 key，没 key 用索引。(TODO: 建议写 JSX 要有 key, 为啥？ index 会变?)
      const key = existingChild.key || existingChild.index;
      map.set(key as string, existingChild);
      existingChild = existingChild.sibling;
    }
    return map;
  }

  /**
   * 🔥🔥🔥 所谓单/多结点 DIFF，指的是新结点！新结点单个就是单结点diff，新结点多个就是多结点diff!
   * 
   * 对比 current.child 和 虚拟DOM，产生 workInProgress.child。
   * 
   * @param returnFiber 新产生 fiber 的 父结点 (workInProgress)
   * @param currentFirstChild 老 fiber 的大儿子 (current.child), 如果压根就没有 current 那这个值就是 null
   * @param newChild 新 fiber 的子虚拟DOM结点: 更新后的虚拟DOM, 单个或多个ReactElement
   */
  function reconcileChildFibers(returnFiber: IFiber, currentFirstChild: IFiber | null, newChild: IReactElement | Array<IReactElement>) {

    if (typeof newChild === 'object' && newChild !== null) {

      if (Array.isArray(newChild)) {
        // 如果 returnFiber 是一个 ul>li*3，那么 newChild 就是一个数组 (li*3)，进到这里。
        // 多个新的子 ReactElement
        return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
      }
      else {
        // 单个子 ReactElement
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE: {
            return placeSingleChild(
              reconcileSingleElement(
                returnFiber,
                currentFirstChild,
                newChild
              )
            );
          }
        }
      }
    }
    else {
      // 纯文本 或 纯数字
    }
    return null;
  }
  return reconcileChildFibers;
}

export const reconcileChildFibers = childReconciler(true);
export const mountChildFibers = childReconciler(false);
