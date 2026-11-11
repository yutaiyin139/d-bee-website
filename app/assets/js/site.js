/**
 * 官网交互（零依赖、defer 加载）。
 * 相比原型：补了移动端菜单焦点陷阱与 aria 同步、FAQ 分类/搜索，
 * 去掉了「mailto 伪表单」「商店弹窗」「设备识别 / UTM」等不适用或易误导的逻辑。
 */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 头部滚动状态 ---- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- 移动端菜单：焦点陷阱 + Esc + aria 同步 ---- */
  var menu = document.getElementById('mobileMenu');
  var openBtn = document.getElementById('menuBtn');
  var closeBtn = document.getElementById('menuClose');
  var lastFocused = null;

  function focusables() {
    if (!menu) return [];
    return Array.prototype.slice.call(
      menu.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])')
    ).filter(function (el) { return el.offsetParent !== null; });
  }
  function openMenu() {
    if (!menu) return;
    lastFocused = document.activeElement;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var f = focusables();
    if (f.length) f[0].focus();
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }
  if (openBtn) openBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (menu) {
    menu.addEventListener('click', function (e) { if (e.target === menu) closeMenu(); });
    menu.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  window.addEventListener('resize', function () { if (menu && menu.classList.contains('is-open') && window.innerWidth > 768) closeMenu(); });

  /* ---- 滚动显现（无 .reveal 的页面也要继续初始化后面的 FAQ） ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
      // 首屏内容同步显示，不依赖异步观察器；视口外元素才交给 IO
      Array.prototype.forEach.call(reveals, function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight + 40) el.classList.add('is-in');
        else io.observe(el);
      });
    }
    // 兜底：任何情况下（IO 不触发、脚本异常、长页面未滚动）都保证内容最终可见
    setTimeout(function () {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
    }, 1200);
  }

  /* ---- FAQ：分类 + 搜索（原生 details 负责展开） ---- */
  var faqWrap = document.querySelector('[data-faq]');
  if (faqWrap) {
    var items = Array.prototype.slice.call(faqWrap.querySelectorAll('.faq-item'));
    var tabs = Array.prototype.slice.call(faqWrap.querySelectorAll('.faq-tab'));
    var search = faqWrap.querySelector('#faqSearch');
    var empty = document.getElementById('faqEmpty');
    var activeGroup = 'all';

    function apply() {
      var q = (search && search.value || '').trim().toLowerCase();
      var shown = 0;
      items.forEach(function (it) {
        var inGroup = activeGroup === 'all' || it.getAttribute('data-group') === activeGroup;
        var inQuery = !q || (it.getAttribute('data-question') || '').toLowerCase().indexOf(q) >= 0;
        var visible = inGroup && inQuery;
        it.hidden = !visible;
        if (!visible) it.removeAttribute('open');
        if (visible) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    }
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activeGroup = tab.getAttribute('data-faq-group');
        tabs.forEach(function (t) {
          var on = t === tab;
          t.classList.toggle('is-on', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        apply();
      });
    });
    if (search) search.addEventListener('input', apply);
    apply();
  }

  /* ---- Toast（供未来非表单交互使用） ---- */
  window.dbeeToast = function (msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('is-on'); }, 2600);
  };
})();
