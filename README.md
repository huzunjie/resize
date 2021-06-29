# resize - 拖拽元素边框实现尺寸调节的基础功能

可用于原生WEB页面，也可以用于Vue、React场景等等

## 在React场景中横向拖拽的使用示例

```jsx
import sizeCtrl from './resize.js';

const asideResizeOpts = {
  dir: 0, // 拖拽方向，0：水平、1：垂直
  area: 1, // 可拖拽位置：0：最小边、1：最大边 （横向时：左边为最小边、右边是最大边；纵向：按上下两边划分）
  min: 264,
  max: 480,
  onChanged(val) {
    localStorage.setItem('asideWidth', val);
  },
};

const width = Math.min(
  Math.max(parseFloat(localStorage.getItem('asideWidth')) || 0, asideResizeOpts.min),
  asideResizeOpts.max
);

<div
  className="my-aside"
  style={{ width }}
  onMouseMove={(e) => sizeCtrl.hoverResizeBar(e, asideResizeOpts)}
  onMouseLeave={(e) => sizeCtrl.leaveResizeBar(e)}
>
  .......
</div>
```
