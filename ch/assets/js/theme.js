/* =========================================================================
   配色模式切换（light / dark）
   -------------------------------------------------------------------------
   偏好优先级：localStorage > 系统偏好(prefers-color-scheme) > 默认 light
   防闪烁：head.html 里有一段等价的内联脚本在样式前执行（首屏就带上正确的
   data-theme），本文件负责绑定开关按钮与后续切换。
   ========================================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'kubuds-theme';
  var root = document.documentElement;

  function readStored() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch (e) {
      return null;   // 隐私模式等场景下 localStorage 不可用
    }
  }

  function writeStored(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* 忽略：存不下也不影响本次切换 */
    }
  }

  function systemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function currentTheme() {
    return root.getAttribute('data-theme') || readStored() || systemTheme();
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute(
        'title',
        theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'
      );
    }
  }

  function toggle() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    apply(next);
    writeStored(next);
  }

  // 初始化：与 head 内联脚本保持一致，并绑定按钮
  function init() {
    apply(currentTheme());

    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggle);
      // 键盘支持（按钮元素本身可聚焦，这里补齐 Space/Enter 的显式处理）
      btn.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
          e.preventDefault();
          toggle();
        }
      });
    }

    // 用户没有手动设置过时，跟随系统偏好的变化
    if (window.matchMedia && !readStored()) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function () {
        if (!readStored()) {
          apply(systemTheme());
        }
      };
      if (mq.addEventListener) {
        mq.addEventListener('change', onChange);
      } else if (mq.addListener) {
        mq.addListener(onChange);   // 旧版 Safari
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 供调试使用
  window.kubudsTheme = { apply: apply, toggle: toggle, current: currentTheme };
})();
