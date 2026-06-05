(function () {
  function toCanonicalView(view) {
    if (view === "member") return "memberQuery";
    if (view === "betting") return "bettingQuery";
    if (view === "group") return "groupGraph";
    if (view === "limitsPage") return "limitsQuery";
    if (view === "rules") return "rulesQuery";
    if (view === "reports") return "reportsQuery";
    if (view === "settings") return "settingsGeneral";
    return view;
  }

  function splitViewTitle(view) {
    return {
      memberQuery: "會員風險分析",
      memberDetail: "會員風險檢視",
      bettingQuery: "投注行為分析",
      bettingAnalysis: "投注行為分析",
      groupQuery: "集團風險偵測",
      groupGraph: "集團風險偵測",
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

  function memberQueryTemplate() {
    const columns = ["會員帳號", "會員ID", "代理帳號", "會員層級", "幣別", "風險評分", "風險等級", "帳號狀態", "最後登入", "操作"];
    const values = activeFilters("member");
    const filteredRows = filterRows(columns.slice(0, -1), memberRows, values);
    const rows = filteredRows.map((row) => [...row, `<button class="secondary member-detail-btn" data-member="${row[0]}">詳情</button>`]);
    return `
      ${pageHeader("會員查詢", "首頁 / 會員風險 / 會員查詢", "依會員、代理、幣別、風險等級與帳號狀態篩選風險會員。")}
      <section class="metric-grid dashboard-metrics">
        ${smallMetric("會員總數", String(filteredRows.length), "目前列表資料")}
        ${smallMetric("高風險會員", String(filteredRows.filter((row) => row[6] === "高風險").length), "需優先覆核", "up")}
        ${smallMetric("觀察 / 限額", String(filteredRows.filter((row) => row[7] === "觀察中" || row[7] === "限額中").length), "處置中")}
        ${smallMetric("已凍結", String(filteredRows.filter((row) => row[7] === "凍結").length), "敏感狀態", "up")}
      </section>
      <section class="filter-bar generic-filter member-list-filter">
        <label><span>會員帳號</span><input id="memberListKeyword" placeholder="請輸入會員帳號" value="${escapeHtml(values["會員帳號"] || "")}" /></label>
        <label><span>代理帳號</span><select><option ${!values["代理帳號"] || values["代理帳號"] === "全部" ? "selected" : ""}>全部</option><option ${values["代理帳號"] === "CQ9" ? "selected" : ""}>CQ9</option><option ${values["代理帳號"] === "AG01" ? "selected" : ""}>AG01</option><option ${values["代理帳號"] === "BBIN" ? "selected" : ""}>BBIN</option></select></label>
        ${filterControl(["幣別", "select"], values)}
        ${filterControl(["風險等級", "select"], values)}
        <label><span>帳號狀態</span><select><option ${!values["帳號狀態"] || values["帳號狀態"] === "全部" ? "selected" : ""}>全部</option><option ${values["帳號狀態"] === "正常" ? "selected" : ""}>正常</option><option ${values["帳號狀態"] === "觀察中" ? "selected" : ""}>觀察中</option><option ${values["帳號狀態"] === "限額中" ? "selected" : ""}>限額中</option><option ${values["帳號狀態"] === "凍結" ? "selected" : ""}>凍結</option></select></label>
        <button class="primary" id="memberListSearch">查詢</button>
        <button class="secondary filter-reset" type="button">清除條件</button>
      </section>
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>會員列表</h2>
          <button class="secondary view-link" data-view-target="memberDetail" type="button">前往風險檢視</button>
        </div>
        ${memberListTable(columns, rows)}
        <div class="table-footer"><span>共 ${filteredRows.length} 筆</span><span>點擊詳情進入會員風險檢視</span></div>
      </section>
      ${specSection(pageSpecs.member || [
        ["頁面目的", "提供風控人員先篩選會員，再進入單一會員風險檢視。"],
        ["核心功能", "會員查詢、風險等級標示、帳號狀態檢視、詳情跳轉、返回列表。"],
        ["驗收標準", "點擊詳情可帶入會員帳號與摘要資料；詳情頁返回可回到會員列表。"],
      ])}
    `;
  }

  function bettingQueryTemplate() {
    const values = activeFilters("betting");
    const rows = filterRows(pageTables.betting.columns, pageTables.betting.rows, values);
    return `
      ${pageHeader("投注查詢", "首頁 / 投注行為 / 投注查詢", "查詢注單行為、命中規則、投注金額與風險等級")}
      <section class="metric-grid dashboard-metrics">
        ${pageMetricCards("投注行為分析", { ...pageTables.betting, rows })}
      </section>
      <section class="filter-bar generic-filter">
        ${[["日期範圍", "date"], ["遊戲類型", "select"], ["風險等級", "select"], ["幣別", "select"], ["會員帳號", "input"], ["命中規則", "select"]].map((filter) => filterControl(filter, values)).join("")}
        <button class="primary generic-action">查詢</button>
        <button class="secondary filter-reset" type="button">清除條件</button>
      </section>
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>投注查詢清單</h2>
          <button class="primary view-link" data-view-target="bettingAnalysis" type="button">查看行為分析</button>
        </div>
        ${tableTemplate(pageTables.betting.columns, rows)}
        <div class="table-footer"><span>共 ${rows.length} 筆</span><span>已套用目前查詢條件</span></div>
      </section>
      ${specSection(pageSpecs.betting)}
    `;
  }

  function bettingAnalysisTemplate() {
    const values = activeFilters("betting");
    const rows = filterRows(pageTables.betting.columns, pageTables.betting.rows, values);
    const highRiskRows = rows.filter((row) => row[7] === "高風險");
    const ruleRows = rows.map((row) => [row[1], row[2], row[3], row[6], row[7], row[8]]);
    return `
      ${pageHeader("行為分析", "首頁 / 投注行為 / 行為分析", "聚焦投注模式、命中規則與高風險行為摘要")}
      <section class="metric-grid dashboard-metrics">
        ${smallMetric("分析筆數", String(rows.length), "依目前資料")}
        ${smallMetric("高風險行為", String(highRiskRows.length), "需優先覆核", "up")}
        ${smallMetric("命中規則", String(new Set(rows.map((row) => row[6])).size), "規則種類")}
        ${smallMetric("涉及會員", String(new Set(rows.map((row) => row[1])).size), "會員數")}
      </section>
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>命中規則分析</h2>
          <button class="secondary view-link" data-view-target="bettingQuery" type="button">返回投注查詢</button>
        </div>
        ${tableTemplate(["會員", "遊戲", "行為模式", "命中規則", "風險等級", "操作"], ruleRows)}
      </section>
      <section class="content-card section-gap">
        <h2>高風險投注明細</h2>
        ${tableTemplate(pageTables.betting.columns, highRiskRows.length ? highRiskRows : rows)}
      </section>
      ${specSection(pageSpecs.betting)}
    `;
  }

  function groupFilters(values) {
    return `
      ${filterControl(["日期範圍", "date"], values)}
      <label><span>集團ID</span><input placeholder="請輸入集團ID" value="${escapeHtml(values["集團ID"] || "")}" /></label>
      ${filterControl(["幣別", "select"], values)}
      ${filterControl(["風險等級", "select"], values)}
      <label><span>代理帳號</span><select><option ${!values["代理帳號"] || values["代理帳號"] === "全部" ? "selected" : ""}>全部</option><option ${values["代理帳號"] === "CQ9" ? "selected" : ""}>CQ9</option><option ${values["代理帳號"] === "AG01" ? "selected" : ""}>AG01</option><option ${values["代理帳號"] === "BBIN" ? "selected" : ""}>BBIN</option></select></label>
    `;
  }

  function groupQueryTemplate() {
    const values = activeFilters("group");
    const rows = filterRows(pageTables.group.columns, pageTables.group.rows, values);
    return `
      ${pageHeader("集團查詢", "首頁 / 集團風險 / 集團查詢", "查詢多帳號關聯、共同 IP、共同裝置與集團風險等級")}
      <section class="metric-grid dashboard-metrics">
        ${pageMetricCards("集團風險偵測", { ...pageTables.group, rows })}
      </section>
      <section class="filter-bar generic-filter">
        ${groupFilters(values)}
        <button class="primary generic-action">查詢</button>
        <button class="secondary filter-reset" type="button">清除條件</button>
      </section>
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>高風險集團清單</h2>
          <button class="primary view-link" data-view-target="groupGraph" type="button">查看關聯圖譜</button>
        </div>
        ${groupTableTemplate(rows)}
        <div class="table-footer"><span>共 ${rows.length} 筆</span><span>可點擊欄位鑽取關聯證據</span></div>
      </section>
      ${specSection(pageSpecs.group)}
    `;
  }

  function groupGraphPageTemplate() {
    const row = selectedGroupRow();
    return `
      ${pageHeader("關聯圖譜", "首頁 / 集團風險 / 關聯圖譜", "視覺化單一集團的帳號、IP、裝置與風險訊號關聯")}
      <section class="overview-grid">
        <div class="content-card wide-card">
          <div class="section-title-row">
            <h2>集團關聯圖譜</h2>
            <label class="group-graph-selector"><span>查看集團</span><select id="groupGraphSelect">${groupOptionsMarkup()}</select></label>
          </div>
          ${groupGraphTemplate()}
        </div>
        <div class="content-card"><h2>圖譜摘要</h2>${groupSummaryTemplate()}</div>
      </section>
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>目前集團資料</h2>
          <button class="secondary view-link" data-view-target="groupQuery" type="button">返回集團查詢</button>
        </div>
        ${groupTableTemplate(row ? [row] : [])}
      </section>
      ${specSection(pageSpecs.group)}
    `;
  }

  function limitsQueryTemplate() {
    const currentData = runtimePageData("限額管理", pageTables.limitsPage);
    const values = activeFilters("limitsPage");
    const rows = filterRows(currentData.columns, currentData.rows, values);
    return `
      ${pageHeader("限額查詢", "首頁 / 限額管理 / 限額查詢", "查詢會員限額、生效狀態、到期日與審核紀錄")}
      <section class="metric-grid dashboard-metrics">
        ${pageMetricCards("限額管理", { ...currentData, rows })}
      </section>
      <section class="filter-bar generic-filter section-gap">
        ${[["會員", "input"], ["幣別", "select"], ["限額類型", "select"], ["狀態", "select"], ["生效日期", "date"]].map((filter) => filterControl(filter, values)).join("")}
        <button class="primary generic-action">查詢</button>
        <button class="secondary filter-reset" type="button">清除條件</button>
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
      <section class="metric-grid dashboard-metrics">
        ${pageMetricCards("風控規則設定", { ...pageTables.rules, rows })}
      </section>
      <section class="filter-bar generic-filter">
        ${ruleFiltersTemplate(values)}
        <button class="primary generic-action">查詢</button>
        <button class="secondary filter-reset" type="button">清除條件</button>
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
      <section class="metric-grid dashboard-metrics">
        ${pageMetricCards("報表管理", { ...pageTables.reports, rows })}
      </section>
      <section class="filter-bar generic-filter">
        ${[["報表類型", "select"], ["週期", "select"], ["幣別", "select"], ["日期範圍", "date"], ["建立人", "input"]].map((filter) => filterControl(filter, values)).join("")}
        <button class="primary generic-action">查詢</button>
        <button class="secondary filter-reset" type="button">清除條件</button>
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

  state.tableUi = state.tableUi || {};
  state.currentUser = state.currentUser || { account: "admin", role: "系統管理員" };
  state.limitApplications = state.limitApplications || [
    {
      id: "LA-20250403-001",
      member: "test003",
      currency: "CNY",
      type: "單注投注上限",
      currentAmount: "100,000.00",
      proposedAmount: "50,000.00",
      level: "L2",
      status: "待審核",
      requester: "risk01",
      approver: "opslead",
      createdAt: "2025-04-03 15:08:11",
      effectiveFrom: "2025-04-03 18:00:00",
      effectiveTo: "2025-04-10 23:59:59",
      reason: "Tie 高額命中，建議先降單注限額並觀察 7 日。",
      history: ["risk01 建立申請", "系統判定需主管覆核"],
    },
    {
      id: "LA-20250403-002",
      member: "vip118",
      currency: "CNY",
      type: "單日提款上限",
      currentAmount: "120,000.00",
      proposedAmount: "80,000.00",
      level: "L3",
      status: "待主管覆核",
      requester: "admin",
      approver: "opslead",
      createdAt: "2025-04-03 14:38:02",
      effectiveFrom: "2025-04-03 18:00:00",
      effectiveTo: "2025-04-09 23:59:59",
      reason: "玩家獲利異常，提款上限先降至中階風險區間。",
      history: ["admin 建立申請", "L3 額度需主管覆核"],
    },
  ];
  state.completedCaseRecords = state.completedCaseRecords || [
    {
      id: "DONE-20250403-001",
      completedAt: "2025-04-03 16:20:18",
      caseId: "RC-20250403-006",
      member: "chen516",
      type: "AML 入金異常",
      riskLevel: "中風險",
      conclusion: "已核對入金來源與 KYC 資料，未發現擴散風險，案件完成。",
      handler: "risk01",
      owner: "risk01",
      requiredRole: "主管以上（含主管）",
    },
    {
      id: "DONE-20250403-002",
      completedAt: "2025-04-03 15:48:33",
      caseId: "RC-20250403-007",
      member: "lin0520",
      type: "異常登入",
      riskLevel: "低風險",
      conclusion: "會員登入 IP 已確認為常用地區，不做額外處置並保留查核紀錄。",
      handler: "cq9-risk-lead",
      owner: "cq9-risk-lead",
      requiredRole: "主管以上（含主管）",
    },
  ];
  state.completedAccessLogs = state.completedAccessLogs || [];

  const COMPLETED_CASE_DETAIL_KEY = "completedToday";

  function currentUserRole() {
    return state.currentUser?.role || "系統管理員";
  }

  function currentUserAccount() {
    return state.currentUser?.account || "admin";
  }

  function canViewCompletedCases() {
    const role = currentUserRole();
    return role.includes("主管") || role === "系統管理員" || role === "平台營運主管";
  }

  function completedCaseTodayDate() {
    const dates = [
      ...riskCases.map((item) => item.time?.slice(0, 10)).filter(Boolean),
      ...state.completedCaseRecords.map((item) => item.completedAt?.slice(0, 10)).filter(Boolean),
    ].sort();
    return dates[dates.length - 1] || updateTimestamp().slice(0, 10);
  }

  function completedCaseRecords() {
    const today = completedCaseTodayDate();
    const seeded = state.completedCaseRecords.filter((item) => item.completedAt?.slice(0, 10) === today);
    const seededCaseIds = new Set(seeded.map((item) => item.caseId));
    const completedFromCases = riskCases
      .filter((item) => (item.caseStatus === "已完成" || item.caseStatus === "誤判關閉") && !seededCaseIds.has(item.id))
      .map((item) => ({
        id: `DONE-${item.id.replace("RC-", "")}`,
        completedAt: updateTimestamp(),
        caseId: item.id,
        member: item.member,
        type: item.type,
        riskLevel: item.riskLevel,
        conclusion: item.suggested || item.reason,
        handler: item.owner || currentUserAccount(),
        owner: item.owner || currentUserAccount(),
        requiredRole: "主管以上（含主管）",
      }));
    return [...completedFromCases, ...seeded].sort((left, right) => right.completedAt.localeCompare(left.completedAt));
  }

  function completedCaseColumns() {
    return ["完成時間", "案件ID", "會員", "事件類型", "風險等級", "完成結論", "處理人", "原負責人", "查閱等級", "操作"];
  }

  function completedCaseRows() {
    return completedCaseRecords().map((item) => [
      item.completedAt,
      item.caseId,
      item.member,
      item.type,
      item.riskLevel,
      item.conclusion,
      item.handler,
      item.owner,
      item.requiredRole,
      "查看",
    ]);
  }

  function recordCompletedCaseAccess() {
    if (!canViewCompletedCases()) return;
    const today = completedCaseTodayDate();
    const recentKey = `${today}:${currentUserAccount()}:${currentUserRole()}`;
    if (state.completedAccessLogs.some((item) => item.key === recentKey)) return;
    state.completedAccessLogs.unshift({
      key: recentKey,
      time: updateTimestamp(),
      account: currentUserAccount(),
      role: currentUserRole(),
      scope: `今日已完成 / ${today}`,
      result: "允許查閱",
    });
    appendAuditLog("查閱今日已完成", `${currentUserAccount()}｜${currentUserRole()}｜${today}`, "首頁儀表板 / 今日已完成", currentUserAccount());
  }

  function completedAccessRows() {
    return state.completedAccessLogs.map((item) => [item.time, item.account, item.role, item.scope, item.result]);
  }

  function upsertCompletedCaseRecord(caseItem, note = "") {
    if (!caseItem || !["已完成", "誤判關閉"].includes(caseItem.caseStatus)) return;
    if (state.completedCaseRecords.some((item) => item.caseId === caseItem.id)) return;
    state.completedCaseRecords.unshift({
      id: `DONE-${caseItem.id.replace("RC-", "")}`,
      completedAt: updateTimestamp(),
      caseId: caseItem.id,
      member: caseItem.member,
      type: caseItem.type,
      riskLevel: caseItem.riskLevel,
      conclusion: note || caseItem.suggested || caseItem.reason,
      handler: currentUserAccount(),
      owner: caseItem.owner || currentUserAccount(),
      requiredRole: "主管以上（含主管）",
    });
  }

  const baseUpdateCaseStatusForCompleted = updateCaseStatus;
  updateCaseStatus = function (caseItem, nextStatus, note = "") {
    const before = caseItem?.caseStatus;
    const result = baseUpdateCaseStatusForCompleted(caseItem, nextStatus, note);
    if (caseItem && before !== caseItem.caseStatus) upsertCompletedCaseRecord(caseItem, note);
    return result;
  };

  function hashText(value) {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
    }
    return Math.abs(hash).toString(36);
  }

  function tableKeyFor(columns, className = "") {
    return `${viewFilterKey()}:${className}:${hashText(columns.join("|"))}`;
  }

  function tableUiFor(key) {
    state.tableUi[key] = state.tableUi[key] || {
      page: 1,
      pageSize: 5,
      sortColumn: "",
      sortDir: "asc",
      quickSearch: "",
      hiddenColumns: [],
    };
    return state.tableUi[key];
  }

  function enhancedTableEnabled(columns, rows, className = "") {
    if (!rows.length || columns.length < 4) return false;
    if (className.includes("permission-table") || className.includes("limit-level-table")) return false;
    if (columns.includes("欄位") && columns.includes("內容")) return false;
    return true;
  }

  function comparableCellValue(value) {
    const text = stripHtml(value);
    const numeric = parseMoneyText(text);
    if (Number.isFinite(numeric)) return numeric;
    return text.toLowerCase();
  }

  function visibleColumnIndexes(columns, ui) {
    const hidden = new Set(ui.hiddenColumns || []);
    const indexes = columns
      .map((column, index) => ({ column, index }))
      .filter(({ column }) => !hidden.has(column))
      .map(({ index }) => index);
    return indexes.length ? indexes : columns.map((_, index) => index);
  }

  function filterTableRows(rows, ui) {
    const keyword = String(ui.quickSearch || "").trim().toLowerCase();
    if (!keyword) return rows;
    return rows.filter((row) => row.some((cell) => stripHtml(cell).toLowerCase().includes(keyword)));
  }

  function sortTableRows(columns, rows, ui) {
    const columnIndex = columns.indexOf(ui.sortColumn);
    if (columnIndex < 0) return rows;
    const direction = ui.sortDir === "desc" ? -1 : 1;
    return [...rows].sort((left, right) => {
      const leftValue = comparableCellValue(left[columnIndex]);
      const rightValue = comparableCellValue(right[columnIndex]);
      if (typeof leftValue === "number" && typeof rightValue === "number") return (leftValue - rightValue) * direction;
      return String(leftValue).localeCompare(String(rightValue), "zh-Hant") * direction;
    });
  }

  function csvEscape(value) {
    return `"${stripHtml(value).replaceAll('"', '""')}"`;
  }

  function exportRowsToCsv(columns, rows, filename) {
    const csv = [columns.map(csvEscape).join(","), ...rows.map((row) => columns.map((_, index) => csvEscape(row[index] || "")).join(","))].join("\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function renderEnhancedTable(columns, rows, className = "") {
    const tableKey = tableKeyFor(columns, className);
    const ui = tableUiFor(tableKey);
    const filteredRows = filterTableRows(rows, ui);
    const sortedRows = sortTableRows(columns, filteredRows, ui);
    const pageCount = Math.max(1, Math.ceil(sortedRows.length / ui.pageSize));
    ui.page = Math.min(Math.max(1, Number(ui.page || 1)), pageCount);
    const start = (ui.page - 1) * ui.pageSize;
    const pageRows = sortedRows.slice(start, start + ui.pageSize);
    const visibleIndexes = visibleColumnIndexes(columns, ui);
    const visibleColumns = visibleIndexes.map((index) => columns[index]);
    const columnMenu = columns.map((column) => `
      <label class="table-column-choice">
        <input type="checkbox" data-table-column="${escapeHtml(column)}" ${ui.hiddenColumns.includes(column) ? "" : "checked"} />
        <span>${escapeHtml(column)}</span>
      </label>
    `).join("");
    const sortLabel = ui.sortColumn ? `${ui.sortColumn} ${ui.sortDir === "desc" ? "降冪" : "升冪"}` : "未排序";

    return `
      <div class="table-workbench" data-table-key="${escapeHtml(tableKey)}">
        <form class="table-toolbar" data-table-search-form>
          <label class="table-search"><span>表格搜尋</span><input data-table-search value="${escapeHtml(ui.quickSearch)}" placeholder="搜尋本表資料" /></label>
          <div class="table-toolbar-actions">
            <button class="secondary" type="submit">套用</button>
            <button class="secondary" type="button" data-table-save-filters>儲存條件</button>
            <button class="secondary" type="button" data-table-restore-filters>套用已存</button>
            <button class="secondary" type="button" data-table-export>匯出 CSV</button>
            <details class="column-picker">
              <summary>欄位</summary>
              <div>${columnMenu}</div>
            </details>
            <label class="page-size"><span>每頁</span><select data-table-page-size>
              ${[5, 10, 20].map((size) => `<option value="${size}" ${ui.pageSize === size ? "selected" : ""}>${size}</option>`).join("")}
            </select></label>
          </div>
        </form>
        <div class="table-state-row">
          <span>排序：${escapeHtml(sortLabel)}</span>
          <span>顯示 ${pageRows.length} / ${sortedRows.length} 筆</span>
        </div>
        ${pageRows.length ? `
          <div class="table-scroll">
            <table class="${className}">
              <thead><tr>${visibleColumns.map((column) => `
                <th><button class="table-sort-btn" type="button" data-table-sort="${escapeHtml(column)}">${escapeHtml(column)}${ui.sortColumn === column ? `<span>${ui.sortDir === "desc" ? "↓" : "↑"}</span>` : ""}</button></th>
              `).join("")}</tr></thead>
              <tbody>
                ${pageRows.map((row) => `<tr>${visibleIndexes.map((index) => formatCell(row[index], index, columns, row, className)).join("")}</tr>`).join("")}
              </tbody>
            </table>
          </div>
        ` : `<div class="empty table-empty-state"><strong>沒有符合條件的資料</strong><span>可以清除表格搜尋或重設查詢條件。</span></div>`}
        <div class="table-footer">
          <span>共 ${sortedRows.length} 筆，第 ${ui.page} / ${pageCount} 頁</span>
          <div class="page-buttons">
            <button type="button" data-table-page="prev">‹</button>
            ${Array.from({ length: pageCount }, (_, index) => `<button type="button" data-table-page="${index + 1}" ${ui.page === index + 1 ? "class='active-page'" : ""}>${index + 1}</button>`).join("")}
            <button type="button" data-table-page="next">›</button>
          </div>
        </div>
      </div>
    `;
  }

  const baseFormatCell = formatCell;
  formatCell = function (cell, index, columns, row = [], source = "") {
    const text = String(cell);
    if (columns[index] === "操作" && String(row[0] || "").startsWith("LA-")) {
      return `<td data-label="${escapeHtml(columns[index] || "")}"><button class="${text === "審核" ? "primary" : "secondary"} limit-approval-btn" type="button" data-limit-application="${escapeHtml(row[0])}">${escapeHtml(text)}</button></td>`;
    }
    return baseFormatCell(cell, index, columns, row, source);
  };

  const baseTableTemplate = tableTemplate;
  tableTemplate = function (columns, rows, className = "") {
    if (!enhancedTableEnabled(columns, rows, className)) return baseTableTemplate(columns, rows, className);
    return renderEnhancedTable(columns, rows, className);
  };

  function bindEnhancedTables() {
    document.querySelectorAll(".table-workbench").forEach((workbench) => {
      const key = workbench.dataset.tableKey;
      const ui = tableUiFor(key);
      const rerender = () => renderActiveView();
      workbench.querySelector("[data-table-search-form]")?.addEventListener("submit", (event) => {
        event.preventDefault();
        ui.quickSearch = workbench.querySelector("[data-table-search]")?.value.trim() || "";
        ui.page = 1;
        rerender();
      });
      workbench.querySelectorAll("[data-table-sort]").forEach((button) => {
        button.addEventListener("click", () => {
          const column = button.dataset.tableSort;
          ui.sortDir = ui.sortColumn === column && ui.sortDir === "asc" ? "desc" : "asc";
          ui.sortColumn = column;
          ui.page = 1;
          rerender();
        });
      });
      workbench.querySelector("[data-table-page-size]")?.addEventListener("change", (event) => {
        ui.pageSize = Number(event.target.value) || 5;
        ui.page = 1;
        rerender();
      });
      workbench.querySelectorAll("[data-table-page]").forEach((button) => {
        button.addEventListener("click", () => {
          const pageCount = workbench.querySelectorAll("[data-table-page]").length - 2;
          const target = button.dataset.tablePage;
          if (target === "prev") ui.page = Math.max(1, ui.page - 1);
          else if (target === "next") ui.page = Math.min(Math.max(1, pageCount), ui.page + 1);
          else ui.page = Number(target);
          rerender();
        });
      });
      workbench.querySelectorAll("[data-table-column]").forEach((input) => {
        input.addEventListener("change", () => {
          const column = input.dataset.tableColumn;
          const hidden = new Set(ui.hiddenColumns);
          if (input.checked) hidden.delete(column);
          else hidden.add(column);
          ui.hiddenColumns = [...hidden];
          rerender();
        });
      });
      workbench.querySelector("[data-table-save-filters]")?.addEventListener("click", () => {
        try {
          localStorage.setItem(`riskSavedFilters:${viewFilterKey()}`, JSON.stringify(activeFilters()));
          toast("已儲存目前查詢條件");
        } catch (error) {
          toast("瀏覽器目前無法儲存查詢條件");
        }
      });
      workbench.querySelector("[data-table-restore-filters]")?.addEventListener("click", () => {
        try {
          const saved = localStorage.getItem(`riskSavedFilters:${viewFilterKey()}`);
          if (!saved) {
            toast("尚未儲存查詢條件");
            return;
          }
          state.filters[viewFilterKey()] = JSON.parse(saved);
          toast("已套用已儲存條件");
          rerender();
        } catch (error) {
          toast("瀏覽器目前無法讀取已存條件");
          return;
        }
      });
      workbench.querySelector("[data-table-export]")?.addEventListener("click", () => {
        const headers = [...workbench.querySelectorAll("thead th")].map((cell) => canonicalText(cell.textContent).replace(/[↑↓]/g, ""));
        const bodyRows = [...workbench.querySelectorAll("tbody tr")].map((row) => [...row.children].map((cell) => cell.textContent.trim()));
        exportRowsToCsv(headers, bodyRows, `${viewFilterKey()}-${Date.now()}.csv`);
        toast("已匯出目前頁面表格 CSV");
      });
    });
  }

  function caseStatusCounts() {
    const activeCases = riskCases.filter(activeCase);
    return {
      pending: activeCases.filter((item) => item.caseStatus === "待處理").length,
      processing: activeCases.filter((item) => item.caseStatus === "處理中").length,
      supervisor: activeCases.filter((item) => item.caseStatus === "待主管覆核").length,
      overdue: activeCases.filter((item) => item.sla === "逾期").length,
      done: riskCases.filter((item) => item.caseStatus === "已完成" || item.caseStatus === "誤判關閉").length,
    };
  }

  function caseWorkflowColumns() {
    return ["案件ID", "會員", "代理", "事件類型", "風險等級", "案件狀態", "SLA", "負責人", "建議處理", "操作"];
  }

  function caseWorkflowRows() {
    return riskCases.map((item) => [
      item.id,
      item.member,
      item.agent,
      item.type,
      item.riskLevel,
      item.caseStatus,
      item.sla,
      item.owner,
      item.suggested,
      item.caseStatus === "已完成" || item.caseStatus === "誤判關閉" ? "查看" : "處理",
    ]);
  }

  function caseTimeline(caseItem) {
    if (!caseItem) return [];
    return [
      [caseItem.time, "系統建案", `${caseItem.type} / ${caseItem.reason}`],
      [caseItem.time, "指派", `負責人 ${caseItem.owner}，SLA ${caseItem.sla}`],
      ...caseItem.evidence.map((item) => [caseItem.time, "證據", item]),
      ...pageTables.settings.rows
        .filter((row) => String(row[1]).includes(caseItem.id))
        .map((row) => [row[3], row[0], row[1]]),
    ];
  }

  function caseTimelineTemplate(caseItem) {
    const timeline = caseTimeline(caseItem);
    return `
      <div class="case-timeline">
        ${timeline.map(([time, title, body]) => `
          <article>
            <span>${escapeHtml(time)}</span>
            <strong>${escapeHtml(title)}</strong>
            <p>${escapeAndFormatMoneyText(body)}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function caseQueueTemplate() {
    const selected = riskCases.find((item) => item.id === state.selectedCaseId) || riskCases.find(activeCase) || riskCases[0];
    state.selectedCaseId = selected?.id;
    const queues = [
      ["待處理", riskCases.filter((item) => item.caseStatus === "待處理")],
      ["處理中", riskCases.filter((item) => item.caseStatus === "處理中")],
      ["待主管覆核", riskCases.filter((item) => item.caseStatus === "待主管覆核")],
      ["已完成", riskCases.filter((item) => item.caseStatus === "已完成" || item.caseStatus === "誤判關閉")],
    ];
    return `
      <section class="case-workflow-grid section-gap">
        <div class="content-card case-board-card">
          <div class="section-title-row">
            <div>
              <h2>案件處理佇列</h2>
              <p class="helper-text">可接手、升級或直接開啟處理視窗，狀態會同步寫入異動紀錄。</p>
            </div>
          </div>
          <div class="case-kanban">
            ${queues.map(([label, cases]) => `
              <section class="case-lane">
                <header><strong>${label}</strong><span>${cases.length}</span></header>
                <div>
                  ${cases.slice(0, 4).map((caseItem) => `
                    <article class="case-ticket ${caseItem.id === selected?.id ? "active" : ""}">
                      <button class="case-ticket-main" type="button" data-case-select="${caseItem.id}">
                        <span>${caseItem.id}</span>
                        <strong>${caseItem.member} / ${caseItem.type}</strong>
                        <small>${caseItem.sla}｜${caseItem.owner}</small>
                      </button>
                      <div class="case-ticket-actions">
                        <button class="secondary" type="button" data-case-claim="${caseItem.id}">接手</button>
                        <button class="secondary" type="button" data-case-escalate="${caseItem.id}">升級</button>
                        <button class="primary" type="button" data-case-handle="${caseItem.id}">處理</button>
                      </div>
                    </article>
                  `).join("") || `<div class="empty mini-empty">暫無案件</div>`}
                </div>
              </section>
            `).join("")}
          </div>
        </div>
        <aside class="content-card case-history-card">
          <h2>案件處理歷程</h2>
          ${selected ? `
            <div class="case-history-summary">
              ${riskBadge(selected.riskLevel)}
              <strong>${selected.id}</strong>
              <span>${selected.member}｜${selected.caseStatus}｜${selected.owner}</span>
            </div>
            ${caseTimelineTemplate(selected)}
          ` : `<div class="empty">暫無案件</div>`}
        </aside>
      </section>
    `;
  }

  function dashboardEnhancedTemplate() {
    const summary = dashboardSummary();
    const status = caseStatusCounts();
    const completedRecords = completedCaseRecords();
    return `
      ${pageHeader("首頁儀表板", "首頁 / 首頁儀表板", "全站風控即時監控與待辦工作台")}
      <section class="content-card dashboard-kpi-board">
        <div class="section-title-row dashboard-kpi-head">
          <div>
            <h2>今日風控總覽</h2>
            <p class="helper-text">主指標與案件狀態集中在同一區，點擊可鑽取明細。</p>
          </div>
        </div>
        <div class="metric-grid dashboard-metrics dashboard-primary-metrics">
          ${smallMetric("高風險會員", String(summary.highRiskMembers), "由風險案件歸戶", "up", "highRiskMembers")}
          ${smallMetric("今日待辦", String(summary.pendingCases), `逾期 ${summary.overdueCases} 件，點擊查看`, "up", "pendingEvents")}
          ${smallMetric("今日投注額", money(summary.todayBetAmount), "依案件有效投注加總", "good", "todayBetAmount")}
          ${smallMetric("凍結帳號", String(summary.frozenAccounts), `自動 ${summary.autoFrozen} / 人工 ${Math.max(0, summary.frozenAccounts - summary.autoFrozen)}`, "up", "frozenAccounts")}
          ${smallMetric("今日已完成", String(completedRecords.length), "主管以上可查閱", "good", COMPLETED_CASE_DETAIL_KEY)}
        </div>
        <div class="dashboard-kpi-divider"></div>
        <div class="metric-grid case-status-metrics dashboard-workflow-metrics">
          ${smallMetric("待處理案件", String(status.pending), "尚未接手")}
          ${smallMetric("處理中", String(status.processing), "已由人員承接")}
          ${smallMetric("待主管覆核", String(status.supervisor), "需二線確認", "up")}
          ${smallMetric("SLA 逾期", String(status.overdue), "需優先處理", "up")}
        </div>
      </section>
      ${caseQueueTemplate()}
      <section class="overview-grid dashboard-chart-grid">
        <div class="content-card"><h2>近30天風險事件趨勢</h2><canvas id="lineChart" height="260"></canvas></div>
        <div class="content-card"><h2>風險類型分布</h2><div class="donut-layout"><canvas id="donutChart" height="260"></canvas>${donutLegend()}</div></div>
      </section>
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>風險案件中心</h2>
          <span class="helper-text">支援排序、分頁、欄位收合、條件儲存與匯出。</span>
        </div>
        ${tableTemplate(caseWorkflowColumns(), caseWorkflowRows(), "case-center-table")}
      </section>
      ${specSection(pageSpecs.dashboard)}
    `;
  }

  const baseDashboardDetailData = dashboardDetailData;
  dashboardDetailData = function (detailKey) {
    if (detailKey !== COMPLETED_CASE_DETAIL_KEY) return baseDashboardDetailData(detailKey);
    return {
      title: "今日已完成紀錄",
      breadcrumb: "首頁 / 首頁儀表板 / 今日已完成",
      subtitle: "查閱今日已完成案件、處理結論與查閱紀錄。此頁限主管以上（含主管）角色。",
      formTitle: "查閱權限",
      guidance: "member",
      columns: completedCaseColumns(),
      rows: completedCaseRows(),
    };
  };

  function completedPermissionCard() {
    const allowed = canViewCompletedCases();
    return `
      <section class="content-card completed-permission-card">
        <div class="permission-status ${allowed ? "allowed" : "denied"}">
          <span>${allowed ? "允許查閱" : "無法查閱"}</span>
          <strong>查閱等級：主管以上（含主管）</strong>
          <p>目前帳號 ${escapeHtml(currentUserAccount())} / ${escapeHtml(currentUserRole())}</p>
        </div>
      </section>
    `;
  }

  function completedLockedTemplate(detail) {
    return `
      ${pageHeader(detail.title, detail.breadcrumb, detail.subtitle)}
      ${completedPermissionCard()}
      <section class="content-card section-gap">
        <h2>權限不足</h2>
        <div class="empty completed-locked">
          <strong>今日已完成紀錄限主管以上查閱</strong>
          <span>請使用代理風控主管、平台營運主管或系統管理員等角色登入後再查閱。</span>
        </div>
      </section>
      <section class="content-card section-gap">
        <h2>查閱紀錄</h2>
        ${tableTemplate(["查閱時間", "帳號", "角色", "查閱範圍", "結果"], completedAccessRows())}
      </section>
    `;
  }

  function completedDetailTemplate(detail) {
    recordCompletedCaseAccess();
    const values = activeFilters(`dashboard:${COMPLETED_CASE_DETAIL_KEY}`);
    const rows = filterRows(detail.columns, detail.rows, values);
    return `
      ${pageHeader(detail.title, detail.breadcrumb, detail.subtitle)}
      ${completedPermissionCard()}
      <section class="filter-bar generic-filter">
        ${filterControl(["日期", "date"], values)}
        ${filterControl(["風險等級", "select"], values)}
        <label><span>關鍵字</span><input placeholder="案件、會員、處理人" value="${escapeHtml(values["關鍵字"] || "")}" /></label>
        <button class="secondary generic-action">查詢</button>
        <button class="secondary filter-reset" type="button">清除條件</button>
        <button class="primary" id="backDashboardBtn">返回儀表板</button>
      </section>
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>今日已完成案件</h2>
          <span class="helper-text">查閱此表會寫入稽核紀錄。</span>
        </div>
        ${tableTemplate(detail.columns, rows, "completed-case-table")}
        <div class="table-footer"><span>共 ${rows.length} 筆</span><span>查閱等級：主管以上（含主管）</span></div>
      </section>
      <section class="content-card section-gap">
        <h2>查閱紀錄</h2>
        ${tableTemplate(["查閱時間", "帳號", "角色", "查閱範圍", "結果"], completedAccessRows(), "completed-access-table")}
      </section>
    `;
  }

  const baseDashboardDetailTemplate = dashboardDetailTemplate;
  dashboardDetailTemplate = function (detailKey) {
    if (detailKey !== COMPLETED_CASE_DETAIL_KEY) return baseDashboardDetailTemplate(detailKey);
    const detail = dashboardDetailData(detailKey);
    return canViewCompletedCases() ? completedDetailTemplate(detail) : completedLockedTemplate(detail);
  };

  function limitApplicationCounts() {
    return {
      pending: state.limitApplications.filter((item) => item.status === "待審核").length,
      supervisor: state.limitApplications.filter((item) => item.status === "待主管覆核").length,
      approved: state.limitApplications.filter((item) => item.status === "已核准").length,
      rejected: state.limitApplications.filter((item) => item.status === "已拒絕").length,
    };
  }

  function limitApplicationColumns() {
    return ["申請單號", "會員", "幣別", "限額類型", "原限額", "申請額度", "審核層級", "狀態", "申請人", "審核人", "操作"];
  }

  function limitApplicationRows() {
    return state.limitApplications.map((item) => [
      item.id,
      item.member,
      item.currency,
      item.type,
      item.currentAmount,
      item.proposedAmount,
      item.level,
      item.status,
      item.requester,
      item.approver,
      item.status === "待審核" || item.status === "待主管覆核" ? "審核" : "查看",
    ]);
  }

  function limitApprovalBoardTemplate() {
    const counts = limitApplicationCounts();
    return `
      <section class="metric-grid dashboard-metrics">
        ${smallMetric("待審核申請", String(counts.pending), "風控可處理", "up")}
        ${smallMetric("主管覆核", String(counts.supervisor), "高額或 L3+ 申請", "up")}
        ${smallMetric("已核准", String(counts.approved), "已轉生效紀錄", "good")}
        ${smallMetric("已拒絕", String(counts.rejected), "保留審核原因")}
      </section>
      <section class="content-card section-gap limit-approval-card">
        <div class="section-title-row">
          <div>
            <h2>限額申請與審核</h2>
            <p class="helper-text">所有新增或調整先進入申請單，再由審核結果決定是否寫入生效限額。</p>
          </div>
        </div>
        ${tableTemplate(limitApplicationColumns(), limitApplicationRows(), "limit-application-table")}
      </section>
    `;
  }

  function currentLimitAmount(member, type) {
    const row = pageTables.limitsPage.rows.find((item) => item[0] === member && normalizedLimitType(item[1]) === type && item[7] === "生效中");
    return row?.[2] || "100,000.00";
  }

  const baseLimitSettingTemplate = limitSettingTemplate;
  limitSettingTemplate = function () {
    return baseLimitSettingTemplate()
      .replace("儲存限額設定", "送出審核申請")
      .replace("會員限額設定", "會員限額申請");
  };

  const baseLimitsQueryTemplate = limitsQueryTemplate;
  limitsQueryTemplate = function () {
    const currentData = runtimePageData("限額管理", pageTables.limitsPage);
    const values = activeFilters("limitsPage");
    const rows = filterRows(currentData.columns, currentData.rows, values);
    return `
      ${pageHeader("限額查詢", "首頁 / 限額管理 / 限額查詢", "查詢會員限額、生效狀態、到期日與審核紀錄")}
      <section class="metric-grid dashboard-metrics">
        ${pageMetricCards("限額管理", { ...currentData, rows })}
      </section>
      <section class="filter-bar generic-filter section-gap">
        ${[["會員", "input"], ["幣別", "select"], ["限額類型", "select"], ["狀態", "select"], ["生效日期", "date"]].map((filter) => filterControl(filter, values)).join("")}
        <button class="primary generic-action">查詢</button>
        <button class="secondary filter-reset" type="button">清除條件</button>
      </section>
      ${limitApprovalBoardTemplate()}
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>生效限額紀錄</h2>
          <button class="primary view-link" data-view-target="limitsSetting" type="button">新增 / 調整限額</button>
        </div>
        ${tableTemplate(currentData.columns, rows)}
        <div class="table-footer"><span>共 ${rows.length} 筆</span><span>已套用目前查詢條件</span></div>
      </section>
      ${specSection(pageSpecs.limitsPage)}
    `;
  };

  const baseLimitsSettingTemplate = limitsSettingTemplate;
  limitsSettingTemplate = function () {
    const currentData = runtimePageData("限額管理", pageTables.limitsPage);
    const recentRows = currentData.rows.slice(0, 5);
    return `
      ${pageHeader("限額設定", "首頁 / 限額管理 / 限額設定", "新增、調整、取消會員限額並套用審核建議")}
      ${limitSettingTemplate()}
      ${limitApprovalBoardTemplate()}
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>最近生效限額紀錄</h2>
          <button class="secondary view-link" data-view-target="limitsQuery" type="button">返回限額查詢</button>
        </div>
        ${tableTemplate(currentData.columns, recentRows)}
        <div class="table-footer"><span>顯示最近 ${recentRows.length} 筆</span><span>審核核准後會同步更新查詢頁</span></div>
      </section>
      ${specSection(pageSpecs.limitsPage)}
    `;
  };

  bindLimitSettingWorkspace = function () {
    const form = el("limitSettingForm");
    if (!form) return;
    document.querySelectorAll("[data-limit-type]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedLimitType = button.dataset.limitType;
        renderActiveView();
      });
    });
    el("limitSettingType")?.addEventListener("change", () => {
      state.selectedLimitType = el("limitSettingType").value;
      renderActiveView();
    });
    el("limitSettingLevel")?.addEventListener("change", () => {
      state.selectedLimitLevel = el("limitSettingLevel").value;
      renderActiveView();
    });
    el("limitSettingMember")?.addEventListener("change", () => {
      state.selectedLimitMember = el("limitSettingMember").value;
      renderActiveView();
    });
    el("applyLimitSuggestionBtn")?.addEventListener("click", () => {
      const value = suggestedLimitValue(limitRecommendationRange(state.selectedLimitLevel, state.selectedLimitType));
      if (!value) {
        toast("此限額需個案審核，請手動輸入核准額度");
        return;
      }
      el("limitProposedAmount").value = value;
      toast("已套用建議區間下限");
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const amount = Number(el("limitProposedAmount")?.value);
      const reason = el("limitSettingReason")?.value.trim();
      if (!Number.isFinite(amount) || amount < 0) {
        toast("請輸入有效的設定額度");
        return;
      }
      if (!reason) {
        toast("請輸入設定原因");
        return;
      }
      const member = el("limitSettingMember")?.value || state.selectedLimitMember;
      const memberRow = memberRows.find((row) => row[0] === member);
      const type = el("limitSettingType")?.value || state.selectedLimitType;
      const level = el("limitSettingLevel")?.value || state.selectedLimitLevel;
      const application = {
        id: `LA-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(state.limitApplications.length + 1).padStart(3, "0")}`,
        member,
        currency: memberRow?.[4] || currentCurrency(),
        type,
        currentAmount: currentLimitAmount(member, type),
        proposedAmount: Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        level,
        status: level === "L3" || level === "L4" || level === "R" || amount > 100000 ? "待主管覆核" : "待審核",
        requester: "admin",
        approver: level === "L3" || level === "L4" || level === "R" ? "opslead" : "risk01",
        createdAt: updateTimestamp(),
        effectiveFrom: (el("limitEffectiveFrom")?.value || "2025-04-03T15:30").replace("T", " "),
        effectiveTo: (el("limitEffectiveTo")?.value || "2025-04-10T23:59").replace("T", " "),
        reason,
        history: ["admin 建立申請", "系統完成限額區間檢查"],
      };
      state.limitApplications.unshift(application);
      appendAuditLog("限額申請", `${application.id}｜${member}｜${type}｜${application.status}`, "限額管理 / 限額設定", "admin");
      renderActiveView();
      toast(`${member} 的 ${type} 已建立審核申請`);
    });
  };

  function approveLimitApplication(application, decision, note) {
    application.status = decision === "approve" ? "已核准" : "已拒絕";
    application.history.push(`${application.status}｜${note}`);
    if (decision === "approve") {
      pageTables.limitsPage.rows.unshift([
        application.member,
        application.type,
        application.proposedAmount,
        application.effectiveFrom,
        application.effectiveTo,
        application.reason,
        "admin",
        "生效中",
        "查看",
      ]);
      updateMemberStatus(application.member, "限額中");
    }
    appendAuditLog("限額審核", `${application.id}｜${application.status}｜${note}`, "限額管理 / 限額審核", "admin");
  }

  function openLimitApprovalModal(applicationId) {
    const application = state.limitApplications.find((item) => item.id === applicationId);
    if (!application) return;
    el("modalTitle").textContent = "限額審核";
    el("modalBody").innerHTML = `
      <div class="limit-approval-summary">
        <span class="badge warning">${escapeHtml(application.status)}</span>
        <strong>${escapeHtml(application.id)}</strong>
        <p>${escapeHtml(application.member)}｜${escapeHtml(application.type)}｜${escapeHtml(application.reason)}</p>
      </div>
      ${tableTemplate(["項目", "異動前", "異動後"], [
        ["限額金額", application.currentAmount, application.proposedAmount],
        ["生效時間", "-", application.effectiveFrom],
        ["到期時間", "-", application.effectiveTo],
        ["審核層級", "-", application.level],
      ], "limit-compare-table")}
      <div class="case-timeline">
        ${application.history.map((item) => `<article><span>${escapeHtml(application.createdAt)}</span><strong>流程紀錄</strong><p>${escapeHtml(item)}</p></article>`).join("")}
      </div>
      <label><span>審核備註</span><textarea id="limitApprovalNote">已核對風險分數、會員層級與建議區間。</textarea></label>
    `;
    el("modalFooter").innerHTML = `<button class="secondary" id="cancelAction">取消</button><button class="secondary" id="rejectLimitApplication">拒絕</button><button class="primary" id="approveLimitApplication">核准</button>`;
    el("modalBackdrop").hidden = false;
    el("cancelAction").addEventListener("click", closeModal);
    el("rejectLimitApplication").addEventListener("click", () => {
      const note = el("limitApprovalNote")?.value.trim();
      if (!note) {
        toast("請填寫審核備註");
        return;
      }
      approveLimitApplication(application, "reject", note);
      closeModal();
      renderActiveView();
      toast(`${application.id} 已拒絕並寫入審核紀錄`);
    });
    el("approveLimitApplication").addEventListener("click", () => {
      const note = el("limitApprovalNote")?.value.trim();
      if (!note) {
        toast("請填寫審核備註");
        return;
      }
      approveLimitApplication(application, "approve", note);
      closeModal();
      renderActiveView();
      toast(`${application.id} 已核准並轉為生效限額`);
    });
  }

  function bindEnhancedWorkflows() {
    bindEnhancedTables();
    document.querySelectorAll("[data-case-select]").forEach((button) => {
      button.addEventListener("click", () => {
        state.selectedCaseId = button.dataset.caseSelect;
        renderActiveView();
      });
    });
    document.querySelectorAll("[data-case-claim]").forEach((button) => {
      button.addEventListener("click", () => {
        const caseItem = riskCases.find((item) => item.id === button.dataset.caseClaim);
        if (!caseItem) return;
        caseItem.owner = "admin";
        updateCaseStatus(caseItem, "處理中", "admin 已接手案件");
        state.selectedCaseId = caseItem.id;
        renderActiveView();
        toast(`${caseItem.id} 已接手`);
      });
    });
    document.querySelectorAll("[data-case-escalate]").forEach((button) => {
      button.addEventListener("click", () => {
        const caseItem = riskCases.find((item) => item.id === button.dataset.caseEscalate);
        if (!caseItem) return;
        updateCaseStatus(caseItem, "待主管覆核", "由案件中心升級覆核");
        state.selectedCaseId = caseItem.id;
        renderActiveView();
        toast(`${caseItem.id} 已升級主管覆核`);
      });
    });
    document.querySelectorAll("[data-case-handle]").forEach((button) => {
      button.addEventListener("click", () => {
        openDetailModal("處理", { columns: ["案件ID"], row: [button.dataset.caseHandle], source: "case-board" });
      });
    });
    document.querySelectorAll("[data-limit-application]").forEach((button) => {
      button.addEventListener("click", () => openLimitApprovalModal(button.dataset.limitApplication));
    });
  }

  Object.assign(pageTemplates, {
    dashboard: dashboardEnhancedTemplate,
    memberQuery: memberQueryTemplate,
    member: memberQueryTemplate,
    bettingQuery: bettingQueryTemplate,
    bettingAnalysis: bettingAnalysisTemplate,
    betting: bettingQueryTemplate,
    groupQuery: groupQueryTemplate,
    groupGraph: groupGraphPageTemplate,
    group: groupGraphPageTemplate,
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
    "會員查詢": ["先篩選會員與風險等級", "查看帳號狀態", "點詳情進入風險檢視"],
    "投注查詢": ["先設定日期與風險等級", "查看命中規則", "點查看開啟明細"],
    "行為分析": ["先看高風險行為", "確認命中規則", "回投注查詢調整條件"],
    "集團查詢": ["先查集團或風險等級", "查看共同 IP 與裝置", "前往圖譜確認關聯"],
    "關聯圖譜": ["選擇集團", "展開或收合圖譜", "點節點查看關聯證據"],
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

  Object.assign(fieldDescriptions, {
    "今日已完成": ["今日已完成的風險案件數量，包含人工處理完成與不做處置後結案的案件。", "數值型 KPI；點擊後進入今日已完成紀錄，查閱等級需主管以上（含主管）。"],
    "待處理案件": ["尚未由人員接手的風險案件數量。", "數值型 KPI；需可從案件中心接手。"],
    "處理中": ["已由風控人員接手但尚未完成或送主管覆核的案件數量。", "數值型 KPI；案件中心需顯示負責人與歷程。"],
    "待主管覆核": ["需要代理風控主管、平台營運主管或系統管理員等角色覆核的案件數量。", "數值型 KPI；高額、凍結或敏感案件需進入此狀態。"],
    "SLA 逾期": ["已超過處理期限的案件數量。", "數值型 KPI；需以警示樣式顯示並優先處理。"],
    "案件處理歷程": ["選中案件的接手、升級、處置與完成紀錄。", "時間軸；需保留操作人、時間與處置原因。"],
    "查閱等級": ["可查看今日已完成紀錄的最低權限等級。", "主管以上（含主管）；未達權限時只能看到權限說明。"],
    "查閱紀錄": ["記錄誰在何時查閱今日已完成資料，以及查閱範圍與結果。", "日期時間、帳號、角色、範圍、結果；需寫入稽核紀錄。"],
    "不做處置原因": ["人工判斷本次不採取限額、觀察或凍結時填寫的原因。", "必填文字；送出後案件標記為已完成並寫入稽核紀錄。"],
    "申請單號": ["限額新增或調整申請的唯一識別碼。", "字串；例如 LA-YYYYMMDD-001。"],
    "申請額度": ["申請人希望調整後生效的限額金額。", "金額；不可為負，需符合幣別小數位。"],
    "審核層級": ["本次限額申請需要的覆核層級。", "L3、L4、R 或高額申請需主管覆核。"],
    "流程紀錄": ["限額申請建立、系統檢查、核准或拒絕的過程。", "時間軸；每一步需保留操作人與備註。"],
  });

  Object.assign(pageSpecs, {
    dashboard: [
      ["頁面目的", "提供全站風控即時概況與待辦入口，聚合今日風控總覽、案件狀態、風險案件中心與圖表分析。"],
      ["核心功能", "五張主要 KPI、四張案件狀態統計、案件接手 / 升級 / 處理、今日已完成主管以上查閱、風險趨勢與風險類型分布。"],
      ["權限規則", "今日已完成紀錄限主管以上（含主管）查閱；查閱需記錄帳號、角色、時間、範圍與結果。"],
      ["驗收標準", "點擊 KPI 可鑽取明細；案件處理會更新狀態、歷程與稽核；表格支援搜尋、排序、分頁、欄位收合、條件儲存與 CSV 匯出。"],
    ],
    member: [
      ["頁面目的", "提供風控人員先篩選會員，再進入單一會員風險檢視與處置。"],
      ["核心功能", "會員查詢、風險檢視、風險計算說明、限額 Tab、調整限額、加入觀察名單、凍結帳號、不做處置與備註。"],
      ["處置規則", "不做處置需填寫原因，送出後不改變會員限制，但會將案件標記為已完成並寫入稽核紀錄。"],
      ["驗收標準", "點擊詳情帶入會員摘要；所有敏感操作需原因；限額調整可跳轉限額設定；不做處置需留下人工判斷紀錄。"],
    ],
    limitsPage: [
      ["頁面目的", "集中處理會員限額查詢、限額申請、審核與生效紀錄。"],
      ["核心功能", "限額查詢、會員限額申請、限額申請與審核清單、核准 / 拒絕、異動前後比較、流程紀錄、生效限額同步。"],
      ["權限規則", "低額可由風控審核；L3、L4、R 或高額申請需主管覆核；所有審核需填寫備註。"],
      ["驗收標準", "送出限額設定先建立申請單；核准後新增生效限額並更新查詢頁；拒絕需保留原因與流程紀錄。"],
    ],
  });

  Object.assign(specDocuments, {
    "首頁儀表板": {
      purpose: "提供全站風控即時概況與待辦入口，協助風控人員掌握今日風控總覽、案件狀態、待處理風險與主管查閱資料。",
      fields: ["高風險會員", "今日待辦", "今日投注額", "凍結帳號", "今日已完成", "待處理案件", "處理中", "待主管覆核", "SLA 逾期", "風險案件中心", "案件處理歷程", "近30天風險事件趨勢", "風險類型分布", "提醒事件"],
      actions: ["點擊 KPI 卡片進入對應詳細表單", "查閱今日已完成紀錄", "接手案件", "升級主管覆核", "處理案件", "查看案件處理歷程", "表格搜尋 / 排序 / 分頁 / 欄位收合", "匯出 CSV", "點擊提醒前往對應頁面"],
      api: ["GET /api/risk/dashboard/summary", "GET /api/risk/dashboard/cases", "GET /api/risk/dashboard/completed-today", "POST /api/risk/dashboard/completed-today/access-log", "GET /api/risk/dashboard/trends", "GET /api/risk/dashboard/event-types"],
      acceptance: ["需顯示五張主要 KPI 與四張案件狀態統計", "今日已完成限主管以上（含主管）查閱", "查閱今日已完成需寫入查閱紀錄", "案件接手、升級與處理需更新狀態與歷程", "風險類型分布需以風控事件件數統計", "表格工具列需可搜尋、排序、分頁、收合欄位與匯出 CSV"],
    },
    "今日已完成紀錄": {
      purpose: "提供主管以上角色查閱今日已完成案件、處理結論與查閱紀錄，便於日終覆盤與稽核。",
      fields: ["完成時間", "案件ID", "會員", "事件類型", "風險等級", "完成結論", "處理人", "原負責人", "查閱等級", "查閱紀錄"],
      actions: ["依日期、風險等級與關鍵字查詢", "返回儀表板", "查看查閱紀錄"],
      api: ["GET /api/risk/dashboard/completed-today", "POST /api/risk/dashboard/completed-today/access-log"],
      acceptance: ["主管以上（含主管）才可查看完成案件內容", "未授權角色需顯示權限不足與允許角色說明", "每次成功查閱需新增查閱紀錄並寫入稽核", "查詢條件需篩選完成案件清單"],
    },
    "會員風險分析": {
      purpose: "提供會員風險列表，讓風控人員先篩選會員，再進入單一會員風險檢視。",
      fields: ["會員帳號", "會員ID", "代理帳號", "會員層級", "幣別", "風險評分", "風險等級", "帳號狀態", "最後登入", "操作"],
      actions: ["查詢會員", "清除條件", "進入詳情", "匯出資料", "表格搜尋 / 排序 / 分頁 / 欄位收合"],
      api: ["GET /api/risk/members"],
      acceptance: ["統計卡需位於篩選欄位上方", "列表可依幣別、風險等級與狀態篩選", "詳情需帶入會員摘要資料", "返回後保留列表與查詢上下文"],
    },
    "會員風險檢視": {
      purpose: "查看單一會員風險評分、投注行為、盈虧趨勢、限額紀錄、事件紀錄與處置操作。",
      fields: ["會員帳號", "日期範圍", "類型", "代理帳號", "幣別", "會員摘要", "核心指標", "建議處理方式", "被列入風險原因", "風險總覽", "風險計算說明", "投注明細", "遊戲紀錄", "高風險投注分析", "盈虧歷史", "限額紀錄", "備註紀錄", "不做處置原因"],
      actions: ["查詢", "返回列表", "調整限額", "加入觀察名單", "凍結帳號", "不做處置", "新增備註", "查看風險計算說明", "前往限額調整"],
      api: ["GET /api/risk/member/summary", "GET /api/risk/member/metrics", "GET /api/risk/member/overview", "POST /api/risk/member/actions/*", "POST /api/risk/events/{id}/no-action"],
      acceptance: ["日期不可超過 90 天", "風險等級顏色正確", "所有操作需填寫原因", "凍結等敏感操作需二次確認", "不做處置需填寫原因、完成案件並寫入稽核紀錄"],
    },
    "限額管理": {
      purpose: "集中管理會員限額查詢、限額申請、審核、取消與操作追蹤；會員目前限額也可由會員風險檢視的限額 Tab 查閱。",
      fields: ["會員帳號", "幣別", "限額類型", "限額層級", "目前限額", "申請單號", "申請額度", "審核層級", "狀態", "生效時間", "到期時間", "原因", "審核人", "流程紀錄", "操作人"],
      actions: ["查詢限額", "送出審核申請", "查看限額申請與審核", "核准申請", "拒絕申請", "查看異動前後比較", "查看審核紀錄", "匯出資料"],
      api: ["GET /api/risk/limits", "GET /api/risk/limits/templates", "GET /api/risk/limits/usage", "GET /api/risk/limits/applications", "POST /api/risk/limits/applications", "POST /api/risk/limits/applications/{id}/approve", "POST /api/risk/limits/applications/{id}/reject", "PUT /api/risk/limits/{id}", "POST /api/risk/limits/{id}/cancel"],
      acceptance: ["限額查詢統計需位於篩選欄位上方", "限額設定送出後先建立申請單，不可直接生效", "審核 modal 需顯示異動前 / 後比較與流程紀錄", "核准後需新增生效限額並更新查詢頁", "拒絕需保存審核備註", "L3 以上或高額升額需主管覆核"],
    },
  });

  Object.assign(specDocuments, {
    "會員查詢": specDocuments["會員風險分析"] || specDocuments["會員風險檢視"],
    "投注查詢": specDocuments["投注行為分析"],
    "行為分析": specDocuments["投注行為分析"],
    "集團查詢": specDocuments["集團風險偵測"],
    "關聯圖譜": specDocuments["集團風險偵測"],
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
    if (view === "memberQuery" || view === "memberDetail" || view === "member") return "member";
    if (view === "bettingQuery" || view === "bettingAnalysis" || view === "betting") return "betting";
    if (view === "groupQuery" || view === "groupGraph" || view === "group") return "group";
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

  const baseRenderMemberPage = renderMemberPage;
  renderMemberPage = function () {
    if (state.memberMode === "detail") {
      state.currentView = "memberDetail";
      activateNav("memberDetail");
      baseRenderMemberPage();
      return;
    }
    state.currentView = "memberQuery";
    activateNav("memberQuery");
    document.querySelector(".content").innerHTML = memberQueryTemplate();
    bindMemberListEvents();
    resetScrollPosition();
  };

  const baseRenderMemberDetail = renderMemberDetail;
  renderMemberDetail = function () {
    state.currentView = "memberDetail";
    activateNav("memberDetail");
    baseRenderMemberDetail();
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
    if (nextView === "memberQuery") {
      state.memberMode = "list";
      state.currentView = "memberQuery";
      activateNav(nextView);
      document.querySelector(".content").innerHTML = memberQueryTemplate();
      bindMemberListEvents();
      resetScrollPosition();
      return;
    }
    if (nextView === "memberDetail") {
      state.memberMode = "detail";
      state.currentView = "memberDetail";
      activateNav(nextView);
      renderMemberDetail();
      return;
    }
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
    if (nextView === "memberQuery" || nextView === "memberDetail") {
      renderView(nextView);
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
        if (targetView === "memberDetail") toast("已前往會員風險檢視");
        if (targetView === "memberQuery") toast("已返回會員查詢");
        if (targetView === "bettingQuery") toast("已返回投注查詢");
        if (targetView === "groupQuery") toast("已返回集團查詢");
        if (targetView === "groupGraph") toast("已前往關聯圖譜");
      });
    });
    el("groupGraphSelect")?.addEventListener("change", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      state.selectedGroup = el("groupGraphSelect").value;
      state.groupGraphExpanded = false;
      renderView("groupGraph");
      toast(`已切換至 ${state.selectedGroup} 關聯圖譜`);
    }, true);
    document.querySelectorAll(".relation-mode-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        state.groupGraphExpanded = button.dataset.expanded === "true";
        renderView("groupGraph");
      }, true);
    });
    bindEnhancedWorkflows();
  };

  const baseBindMemberListEvents = bindMemberListEvents;
  bindMemberListEvents = function () {
    baseBindMemberListEvents();
    bindEnhancedTables();
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
  if (document.body.classList.contains("is-authenticated")) {
    renderActiveView();
  }
})();
