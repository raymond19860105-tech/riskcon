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

  Object.assign(pageTemplates, {
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
