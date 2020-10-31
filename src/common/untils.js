// 防抖动函数
function debounce(fn, delay) {
  var timer;
  return function () {
      var _this = this;
      var args = arguments;
      if (timer) {
          return;
      }
      timer = setTimeout(function () {
          fn.apply(_this, args);
          timer = null; // 在delay后执行完fn之后清空timer，此时timer为假，throttle触发可以进入计时器
      }, delay)
  }
}