(function () {
  function toCanonicalView(view) {
    if (view === "limitsPage") return "limitsQuery";
    if (view === "rules") return "rulesQuery";
    if (view === "reports") return "reportsQuery";
    if (view === "settings") return "settingsGeneral";
    return view;
  }

  function splitViewTitle(view) {
    return {
      limitsQuery: "限額管理",
      limitsSetting: "限額管理",
      rulesQuery: "風控規則設定",
      rulesSetting: "風控規則設定",
      reportsQuery: "報表管理",
      reportsSetting: "報表管理",
      settingsGeneral: "系統設定",
      settingsLimitCategories: "系統設定",
      settingsAdmins: "系統設定",
      settingsAudit: "系統設定",
    }[view];
  }

  const NAV_GROUP_STORAGE_KEY = "riskDashboardNavGroups";

  function readNavGroupState() {
    try {
      return JSON.parse(localStorage.getItem(NAV_GROUP_STORAGE_KEY) || "{}");
    } catch (error) {
      return {};
    }
  }

  function saveNavGroupState(values) {
    try {
      localStorage.setItem(NAV_GROUP_STORAGE_KEY, JSON.stringify(values));
    } catch (error) {
      // Collapsing still works for the current page when storage is blocked.
    }
  }

  function setNavGroupCollapsed(group, collapsed, { persist = true } = {}) {
    if (!group) return;
    const toggle = group.querySelector("[data-nav-toggle]");
    group.classList.toggle("is-collapsed", collapsed);
    toggle?.setAttribute("aria-expanded", collapsed ? "false" : "true");
    if (!persist) return;
    const key = group.dataset.navGroup;
    if (!key) return;
    const values = readNavGroupState();
    values[key] = collapsed;
    saveNavGroupState(values);
  }

  function expandGroupForView(view) {
    const activeGroup = [...document.querySelectorAll(".nav-group")].find((group) => {
      return Boolean(group.querySelector(`.nav-item[data-view="${view}"]`));
    });
    if (activeGroup) setNavGroupCollapsed(activeGroup, false);
  }

  function initNavGroupToggles() {
    const values = readNavGroupState();
    document.querySelectorAll(".nav-group").forEach((group) => {
      const key = group.dataset.navGroup;
      setNavGroupCollapsed(group, Boolean(values[key]), { persist: false });
      group.querySelector("[data-nav-toggle]")?.addEventListener("click", () => {
        const collapsed = !group.classList.contains("is-collapsed");
        setNavGroupCollapsed(group, collapsed);
        const label = group.querySelector(".nav-group-label")?.textContent.trim() || "子功能";
        toast(`${label}已${collapsed ? "收起" : "展開"}`);
      });
    });
  }

  function limitsQueryTemplate() {
    const currentData = runtimePageData("限額管理", pageTables.limitsPage);
    const values = activeFilters("limitsPage");
    const rows = filterRows(currentData.columns, currentData.rows, values);
    return `
      ${pageHeader("限額查詢", "首頁 / 限額管理 / 限額查詢", "查詢會員限額、生效狀態、到期日與審核紀錄")}
      <section class="filter-bar generic-filter section-gap">
        ${[["會員", "input"], ["幣別", "select"], ["限額類型", "select"], ["狀態", "select"], ["生效日期", "date"]].map((filter) => filterControl(filter, values)).join("")}
        <button class="primary generic-action">查詢</button>
        <button class="secondary filter-reset" type="button">清除條件</button>
      </section>
      <section class="metric-grid dashboard-metrics">
        ${pageMetricCards("限額管理", { ...currentData, rows })}
      </section>
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>限額調整審核清單</h2>
          <button class="primary view-link" data-view-target="limitsSetting" type="button">新增 / 調整限額</button>
        </div>
        ${tableTemplate(currentData.columns, rows)}
        <div class="table-footer"><span>共 ${rows.length} 筆</span><span>已套用目前查詢條件</span></div>
      </section>
      ${specSection(pageSpecs.limitsPage)}
    `;
  }

  function limitsSettingTemplate() {
    const currentData = runtimePageData("限額管理", pageTables.limitsPage);
    const recentRows = currentData.rows.slice(0, 5);
    return `
      ${pageHeader("限額設定", "首頁 / 限額管理 / 限額設定", "新增、調整、取消會員限額並套用審核建議")}
      ${limitSettingTemplate()}
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>最近限額調整紀錄</h2>
          <button class="secondary view-link" data-view-target="limitsQuery" type="button">返回限額查詢</button>
        </div>
        ${tableTemplate(currentData.columns, recentRows)}
        <div class="table-footer"><span>顯示最近 ${recentRows.length} 筆</span><span>儲存設定後會同步更新查詢頁</span></div>
      </section>
      ${specSection(pageSpecs.limitsPage)}
    `;
  }

  function ruleFiltersTemplate(values) {
    return `
      <label><span>規則名稱</span><input placeholder="請輸入規則名稱" value="${escapeHtml(values["規則名稱"] || "")}" /></label>
      <label><span>規則類型</span><select><option ${!values["規則類型"] || values["規則類型"] === "全部" ? "selected" : ""}>全部</option><option ${values["規則類型"] === "金額" ? "selected" : ""}>金額</option><option ${values["規則類型"] === "頻率" ? "selected" : ""}>頻率</option><option ${values["規則類型"] === "行為" ? "selected" : ""}>行為</option><option ${values["規則類型"] === "關聯" ? "selected" : ""}>關聯</option></select></label>
      <label><span>風險等級</span><select><option ${!values["風險等級"] || values["風險等級"] === "全部" ? "selected" : ""}>全部</option><option ${values["風險等級"] === "高風險" ? "selected" : ""}>高風險</option><option ${values["風險等級"] === "中風險" ? "selected" : ""}>中風險</option><option ${values["風險等級"] === "低風險" ? "selected" : ""}>低風險</option></select></label>
      <label><span>幣別</span><select><option ${!values["幣別"] || values["幣別"] === "全部" ? "selected" : ""}>全部</option><option ${values["幣別"] === "CNY" ? "selected" : ""}>CNY</option><option ${values["幣別"] === "USD" ? "selected" : ""}>USD</option><option ${values["幣別"] === "HKD" ? "selected" : ""}>HKD</option><option ${values["幣別"] === "TWD" ? "selected" : ""}>TWD</option><option ${values["幣別"] === "JPY" ? "selected" : ""}>JPY</option><option ${values["幣別"] === "KRW" ? "selected" : ""}>KRW</option></select></label>
      <label><span>狀態</span><select><option ${!values["狀態"] || values["狀態"] === "全部" ? "selected" : ""}>全部</option><option ${values["狀態"] === "啟用" ? "selected" : ""}>啟用</option><option ${values["狀態"] === "停用" ? "selected" : ""}>停用</option></select></label>
    `;
  }

  function rulesQueryTemplate() {
    const values = activeFilters("rules");
    const rows = filterRows(pageTables.rules.columns, pageTables.rules.rows, values);
    return `
      ${pageHeader("規則查詢", "首頁 / 風控規則 / 規則查詢", "查詢風控規則、風險等級、幣別門檻與啟用狀態")}
      <section class="filter-bar generic-filter">
        ${ruleFiltersTemplate(values)}
        <button class="primary generic-action">查詢</button>
        <button class="secondary filter-reset" type="button">清除條件</button>
      </section>
      <section class="metric-grid dashboard-metrics">
        ${pageMetricCards("風控規則設定", { ...pageTables.rules, rows })}
      </section>
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>規則清單</h2>
          <button class="primary view-link" data-view-target="rulesSetting" type="button">前往規則設定</button>
        </div>
        ${tableTemplate(pageTables.rules.columns, rows)}
        <div class="table-footer"><span>共 ${rows.length} 筆</span><span>已套用目前查詢條件</span></div>
      </section>
      ${specSection(pageSpecs.rules)}
    `;
  }

  function rulesSettingTemplate() {
    return `
      ${pageHeader("規則設定", "首頁 / 風控規則 / 規則設定", "維護幣別風險值、新增規則與規則測試")}
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>幣別風險值設定</h2>
          <button class="secondary" id="syncRuleRateBtn">同步匯率參考</button>
        </div>
        <p class="helper-text">金額型規則依會員交易幣別套用門檻；匯率 API 僅用於畫面換算與參考，不直接覆蓋風控門檻。</p>
        ${currencyRiskThresholdTable()}
      </section>
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>規則設定清單</h2>
          <div class="button-row">
            <button class="secondary view-link" data-view-target="rulesQuery" type="button">返回規則查詢</button>
            <button class="primary" id="addRuleBtn" type="button">新增規則</button>
          </div>
        </div>
        ${tableTemplate(pageTables.rules.columns, pageTables.rules.rows)}
      </section>
      ${specSection(pageSpecs.rules)}
    `;
  }

  function reportsQueryTemplate() {
    const values = activeFilters("reports");
    const rows = filterRows(pageTables.reports.columns, pageTables.reports.rows, values);
    return `
      ${pageHeader("報表查詢", "首頁 / 報表管理 / 報表查詢", "查詢報表產生狀態、下載紀錄與建立人")}
      <section class="filter-bar generic-filter">
        ${[["報表類型", "select"], ["週期", "select"], ["幣別", "select"], ["日期範圍", "date"], ["建立人", "input"]].map((filter) => filterControl(filter, values)).join("")}
        <button class="primary generic-action">查詢</button>
        <button class="secondary filter-reset" type="button">清除條件</button>
      </section>
      <section class="metric-grid dashboard-metrics">
        ${pageMetricCards("報表管理", { ...pageTables.reports, rows })}
      </section>
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>報表清單</h2>
          <button class="primary view-link" data-view-target="reportsSetting" type="button">前往報表設定</button>
        </div>
        ${tableTemplate(pageTables.reports.columns, rows)}
        <div class="table-footer"><span>共 ${rows.length} 筆</span><span>已套用目前查詢條件</span></div>
      </section>
      ${specSection(pageSpecs.reports)}
    `;
  }

  function reportsSettingTemplate() {
    return `
      ${pageHeader("報表設定", "首頁 / 報表管理 / 報表設定", "產生、排程與寄送風控報表")}
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>產生報表</h2>
          <button class="secondary view-link" data-view-target="reportsQuery" type="button">返回報表查詢</button>
        </div>
        <div class="rule-editor">
          <label><span>報表類型</span><select><option>會員高風險日報</option><option>代理風險排行週報</option><option>限額處置月報</option><option>AML 入金異常報表</option></select></label>
          <label><span>週期</span><select><option>每日</option><option>每週</option><option>每月</option><option>自訂</option></select></label>
          <label><span>幣別</span><select><option>CNY</option><option>USD</option><option>HKD</option><option>TWD</option><option>JPY</option><option>KRW</option></select></label>
          <label class="date-filter-range"><span>日期範圍</span><div class="date-range"><input type="date" value="2025-04-01" /><span>~</span><input type="date" value="2025-04-03" /></div></label>
          <label><span>產生方式</span><select><option>立即產生</option><option>排程產生</option></select></label>
          <label><span>收件人</span><input value="risk-team@example.com" /></label>
        </div>
        <div class="limit-form-actions">
          <button class="primary generic-action" type="button">產生報表</button>
        </div>
      </section>
      <section class="content-card section-gap">
        <h2>最近報表產生紀錄</h2>
        ${tableTemplate(pageTables.reports.columns, pageTables.reports.rows)}
      </section>
      ${specSection(pageSpecs.reports)}
    `;
  }

  function settingsChildTemplate(key, title, subtitle, template) {
    state.settingsTab = key;
    return `
      ${pageHeader(title, `首頁 / 系統設定 / ${title}`, subtitle)}
      ${template()}
      ${specSection(pageSpecs.settings)}
    `;
  }

  function settingsGeneralPageTemplate() {
    return settingsChildTemplate("general", "一般設定", "後台安全、刷新、查詢限制、語系、顯示幣別與通知設定", settingsGeneralTemplate);
  }

  function settingsLimitCategoriesPageTemplate() {
    return settingsChildTemplate("limitCategories", "限額設定類別", "維護限額類型、玩家類別額度、審核方式與觸發處理", limitCategorySettingsTemplate);
  }

  function settingsAdminsPageTemplate() {
    return settingsChildTemplate("admins", "管理者與權限", "管理後台帳號、角色、資料範圍與權限矩陣", settingsAdminTemplate);
  }

  function settingsAuditPageTemplate() {
    return settingsChildTemplate("audit", "異動紀錄", "查閱敏感設定、匯率同步、限額類別與管理帳號異動紀錄", settingsAuditTemplate);
  }

  Object.assign(pageTemplates, {
    limitsQuery: limitsQueryTemplate,
    limitsSetting: limitsSettingTemplate,
    limitsPage: limitsQueryTemplate,
    rulesQuery: rulesQueryTemplate,
    rulesSetting: rulesSettingTemplate,
    rules: rulesQueryTemplate,
    reportsQuery: reportsQueryTemplate,
    reportsSetting: reportsSettingTemplate,
    reports: reportsQueryTemplate,
    settingsGeneral: settingsGeneralPageTemplate,
    settingsLimitCategories: settingsLimitCategoriesPageTemplate,
    settingsAdmins: settingsAdminsPageTemplate,
    settingsAudit: settingsAuditPageTemplate,
    settings: settingsGeneralPageTemplate,
  });

  Object.assign(beginnerGuides, {
    "限額查詢": ["先輸入會員或限額條件", "查看生效與到期狀態", "需要調整時前往限額設定"],
    "限額設定": ["先選會員與限額類型", "確認建議區間與審核要求", "儲存後回查詢頁確認紀錄"],
    "規則查詢": ["先查現有規則", "確認幣別門檻與狀態", "需要調整時前往規則設定"],
    "規則設定": ["先維護幣別風險值", "新增或調整規則", "測試通過後儲存"],
    "報表查詢": ["設定報表條件", "查看產生狀態", "完成後下載或匯出"],
    "報表設定": ["選擇報表類型與週期", "設定收件人或產生方式", "產生後回查詢頁確認狀態"],
    "一般設定": ["確認自動刷新與查詢限制", "設定通知與收件人", "套用語系或顯示幣別"],
    "限額設定類別": ["選擇限額類型", "維護玩家類別額度", "儲存後確認異動紀錄"],
    "管理者與權限": ["查詢管理帳號", "確認角色與資料範圍", "新增帳號或檢查權限矩陣"],
    "異動紀錄": ["檢查最近設定異動", "確認操作者與時間", "追蹤敏感設定變更"],
  });

  Object.assign(specDocuments, {
    "限額查詢": specDocuments["限額管理"],
    "限額設定": specDocuments["限額管理"],
    "規則查詢": specDocuments["風控規則設定"],
    "規則設定": specDocuments["風控規則設定"],
    "報表查詢": specDocuments["報表管理"],
    "報表設定": specDocuments["報表管理"],
    "一般設定": specDocuments["系統設定"],
    "限額設定類別": specDocuments["系統設定"],
    "管理者與權限": specDocuments["系統設定"],
    "異動紀錄": specDocuments["系統設定"],
  });

  const baseViewFilterKey = viewFilterKey;
  viewFilterKey = function (view = state.currentView) {
    if (view === "limitsQuery" || view === "limitsSetting" || view === "limitsPage") return "limitsPage";
    if (view === "rulesQuery" || view === "rulesSetting" || view === "rules") return "rules";
    if (view === "reportsQuery" || view === "reportsSetting" || view === "reports") return "reports";
    if (view === "settingsGeneral" || view === "settingsLimitCategories" || view === "settingsAdmins" || view === "settingsAudit" || view === "settings") return view;
    return baseViewFilterKey(view);
  };

  const baseCurrentSpecTitle = currentSpecTitle;
  currentSpecTitle = function () {
    if (state.currentView === "rulesSetting" && state.ruleMode === "create") return "新增風控規則";
    return splitViewTitle(state.currentView) || baseCurrentSpecTitle();
  };

  activateNav = function (view) {
    const activeView = toCanonicalView(view);
    expandGroupForView(activeView);
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.view === activeView);
    });
    document.querySelectorAll(".nav-group").forEach((group) => {
      group.classList.toggle("active", Boolean(group.querySelector(`.nav-item[data-view="${activeView}"]`)));
    });
  };

  const baseRenderView = renderView;
  renderView = function (view) {
    const nextView = toCanonicalView(view);
    if (nextView === "dashboard" || nextView === "member") {
      baseRenderView(nextView);
      return;
    }
    if (nextView === "rulesSetting" && state.ruleMode === "create") {
      renderRulesPage();
      return;
    }
    if (pageTemplates[nextView]) {
      state.currentView = nextView;
      document.querySelector(".content").innerHTML = pageTemplates[nextView]();
      bindGenericPage();
      drawChartsSoon();
      resetScrollPosition();
      return;
    }
    baseRenderView(nextView);
  };

  renderRulesPage = function () {
    state.currentView = "rulesSetting";
    document.querySelector(".content").innerHTML = state.ruleMode === "create" ? createRuleTemplate() : pageTemplates.rulesSetting();
    bindGenericPage();
    resetScrollPosition();
  };

  renderActiveView = function () {
    const nextView = toCanonicalView(state.currentView);
    if (nextView === "dashboard") {
      renderDashboardPage();
      return;
    }
    if (nextView === "member") {
      renderMemberPage();
      return;
    }
    if (nextView === "rulesSetting" && state.ruleMode === "create") {
      renderRulesPage();
      return;
    }
    renderView(nextView);
  };

  window.navigateToView = function (view) {
    const nextView = toCanonicalView(view);
    state.currentView = nextView;
    state.page = 1;
    if (nextView === "rulesQuery" || nextView === "rulesSetting") state.ruleMode = "list";
    activateNav(nextView);
    renderView(nextView);
  };

  const baseBindGenericPage = bindGenericPage;
  bindGenericPage = function () {
    baseBindGenericPage();
    document.querySelectorAll("[data-view-target]").forEach((button) => {
      button.addEventListener("click", () => {
        const targetView = button.dataset.viewTarget;
        window.navigateToView(targetView);
        if (targetView === "limitsSetting") toast("已前往限額設定");
        if (targetView === "limitsQuery") toast("已返回限額查詢");
        if (targetView === "rulesSetting") toast("已前往規則設定");
        if (targetView === "rulesQuery") toast("已返回規則查詢");
        if (targetView === "reportsSetting") toast("已前往報表設定");
        if (targetView === "reportsQuery") toast("已返回報表查詢");
      });
    });
  };

  document.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest("#memberLimitManageBtn");
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      state.selectedLimitMember = state.member;
      const memberRow = memberRows.find((row) => row[0] === state.member);
      state.selectedLimitLevel = memberLimitLevel(memberRow);
      window.navigateToView("limitsSetting");
      toast(`已帶入 ${state.member}，可進行限額調整`);
    },
    true
  );

  initNavGroupToggles();
  activateNav(state.currentView || "dashboard");
})();
