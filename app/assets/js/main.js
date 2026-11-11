/* 自律蜜蜂 D-Bee 官网 — 共享交互脚本 */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var page = document.body.getAttribute("data-page") || "";

  /* ---------- 页头滚动状态 & 当前导航 ---------- */
  var header = $(".site-header");
  function onScroll() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  $$(".nav a, .mobile-menu nav a").forEach(function (a) {
    if (a.getAttribute("data-nav") === page) a.classList.add("is-active");
  });
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- 移动端菜单 ---------- */
  var menuBtn = $("#menuBtn"), mobileMenu = $("#mobileMenu"), menuClose = $("#menuClose");
  function setMenu(open) {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open && menuClose) menuClose.focus();
    else if (menuBtn) menuBtn.focus();
  }
  if (menuBtn) menuBtn.addEventListener("click", function () { setMenu(true); });
  if (menuClose) menuClose.addEventListener("click", function () { setMenu(false); });
  $$(".mobile-menu a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (mobileMenu && mobileMenu.classList.contains("is-open")) setMenu(false);
      closeModal();
      closeReader();
    }
  });

  /* ---------- 滚动显现 ---------- */
  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 }) : null;
  $$(".reveal").forEach(function (el) {
    if (io) io.observe(el); else el.classList.add("is-in");
  });

  /* ---------- 手机样机轮播 ---------- */
  var screens = $$(".app-screen"), dots = $$(".phone-dots button");
  if (screens.length > 1) {
    var cur = 0, timer = null;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function show(i) {
      cur = (i + screens.length) % screens.length;
      screens.forEach(function (s, k) { s.classList.toggle("is-on", k === cur); });
      dots.forEach(function (d, k) {
        d.classList.toggle("is-on", k === cur);
        d.setAttribute("aria-pressed", k === cur ? "true" : "false");
      });
    }
    function auto() {
      if (reduce) return;
      timer = setInterval(function () { show(cur + 1); }, 3800);
    }
    dots.forEach(function (d, k) {
      d.addEventListener("click", function () { clearInterval(timer); show(k); auto(); });
    });
    var heroDev = $(".hero-device");
    if (heroDev) {
      heroDev.addEventListener("mouseenter", function () { clearInterval(timer); });
      heroDev.addEventListener("mouseleave", function () { clearInterval(timer); auto(); });
    }
    auto();
  }

  /* ---------- 悬浮下载钮：下载页隐藏 ---------- */
  if (page === "download") { var fab = $(".dl-fab"); if (fab) fab.style.display = "none"; }

  /* ---------- Toast ---------- */
  var toastEl = $("#toast"), toastTimer = null;
  window.showToast = function (msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("is-show"); }, 2800);
  };

  /* ---------- 通用弹窗 ---------- */
  var openModalEl = null;
  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    m.classList.add("is-open");
    openModalEl = m;
    document.body.style.overflow = "hidden";
    var c = $(".modal-close", m); if (c) c.focus();
  }
  function closeModal() {
    if (!openModalEl) return;
    openModalEl.classList.remove("is-open");
    openModalEl = null;
    document.body.style.overflow = "";
  }
  window.openModal = openModal;
  $$("[data-modal-open]").forEach(function (b) {
    b.addEventListener("click", function () { openModal(b.getAttribute("data-modal-open")); });
  });
  $$(".modal").forEach(function (m) {
    m.addEventListener("click", function (e) { if (e.target === m) closeModal(); });
    $$(".modal-close, [data-close-modal]", m).forEach(function (c) { c.addEventListener("click", closeModal); });
  });

  /* ---------- FAQ 手风琴 ---------- */
  $$(".faq-item").forEach(function (item) {
    var q = $(".faq-q", item), a = $(".faq-a", item);
    if (!q || !a) return;
    q.setAttribute("aria-expanded", "false");
    q.addEventListener("click", function () {
      var isOpen = item.classList.toggle("is-open");
      q.setAttribute("aria-expanded", isOpen ? "true" : "false");
      a.style.maxHeight = isOpen ? a.scrollHeight + "px" : "0px";
    });
  });

  /* ---------- 帮助中心：分类切换 + 搜索 ---------- */
  var helpTabs = $$(".help-tab"), helpPanes = $$(".help-pane");
  helpTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var id = tab.getAttribute("data-tab");
      helpTabs.forEach(function (t) { t.classList.toggle("is-on", t === tab); });
      helpPanes.forEach(function (p) { p.classList.toggle("is-on", p.id === "pane-" + id); });
      var si = $("#helpSearch"); if (si) { si.value = ""; filterFaq(""); }
    });
  });
  var helpSearch = $("#helpSearch");
  function filterFaq(kw) {
    var anyVisible = false;
    $$(".faq-item").forEach(function (it) {
      var hit = !kw || it.textContent.toLowerCase().indexOf(kw) > -1;
      it.style.display = hit ? "" : "none";
      if (hit && it.closest(".help-pane").classList.contains("is-on")) anyVisible = true;
    });
    if (kw) { // 搜索时跨分类显示
      helpPanes.forEach(function (p) { p.classList.add("is-on"); });
      anyVisible = $$(".faq-item").some(function (it) { return it.style.display !== "none"; });
    } else {
      var onTab = $(".help-tab.is-on");
      helpPanes.forEach(function (p) { p.classList.toggle("is-on", onTab && p.id === "pane-" + onTab.getAttribute("data-tab")); });
      anyVisible = true;
    }
    var empty = $(".faq-empty");
    if (empty) empty.classList.toggle("is-show", !anyVisible);
  }
  if (helpSearch) {
    helpSearch.addEventListener("input", function () { filterFaq(helpSearch.value.trim().toLowerCase()); });
  }

  /* ---------- 表单：校验 + 邮件发送 ---------- */
  $$("form[data-mailto]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      $$("[required]", form).forEach(function (f) {
        var field = f.closest(".field");
        var bad = !f.value.trim();
        if (!bad && f.type === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim());
        if (field) field.classList.toggle("is-err", bad);
        if (bad && ok) { f.focus(); ok = false; }
        else if (bad) ok = false;
      });
      if (!ok) { showToast("请完善标红的必填项"); return; }
      var to = form.getAttribute("data-mailto");
      var subject = form.getAttribute("data-subject") || "官网留言";
      var lines = [];
      $$("input,select,textarea", form).forEach(function (f) {
        var lb = form.querySelector('label[for="' + f.id + '"]');
        if (lb && f.value.trim()) lines.push(lb.textContent.replace(/[*＊]/g, "").trim() + "：" + f.value.trim());
      });
      var url = "mailto:" + to + "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n") + "\n\n—— 来自自律蜜蜂官网");
      window.location.href = url;
      var okBox = $(".form-ok", form.parentElement);
      if (okBox) {
        form.style.display = "none";
        okBox.classList.add("is-show");
        var back = $(".form-ok .btn", form.parentElement);
        if (back) back.addEventListener("click", function () {
          okBox.classList.remove("is-show");
          form.style.display = "";
          form.reset();
        });
      } else {
        showToast("已为你唤起邮件客户端，点击发送即可");
        form.reset();
      }
    });
    $$("input,textarea,select", form).forEach(function (f) {
      f.addEventListener("input", function () {
        var field = f.closest(".field"); if (field) field.classList.remove("is-err");
      });
    });
  });

  /* ---------- 博客：筛选 + 阅读浮层 ---------- */
  var POSTS = {
    "p1": {
      cat: "习惯养成", title: "21 天养成一个习惯？你可能一直理解错了", date: "2026-10-24", read: "6 分钟",
      body: "<p>「21 天养成一个习惯」大概是被引用最多、也被误解最深的自律金句。它源自上世纪六十年代一本关于心理调适的畅销书，原意是「适应一个变化大约需要 21 天」，而不是「坚持 21 天就能自动化」。</p><p>后来针对习惯养成的追踪研究发现：一个行为真正变得不那么费力，平均需要约 66 天，而且不同习惯差异很大——喝一杯水可能两三周就自动化了，而每天早起运动可能要半年。</p><h3>比天数更重要的三件事</h3><ul><li><b>触发线索</b>：把新习惯挂在旧习惯后面，比如「刷完牙就背 10 个单词」。</li><li><b>最小剂量</b>：目标小到不可能失败，比如「翻开书读一页」。先保证不断档，再谈强度。</li><li><b>即时反馈</b>：大脑喜欢看得见的奖励。每次打卡、每格进度条，都是在给坚持充电。</li></ul><blockquote>自律蜜蜂的设计思路正是这三点：习惯关联提醒、默认最小目标、打卡即时的视觉反馈。</blockquote><p>所以别在第 22 天焦虑「怎么还没自动化」。用打卡工具把记录交给 APP，把意志力留给行动本身。</p>"
    },
    "p2": {
      cat: "专注方法", title: "番茄工作法实操：从 25 分钟开始的专注训练", date: "2026-10-17", read: "5 分钟",
      body: "<p>番茄工作法的规则很简单：25 分钟专注 + 5 分钟休息，每 4 个番茄钟来一次长休息。但大多数人用错的不是规则，而是心态——把番茄钟当成监工，而不是热身。</p><h3>正确的打开方式</h3><ul><li><b>开始前写下这一颗番茄的唯一目标</b>：不是「复习数学」，而是「做完第三章 10 道错题」。</li><li><b>杂念清单</b>：脑子里冒出「想看看消息」时，记在纸上而不是拿起手机，番茄钟结束后统一处理。</li><li><b>保护番茄钟的完整性</b>：一旦被打断超过一分钟，这颗番茄就作废重来。听起来严格，但正是这种「作废成本」训练出边界感。</li></ul><p>如果你连 25 分钟都坐不住，可以先从 15 分钟起步，每周加 5 分钟。自律蜜蜂的专注模式支持自定义时长、白噪音和严格模式，帮你循序渐进。</p><blockquote>专注不是一种天赋，是一块可以训练的肌肉。番茄钟就是那块最轻的哑铃。</blockquote>"
    },
    "p3": {
      cat: "备考规划", title: "考研最后 100 天：一份可以执行的时间表", date: "2026-10-08", read: "8 分钟",
      body: "<p>倒计时 100 天，最忌讳两件事：一是每天学到深夜自我感动，二是频繁换计划。这一阶段的核心是「稳定输出」。</p><h3>一天的参考结构</h3><ul><li><b>上午（大脑黄金期）</b>：数学/专业课这类硬骨头，2 个番茄钟一组，上午完成 4 颗。</li><li><b>下午</b>：英语阅读 + 政治选择题，3 颗番茄钟，中间安排 20 分钟午休。</li><li><b>晚上</b>：复盘白天错题 + 背诵类内容，2 颗番茄钟，23:30 前结束。</li></ul><h3>每周留一个「缓冲半天」</h3><p>计划排满 7 天的表，注定执行不到第二周。留出半天专门补落下的进度，补上了就当休息——这不是偷懒，是让计划有弹性。</p><p>最后，把「今天学了多久」换成「今天完成了哪几颗番茄」。时间可以摸鱼，番茄钟不会。</p><blockquote>用自律蜜蜂的目标追踪功能把 100 天拆成 14 个周目标，每周日晚上花 10 分钟复盘一次，比任何鸡血都管用。</blockquote>"
    },
    "p4": {
      cat: "拖延心理", title: "为什么我们总把事情拖到最后一刻", date: "2026-09-26", read: "7 分钟",
      body: "<p>拖延不是懒，而是大脑在逃避任务带来的不适感。写论文、做方案、背单词——这些事让人联想到困难、不确定和可能的失败，大脑于是选择「先刷会儿视频」来获得即时缓解。</p><h3>三个被验证有效的突破口</h3><ul><li><b>两分钟启动</b>：只承诺做两分钟。开始之后，继续做下去的阻力会小得多。</li><li><b>把模糊变具体</b>：「明天写报告」让人想逃；「明天上午 10 点，打开文档写第一部分提纲」则容易得多。</li><li><b>公开承诺</b>：告诉朋友你的打卡目标，或者把打卡记录分享出去。社会压力是对抗拖延的利器。</li></ul><p>理解拖延是情绪问题而非道德问题，本身就是解脱的开始：你不需要责备自己，只需要设计一个让自己更容易启动的环境。</p>"
    },
    "p5": {
      cat: "使用技巧", title: "自律蜜蜂隐藏玩法：打卡模板的 5 种组合", date: "2026-09-15", read: "4 分钟",
      body: "<p>很多用户只用自律蜜蜂打卡「早起」和「背单词」，其实内置的模板库还藏着不少组合拳。</p><h3>五套高频模板组合</h3><ul><li><b>备考套装</b>：番茄专注 × 6 + 错题复盘 + 22:30 睡觉提醒。</li><li><b>减脂套装</b>：喝水 8 杯 + 运动 30 分钟 + 晚餐 19 点前 + 体重周记。</li><li><b>戒短视频套装</b>：屏幕使用时长目标 + 睡前一小时无手机 + 替代活动（阅读 10 分钟）。</li><li><b>职场进阶套装</b>：每日三件要事 + 深度工作 2 小时 + 下班前 5 分钟复盘。</li><li><b>情绪管理套装</b>：冥想 10 分钟 + 感恩日记 + 23 点前入睡。</li></ul><p>在「新建习惯」页搜索关键词即可一键套用模板，再按自己的节奏微调目标和提醒时间。模板是起点，不是枷锁——适合你的节奏才是最好的节奏。</p>"
    },
    "p6": {
      cat: "注意力训练", title: "注意力碎片化时代，如何夺回你的专注力", date: "2026-09-02", read: "6 分钟",
      body: "<p>短视频把刺激切成 15 秒一份，我们的注意力也被切成了同样的尺寸。好消息是，注意力和肌肉一样，可以通过训练恢复。</p><h3>一套循序渐进的恢复方案</h3><ul><li><b>第 1 周：记录</b>。不急着改，先用工具记录每天的屏幕时间和专注时长，看见问题是第一步。</li><li><b>第 2-3 周：设立「无手机区」</b>。餐桌、书桌、睡前一小时，三个场景任选其一开始。</li><li><b>第 4 周起：单任务训练</b>。每天安排至少 2 颗完整番茄钟，期间只做一件事。</li></ul><p>过程中会有反复，这很正常。注意力的恢复以「月」为单位，给自己一点耐心。</p><blockquote>数据复盘功能存在的意义，就是让你在「感觉最近很差」的时候，能看见自己其实已经比上个月专注了 40 分钟。</blockquote>"
    }
  };

  var blogChips = $$(".blog-chip");
  blogChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      blogChips.forEach(function (c) { c.classList.toggle("is-on", c === chip); });
      var cat = chip.getAttribute("data-cat");
      $$(".post-card").forEach(function (card) {
        card.style.display = (cat === "all" || card.getAttribute("data-cat") === cat) ? "" : "none";
      });
    });
  });

  var reader = $("#reader");
  function closeReader() {
    if (!reader || !reader.classList.contains("is-open")) return;
    reader.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  $$(".post-card").forEach(function (card) {
    card.addEventListener("click", function () {
      var p = POSTS[card.getAttribute("data-post")];
      if (!p || !reader) return;
      $("#readerCat").textContent = p.cat;
      $("#readerTitle").textContent = p.title;
      $("#readerMeta").innerHTML = "<span>" + p.date + "</span><span>阅读约 " + p.read + "</span>";
      $("#readerBody").innerHTML = p.body;
      reader.classList.add("is-open");
      document.body.style.overflow = "hidden";
      $(".reader-panel", reader).scrollTop = 0;
      $(".reader-close", reader).focus();
    });
  });
  if (reader) {
    reader.addEventListener("click", function (e) { if (e.target === reader) closeReader(); });
    $(".reader-close", reader).addEventListener("click", closeReader);
  }

  /* ---------- 下载页：设备识别 + 渠道统计 ---------- */
  if (page === "download") {
    var ua = navigator.userAgent;
    var isIOS = /iPhone|iPad|iPod/i.test(ua);
    var isHarmony = /HarmonyOS/i.test(ua);
    var isAndroid = /Android/i.test(ua) && !isHarmony;
    var vendor = "other";
    if (/HUAWEI|HONOR/i.test(ua)) vendor = "huawei";
    else if (/Mi|Xiaomi|Redmi|MIUI/i.test(ua)) vendor = "xiaomi";
    else if (/OPPO|OPlus/i.test(ua)) vendor = "oppo";
    else if (/vivo/i.test(ua)) vendor = "vivo";

    // UTM 渠道参数
    var params = new URLSearchParams(location.search);
    var channel = params.get("utm_source") || params.get("channel") || "direct";
    try {
      var stat = JSON.parse(localStorage.getItem("dbee_dl_stat") || "{}");
      stat[channel] = (stat[channel] || 0) + 1;
      localStorage.setItem("dbee_dl_stat", JSON.stringify(stat));
    } catch (e) { /* 隐私模式下静默 */ }

    var hint = $("#deviceHint");
    function showHint(text) {
      if (!hint) return;
      $("#deviceHintText").textContent = text;
      hint.classList.add("is-show");
    }
    var matchMap = { huawei: "store-huawei", xiaomi: "store-xiaomi", oppo: "store-oppo", vivo: "store-vivo" };
    if (isIOS) showHint("检测到你正在使用 iPhone，推荐前往 App Store 下载");
    else if (isHarmony) showHint("检测到鸿蒙设备，推荐前往华为应用市场下载");
    else if (isAndroid) showHint("检测到你正在使用安卓设备，已为你标记推荐商店");

    var matchId = isIOS ? "store-ios" : (isHarmony ? "store-huawei" : (isAndroid && matchMap[vendor] ? matchMap[vendor] : null));
    if (matchId) {
      var m = document.getElementById(matchId);
      if (m) m.classList.add("is-match");
    }

    // 商店按钮行为
    $$("[data-store]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var store = btn.getAttribute("data-store");
        if (store === "ios") {
          window.open("https://apps.apple.com/cn/search?term=" + encodeURIComponent("自律蜜蜂"), "_blank", "noopener");
          showToast("已打开 App Store，搜索「自律蜜蜂」即可下载");
        } else {
          openModal("storeModal");
          var titleMap = { huawei: "华为应用市场", xiaomi: "小米应用商店", oppo: "OPPO 软件商店", vivo: "vivo 应用商店", harmony: "鸿蒙应用市场" };
          $("#storeModalTitle").textContent = titleMap[store] || "应用商店下载";
        }
      });
    });
  }
})();
