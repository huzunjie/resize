/* 拖拽元素边框实现尺寸调节的基础功能 */

const docEl = document.documentElement;

// 设置当前文档鼠标样式
function setDocElCursor(val) {
  docEl.style.cursor = val || 'initial';
}

// 事件监听
function addDocElEvt(type, handler) {
  docEl.addEventListener(type, handler);
}
function removeDocElEvt(type, handler) {
  docEl.removeEventListener(type, handler);
}

// 方向对应参数配置
const dirConf = [
  {
    posKey: 'left',
    sizeKey: 'width',
    pageKey: 'pageX',
    cursor: 'ew-resize'
  },
  {
    posKey: 'top',
    sizeKey: 'height',
    pageKey: 'pageY',
    cursor: 'ns-resize'
  }
];
const dirArea2Name = [
  ['left', 'right'],
  ['top', 'bottom']
];
const defConf = {
  dir: 0, // 拖拽方向：水平 - 0 ||  垂直 - 1 
  area: 1, // 可拖拽位置：最小边 - 0 ||  最大边 - 1 （横向：左边为最小边、右边是最大边；纵向：按上下两边划分）
  min: 150,
  max: 600
};

// 拖拽控制器
const ctrl = {
  el: null, // 拖拽时要改动的元素
  ...defConf,
  setOpts(opts) {
    Object.keys(defConf).forEach(_key => {
      if(!isNaN(opts[_key])) ctrl[_key] = opts[_key];
    });
  },
  // 获取边界距离值
  getHorizCriticalVal(evt) {
    const dirKeys = dirConf[ctrl.dir];
    const react = evt.currentTarget.getBoundingClientRect();
    const elPos = react[dirKeys.posKey];
    const elSize = ctrl.area === 1 ? react[dirKeys.sizeKey] : 0;
    const pagePos = evt[dirKeys.pageKey];
    return Math.abs(pagePos - (elPos + elSize));
  },
  // 侧边拖拽初始化方法
  hoverResizeBar(evt, opts) {
    if(ctrl.staElSize === null) {
      opts && ctrl.setOpts(opts);
      const act = ctrl.getHorizCriticalVal(evt) < 4 ? 'enterResizeBar' : 'leaveResizeBar';
      ctrl[act](evt);
    }
  },
  // 鼠标进入拖拽区
  enterResizeBar(evt, opts) {
    opts && ctrl.setOpts(opts);
    ctrl.el = evt.currentTarget;
    setDocElCursor(dirConf[ctrl.dir].cursor);
  },
  // 鼠标离开拖拽区
  leaveResizeBar() {
    if(ctrl.staElSize === null) {
      ctrl.el = null;
      setDocElCursor();
    }
  },
  // 启动拖拽
  staElSize: null,
  dragStart(evt) {
    const el = ctrl.el;
    if(!el) return;
    const dirKeys = dirConf[ctrl.dir];
    ctrl.staElSize = el.getBoundingClientRect()[dirKeys.sizeKey];
    ctrl.staPagePos = evt[dirKeys.pageKey];
    addDocElEvt('mousemove', ctrl.dragging);
    addDocElEvt('mouseup', ctrl.dragEnd);
    el.setCapture && el.setCapture();
    evt.preventDefault();
  },
  // 改变尺寸
  dragging(evt) {
    const el = ctrl.el;
    if(!el) {
      return ctrl.leaveResizeBar();
    }
    const dirKeys = dirConf[ctrl.dir];
    evt.preventDefault();
    
    const posDiff = (evt[dirKeys.pageKey] - ctrl.staPagePos) * (ctrl.area === 1 ? 1 : -1);
    el.style[dirKeys.sizeKey] = Math.max(ctrl.min, Math.min(ctrl.max, ctrl.staElSize + posDiff)) + 'px';
  },
  // 改变尺寸
  dragEnd(evt) {
    const el = ctrl.el;
    removeDocElEvt('mousemove', ctrl.dragging);
    removeDocElEvt('mouseup', ctrl.dragEnd);
    ctrl.staElSize = null;
    ctrl.staPagePos = null;
    el && el.releaseCapture && el.releaseCapture();
  },
  init() {
    addDocElEvt('mousedown', ctrl.dragStart);
  },
  // 给 VUE 组件的 props 增加拖拽能力
  dragResize2Vue(props, conf = {}) {
    const resizeOpts = Object.assign({}, defConf, conf);
    const {dir = 0, area = 1} = resizeOpts;
    if(typeof props.class === 'string') {
      props.class = {
        [props.class]: true
      };
    }
    // 增加若拽标识 className
    props.class = {
      ...props.class,
      ['drag-resize-' + dirArea2Name[dir][area]]: true
    };
    // 侧边增加鼠标事件，判定拖拽
    props.on = {
      ...props.on,
      mousemove: evt => ctrl.hoverResizeBar(evt, resizeOpts),
      mouseleave: evt => ctrl.leaveResizeBar(evt)
    };
  }
};
ctrl.init();

export default ctrl;
