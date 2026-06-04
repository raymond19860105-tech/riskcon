const state = {
  currentView: "dashboard",
  memberMode: "list",
  ruleMode: "list",
  dashboardMode: "main",
  dashboardDetail: "highRiskMembers",
  activeTab: "overview",
  member: "test003",
  page: 1,
  pageSize: 10,
  accountStatus: "正常",
  watchlisted: false,
  memberPageHTML: "",
  currency: "CNY",
  language: "zh-Hant",
  selectedGroup: "GRP-2048",
  groupGraphExpanded: false,
  settingsTab: "general",
  selectedLimitType: "單日投注額上限",
  selectedLimitLevel: "L2",
  selectedLimitMember: "test003",
  filters: {},
  selectedRow: null,
};

const THEME_STORAGE_KEY = "riskDashboardTheme";
const CURRENCY_STORAGE_KEY = "riskDashboardCurrency";
const LANGUAGE_STORAGE_KEY = "riskDashboardLanguage";
const AUTH_STORAGE_KEY = "riskDashboardAuthenticated";
const LOGIN_CREDENTIAL = "830606";

let appStarted = false;

const currencySettings = {
  CNY: { label: "人民幣 CNY", symbol: "¥", rateToCny: 1, decimals: 2 },
  USD: { label: "美元 USD", symbol: "$", rateToCny: 7.2, decimals: 2 },
  HKD: { label: "港幣 HKD", symbol: "HK$", rateToCny: 0.92, decimals: 2 },
  TWD: { label: "新台幣 TWD", symbol: "NT$", rateToCny: 0.23, decimals: 0 },
  JPY: { label: "日圓 JPY", symbol: "¥", rateToCny: 0.048, decimals: 0 },
  KRW: { label: "韓元 KRW", symbol: "₩", rateToCny: 0.0053, decimals: 0 },
};

const languageSettings = {
  "zh-Hant": { label: "繁體中文", htmlLang: "zh-Hant" },
  "zh-Hans": { label: "简体中文", htmlLang: "zh-Hans" },
  en: { label: "English", htmlLang: "en" },
  vi: { label: "Tiếng Việt", htmlLang: "vi" },
};

const languageTranslations = {
  "風控管理後台": { "zh-Hans": "风控管理后台", en: "Risk Operations Console", vi: "Bảng điều khiển quản trị rủi ro" },
  "語系": { "zh-Hans": "语言", en: "Language", vi: "Ngôn ngữ" },
  "語系已切換": { "zh-Hans": "语言已切换", en: "Language updated", vi: "Đã đổi ngôn ngữ" },
  "設定已儲存，敏感設定異動已記錄": { "zh-Hans": "设置已保存，敏感设置变更已记录", en: "Settings saved. Sensitive setting changes have been logged.", vi: "Đã lưu cài đặt. Thay đổi nhạy cảm đã được ghi nhật ký." },
  "查詢完成，列表與統計已依目前條件更新": { "zh-Hans": "查询完成，列表与统计已按当前条件更新", en: "Search completed. Lists and metrics have been updated.", vi: "Tra cứu hoàn tất. Danh sách và chỉ số đã được cập nhật." },
  "已建立匯出任務，完成後會出現在報表管理": { "zh-Hans": "已建立导出任务，完成后会出现在报表管理", en: "Export job created. It will appear in Report Management when ready.", vi: "Đã tạo tác vụ xuất dữ liệu. Khi hoàn tất sẽ hiển thị trong Quản lý báo cáo." },
  "測試通知已送出，請查看右上角提醒": { "zh-Hans": "测试通知已送出，请查看右上角提醒", en: "Test notification sent. Check the alert area in the top right.", vi: "Đã gửi thông báo thử. Vui lòng kiểm tra thông báo ở góc trên bên phải." },
  "繁體中文": { "zh-Hans": "繁体中文", en: "Traditional Chinese", vi: "Tiếng Trung phồn thể" },
  "简体中文": { "zh-Hans": "简体中文", en: "Simplified Chinese", vi: "Tiếng Trung giản thể" },
  "首頁儀表板": { "zh-Hans": "首页仪表板", en: "Dashboard", vi: "Bảng điều khiển" },
  "會員風險分析": { "zh-Hans": "会员风险分析", en: "Member Risk Analysis", vi: "Phân tích rủi ro hội viên" },
  "投注行為分析": { "zh-Hans": "投注行为分析", en: "Betting Behavior Analysis", vi: "Phân tích hành vi đặt cược" },
  "集團風險偵測": { "zh-Hans": "集团风险侦测", en: "Syndicate Risk Detection", vi: "Phát hiện rủi ro nhóm tài khoản" },
  "限額管理": { "zh-Hans": "限额管理", en: "Limit Management", vi: "Quản lý hạn mức" },
  "限額查詢": { "zh-Hans": "限额查询", en: "Limit Search", vi: "Tra cứu hạn mức" },
  "限額設定": { "zh-Hans": "限额设置", en: "Limit Settings", vi: "Thiết lập hạn mức" },
  "風控規則設定": { "zh-Hans": "风控规则设置", en: "Risk Rule Settings", vi: "Thiết lập quy tắc rủi ro" },
  "風控規則": { "zh-Hans": "风控规则", en: "Risk Rules", vi: "Quy tắc rủi ro" },
  "規則查詢": { "zh-Hans": "规则查询", en: "Rule Search", vi: "Tra cứu quy tắc" },
  "規則設定": { "zh-Hans": "规则设置", en: "Rule Settings", vi: "Thiết lập quy tắc" },
  "報表管理": { "zh-Hans": "报表管理", en: "Report Management", vi: "Quản lý báo cáo" },
  "報表查詢": { "zh-Hans": "报表查询", en: "Report Search", vi: "Tra cứu báo cáo" },
  "報表設定": { "zh-Hans": "报表设置", en: "Report Settings", vi: "Thiết lập báo cáo" },
  "系統設定": { "zh-Hans": "系统设置", en: "System Settings", vi: "Cài đặt hệ thống" },
  "最後更新時間": { "zh-Hans": "最后更新时间", en: "Last updated", vi: "Cập nhật lần cuối" },
  "重新整理": { "zh-Hans": "刷新", en: "Refresh", vi: "Làm mới" },
  "收合選單": { "zh-Hans": "收合菜单", en: "Collapse menu", vi: "Thu gọn menu" },
  "切換深色模式": { "zh-Hans": "切换深色模式", en: "Switch to dark mode", vi: "Chuyển sang chế độ tối" },
  "切換淺色模式": { "zh-Hans": "切换浅色模式", en: "Switch to light mode", vi: "Chuyển sang chế độ sáng" },
  "深色": { "zh-Hans": "深色", en: "Dark", vi: "Tối" },
  "淺色": { "zh-Hans": "浅色", en: "Light", vi: "Sáng" },
  "通知": { "zh-Hans": "通知", en: "Notifications", vi: "Thông báo" },
  "登入風控後台": { "zh-Hans": "登录风控后台", en: "Sign In to Risk Console", vi: "Đăng nhập bảng rủi ro" },
  "使用授權帳號後才能查看內頁": { "zh-Hans": "使用授权账号后才能查看内页", en: "Sign in with an authorized account to view the console.", vi: "Đăng nhập tài khoản được cấp quyền để xem hệ thống." },
  "帳號": { "zh-Hans": "账号", en: "Account", vi: "Tài khoản" },
  "密碼": { "zh-Hans": "密码", en: "Password", vi: "Mật khẩu" },
  "請輸入帳號": { "zh-Hans": "请输入账号", en: "Enter account", vi: "Nhập tài khoản" },
  "請輸入密碼": { "zh-Hans": "请输入密码", en: "Enter password", vi: "Nhập mật khẩu" },
  "帳號或密碼錯誤": { "zh-Hans": "账号或密码错误", en: "Invalid account or password", vi: "Sai tài khoản hoặc mật khẩu" },
  "登入": { "zh-Hans": "登录", en: "Sign In", vi: "Đăng nhập" },
  "登入成功": { "zh-Hans": "登录成功", en: "Signed in", vi: "Đã đăng nhập" },
  "登出": { "zh-Hans": "登出", en: "Sign Out", vi: "Đăng xuất" },
  "已登出": { "zh-Hans": "已登出", en: "Signed out", vi: "Đã đăng xuất" },
  "規格說明": { "zh-Hans": "规格说明", en: "Specifications", vi: "Đặc tả" },
  "風險計算說明": { "zh-Hans": "风险计算说明", en: "Risk Calculation", vi: "Giải thích tính rủi ro" },
  "清除條件": { "zh-Hans": "清除条件", en: "Clear Filters", vi: "Xóa bộ lọc" },
  "已清除查詢條件": { "zh-Hans": "已清除查询条件", en: "Filters cleared", vi: "Đã xóa bộ lọc" },
  "展開流程提示": { "zh-Hans": "展开流程提示", en: "Show workflow tips", vi: "Xem gợi ý quy trình" },
  "公式": { "zh-Hans": "公式", en: "Formula", vi: "Công thức" },
  "資料來源": { "zh-Hans": "数据来源", en: "Data Source", vi: "Nguồn dữ liệu" },
  "風險判讀": { "zh-Hans": "风险判读", en: "Risk Reading", vi: "Diễn giải rủi ro" },
  "注意事項": { "zh-Hans": "注意事项", en: "Notes", vi: "Lưu ý" },
  "以下說明每個風險數值怎麼來；輸贏採玩家視角，正數代表玩家贏錢，負數代表平台贏錢。": { "zh-Hans": "以下说明每个风险数值怎么来；输赢采用玩家视角，正数代表玩家赢钱，负数代表平台赢钱。", en: "Explains how each risk value is calculated. Win/loss is from the player view: positive means the player wins, negative means the platform wins.", vi: "Giải thích cách tính từng chỉ số rủi ro. Thắng/thua theo góc nhìn người chơi: số dương là người chơi thắng, số âm là nền tảng thắng." },
  "功能規格摘要": { "zh-Hans": "功能规格摘要", en: "Feature Spec Summary", vi: "Tóm tắt đặc tả tính năng" },
  "建議流程": { "zh-Hans": "建议流程", en: "Suggested flow", vi: "Quy trình gợi ý" },
  "一般設定": { "zh-Hans": "一般设置", en: "General Settings", vi: "Cài đặt chung" },
  "限額設定類別": { "zh-Hans": "限额设置类别", en: "Limit Categories", vi: "Nhóm thiết lập hạn mức" },
  "管理者與權限": { "zh-Hans": "管理员与权限", en: "Admins & Permissions", vi: "Quản trị viên & quyền" },
  "異動紀錄": { "zh-Hans": "变更记录", en: "Change Log", vi: "Nhật ký thay đổi" },
  "管理者帳號": { "zh-Hans": "管理员账号", en: "Admin Accounts", vi: "Tài khoản quản trị" },
  "角色權限矩陣": { "zh-Hans": "角色权限矩阵", en: "Role Permission Matrix", vi: "Ma trận quyền theo vai trò" },
  "設定異動紀錄": { "zh-Hans": "设置变更记录", en: "Settings Change Log", vi: "Nhật ký thay đổi cài đặt" },
  "查詢": { "zh-Hans": "查询", en: "Search", vi: "Tra cứu" },
  "匯出資料": { "zh-Hans": "导出数据", en: "Export Data", vi: "Xuất dữ liệu" },
  "新增限額": { "zh-Hans": "新增限额", en: "Add Limit", vi: "Thêm hạn mức" },
  "新增 / 調整限額": { "zh-Hans": "新增 / 调整限额", en: "Add / Adjust Limit", vi: "Thêm / điều chỉnh hạn mức" },
  "返回限額查詢": { "zh-Hans": "返回限额查询", en: "Back to Limit Search", vi: "Quay lại tra cứu hạn mức" },
  "已前往限額設定": { "zh-Hans": "已前往限额设置", en: "Opened Limit Settings", vi: "Đã mở thiết lập hạn mức" },
  "已返回限額查詢": { "zh-Hans": "已返回限额查询", en: "Back to Limit Search", vi: "Đã quay lại tra cứu hạn mức" },
  "前往規則設定": { "zh-Hans": "前往规则设置", en: "Go to Rule Settings", vi: "Đi tới thiết lập quy tắc" },
  "返回規則查詢": { "zh-Hans": "返回规则查询", en: "Back to Rule Search", vi: "Quay lại tra cứu quy tắc" },
  "前往報表設定": { "zh-Hans": "前往报表设置", en: "Go to Report Settings", vi: "Đi tới thiết lập báo cáo" },
  "返回報表查詢": { "zh-Hans": "返回报表查询", en: "Back to Report Search", vi: "Quay lại tra cứu báo cáo" },
  "已前往規則設定": { "zh-Hans": "已前往规则设置", en: "Opened Rule Settings", vi: "Đã mở thiết lập quy tắc" },
  "已返回規則查詢": { "zh-Hans": "已返回规则查询", en: "Back to Rule Search", vi: "Đã quay lại tra cứu quy tắc" },
  "已前往報表設定": { "zh-Hans": "已前往报表设置", en: "Opened Report Settings", vi: "Đã mở thiết lập báo cáo" },
  "已返回報表查詢": { "zh-Hans": "已返回报表查询", en: "Back to Report Search", vi: "Đã quay lại tra cứu báo cáo" },
  "產生報表": { "zh-Hans": "生成报表", en: "Generate Report", vi: "Tạo báo cáo" },
  "測試通知": { "zh-Hans": "测试通知", en: "Test Notification", vi: "Gửi thử thông báo" },
  "儲存設定": { "zh-Hans": "保存设置", en: "Save Settings", vi: "Lưu cài đặt" },
  "套用幣別": { "zh-Hans": "套用币别", en: "Apply Currency", vi: "Áp dụng tiền tệ" },
  "同步匯率": { "zh-Hans": "同步汇率", en: "Sync Rates", vi: "Đồng bộ tỷ giá" },
  "新增管理帳號": { "zh-Hans": "新增管理员账号", en: "Add Admin Account", vi: "Thêm tài khoản quản trị" },
  "儲存類別設定": { "zh-Hans": "保存类别设置", en: "Save Category Settings", vi: "Lưu thiết lập nhóm" },
  "儲存限額設定": { "zh-Hans": "保存限额设置", en: "Save Limit Settings", vi: "Lưu thiết lập hạn mức" },
  "套用建議下限": { "zh-Hans": "套用建议下限", en: "Use Suggested Minimum", vi: "Dùng mức tối thiểu gợi ý" },
  "返回": { "zh-Hans": "返回", en: "Back", vi: "Quay lại" },
  "查看": { "zh-Hans": "查看", en: "View", vi: "Xem" },
  "詳情": { "zh-Hans": "详情", en: "Details", vi: "Chi tiết" },
  "處理": { "zh-Hans": "处理", en: "Handle", vi: "Xử lý" },
  "取消": { "zh-Hans": "取消", en: "Cancel", vi: "Hủy" },
  "關閉": { "zh-Hans": "关闭", en: "Close", vi: "Đóng" },
  "確認": { "zh-Hans": "确认", en: "Confirm", vi: "Xác nhận" },
  "建立帳號": { "zh-Hans": "创建账号", en: "Create Account", vi: "Tạo tài khoản" },
  "會員帳號": { "zh-Hans": "会员账号", en: "Member Account", vi: "Tài khoản hội viên" },
  "會員ID": { "zh-Hans": "会员ID", en: "Member ID", vi: "ID hội viên" },
  "會員ID：": { "zh-Hans": "会员ID：", en: "Member ID: ", vi: "ID hội viên: " },
  "代理帳號": { "zh-Hans": "代理账号", en: "Agent Account", vi: "Tài khoản đại lý" },
  "會員層級": { "zh-Hans": "会员层级", en: "Member Tier", vi: "Cấp hội viên" },
  "幣別": { "zh-Hans": "币别", en: "Currency", vi: "Tiền tệ" },
  "日期範圍": { "zh-Hans": "日期范围", en: "Date Range", vi: "Khoảng ngày" },
  "類型": { "zh-Hans": "类型", en: "Type", vi: "Loại" },
  "全部": { "zh-Hans": "全部", en: "All", vi: "Tất cả" },
  "百家樂": { "zh-Hans": "百家乐", en: "Baccarat", vi: "Baccarat" },
  "老虎機": { "zh-Hans": "老虎机", en: "Slots", vi: "Máy slot" },
  "輪盤": { "zh-Hans": "轮盘", en: "Roulette", vi: "Roulette" },
  "其他": { "zh-Hans": "其他", en: "Other", vi: "Khác" },
  "風險評分": { "zh-Hans": "风险评分", en: "Risk Score", vi: "Điểm rủi ro" },
  "玩家輸贏金額": { "zh-Hans": "玩家输赢金额", en: "Player Win/Loss Amount", vi: "Số tiền thắng/thua của người chơi" },
  "風險等級": { "zh-Hans": "风险等级", en: "Risk Level", vi: "Mức rủi ro" },
  "帳號狀態": { "zh-Hans": "账号状态", en: "Account Status", vi: "Trạng thái tài khoản" },
  "最後登入": { "zh-Hans": "最后登录", en: "Last Login", vi: "Đăng nhập gần nhất" },
  "操作": { "zh-Hans": "操作", en: "Action", vi: "Thao tác" },
  "高風險": { "zh-Hans": "高风险", en: "High Risk", vi: "Cao" },
  "中風險": { "zh-Hans": "中风险", en: "Medium Risk", vi: "Trung bình" },
  "低風險": { "zh-Hans": "低风险", en: "Low Risk", vi: "Thấp" },
  "正常": { "zh-Hans": "正常", en: "Normal", vi: "Ổn định" },
  "觀察中": { "zh-Hans": "观察中", en: "Under Watch", vi: "Theo dõi" },
  "限額中": { "zh-Hans": "限额中", en: "Limited", vi: "Giới hạn" },
  "凍結": { "zh-Hans": "冻结", en: "Frozen", vi: "Đã khóa" },
  "啟用": { "zh-Hans": "启用", en: "Enabled", vi: "Đang bật" },
  "停用": { "zh-Hans": "停用", en: "Disabled", vi: "Đã tắt" },
  "已啟用": { "zh-Hans": "已启用", en: "Enabled", vi: "Đã bật" },
  "未啟用": { "zh-Hans": "未启用", en: "Not Enabled", vi: "Chưa bật" },
  "生效中": { "zh-Hans": "生效中", en: "Active", vi: "Hiệu lực" },
  "已完成": { "zh-Hans": "已完成", en: "Completed", vi: "Đã hoàn tất" },
  "待處理": { "zh-Hans": "待处理", en: "Pending", vi: "Chờ xử lý" },
  "處理中": { "zh-Hans": "处理中", en: "In Progress", vi: "Đang xử lý" },
  "已處理": { "zh-Hans": "已处理", en: "Handled", vi: "Hoàn tất" },
  "高風險會員": { "zh-Hans": "高风险会员", en: "High-Risk Members", vi: "Hội viên rủi ro cao" },
  "今日待辦": { "zh-Hans": "今日待办", en: "Today's Tasks", vi: "Việc cần làm hôm nay" },
  "今日投注額": { "zh-Hans": "今日投注额", en: "Today's Bet Amount", vi: "Tiền cược hôm nay" },
  "凍結帳號": { "zh-Hans": "冻结账号", en: "Frozen Accounts", vi: "Tài khoản bị khóa" },
  "近30天風險事件趨勢": { "zh-Hans": "近30天风险事件趋势", en: "Risk Events in Last 30 Days", vi: "Xu hướng sự kiện rủi ro 30 ngày" },
  "風險類型分布": { "zh-Hans": "风险类型分布", en: "Risk Type Distribution", vi: "Phân bố loại rủi ro" },
  "風險事件類型分布（件數）": { "zh-Hans": "风险事件类型分布（件数）", en: "Risk Event Types (Count)", vi: "Loại sự kiện rủi ro (số vụ)" },
  "風險事件": { "zh-Hans": "风险事件", en: "Risk Event", vi: "Sự kiện rủi ro" },
  "風險事件數": { "zh-Hans": "风险事件数", en: "Risk Event Count", vi: "Số sự kiện rủi ro" },
  "件數": { "zh-Hans": "件数", en: "Count", vi: "Số vụ" },
  "比例": { "zh-Hans": "比例", en: "Share", vi: "Tỷ lệ" },
  "總計": { "zh-Hans": "总计", en: "Total", vi: "Tổng cộng" },
  "超過限額": { "zh-Hans": "超过限额", en: "Limit Exceeded", vi: "Vượt hạn mức" },
  "出金上限": { "zh-Hans": "出金上限", en: "Withdrawal Limit", vi: "Hạn mức rút tiền" },
  "集團投注": { "zh-Hans": "集团投注", en: "Syndicate Betting", vi: "Cược theo nhóm" },
  "對押 / 對打": { "zh-Hans": "对押 / 对打", en: "Opposite-Side Betting", vi: "Cược đối ứng" },
  "異常登入": { "zh-Hans": "异常登录", en: "Abnormal Login", vi: "Đăng nhập bất thường" },
  "AML 入金異常": { "zh-Hans": "AML 入金异常", en: "AML Deposit Anomaly", vi: "Nạp tiền bất thường AML" },
  "管理帳號": { "zh-Hans": "管理账号", en: "Admin Account", vi: "Tài khoản quản trị" },
  "管理者姓名": { "zh-Hans": "管理员姓名", en: "Admin Name", vi: "Tên quản trị viên" },
  "帳號歸屬": { "zh-Hans": "账号归属", en: "Account Owner", vi: "Đơn vị sở hữu tài khoản" },
  "所屬代理": { "zh-Hans": "所属代理", en: "Assigned Agent", vi: "Đại lý phụ trách" },
  "角色": { "zh-Hans": "角色", en: "Role", vi: "Vai trò" },
  "資料範圍": { "zh-Hans": "数据范围", en: "Data Scope", vi: "Phạm vi dữ liệu" },
  "成本歸屬": { "zh-Hans": "成本归属", en: "Cost Owner", vi: "Đơn vị chịu chi phí" },
  "審核層級": { "zh-Hans": "审核层级", en: "Approval Level", vi: "Cấp duyệt" },
  "雙因素驗證": { "zh-Hans": "双因素验证", en: "Two-Factor Auth", vi: "Xác thực hai yếu tố" },
  "平台": { "zh-Hans": "平台", en: "Platform", vi: "Nền tảng" },
  "代理": { "zh-Hans": "代理", en: "Agent", vi: "Đại lý" },
  "全站": { "zh-Hans": "全站", en: "All Sites", vi: "Toàn hệ thống" },
  "平台負擔": { "zh-Hans": "平台负担", en: "Platform Pays", vi: "Nền tảng chi trả" },
  "代理負擔": { "zh-Hans": "代理负担", en: "Agent Pays", vi: "Đại lý chi trả" },
  "平台代管 / 代理分攤": { "zh-Hans": "平台代管 / 代理分摊", en: "Platform Managed / Agent Shared", vi: "Nền tảng quản lý / đại lý chia sẻ" },
  "代理風控監控員": { "zh-Hans": "代理风控监控员", en: "Agent Risk Monitor", vi: "Nhân viên giám sát rủi ro đại lý" },
  "代理風控主管": { "zh-Hans": "代理风控主管", en: "Agent Risk Supervisor", vi: "Trưởng nhóm rủi ro đại lý" },
  "平台風控審核員": { "zh-Hans": "平台风控审核员", en: "Platform Risk Reviewer", vi: "Nhân viên thẩm định rủi ro nền tảng" },
  "平台風控管理員": { "zh-Hans": "平台风控管理员", en: "Platform Risk Manager", vi: "Quản lý rủi ro nền tảng" },
  "平台營運主管": { "zh-Hans": "平台运营主管", en: "Platform Operations Lead", vi: "Trưởng vận hành nền tảng" },
  "系統管理員": { "zh-Hans": "系统管理员", en: "System Administrator", vi: "Quản trị hệ thống" },
  "代理主管覆核": { "zh-Hans": "代理主管复核", en: "Agent Supervisor Review", vi: "Trưởng đại lý duyệt" },
  "平台主管覆核": { "zh-Hans": "平台主管复核", en: "Platform Lead Review", vi: "Trưởng nền tảng duyệt" },
  "系統管理員覆核": { "zh-Hans": "系统管理员复核", en: "System Admin Review", vi: "Quản trị hệ thống duyệt" },
  "限額類型": { "zh-Hans": "限额类型", en: "Limit Type", vi: "Loại hạn mức" },
  "控制對象": { "zh-Hans": "控制对象", en: "Control Target", vi: "Đối tượng kiểm soát" },
  "啟用狀態": { "zh-Hans": "启用状态", en: "Status", vi: "Trạng thái" },
  "適用範圍": { "zh-Hans": "适用范围", en: "Applies To", vi: "Phạm vi áp dụng" },
  "玩家類別 / VIP 額度設定": { "zh-Hans": "玩家类别 / VIP 额度设置", en: "Player Class / VIP Limit Settings", vi: "Thiết lập hạn mức theo nhóm người chơi / VIP" },
  "玩家類別": { "zh-Hans": "玩家类别", en: "Player Class", vi: "Nhóm người chơi" },
  "VIP 對應": { "zh-Hans": "VIP 对应", en: "VIP Mapping", vi: "Tương ứng VIP" },
  "建議下限": { "zh-Hans": "建议下限", en: "Suggested Minimum", vi: "Mức tối thiểu gợi ý" },
  "建議上限": { "zh-Hans": "建议上限", en: "Suggested Maximum", vi: "Mức tối đa gợi ý" },
  "審核方式": { "zh-Hans": "审核方式", en: "Review Method", vi: "Cách duyệt" },
  "進階規則文字": { "zh-Hans": "进阶规则文字", en: "Advanced Rule Text", vi: "Nội dung quy tắc nâng cao" },
  "設定目的": { "zh-Hans": "设置目的", en: "Purpose", vi: "Mục đích" },
  "檢查公式": { "zh-Hans": "检查公式", en: "Validation Formula", vi: "Công thức kiểm tra" },
  "設定重點": { "zh-Hans": "设置重点", en: "Key Points", vi: "Điểm cần lưu ý" },
  "審核要求": { "zh-Hans": "审核要求", en: "Review Requirements", vi: "Yêu cầu duyệt" },
  "觸發處理": { "zh-Hans": "触发处理", en: "Trigger Action", vi: "Xử lý khi kích hoạt" },
  "限額類別清單": { "zh-Hans": "限额类别清单", en: "Limit Category List", vi: "Danh sách nhóm hạn mức" },
  "玩家類別對應": { "zh-Hans": "玩家类别对应", en: "Player Class Mapping", vi: "Đối chiếu nhóm người chơi" },
  "單日投注額上限": { "zh-Hans": "单日投注额上限", en: "Daily Bet Limit", vi: "Hạn mức cược mỗi ngày" },
  "單日淨輸上限": { "zh-Hans": "单日净输上限", en: "Daily Net Loss Limit", vi: "Hạn mức thua ròng mỗi ngày" },
  "單日入金上限": { "zh-Hans": "单日入金上限", en: "Daily Deposit Limit", vi: "Hạn mức nạp mỗi ngày" },
  "單日提款上限": { "zh-Hans": "单日提款上限", en: "Daily Withdrawal Limit", vi: "Hạn mức rút mỗi ngày" },
  "單注投注上限": { "zh-Hans": "单注投注上限", en: "Single Bet Limit", vi: "Hạn mức mỗi cược" },
  "單局 / 單場上限": { "zh-Hans": "单局 / 单场上限", en: "Round / Event Limit", vi: "Hạn mức mỗi ván / trận" },
  "單玩法上限": { "zh-Hans": "单玩法上限", en: "Play-Type Limit", vi: "Hạn mức theo cách chơi" },
  "單日最大派彩上限": { "zh-Hans": "单日最大派彩上限", en: "Daily Max Payout Limit", vi: "Hạn mức trả thưởng tối đa mỗi ngày" },
  "群組單日曝險上限": { "zh-Hans": "群组单日曝险上限", en: "Group Daily Exposure Limit", vi: "Hạn mức rủi ro nhóm mỗi ngày" },
  "風險案件處理": { "zh-Hans": "风险案件处理", en: "Risk Case Handling", vi: "Xử lý hồ sơ rủi ro" },
  "案件處置方式": { "zh-Hans": "案件处置方式", en: "Case Action", vi: "Cách xử lý" },
  "確認處理": { "zh-Hans": "确认处理", en: "Confirm Action", vi: "Xác nhận xử lý" },
  "標記已完成": { "zh-Hans": "标记已完成", en: "Complete", vi: "Hoàn tất" },
  "加入觀察": { "zh-Hans": "加入观察", en: "Watch", vi: "Theo dõi" },
  "維持凍結": { "zh-Hans": "维持冻结", en: "Keep Frozen", vi: "Giữ khóa" },
  "凍結會員": { "zh-Hans": "冻结会员", en: "Freeze Member", vi: "Khóa hội viên" },
  "升級覆核": { "zh-Hans": "升级复核", en: "Escalate", vi: "Chuyển duyệt" },
  "誤判關閉": { "zh-Hans": "误判关闭", en: "False Positive", vi: "Đóng nhầm" },
  "不做處置": { "zh-Hans": "不做处置", en: "No Action", vi: "Không xử lý" },
  "不做處置原因": { "zh-Hans": "不做处置原因", en: "No-action Reason", vi: "Lý do không xử lý" },
  "處理備註": { "zh-Hans": "处理备注", en: "Handling Note", vi: "Ghi chú xử lý" },
  "請填寫處理備註": { "zh-Hans": "请填写处理备注", en: "Enter a handling note", vi: "Nhập ghi chú xử lý" },
  "已執行": { "zh-Hans": "已执行", en: "Executed ", vi: "Đã thực hiện " },
  "並寫入稽核紀錄": { "zh-Hans": "并写入稽核记录", en: " and logged for audit", vi: " và đã ghi nhật ký" },
  "已完成覆核，案件證據與處理結論已確認。": { "zh-Hans": "已完成复核，案件证据与处理结论已确认。", en: "Review completed. Evidence and conclusion confirmed.", vi: "Đã rà soát. Đã xác nhận chứng cứ và kết luận." },
  "已加入觀察名單，後續同類規則命中需再次提醒。": { "zh-Hans": "已加入观察名单，后续同类规则命中需再次提醒。", en: "Added to watchlist. Alert again on similar rule hits.", vi: "Đã đưa vào theo dõi. Cảnh báo lại khi lặp quy tắc." },
  "已調整會員限額，先降低平台曝險並持續觀察。": { "zh-Hans": "已调整会员限额，先降低平台曝险并持续观察。", en: "Member limit adjusted to reduce exposure and monitor.", vi: "Đã chỉnh hạn mức để giảm rủi ro và theo dõi." },
  "已凍結帳號交易權限，等待主管覆核。": { "zh-Hans": "已冻结账号交易权限，等待主管复核。", en: "Trading access frozen pending supervisor review.", vi: "Đã khóa giao dịch, chờ cấp trên duyệt." },
  "維持凍結，等待主管覆核後再決定是否解除。": { "zh-Hans": "维持冻结，等待主管复核后再决定是否解除。", en: "Keep frozen until supervisor review decides release.", vi: "Giữ khóa, chờ cấp trên quyết định mở." },
  "已升級主管覆核，需補充關聯證據與資金紀錄。": { "zh-Hans": "已升级主管复核，需补充关联证据与资金记录。", en: "Escalated. Add linkage evidence and fund records.", vi: "Đã chuyển duyệt. Bổ sung chứng cứ và dòng tiền." },
  "確認為誤判事件，案件關閉並保留稽核紀錄。": { "zh-Hans": "确认为误判事件，案件关闭并保留稽核记录。", en: "Confirmed false positive. Case closed with audit log.", vi: "Xác nhận nhầm. Đóng hồ sơ và lưu nhật ký." },
  "已確認本次風險訊號，不調整限額、不加入觀察、不凍結帳號，僅保留處理紀錄。": { "zh-Hans": "已确认本次风险信号，不调整限额、不加入观察、不冻结账号，仅保留处理记录。", en: "Signal reviewed. No limit, watchlist, or freeze action taken; record kept only.", vi: "Đã kiểm tra tín hiệu; không chỉnh hạn mức, không theo dõi, không khóa; chỉ lưu hồ sơ." },
  "此筆資料目前僅供檢視。": { "zh-Hans": "此笔资料目前仅供检视。", en: "This record is view-only.", vi: "Bản ghi này chỉ để xem." },
};

Object.assign(languageTranslations, {
  "會員風險檢視 | 風控管理後台": { "zh-Hans": "会员风险检视 | 风控管理后台", en: "Member Risk Review | Risk Operations Console", vi: "Kiểm tra rủi ro hội viên | Bảng quản trị rủi ro" },
  "主選單": { "zh-Hans": "主菜单", en: "Main Menu", vi: "Menu chính" },
  "首頁": { "zh-Hans": "首页", en: "Home", vi: "Trang chủ" },
  "頁面說明": { "zh-Hans": "页面说明", en: "Page Info", vi: "Thông tin trang" },
  "會員風險檢視": { "zh-Hans": "会员风险检视", en: "Member Risk Review", vi: "Kiểm tra rủi ro hội viên" },
  "全站風控即時監控與待辦工作台": { "zh-Hans": "全站风控实时监控与待办工作台", en: "Real-time risk monitoring and task workspace across all sites", vi: "Bàn làm việc giám sát rủi ro thời gian thực trên toàn hệ thống" },
  "投注行為偵測、規則命中與注單風險分析": { "zh-Hans": "投注行为侦测、规则命中与注单风险分析", en: "Betting behavior detection, rule hits, and bet slip risk analysis", vi: "Phát hiện hành vi đặt cược, quy tắc bị kích hoạt và phân tích rủi ro phiếu cược" },
  "多帳號關聯、共同裝置、共同 IP 與疑似集團套利偵測": { "zh-Hans": "多账号关联、共同设备、共同 IP 与疑似集团套利侦测", en: "Multi-account links, shared devices, shared IPs, and suspected syndicate arbitrage detection", vi: "Phát hiện liên kết nhiều tài khoản, thiết bị/IP dùng chung và dấu hiệu trục lợi theo nhóm" },
  "會員限額建立、調整、取消與歷史查詢": { "zh-Hans": "会员限额创建、调整、取消与历史查询", en: "Create, adjust, cancel, and search member limit history", vi: "Tạo, điều chỉnh, hủy và tra cứu lịch sử hạn mức hội viên" },
  "限額調整、審核、取消與操作追蹤": { "zh-Hans": "限额调整、审核、取消与操作追踪", en: "Limit adjustment, approval, cancellation, and action tracking", vi: "Điều chỉnh, duyệt, hủy và theo dõi thao tác hạn mức" },
  "規則啟停、閾值設定、自動處置與版本管理": { "zh-Hans": "规则启停、阈值设置、自动处置与版本管理", en: "Rule activation, threshold settings, automated actions, and version management", vi: "Bật/tắt quy tắc, thiết lập ngưỡng, xử lý tự động và quản lý phiên bản" },
  "風控報表產生、下載、排程與審計": { "zh-Hans": "风控报表生成、下载、排程与审计", en: "Generate, download, schedule, and audit risk reports", vi: "Tạo, tải xuống, lập lịch và kiểm toán báo cáo rủi ro" },
  "後台安全、刷新、查詢限制、幣別、通知、角色權限與限額設定類別": { "zh-Hans": "后台安全、刷新、查询限制、币别、通知、角色权限与限额设置类别", en: "Back-office security, refresh, search limits, currencies, notifications, roles, and limit categories", vi: "Bảo mật back-office, làm mới, giới hạn tra cứu, tiền tệ, thông báo, vai trò và nhóm hạn mức" },
  "建議流程": { "zh-Hans": "建议流程", en: "Suggested Workflow", vi: "Quy trình đề xuất" },
  "先看紅色或上升的 KPI": { "zh-Hans": "先看红色或上升的 KPI", en: "Review red or rising KPIs first", vi: "Ưu tiên xem các KPI màu đỏ hoặc đang tăng" },
  "點 KPI 或提醒查看明細": { "zh-Hans": "点 KPI 或提醒查看明细", en: "Click a KPI or alert to view details", vi: "Nhấn KPI hoặc cảnh báo để xem chi tiết" },
  "前往對應頁面處理": { "zh-Hans": "前往对应页面处理", en: "Go to the relevant page to handle it", vi: "Đi tới trang liên quan để xử lý" },
  "先用風險等級篩選": { "zh-Hans": "先用风险等级筛选", en: "Filter by risk level first", vi: "Lọc theo mức rủi ro trước" },
  "點詳情進入會員檢視": { "zh-Hans": "点详情进入会员检视", en: "Open Details to review the member", vi: "Mở Chi tiết để kiểm tra hội viên" },
  "必要時匯出清單": { "zh-Hans": "必要时导出清单", en: "Export the list if needed", vi: "Xuất danh sách khi cần" },
  "先設定日期與風險等級": { "zh-Hans": "先设置日期与风险等级", en: "Set date range and risk level first", vi: "Chọn khoảng ngày và mức rủi ro trước" },
  "查看命中規則": { "zh-Hans": "查看命中规则", en: "Review matched rules", vi: "Xem các quy tắc bị kích hoạt" },
  "點查看開啟明細": { "zh-Hans": "点查看开启明细", en: "Click View to open details", vi: "Nhấn Xem để mở chi tiết" },
  "先看關聯圖譜": { "zh-Hans": "先看关联图谱", en: "Review the relationship graph first", vi: "Xem sơ đồ liên kết trước" },
  "點節點或數字查看關聯帳號": { "zh-Hans": "点节点或数字查看关联账号", en: "Click a node or count to view linked accounts", vi: "Nhấn nút hoặc con số để xem tài khoản liên kết" },
  "確認後標記覆核": { "zh-Hans": "确认后标记复核", en: "Confirm and mark for review", vi: "Xác nhận rồi đánh dấu đã rà soát" },
  "先查會員目前限額": { "zh-Hans": "先查会员目前限额", en: "Check the member's current limits first", vi: "Kiểm tra hạn mức hiện tại của hội viên trước" },
  "新增或調整限額": { "zh-Hans": "新增或调整限额", en: "Add or adjust limits", vi: "Thêm hoặc điều chỉnh hạn mức" },
  "確認生效與到期時間": { "zh-Hans": "确认生效与到期时间", en: "Confirm effective and expiry times", vi: "Xác nhận thời gian hiệu lực và hết hạn" },
  "先選會員與限額類型": { "zh-Hans": "先选会员与限额类型", en: "Select member and limit type first", vi: "Chọn hội viên và loại hạn mức trước" },
  "確認建議區間與審核要求": { "zh-Hans": "确认建议区间与审核要求", en: "Confirm suggested range and approval requirements", vi: "Xác nhận khoảng gợi ý và yêu cầu duyệt" },
  "儲存後進入調整紀錄": { "zh-Hans": "保存后进入调整记录", en: "Save into adjustment records", vi: "Lưu vào lịch sử điều chỉnh" },
  "先查現有規則": { "zh-Hans": "先查现有规则", en: "Search existing rules first", vi: "Tra cứu quy tắc hiện có trước" },
  "確認狀態是否啟用": { "zh-Hans": "确认状态是否启用", en: "Confirm whether the rule is enabled", vi: "Xác nhận quy tắc đã bật hay chưa" },
  "需要時新增規則": { "zh-Hans": "需要时新增规则", en: "Add a rule when needed", vi: "Thêm quy tắc khi cần" },
  "選擇報表類型與週期": { "zh-Hans": "选择报表类型与周期", en: "Select report type and cycle", vi: "Chọn loại báo cáo và chu kỳ" },
  "完成後下載或匯出": { "zh-Hans": "完成后下载或导出", en: "Download or export when complete", vi: "Tải xuống hoặc xuất dữ liệu sau khi hoàn tất" },
  "先確認一般設定與幣別": { "zh-Hans": "先确认一般设置与币别", en: "Check general settings and currency first", vi: "Kiểm tra cài đặt chung và tiền tệ trước" },
  "查看管理帳號與角色權限": { "zh-Hans": "查看管理账号与角色权限", en: "Review admin accounts and role permissions", vi: "Xem tài khoản quản trị và quyền theo vai trò" },
  "新增帳號或儲存設定後確認提示": { "zh-Hans": "新增账号或保存设置后确认提示", en: "Confirm the prompt after adding an account or saving settings", vi: "Xác nhận thông báo sau khi thêm tài khoản hoặc lưu cài đặt" },
  "由風險案件歸戶": { "zh-Hans": "由风险案件归户", en: "Grouped by risk case owner", vi: "Tổng hợp theo hồ sơ rủi ro" },
  "逾期": { "zh-Hans": "逾期", en: "Overdue", vi: "Quá hạn" },
  "逾期 1 件，點擊查看": { "zh-Hans": "逾期 1 件，点击查看", en: "1 overdue case. Click to view.", vi: "1 vụ quá hạn. Nhấn để xem." },
  "依案件有效投注加總": { "zh-Hans": "按案件有效投注加总", en: "Summed from valid bets in cases", vi: "Tổng hợp theo cược hợp lệ trong hồ sơ" },
  "自動 1 / 人工 0": { "zh-Hans": "自动 1 / 人工 0", en: "Auto 1 / Manual 0", vi: "Tự động 1 / Thủ công 0" },
  "風險案件中心": { "zh-Hans": "风险案件中心", en: "Risk Case Center", vi: "Trung tâm hồ sơ rủi ro" },
  "KPI、待辦與鑽取清單都由同一批案件資料產生。": { "zh-Hans": "KPI、待办与钻取清单都由同一批案件数据产生。", en: "KPIs, tasks, and drill-down lists are generated from the same case dataset.", vi: "KPI, việc cần làm và danh sách drill-down đều lấy từ cùng bộ hồ sơ rủi ro." },
  "案件ID": { "zh-Hans": "案件ID", en: "Case ID", vi: "ID hồ sơ" },
  "案件": { "zh-Hans": "案件", en: "Case", vi: "Hồ sơ" },
  "案件狀態": { "zh-Hans": "案件状态", en: "Case Status", vi: "Trạng thái hồ sơ" },
  "時間": { "zh-Hans": "时间", en: "Time", vi: "Thời gian" },
  "會員": { "zh-Hans": "会员", en: "Member", vi: "Hội viên" },
  "負責人": { "zh-Hans": "负责人", en: "Owner", vi: "Người phụ trách" },
  "高風險投注命中": { "zh-Hans": "高风险投注命中", en: "High-risk bet matched", vi: "Cược rủi ro cao bị phát hiện" },
  "疑似對打": { "zh-Hans": "疑似对打", en: "Suspected matched betting", vi: "Nghi vấn cược đối ứng" },
  "大額投注": { "zh-Hans": "大额投注", en: "Large Bet", vi: "Cược lớn" },
  "待主管覆核": { "zh-Hans": "待主管复核", en: "Awaiting Supervisor Review", vi: "Chờ duyệt" },
  "自動凍結": { "zh-Hans": "自动冻结", en: "Auto Frozen", vi: "Tự động khóa" },
  "異常時段投注": { "zh-Hans": "异常时段投注", en: "Off-hour Betting", vi: "Cược vào khung giờ bất thường" },
  "會員總數": { "zh-Hans": "会员总数", en: "Total Members", vi: "Tổng số hội viên" },
  "目前列表資料": { "zh-Hans": "当前列表数据", en: "Current list data", vi: "Dữ liệu trong danh sách hiện tại" },
  "需優先覆核": { "zh-Hans": "需优先复核", en: "Priority Review", vi: "Cần rà soát ưu tiên" },
  "觀察 / 限額": { "zh-Hans": "观察 / 限额", en: "Watch / Limit", vi: "Theo dõi / giới hạn" },
  "敏感狀態": { "zh-Hans": "敏感状态", en: "Sensitive Status", vi: "Trạng thái nhạy cảm" },
  "會員列表": { "zh-Hans": "会员列表", en: "Member List", vi: "Danh sách hội viên" },
  "點擊詳情進入會員風險檢視": { "zh-Hans": "点击详情进入会员风险检视", en: "Click Details to open member risk review", vi: "Nhấn Chi tiết để mở kiểm tra rủi ro hội viên" },
  "遊戲類型": { "zh-Hans": "游戏类型", en: "Game Type", vi: "Loại trò chơi" },
  "遊戲": { "zh-Hans": "游戏", en: "Game", vi: "Trò chơi" },
  "命中規則": { "zh-Hans": "命中规则", en: "Matched Rule", vi: "Quy tắc bị kích hoạt" },
  "高額 Tie 命中": { "zh-Hans": "高额 Tie 命中", en: "High Tie Payout Hit", vi: "Trúng Tie giá trị cao" },
  "連續贏局": { "zh-Hans": "连续赢局", en: "Winning Streak", vi: "Chuỗi thắng liên tiếp" },
  "多帳號同裝置": { "zh-Hans": "多账号同设备", en: "Multiple Accounts on Same Device", vi: "Nhiều tài khoản dùng cùng thiết bị" },
  "總筆數": { "zh-Hans": "总笔数", en: "Total Records", vi: "Tổng số dòng" },
  "本頁模擬資料": { "zh-Hans": "本页模拟数据", en: "Demo data on this page", vi: "Dữ liệu mô phỏng trên trang này" },
  "需優先處理": { "zh-Hans": "需优先处理", en: "Priority Handling", vi: "Cần xử lý ưu tiên" },
  "持續追蹤": { "zh-Hans": "持续追踪", en: "Ongoing Monitoring", vi: "Theo dõi tiếp" },
  "含系統處理": { "zh-Hans": "含系统处理", en: "Includes system actions", vi: "Bao gồm xử lý của hệ thống" },
  "投注行為分析清單": { "zh-Hans": "投注行为分析清单", en: "Betting Behavior Analysis List", vi: "Danh sách phân tích hành vi đặt cược" },
  "行為模式": { "zh-Hans": "行为模式", en: "Behavior Pattern", vi: "Mẫu hành vi" },
  "投注金額": { "zh-Hans": "投注金额", en: "Bet Amount", vi: "Số tiền cược" },
  "輸贏": { "zh-Hans": "输赢", en: "Win/Loss", vi: "Thắng/thua" },
  "同局反向投注": { "zh-Hans": "同局反向投注", en: "Opposite bets in same round", vi: "Cược ngược chiều trong cùng ván" },
  "連續追注 9 局": { "zh-Hans": "连续追注 9 局", en: "Chased bets for 9 consecutive rounds", vi: "Theo cược liên tiếp 9 ván" },
  "追注異常": { "zh-Hans": "追注异常", en: "Abnormal chasing", vi: "Theo cược bất thường" },
  "凌晨集中投注": { "zh-Hans": "凌晨集中投注", en: "Concentrated late-night betting", vi: "Cược tập trung lúc rạng sáng" },
  "異常時段": { "zh-Hans": "异常时段", en: "Abnormal Time", vi: "Khung giờ bất thường" },
  "集團ID": { "zh-Hans": "集团ID", en: "Group ID", vi: "ID nhóm" },
  "請輸入集團ID": { "zh-Hans": "请输入集团ID", en: "Enter Group ID", vi: "Nhập ID nhóm" },
  "集團關聯圖譜": { "zh-Hans": "集团关联图谱", en: "Group Relationship Graph", vi: "Sơ đồ liên kết nhóm" },
  "查看集團": { "zh-Hans": "查看集团", en: "View Group", vi: "Xem nhóm" },
  "收合總覽": { "zh-Hans": "收合总览", en: "Collapse Overview", vi: "Thu gọn tổng quan" },
  "展開全部": { "zh-Hans": "展开全部", en: "Expand All", vi: "Mở rộng tất cả" },
  "將大量關聯聚合成一張圖": { "zh-Hans": "将大量关联聚合成一张图", en: "Aggregate many relationships into one graph", vi: "Gom nhiều liên kết vào một sơ đồ" },
  "集團": { "zh-Hans": "集团", en: "Group", vi: "Nhóm" },
  "共同 IP": { "zh-Hans": "共同 IP", en: "Shared IP", vi: "IP dùng chung" },
  "共同IP": { "zh-Hans": "共同IP", en: "Shared IP", vi: "IP dùng chung" },
  "共同裝置": { "zh-Hans": "共同设备", en: "Shared Device", vi: "Thiết bị dùng chung" },
  "風險訊號": { "zh-Hans": "风险信号", en: "Risk Signal", vi: "Tín hiệu rủi ro" },
  "高風險集團": { "zh-Hans": "高风险集团", en: "High-Risk Group", vi: "Nhóm rủi ro cao" },
  "高風險集團清單": { "zh-Hans": "高风险集团清单", en: "High-Risk Group List", vi: "Danh sách nhóm rủi ro cao" },
  "關聯帳號": { "zh-Hans": "关联账号", en: "Linked Accounts", vi: "Tài khoản liên kết" },
  "關聯帳號數": { "zh-Hans": "关联账号数", en: "Linked Account Count", vi: "Số tài khoản liên kết" },
  "對打 / 同裝置": { "zh-Hans": "对打 / 同设备", en: "Matched Betting / Same Device", vi: "Cược đối ứng / cùng thiết bị" },
  "主要風險": { "zh-Hans": "主要风险", en: "Primary Risk", vi: "Rủi ro chính" },
  "登入重疊": { "zh-Hans": "登录重叠", en: "Overlapping Logins", vi: "Đăng nhập trùng thời điểm" },
  "行為關聯": { "zh-Hans": "行为关联", en: "Behavior Link", vi: "Liên kết hành vi" },
  "共同登入": { "zh-Hans": "共同登录", en: "Shared Login", vi: "Đăng nhập dùng chung" },
  "裝置指紋": { "zh-Hans": "设备指纹", en: "Device Fingerprint", vi: "Dấu vân tay thiết bị" },
  "核心裝置": { "zh-Hans": "核心设备", en: "Core Device", vi: "Thiết bị chính" },
  "圖譜摘要": { "zh-Hans": "图谱摘要", en: "Graph Summary", vi: "Tóm tắt sơ đồ" },
  "目前集團：": { "zh-Hans": "当前集团：", en: "Current Group: ", vi: "Nhóm hiện tại: " },
  "判定原因：": { "zh-Hans": "判定原因：", en: "Reason: ", vi: "Lý do xác định: " },
  "總投注": { "zh-Hans": "总投注", en: "Total Bet", vi: "Tổng tiền cược" },
  "總輸贏": { "zh-Hans": "总输赢", en: "Total Win/Loss", vi: "Tổng thắng/thua" },
  "等級": { "zh-Hans": "等级", en: "Level", vi: "Cấp" },
  "批量註冊": { "zh-Hans": "批量注册", en: "Bulk Registration", vi: "Đăng ký hàng loạt" },
  "登入時段重疊": { "zh-Hans": "登录时段重叠", en: "Overlapping Login Periods", vi: "Khung giờ đăng nhập trùng nhau" },
  "可點擊欄位鑽取關聯證據": { "zh-Hans": "可点击字段钻取关联证据", en: "Click fields to drill into relationship evidence", vi: "Nhấn vào trường để xem sâu bằng chứng liên kết" },
  "狀態": { "zh-Hans": "状态", en: "Status", vi: "Trạng thái" },
  "已失效": { "zh-Hans": "已失效", en: "Expired", vi: "Đã hết hiệu lực" },
  "已取消": { "zh-Hans": "已取消", en: "Cancelled", vi: "Đã hủy" },
  "生效日期": { "zh-Hans": "生效日期", en: "Effective Date", vi: "Ngày hiệu lực" },
  "限額筆數": { "zh-Hans": "限额笔数", en: "Limit Records", vi: "Số bản ghi hạn mức" },
  "本頁限額紀錄": { "zh-Hans": "本页限额记录", en: "Limit records on this page", vi: "Bản ghi hạn mức trên trang này" },
  "目前有效": { "zh-Hans": "当前有效", en: "Currently Active", vi: "Đang hiệu lực" },
  "即將到期": { "zh-Hans": "即将到期", en: "Expiring Soon", vi: "Sắp hết hạn" },
  "7 日內到期": { "zh-Hans": "7 日内到期", en: "Expires within 7 days", vi: "Hết hạn trong 7 ngày" },
  "歷史紀錄": { "zh-Hans": "历史记录", en: "History", vi: "Lịch sử" },
  "限額管理清單": { "zh-Hans": "限额管理清单", en: "Limit Management List", vi: "Danh sách quản lý hạn mức" },
  "目前限額": { "zh-Hans": "当前限额", en: "Current Limit", vi: "Hạn mức hiện tại" },
  "生效時間": { "zh-Hans": "生效时间", en: "Effective Time", vi: "Thời gian hiệu lực" },
  "到期時間": { "zh-Hans": "到期时间", en: "Expiry Time", vi: "Thời gian hết hạn" },
  "原因": { "zh-Hans": "原因", en: "Reason", vi: "Lý do" },
  "操作人": { "zh-Hans": "操作人", en: "Operator", vi: "Người thao tác" },
  "大額投注提醒": { "zh-Hans": "大额投注提醒", en: "Large Bet Alert", vi: "Cảnh báo cược lớn" },
  "永久": { "zh-Hans": "永久", en: "Permanent", vi: "Vĩnh viễn" },
  "疑似套利": { "zh-Hans": "疑似套利", en: "Suspected Arbitrage", vi: "Nghi vấn trục lợi" },
  "玩家獲利異常": { "zh-Hans": "玩家获利异常", en: "Abnormal Player Profit", vi: "Lợi nhuận người chơi bất thường" },
  "高賠率玩法集中投注": { "zh-Hans": "高赔率玩法集中投注", en: "Concentrated Betting on High-Odds Play Types", vi: "Cược tập trung vào cách chơi tỷ lệ trả cao" },
  "會員限額設定": { "zh-Hans": "会员限额设置", en: "Member Limit Settings", vi: "Thiết lập hạn mức hội viên" },
  "會員目前限額": { "zh-Hans": "会员当前限额", en: "Current Member Limits", vi: "Hạn mức hiện tại của hội viên" },
  "限額檢視": { "zh-Hans": "限额检视", en: "Limit Review", vi: "Kiểm tra hạn mức" },
  "限額調整審核清單": { "zh-Hans": "限额调整审核清单", en: "Limit Adjustment & Approval List", vi: "Danh sách điều chỉnh và duyệt hạn mức" },
  "限額調整歷史": { "zh-Hans": "限额调整历史", en: "Limit Adjustment History", vi: "Lịch sử điều chỉnh hạn mức" },
  "今日已用": { "zh-Hans": "今日已用", en: "Used Today", vi: "Đã dùng hôm nay" },
  "剩餘額度": { "zh-Hans": "剩余额度", en: "Remaining Limit", vi: "Hạn mức còn lại" },
  "使用率": { "zh-Hans": "使用率", en: "Usage", vi: "Tỷ lệ dùng" },
  "限額來源": { "zh-Hans": "限额来源", en: "Limit Source", vi: "Nguồn hạn mức" },
  "含 9 種限額類型": { "zh-Hans": "含 9 种限额类型", en: "Includes 9 limit types", vi: "Gồm 9 loại hạn mức" },
  "需追蹤效期": { "zh-Hans": "需追踪有效期", en: "Expiry needs tracking", vi: "Cần theo dõi hiệu lực" },
  "依系統設定": { "zh-Hans": "按系统设置", en: "System setting", vi: "Theo cài đặt hệ thống" },
  "系統範本": { "zh-Hans": "系统模板", en: "System Template", vi: "Mẫu hệ thống" },
  "人工調整": { "zh-Hans": "人工调整", en: "Manual Adjustment", vi: "Điều chỉnh thủ công" },
  "前往限額調整": { "zh-Hans": "前往限额调整", en: "Go to Limit Adjustment", vi: "Đến phần điều chỉnh hạn mức" },
  "調整限額": { "zh-Hans": "调整限额", en: "Adjust Limit", vi: "Điều chỉnh hạn mức" },
  "這裡只處理會員額度套用；限額類型、層級範本與建議規則統一由「系統設定 / 限額設定類別」維護。": { "zh-Hans": "这里只处理会员额度套用；限额类型、层级模板与建议规则统一由「系统设置 / 限额设置类别」维护。", en: "This page only applies limits to members. Limit types, tier templates, and recommendation rules are maintained under System Settings / Limit Categories.", vi: "Trang này chỉ áp dụng hạn mức cho hội viên. Loại hạn mức, mẫu cấp độ và quy tắc gợi ý được quản lý tại Cài đặt hệ thống / Nhóm thiết lập hạn mức." },
  "玩家限額層級": { "zh-Hans": "玩家限额层级", en: "Player Limit Tier", vi: "Cấp hạn mức người chơi" },
  "L0 新註冊 / 未完整 KYC / 未入 VIP / 新會員": { "zh-Hans": "L0 新注册 / 未完整 KYC / 未入 VIP / 新会员", en: "L0 New / Incomplete KYC / Non-VIP / New Member", vi: "L0 Mới đăng ký / KYC chưa đầy đủ / chưa vào VIP / hội viên mới" },
  "L1 基本 KYC 玩家 / VIP 0-1": { "zh-Hans": "L1 基本 KYC 玩家 / VIP 0-1", en: "L1 Basic KYC Player / VIP 0-1", vi: "L1 Người chơi KYC cơ bản / VIP 0-1" },
  "L2 穩定一般玩家 / VIP 2-3": { "zh-Hans": "L2 稳定一般玩家 / VIP 2-3", en: "L2 Stable Standard Player / VIP 2-3", vi: "L2 Người chơi phổ thông ổn định / VIP 2-3" },
  "L3 中階 VIP / VIP 4-6": { "zh-Hans": "L3 中阶 VIP / VIP 4-6", en: "L3 Mid-Tier VIP / VIP 4-6", vi: "L3 VIP trung cấp / VIP 4-6" },
  "L4 高端 VIP / VIP 7+": { "zh-Hans": "L4 高端 VIP / VIP 7+", en: "L4 High-End VIP / VIP 7+", vi: "L4 VIP cao cấp / VIP 7+" },
  "R 高風險玩家 / 不限 VIP / 風控標記": { "zh-Hans": "R 高风险玩家 / 不限 VIP / 风控标记", en: "R High-Risk Player / Any VIP / Risk Flagged", vi: "R Người chơi rủi ro cao / mọi cấp VIP / bị gắn cờ rủi ro" },
  "建議區間": { "zh-Hans": "建议区间", en: "Suggested Range", vi: "Khoảng gợi ý" },
  "設定額度（CNY）": { "zh-Hans": "设置额度（CNY）", en: "Limit Amount (CNY)", vi: "Số tiền hạn mức (CNY)" },
  "設定原因": { "zh-Hans": "设置原因", en: "Reason for Setting", vi: "Lý do thiết lập" },
  "系統設定建議": { "zh-Hans": "系统设置建议", en: "System Recommendation", vi: "Gợi ý của hệ thống" },
  "設定來源": { "zh-Hans": "设置来源", en: "Setting Source", vi: "Nguồn thiết lập" },
  "系統設定 / 限額設定類別": { "zh-Hans": "系统设置 / 限额设置类别", en: "System Settings / Limit Categories", vi: "Cài đặt hệ thống / Nhóm thiết lập hạn mức" },
  "控制流水與投注強度；不可只依 VIP 等級放大，需看近 30 日平均日投注額。": { "zh-Hans": "控制流水与投注强度；不可只依 VIP 等级放大，需看近 30 日平均日投注额。", en: "Controls turnover and betting intensity. Do not increase it by VIP level alone; use the 30-day average daily bet amount.", vi: "Kiểm soát doanh số cược và cường độ đặt cược. Không tăng chỉ theo cấp VIP; cần dựa trên tiền cược trung bình ngày trong 30 ngày." },
  "L0-L1 可系統自動；L2 半自動；L3 以上需人工審核。": { "zh-Hans": "L0-L1 可系统自动；L2 半自动；L3 以上需人工审核。", en: "L0-L1 can be automated; L2 is semi-automated; L3 and above require manual review.", vi: "L0-L1 có thể tự động; L2 bán tự động; L3 trở lên cần duyệt thủ công." },
  "今日已投注額 + 本次下注額 ≤ 單日投注額上限": { "zh-Hans": "今日已投注额 + 本次下注额 ≤ 单日投注额上限", en: "Today's bet amount + this bet amount ≤ Daily Bet Limit", vi: "Tiền cược hôm nay + số tiền cược lần này ≤ Hạn mức cược mỗi ngày" },
  "今日已投注額 + 本次下注額 ≤ Daily Bet Limit": { "zh-Hans": "今日已投注额 + 本次下注额 ≤ 单日投注额上限", en: "Today's bet amount + this bet amount ≤ Daily Bet Limit", vi: "Tiền cược hôm nay + số tiền cược lần này ≤ Hạn mức cược mỗi ngày" },
  "規則名稱": { "zh-Hans": "规则名称", en: "Rule Name", vi: "Tên quy tắc" },
  "規則類型": { "zh-Hans": "规则类型", en: "Rule Type", vi: "Loại quy tắc" },
  "金額": { "zh-Hans": "金额", en: "Amount", vi: "Số tiền" },
  "頻率": { "zh-Hans": "频率", en: "Frequency", vi: "Tần suất" },
  "行為": { "zh-Hans": "行为", en: "Behavior", vi: "Hành vi" },
  "關聯": { "zh-Hans": "关联", en: "Link", vi: "Liên kết" },
  "新增規則": { "zh-Hans": "新增规则", en: "Add Rule", vi: "Thêm quy tắc" },
  "幣別風險值設定": { "zh-Hans": "币别风险值设置", en: "Currency Risk Thresholds", vi: "Ngưỡng rủi ro theo tiền tệ" },
  "同步匯率參考": { "zh-Hans": "同步汇率参考", en: "Sync Reference Rates", vi: "Đồng bộ tỷ giá tham chiếu" },
  "金額型規則依會員交易幣別套用門檻；匯率 API 僅用於畫面換算與參考，不直接覆蓋風控門檻。": { "zh-Hans": "金额型规则按会员交易币别套用门槛；汇率 API 仅用于画面换算与参考，不直接覆盖风控门槛。", en: "Amount-based rules apply thresholds by the member's transaction currency. The rate API is only for display conversion and reference; it does not overwrite risk thresholds.", vi: "Quy tắc theo số tiền áp dụng ngưỡng theo tiền tệ giao dịch của hội viên. API tỷ giá chỉ dùng để quy đổi hiển thị và tham khảo, không ghi đè ngưỡng rủi ro." },
  "會員幣別": { "zh-Hans": "会员币别", en: "Member Currency", vi: "Tiền tệ của hội viên" },
  "高額投注門檻": { "zh-Hans": "高额投注门槛", en: "Large Bet Threshold", vi: "Ngưỡng cược lớn" },
  "玩家盈利門檻": { "zh-Hans": "玩家盈利门槛", en: "Player Profit Threshold", vi: "Ngưỡng lợi nhuận người chơi" },
  "單日累積曝險": { "zh-Hans": "单日累计曝险", en: "Daily Accumulated Exposure", vi: "Rủi ro tích lũy trong ngày" },
  "預設處置": { "zh-Hans": "默认处置", en: "Default Action", vi: "Xử lý mặc định" },
  "建立事件 + 限額提醒": { "zh-Hans": "创建事件 + 限额提醒", en: "Create Event + Limit Alert", vi: "Tạo sự kiện + cảnh báo hạn mức" },
  "建立事件 + 人工覆核": { "zh-Hans": "创建事件 + 人工复核", en: "Create Event + Manual Review", vi: "Tạo sự kiện + rà soát thủ công" },
  "規則清單": { "zh-Hans": "规则清单", en: "Rule List", vi: "Danh sách quy tắc" },
  "觸發條件": { "zh-Hans": "触发条件", en: "Trigger Conditions", vi: "Điều kiện kích hoạt" },
  "處置方式": { "zh-Hans": "处置方式", en: "Action Method", vi: "Cách xử lý" },
  "幣別風險值": { "zh-Hans": "币别风险值", en: "Currency Risk Threshold", vi: "Ngưỡng rủi ro theo tiền tệ" },
  "最後更新": { "zh-Hans": "最后更新", en: "Last Updated", vi: "Cập nhật lần cuối" },
  "已設定": { "zh-Hans": "已设置", en: "Configured", vi: "Đã thiết lập" },
  "不適用": { "zh-Hans": "不适用", en: "N/A", vi: "Không áp dụng" },
  "報表類型": { "zh-Hans": "报表类型", en: "Report Type", vi: "Loại báo cáo" },
  "會員高風險日報": { "zh-Hans": "会员高风险日报", en: "Daily High-Risk Member Report", vi: "Báo cáo ngày hội viên rủi ro cao" },
  "代理風險排行週報": { "zh-Hans": "代理风险排行周报", en: "Weekly Agent Risk Ranking", vi: "Báo cáo tuần xếp hạng rủi ro đại lý" },
  "限額處置月報": { "zh-Hans": "限额处置月报", en: "Monthly Limit Action Report", vi: "Báo cáo tháng xử lý hạn mức" },
  "週期": { "zh-Hans": "周期", en: "Cycle", vi: "Chu kỳ" },
  "每日": { "zh-Hans": "每日", en: "Daily", vi: "Hằng ngày" },
  "每週": { "zh-Hans": "每周", en: "Weekly", vi: "Hằng tuần" },
  "每月": { "zh-Hans": "每月", en: "Monthly", vi: "Hằng tháng" },
  "自訂": { "zh-Hans": "自定义", en: "Custom", vi: "Tùy chỉnh" },
  "建立人": { "zh-Hans": "创建人", en: "Created By", vi: "Người tạo" },
  "總報表": { "zh-Hans": "总报表", en: "Total Reports", vi: "Tổng báo cáo" },
  "目前可查詢報表": { "zh-Hans": "当前可查询报表", en: "Reports currently searchable", vi: "Báo cáo hiện có thể tra cứu" },
  "可下載或匯出": { "zh-Hans": "可下载或导出", en: "Downloadable or exportable", vi: "Có thể tải xuống hoặc xuất" },
  "排程報表": { "zh-Hans": "排程报表", en: "Scheduled Reports", vi: "Báo cáo lập lịch" },
  "每日 / 每週自動產生": { "zh-Hans": "每日 / 每周自动生成", en: "Auto-generated daily / weekly", vi: "Tự động tạo hằng ngày / hằng tuần" },
  "產生中": { "zh-Hans": "生成中", en: "Generating", vi: "Đang tạo" },
  "目前無等待任務": { "zh-Hans": "当前无等待任务", en: "No pending jobs", vi: "Không có tác vụ chờ" },
  "報表管理清單": { "zh-Hans": "报表管理清单", en: "Report Management List", vi: "Danh sách quản lý báo cáo" },
  "報表名稱": { "zh-Hans": "报表名称", en: "Report Name", vi: "Tên báo cáo" },
  "產生時間": { "zh-Hans": "生成时间", en: "Generated Time", vi: "Thời gian tạo" },
  "自動刷新秒數": { "zh-Hans": "自动刷新秒数", en: "Auto Refresh (seconds)", vi: "Tự động làm mới (giây)" },
  "最大查詢區間": { "zh-Hans": "最大查询区间", en: "Maximum Search Range", vi: "Khoảng tra cứu tối đa" },
  "敏感操作需二次確認": { "zh-Hans": "敏感操作需二次确认", en: "Require confirmation for sensitive actions", vi: "Yêu cầu xác nhận lần hai cho thao tác nhạy cảm" },
  "通知設定": { "zh-Hans": "通知设置", en: "Notification Settings", vi: "Thiết lập thông báo" },
  "高風險事件收件人": { "zh-Hans": "高风险事件收件人", en: "High-Risk Event Recipients", vi: "Người nhận sự kiện rủi ro cao" },
  "通知頻道": { "zh-Hans": "通知频道", en: "Notification Channel", vi: "Kênh thông báo" },
  "站內通知 + Email": { "zh-Hans": "站内通知 + Email", en: "In-app Notifications + Email", vi: "Thông báo trong hệ thống + Email" },
  "站內通知": { "zh-Hans": "站内通知", en: "In-app Notifications", vi: "Thông báo trong hệ thống" },
  "幣別設定": { "zh-Hans": "币别设置", en: "Currency Settings", vi: "Thiết lập tiền tệ" },
  "顯示幣別": { "zh-Hans": "显示币别", en: "Display Currency", vi: "Tiền tệ hiển thị" },
  "人民幣 CNY": { "zh-Hans": "人民币 CNY", en: "Chinese Yuan (CNY)", vi: "Nhân dân tệ (CNY)" },
  "美元 USD": { "zh-Hans": "美元 USD", en: "US Dollar (USD)", vi: "Đô la Mỹ (USD)" },
  "港幣 HKD": { "zh-Hans": "港币 HKD", en: "Hong Kong Dollar (HKD)", vi: "Đô la Hồng Kông (HKD)" },
  "新台幣 TWD": { "zh-Hans": "新台币 TWD", en: "New Taiwan Dollar (TWD)", vi: "Đô la Đài Loan (TWD)" },
  "日圓 JPY": { "zh-Hans": "日元 JPY", en: "Japanese Yen (JPY)", vi: "Yên Nhật (JPY)" },
  "韓元 KRW": { "zh-Hans": "韩元 KRW", en: "Korean Won (KRW)", vi: "Won Hàn Quốc (KRW)" },
  "基準幣別": { "zh-Hans": "基准币别", en: "Base Currency", vi: "Tiền tệ cơ sở" },
  "匯率 API": { "zh-Hans": "汇率 API", en: "Exchange Rate API", vi: "API tỷ giá" },
  "最後同步": { "zh-Hans": "最后同步", en: "Last Sync", vi: "Đồng bộ lần cuối" },
  "目前顯示：人民幣 CNY": { "zh-Hans": "当前显示：人民币 CNY", en: "Currently displayed: Chinese Yuan (CNY)", vi: "Đang hiển thị: Nhân dân tệ (CNY)" },
  "匯率由 內部匯率服務 透過 API 同步；風控判斷請使用各幣別風險值，不直接拿顯示匯率換算門檻。": { "zh-Hans": "汇率由 内部汇率服务 通过 API 同步；风控判断请使用各币别风险值，不直接拿显示汇率换算门槛。", en: "Rates are synced from the internal rate service via API. Risk decisions should use currency-specific thresholds, not displayed exchange-rate conversions.", vi: "Tỷ giá được đồng bộ từ dịch vụ tỷ giá nội bộ qua API. Quyết định rủi ro phải dùng ngưỡng theo từng tiền tệ, không lấy tỷ giá hiển thị để quy đổi ngưỡng." },
  "API 匯率": { "zh-Hans": "API 汇率", en: "API Rate", vi: "Tỷ giá API" },
  "金額範例": { "zh-Hans": "金额示例", en: "Amount Example", vi: "Ví dụ số tiền" },
  "API 已同步": { "zh-Hans": "API 已同步", en: "API Synced", vi: "API đã đồng bộ" },
  "清單": { "zh-Hans": "清单", en: "List", vi: "Danh sách" },
  "已套用目前查詢條件": { "zh-Hans": "已套用当前查询条件", en: "Current search filters applied", vi: "Đã áp dụng điều kiện tra cứu hiện tại" },
  "事件類型": { "zh-Hans": "事件类型", en: "Event Type", vi: "Loại sự kiện" },
  "先從會員列表篩選目標會員，點擊詳情後進入單一會員風險檢視。": { "zh-Hans": "先从会员列表筛选目标会员，点击详情后进入单一会员风险检视。", en: "Filter the target member from the member list, then click Details to open a single-member risk review.", vi: "Lọc hội viên cần kiểm tra từ danh sách, rồi nhấn Chi tiết để mở phần kiểm tra rủi ro của từng hội viên." },
  "處置中": { "zh-Hans": "处置中", en: "Under Action", vi: "Đang xử lý" },
  "已凍結": { "zh-Hans": "已冻结", en: "Frozen", vi: "Đã khóa" },
  "test003 等 12 個": { "zh-Hans": "test003 等 12 个", en: "test003 and 12 others", vi: "test003 và 12 tài khoản khác" },
  "5 台裝置": { "zh-Hans": "5 台设备", en: "5 devices", vi: "5 thiết bị" },
  "2 台裝置": { "zh-Hans": "2 台设备", en: "2 devices", vi: "2 thiết bị" },
  "3 台裝置": { "zh-Hans": "3 台设备", en: "3 devices", vi: "3 thiết bị" },
  "目前只顯示 GRP-2048；切換集團後圖譜會自動重新收合。線條越粗代表關聯強度越高，虛線代表帳號與 IP / 裝置的交叉證據。": { "zh-Hans": "目前只显示 GRP-2048；切换集团后图谱会自动重新收合。线条越粗代表关联强度越高，虚线代表账号与 IP / 设备的交叉证据。", en: "Only GRP-2048 is shown now. After switching groups, the graph collapses again automatically. Thicker lines indicate stronger relationships, and dashed lines indicate cross-evidence between accounts, IPs, and devices.", vi: "Hiện chỉ hiển thị GRP-2048. Khi đổi nhóm, sơ đồ sẽ tự thu gọn lại. Đường càng dày nghĩa là mức liên kết càng mạnh; đường nét đứt thể hiện bằng chứng giao thoa giữa tài khoản, IP và thiết bị." },
  "關聯帳號：12 個": { "zh-Hans": "关联账号：12 个", en: "Linked Accounts: 12", vi: "Tài khoản liên kết: 12" },
  "共同 IP：3 組": { "zh-Hans": "共同 IP：3 组", en: "Shared IP: 3 groups", vi: "IP dùng chung: 3 nhóm" },
  "共同裝置：5 台": { "zh-Hans": "共同设备：5 台", en: "Shared Devices: 5", vi: "Thiết bị dùng chung: 5" },
  "判定原因：同 IP、同裝置、多帳號同局對打與高風險玩法集中投注。": { "zh-Hans": "判定原因：同 IP、同设备、多账号同局对打与高风险玩法集中投注。", en: "Reason: same IP, same device, multiple accounts placing opposite bets in the same round, and concentrated betting on high-risk play types.", vi: "Lý do xác định: cùng IP, cùng thiết bị, nhiều tài khoản cược đối ứng trong cùng ván và cược tập trung vào cách chơi rủi ro cao." },
  "12 個帳號": { "zh-Hans": "12 个账号", en: "12 accounts", vi: "12 tài khoản" },
  "7 個帳號": { "zh-Hans": "7 个账号", en: "7 accounts", vi: "7 tài khoản" },
  "4 個帳號": { "zh-Hans": "4 个账号", en: "4 accounts", vi: "4 tài khoản" },
  "依 高風險 與 單日投注額上限 建議區間調整。": { "zh-Hans": "按高风险与单日投注额上限建议区间调整。", en: "Adjusted according to the suggested range for High Risk and Daily Bet Limit.", vi: "Điều chỉnh theo khoảng gợi ý cho Rủi ro cao và Hạn mức cược mỗi ngày." },
  "今日投注額超過近 30 日平均 3 倍時降額 30% ~ 50%，超過 5 倍時降額 50% ~ 80%。": { "zh-Hans": "今日投注额超过近 30 日平均 3 倍时降额 30% ~ 50%，超过 5 倍时降额 50% ~ 80%。", en: "If today's bet amount exceeds 3x the 30-day average, reduce the limit by 30% to 50%; if it exceeds 5x, reduce it by 50% to 80%.", vi: "Nếu tiền cược hôm nay vượt 3 lần mức trung bình 30 ngày, giảm hạn mức 30% đến 50%; nếu vượt 5 lần, giảm 50% đến 80%." },
  "依會員幣別玩家盈利門檻": { "zh-Hans": "按会员币别玩家盈利门槛", en: "Player profit threshold by member currency", vi: "Ngưỡng lợi nhuận người chơi theo tiền tệ của hội viên" },
  "事件 + 限額提醒": { "zh-Hans": "事件 + 限额提醒", en: "Event + Limit Alert", vi: "Sự kiện + cảnh báo hạn mức" },
  "事件 + 觀察名單": { "zh-Hans": "事件 + 观察名单", en: "Event + Watchlist", vi: "Sự kiện + danh sách theo dõi" },
  "事件 + 人工覆核": { "zh-Hans": "事件 + 人工复核", en: "Event + Manual Review", vi: "Sự kiện + rà soát thủ công" },
  "事件": { "zh-Hans": "事件", en: "Event", vi: "Sự kiện" },
  "連續玩家盈利 >= 8 局": { "zh-Hans": "连续玩家盈利 >= 8 局", en: "Player profit for >= 8 consecutive rounds", vi: "Người chơi có lãi liên tiếp >= 8 ván" },
  "00:00-06:00 投注比例 >= 30%": { "zh-Hans": "00:00-06:00 投注占比 >= 30%", en: "Betting share from 00:00-06:00 >= 30%", vi: "Tỷ lệ cược từ 00:00-06:00 >= 30%" },
  "同裝置帳號 >= 3": { "zh-Hans": "同设备账号 >= 3", en: "Accounts on same device >= 3", vi: "Tài khoản trên cùng thiết bị >= 3" },
});

const zhHansCharMap = {
  "風": "风", "險": "险", "後": "后", "臺": "台", "台": "台", "體": "体", "語": "语", "系": "系", "會": "会", "員": "员",
  "儀": "仪", "錶": "表", "檢": "检", "視": "视", "聯": "联", "偵": "侦", "測": "测", "額": "额", "規": "规",
  "則": "则", "設": "设", "報": "报", "錶": "表", "統": "统", "頁": "页", "資": "资", "匯": "汇", "圖": "图",
  "譜": "谱", "類": "类", "別": "别", "狀": "状", "態": "态", "處": "处", "開": "开", "關": "关", "閉": "闭",
  "啟": "启", "凍": "冻", "結": "结", "帳": "账", "號": "号", "層": "层", "級": "级", "審": "审", "覈": "核",
  "證": "证", "驗": "验", "雙": "双", "權": "权", "陣": "阵", "歸": "归", "屬": "属", "範": "范", "圍": "围",
  "擔": "担", "營": "营", "運": "运", "產": "产", "異": "异", "動": "动", "錄": "录", "勾": "勾", "選": "选",
  "當": "当", "數": "数", "據": "据", "輸": "输", "贏": "赢", "虧": "亏", "錢": "钱", "寶": "宝", "萬": "万",
  "為": "为", "與": "与", "個": "个", "這": "这", "來": "来", "讓": "让", "應": "应", "觸": "触", "發": "发",
  "寫": "写", "讀": "读", "專": "专", "廣": "广", "點": "点", "擊": "击", "須": "须", "復": "复", "雜": "杂",
  "顯": "显", "隱": "隐", "餘": "余", "戶": "户", "單": "单", "與": "与", "線": "线", "護": "护", "邊": "边",
  "界": "界", "級": "级", "彙": "汇", "總": "总", "賽": "赛", "場": "场", "獎": "奖", "獲": "获", "據": "据"
};

const translationReverse = Object.entries(languageSettings).reduce((acc, [code]) => {
  acc[code] = {};
  Object.entries(languageTranslations).forEach(([source, targets]) => {
    const translated = targets[code];
    if (translated) acc[code][translated] = source;
  });
  return acc;
}, {});

const translationSourceText = new WeakMap();
const translationSourceAttrs = new WeakMap();
const translationSourceValues = new WeakMap();
let languageObserverQueued = false;

function languageOptionsMarkup() {
  return Object.entries(languageSettings)
    .map(([code, meta]) => `<option value="${code}" ${code === state.language ? "selected" : ""}>${meta.label}</option>`)
    .join("");
}

function preferredLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (languageSettings[stored]) return stored;
  } catch (error) {
    // localStorage can be unavailable in some file:// browser settings.
  }
  return "zh-Hant";
}

function translateTerm(value, language = state.language) {
  if (language === "zh-Hant") return value;
  const exact = languageTranslations[value]?.[language];
  if (exact) return exact;
  if (value.includes(" / ")) return value.split(" / ").map((part) => translateTerm(part, language)).join(" / ");
  if (language === "zh-Hans") {
    return [...value].map((char) => zhHansCharMap[char] || char).join("");
  }
  return value;
}

function translatePattern(value, language = state.language) {
  if (language === "zh-Hant") return "";
  const recordCount = value.match(/^共\s*(\d+)\s*筆$/);
  if (recordCount) {
    if (language === "zh-Hans") return `共 ${recordCount[1]} 笔`;
    if (language === "en") return `Total ${recordCount[1]} records`;
    if (language === "vi") return `Tổng ${recordCount[1]} dòng`;
  }
  const caseCount = value.match(/^(\d+)\s*件$/);
  if (caseCount) {
    if (language === "zh-Hans") return `${caseCount[1]} 件`;
    if (language === "en") return `${caseCount[1]} cases`;
    if (language === "vi") return `${caseCount[1]} vụ`;
  }
  const accountCount = value.match(/^(\d+)\s*個帳號$/);
  if (accountCount) {
    if (language === "zh-Hans") return `${accountCount[1]} 个账号`;
    if (language === "en") return `${accountCount[1]} accounts`;
    if (language === "vi") return `${accountCount[1]} tài khoản`;
  }
  const ipGroupCount = value.match(/^(\d+)\s*組\s*IP$/);
  if (ipGroupCount) {
    if (language === "zh-Hans") return `${ipGroupCount[1]} 组 IP`;
    if (language === "en") return `${ipGroupCount[1]} IP groups`;
    if (language === "vi") return `${ipGroupCount[1]} nhóm IP`;
  }
  const deviceCount = value.match(/^(\d+)\s*台裝置$/);
  if (deviceCount) {
    if (language === "zh-Hans") return `${deviceCount[1]} 台设备`;
    if (language === "en") return `${deviceCount[1]} devices`;
    if (language === "vi") return `${deviceCount[1]} thiết bị`;
  }
  return "";
}

function translateText(value, language = state.language) {
  if (!value || language === "zh-Hant") return value;
  const prefix = value.match(/^\s*/)?.[0] || "";
  const suffix = value.match(/\s*$/)?.[0] || "";
  let body = value.trim();
  if (!body) return value;
  const numbered = body.match(/^(\d+\.\s*)(.+)$/);
  const numberPrefix = numbered?.[1] || "";
  if (numbered) body = numbered[2];
  let translated = translatePattern(body, language) || translateTerm(body, language);
  if (translated === body && language !== "zh-Hans") {
    const entries = Object.keys(languageTranslations).sort((a, b) => b.length - a.length);
    entries.forEach((source) => {
      const target = languageTranslations[source]?.[language];
      if (target && translated.includes(source)) translated = translated.split(source).join(target);
    });
  }
  return `${prefix}${numberPrefix}${translated}${suffix}`;
}

function canonicalText(value) {
  const body = String(value || "").trim();
  return translationReverse[state.language]?.[body] || body;
}

function translateDomText(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest("#languageSelect")) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    if (!translationSourceText.has(node)) translationSourceText.set(node, node.nodeValue);
    node.nodeValue = translateText(translationSourceText.get(node));
  });
}

function translateDomAttributes(root = document.body) {
  const attrs = ["title", "aria-label", "placeholder"];
  root.querySelectorAll("*").forEach((node) => {
    if (node.closest("#languageSelect")) return;
    attrs.forEach((attr) => {
      if (!node.hasAttribute(attr)) return;
      let source = translationSourceAttrs.get(node);
      if (!source) {
        source = {};
        translationSourceAttrs.set(node, source);
      }
      if (!source[attr]) source[attr] = node.getAttribute(attr);
      node.setAttribute(attr, translateText(source[attr]));
    });
  });
}

function translateDomValues(root = document.body) {
  root.querySelectorAll("[data-i18n-value]").forEach((node) => {
    if (!translationSourceValues.has(node)) translationSourceValues.set(node, node.value || node.textContent || "");
    const translated = translateText(translationSourceValues.get(node));
    if ("value" in node) {
      node.value = translated;
      if (node.tagName === "TEXTAREA") node.textContent = translated;
    } else {
      node.textContent = translated;
    }
  });
}

function applyLanguageToDom() {
  document.documentElement.lang = languageSettings[state.language]?.htmlLang || "zh-Hant";
  document.title = translateText("會員風險檢視 | 風控管理後台");
  document.querySelectorAll("#languageSelect, #languageSettingSelect").forEach((select) => {
    select.value = state.language;
  });
  translateDomText();
  translateDomAttributes();
  translateDomValues();
}

function scheduleLanguageApply() {
  if (languageObserverQueued) return;
  languageObserverQueued = true;
  requestAnimationFrame(() => {
    languageObserverQueued = false;
    applyLanguageToDom();
  });
}

function applyLanguage(code, options = {}) {
  state.language = languageSettings[code] ? code : "zh-Hant";
  if (options.persist) {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, state.language);
    } catch (error) {
      // Language still works for this session if localStorage is blocked.
    }
  }
  applyLanguageToDom();
  if (options.announce) toast("語系已切換");
}

function observeLanguageDom() {
  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length)) scheduleLanguageApply();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

const exchangeRateApi = {
  provider: "內部匯率服務",
  endpoint: "GET /api/system/exchange-rates?base=CNY",
  updatedAt: "2026-04-30 09:00:00",
  status: "API 已同步",
};

const riskCurrencyThresholds = [
  { code: "CNY", highBet: 50000, highWin: 50000, dailyExposure: 300000, action: "建立事件 + 限額提醒" },
  { code: "USD", highBet: 7000, highWin: 7000, dailyExposure: 42000, action: "建立事件 + 限額提醒" },
  { code: "HKD", highBet: 54000, highWin: 54000, dailyExposure: 326000, action: "建立事件 + 限額提醒" },
  { code: "TWD", highBet: 220000, highWin: 220000, dailyExposure: 1300000, action: "建立事件 + 限額提醒" },
  { code: "JPY", highBet: 1040000, highWin: 1040000, dailyExposure: 6250000, action: "建立事件 + 人工覆核" },
  { code: "KRW", highBet: 9400000, highWin: 9400000, dailyExposure: 56600000, action: "建立事件 + 人工覆核" },
];

const memberRows = [
  ["test003", "M0001003", "CQ9", "VIP 6", "CNY", "91", "高風險", "正常", "2025-04-03 14:22:18"],
  ["amy900", "M0001090", "CQ9", "VIP 5", "CNY", "87", "高風險", "觀察中", "2025-04-03 13:58:10"],
  ["vip118", "M0001118", "AG01", "VIP 7", "CNY", "66", "中風險", "限額中", "2025-04-03 12:41:02"],
  ["mike77", "M0002077", "BBIN", "VIP 3", "USD", "58", "中風險", "正常", "2025-04-03 11:19:44"],
  ["lin0520", "M0002520", "CQ9", "VIP 2", "CNY", "35", "低風險", "正常", "2025-04-02 22:10:31"],
  ["risk888", "M0001888", "AG01", "VIP 6", "CNY", "94", "高風險", "凍結", "2025-04-02 18:02:15"],
];

const tabs = [
  ["overview", "風險總覽"],
  ["bets", "投注明細"],
  ["games", "遊戲紀錄"],
  ["analysis", "高風險投注分析"],
  ["history", "盈虧歷史"],
  ["limits", "限額檢視"],
  ["remarks", "備註紀錄"],
];

const settingsTabs = [
  ["general", "一般設定"],
  ["limitCategories", "限額設定類別"],
  ["admins", "管理者與權限"],
  ["audit", "異動紀錄"],
];

const metrics = [
  { label: "風險評分", value: "91 / 100", progress: 91 },
  { label: "下注筆數", value: "512", compare: "對比前一天 ↑ 23.54%", trend: "up" },
  { label: "投注金額", value: "1,258,000.00", compare: "對比前一天 ↑ 15.32%", trend: "up" },
  { label: "輸贏金額", value: "95,450.00", compare: "玩家贏錢較前一天擴大 7.89%", trend: "up" },
  { label: "盈虧(%)", value: "7.89%", compare: "玩家贏錢比例 ↑ 3.21%", trend: "up" },
  { label: "高風險投注比例", value: "45.67%", compare: "對比前一天 ↑ 8.73%", trend: "up" },
];

const riskRows = [
  ["玩家盈虧率", "7.89%", "2.15%", "高風險"],
  ["高風險投注比例(Tie/Pair/Bonus)", "45.67%", "18.32%", "高風險"],
  ["高風險投注命中率", "16.54%", "9.52%", "高風險"],
  ["最大單注金額", "100,000.00", "50,000.00", "高風險"],
  ["連開局數(最大)", "18", "7", "高風險"],
  ["單日最大輸贏", "125,450.00", "45,230.00", "高風險"],
  ["異常投注時段比例", "32.14%", "12.57%", "中風險"],
  ["多帳號關聯數", "3", "1", "高風險"],
];

const riskCalculationDocs = [
  {
    title: "風險評分",
    formula: "風險評分 = 玩家獲利能力分 + 高風險玩法分 + 行為異常分 + 關聯風險分 + 處置紀錄分，上限 100 分。",
    source: "會員投注統計、已結算輸贏、規則命中紀錄、IP / 裝置 / 帳號關聯、限額與凍結紀錄。",
    interpretation: "0-39 為低風險，40-69 為中風險，70 以上列為高風險並進入優先覆核。",
    note: "分數用於排序與提醒，不應單獨作為凍結依據；敏感處置仍需查看原因與證據鏈。",
  },
  {
    title: "下注筆數",
    formula: "下注筆數 = 查詢期間內成功成立且未取消的注單數。",
    source: "注單主檔、注單狀態、查詢日期範圍。",
    interpretation: "短時間下注筆數快速上升，可能代表追注、批量操作或自動下注。",
    note: "需排除取消、作廢、測試注單；也要搭配投注金額與時間間隔一起看。",
  },
  {
    title: "投注金額",
    formula: "投注金額 = 查詢期間內所有有效注單投注額加總。",
    source: "有效投注額、會員幣別、匯率顯示設定。",
    interpretation: "投注額明顯高於會員層級或近期平均時，需檢查是否有大額投注或拆單規避限額。",
    note: "風控判斷以會員原幣別門檻為準；畫面顯示幣別只用於閱讀換算。",
  },
  {
    title: "輸贏金額",
    formula: "輸贏金額 = 派彩金額 - 有效投注金額，採玩家視角。",
    source: "已結算注單、派彩金額、有效投注額。",
    interpretation: "正數代表玩家贏錢、平台輸錢；負數代表玩家輸錢、平台贏錢。",
    note: "未結算注單不可納入；跨幣別統計需保留原幣別與基準幣別。",
  },
  {
    title: "盈虧(%)",
    formula: "盈虧(%) = 輸贏金額 ÷ 有效投注金額 × 100%。",
    source: "已結算輸贏、有效投注額。",
    interpretation: "百分比為正代表玩家贏錢效率越高；需搭配投注量判斷樣本是否足夠。",
    note: "有效投注額為 0 時不可計算，畫面需顯示為 N/A 或暫無資料。",
  },
  {
    title: "玩家盈虧率",
    formula: "玩家盈虧率 = 玩家輸贏金額 ÷ 有效投注金額 × 100%，其中玩家輸贏金額 = 派彩金額 - 有效投注金額。",
    source: "已結算注單、有效投注額、派彩金額。",
    interpretation: "長期盈虧率持續為正且投注量大，通常比單日玩家贏錢更值得優先追蹤。",
    note: "樣本數過少時不宜直接升級風險，可先加入觀察名單。",
  },
  {
    title: "高風險投注比例",
    formula: "高風險投注比例 = 高風險玩法投注金額 ÷ 總投注金額 × 100%。",
    source: "玩法分類、投注金額、風控規則標籤，例如 Tie、Pair、Bonus 或平台定義的高波動玩法。",
    interpretation: "比例越高，代表會員投注集中在高風險玩法，可能放大短期曝險。",
    note: "不同遊戲的高風險玩法定義不同，需由規則設定維護，不可寫死在前端。",
  },
  {
    title: "高風險投注命中率",
    formula: "高風險投注命中率 = 高風險玩法玩家盈利注單數 ÷ 高風險玩法已結算注單數 × 100%。",
    source: "高風險玩法注單、結算結果、輸贏金額。",
    interpretation: "高風險玩法命中率高於基準值，可能代表短期波動、策略型投注或異常資訊優勢。",
    note: "必須搭配注單數；少量命中不代表穩定風險。",
  },
  {
    title: "最大單注金額",
    formula: "最大單注金額 = max(單筆有效投注金額)。",
    source: "查詢期間內所有有效注單金額。",
    interpretation: "單注超過幣別風險門檻時，可觸發大額投注事件或限額提醒。",
    note: "不同幣別需使用各自門檻，例如 CNY、USD、JPY 不可直接用同一數字比較。",
  },
  {
    title: "連開局數(最大)",
    formula: "連開局數(最大) = 查詢期間內同方向或同結果連續命中的最長局數。",
    source: "遊戲局號、局結果、會員投注項、結算時間排序。",
    interpretation: "連續命中或連續同方向投注過長，可能代表追注、套利策略或遊戲結果異常。",
    note: "需按遊戲局號與時間排序，跨桌、跨遊戲不可直接合併計算。",
  },
  {
    title: "單日最大輸贏",
    formula: "單日最大輸贏 = max(每日輸贏金額的絕對值)，並保留當日實際正負方向。",
    source: "每日已結算注單彙總、有效投注額、派彩金額。",
    interpretation: "單日輸贏波動越大，代表會員或平台單日曝險越高；正數代表玩家贏錢。",
    note: "若只看絕對值會漏掉方向；明細中必須標明正負，正數需優先確認玩家獲利原因。",
  },
  {
    title: "異常投注時段比例",
    formula: "異常投注時段比例 = 異常時段投注金額 ÷ 總投注金額 × 100%。",
    source: "注單成立時間、平台定義的異常時段，例如 00:00-06:00 或低流量時段。",
    interpretation: "異常時段比例偏高，可能代表利用低監控時段、批量投注或跨區操作。",
    note: "需依市場營運時區計算，不能只用瀏覽器本地時間。",
  },
  {
    title: "多帳號關聯數",
    formula: "多帳號關聯數 = 與此會員共享 IP、裝置、支付資料、KYC 或相似投注行為的去重帳號數。",
    source: "登入 IP、Device ID、支付工具、KYC 資料、投注時間與玩法相似度。",
    interpretation: "關聯數越高，多帳號、對打、拆單或集團操作的可能性越高。",
    note: "公司、家庭、宿舍網路可能造成誤判，需查看共同裝置與下注行為交叉證據。",
  },
];

const events = [
  ["2025-04-03 14:15:22", "高風險投注命中", "Tie 投注命中，玩家輸贏 85,000.00（玩家贏錢）", "高風險", "已處理", "system", "自動風控規則觸發"],
  ["2025-04-03 13:42:11", "異常連勝", "連續贏局達 12 局", "高風險", "已處理", "system", "自動風控規則觸發"],
  ["2025-04-03 11:08:33", "大額投注", "單注金額達 100,000.00", "中風險", "已處理", "system", "限額調整提醒"],
  ["2025-04-02 22:35:45", "異常時段投注", "凌晨時段投注比例過高", "中風險", "已處理", "admin", "人工覆核"],
];

const riskEventTypes = [
  ["超過限額", 38, 28.36, "#e35252"],
  ["出金上限", 27, 20.15, "#f59e0b"],
  ["集團投注", 24, 17.91, "#2378dc"],
  ["對押 / 對打", 19, 14.18, "#9b55d4"],
  ["異常登入", 14, 10.45, "#39a96b"],
  ["AML 入金異常", 12, 8.96, "#6ca6b1"],
];

const profitSeries = [
  0, 6000, -9000, -33000, -13000, -26000, -21000, -39000, -27000, -65000,
  -42000, -82000, -108000, -76000, -46000, -43000, 6000, -15000, -8000, 4000,
  13000, 31000, 52000, 34000, 42000, 28000, 54000, 88000, 116000, 102000,
];

const riskEventSeries = [
  12, 15, 9, 18, 22, 19, 28, 31, 25, 34,
  29, 38, 42, 36, 33, 41, 47, 45, 52, 49,
  58, 63, 55, 61, 68, 73, 70, 82, 88, 91,
];

const notifications = [
  { time: "2025-04-03 14:15:22", level: "高風險", title: "test003 高額 Tie 命中", body: "玩家輸贏 85,000.00，正數代表玩家贏錢，已超過高風險閾值。", action: "查看會員", target: { view: "member", member: "test003", label: "會員風險檢視" } },
  { time: "2025-04-03 13:42:11", level: "高風險", title: "GRP-2048 疑似集團對打", body: "同局反向投注 8 次，共同裝置 5 台。", action: "查看集團", target: { view: "group", group: "GRP-2048", kind: "overview", label: "集團風險偵測" } },
  { time: "2025-04-03 11:08:33", level: "中風險", title: "vip118 大額投注提醒", body: "單注金額達 100,000.00，等待人工覆核。", action: "處理事件", target: { view: "dashboard", detail: "pendingEvents", label: "今日待辦明細" } },
  { time: "2025-04-03 10:22:18", level: "高風險", title: "risk888 自動凍結", body: "多帳號同裝置命中，自動凍結等待覆核。", action: "凍結覆核", target: { view: "dashboard", detail: "frozenAccounts", label: "凍結帳號詳細表單" } },
  { time: "2025-04-03 09:40:02", level: "中風險", title: "異常時段投注比例升高", body: "凌晨投注比例達 32.14%，建議觀察。", action: "查看事件", target: { view: "betting", label: "投注行為分析" } },
];

const riskCases = [
  {
    id: "RC-20250403-001",
    time: "2025-04-03 14:15:22",
    member: "test003",
    memberId: "M0001003",
    agent: "CQ9",
    currency: "CNY",
    riskScore: 91,
    riskLevel: "高風險",
    accountStatus: "正常",
    caseStatus: "待處理",
    sla: "逾期",
    owner: "risk01",
    type: "高風險投注命中",
    behavior: "高額 Tie 命中",
    game: "百家樂",
    rule: "高額 Tie 命中",
    betAmount: 100000,
    validBet: 100000,
    winLoss: 85000,
    reason: "Tie 投注命中，玩家輸贏 85,000.00，代表玩家贏錢且超過 CNY 玩家盈利門檻。",
    suggested: "先降低單注限額至 50,000 CNY，加入 7 日觀察；若再次命中同類規則，升級主管覆核。",
    evidence: ["注單 BT202504031000", "玩家輸贏 85,000.00 / 門檻 50,000.00", "近 30 天高風險投注比例 45.67%"],
  },
  {
    id: "RC-20250403-002",
    time: "2025-04-03 13:42:11",
    member: "amy900",
    memberId: "M0001090",
    agent: "CQ9",
    currency: "CNY",
    riskScore: 87,
    riskLevel: "高風險",
    accountStatus: "觀察中",
    caseStatus: "處理中",
    sla: "待處理",
    owner: "risk02",
    type: "疑似對打",
    behavior: "同局反向投注",
    game: "百家樂",
    groupId: "GRP-2048",
    rule: "多帳號同裝置",
    betAmount: 180000,
    validBet: 180000,
    winLoss: 3200,
    reason: "同局反向投注 4 次，且與 GRP-2048 共用裝置。",
    suggested: "先保留觀察狀態並標記集團覆核，核對共同裝置與同局投注後再決定是否限額。",
    evidence: ["集團 GRP-2048", "共同裝置 Device A91", "同局反向投注 4 次"],
  },
  {
    id: "RC-20250403-003",
    time: "2025-04-03 11:08:33",
    member: "vip118",
    memberId: "M0001118",
    agent: "AG01",
    currency: "CNY",
    riskScore: 66,
    riskLevel: "中風險",
    accountStatus: "限額中",
    caseStatus: "待主管覆核",
    sla: "待處理",
    owner: "opslead",
    type: "大額投注",
    behavior: "連續追注 9 局",
    game: "百家樂",
    rule: "追注異常",
    betAmount: 72000,
    validBet: 72000,
    winLoss: -18000,
    reason: "單注與追注頻率高於會員層級基準，已觸發限額提醒。",
    suggested: "維持既有限額並要求主管覆核，若 24 小時內未再命中可降為觀察。",
    evidence: ["追注 9 局", "單注 72,000.00", "目前狀態：限額中"],
  },
  {
    id: "RC-20250403-004",
    time: "2025-04-03 10:22:18",
    member: "risk888",
    memberId: "M0001888",
    agent: "AG01",
    currency: "CNY",
    riskScore: 94,
    riskLevel: "高風險",
    accountStatus: "凍結",
    caseStatus: "待主管覆核",
    sla: "待處理",
    owner: "opslead",
    type: "自動凍結",
    behavior: "多帳號同裝置",
    game: "百家樂",
    groupId: "GRP-2048",
    rule: "多帳號同裝置",
    freezeScope: "全部凍結",
    freezeSource: "自動",
    betAmount: 0,
    validBet: 0,
    winLoss: 0,
    reason: "多帳號共用裝置並命中集團風險，自動凍結等待覆核。",
    suggested: "維持凍結並檢查出金、共同裝置與關聯帳號；確認無擴散風險後再由主管覆核解凍。",
    evidence: ["共同裝置 Device C72", "關聯集團 GRP-2048", "帳號狀態：凍結"],
  },
  {
    id: "RC-20250403-005",
    time: "2025-04-03 09:40:02",
    member: "mike77",
    memberId: "M0002077",
    agent: "BBIN",
    currency: "USD",
    riskScore: 58,
    riskLevel: "中風險",
    accountStatus: "正常",
    caseStatus: "待處理",
    sla: "待處理",
    owner: "risk01",
    type: "異常時段投注",
    behavior: "凌晨集中投注",
    game: "輪盤",
    rule: "異常時段",
    betAmount: 45500,
    validBet: 45500,
    winLoss: 12400,
    reason: "凌晨投注比例達 32.14%，高於異常時段門檻。",
    suggested: "先標記事件已覆核並持續觀察 24 小時，不建議立即凍結。",
    evidence: ["異常時段比例 32.14%", "會員幣別 USD", "近 24 小時無關聯帳號命中"],
  },
];

const rowContexts = new Map();
let rowContextCounter = 0;

const riskHandlingGuidance = {
  member: {
    suggested: "先降低單注限額至 50,000，加入 7 日觀察名單；若再次命中高額投注或異常連勝，再升級人工覆核或凍結。",
    reason: "會員近 30 天玩家盈虧率為 7.89%，高風險投注比例達 45.67%，Tie / Pair / Bonus 類型投注集中，且曾出現大額單注與多帳號關聯。",
    evidence: ["風險評分 91 / 100", "單日最大輸贏 125,450.00（玩家贏錢）", "多帳號關聯數高於基準值"],
  },
  event: {
    suggested: "先標記事件已覆核並要求 24 小時內追蹤；若同類事件再次發生，改為升級覆核並限制自動接單。",
    reason: "事件命中高風險投注規則，觸發值明顯超過閾值，且事件狀態仍待處理或已逾期。",
    evidence: ["高風險投注命中", "觸發值超過規則門檻", "需要補足人工處理備註"],
  },
  bet: {
    suggested: "先核對注單、局號與派彩，再標記覆核結果；若同會員同日累積投注偏高，建議降低當日限額。",
    reason: "今日投注額集中在高風險玩法，玩家輸贏正值波動高於一般會員，需確認是否為連續追注或高額命中。",
    evidence: ["今日投注額 8,920,000.00", "高風險投注標籤增加", "需比對有效投注與玩家輸贏；正數代表玩家贏錢"],
  },
  frozen: {
    suggested: "先維持凍結並檢查凍結來源、關聯帳號與提款狀態；確認無擴散風險後再由主管覆核解凍。",
    reason: "帳號命中自動凍結或人工凍結條件，可能涉及多帳號同裝置、出金資料異常或疑似對打。",
    evidence: ["凍結來源需可追溯", "需記錄覆核原因", "解除限制前需確認關聯帳號"],
  },
};

const actionGuidance = {
  limit: {
    suggested: "優先下修單注或單日限額，保留會員登入與正常查詢權限，觀察期建議 7 天。",
    reason: "會員高風險投注比例與單注金額偏高，直接封鎖可能影響正常玩家體驗，先用限額降低曝險。",
    evidence: ["最大單注金額高於基準值", "近期盈虧波動偏高"],
  },
  watch: {
    suggested: "加入觀察名單並設定觀察期限，要求系統持續提醒同類規則命中。",
    reason: "目前已有異常訊號但尚未達到凍結標準，適合先保留證據並追蹤後續行為。",
    evidence: ["異常時段投注比例偏高", "高風險玩法投注比例升高"],
  },
  freeze: {
    suggested: "僅在高風險證據足夠時凍結，並明確填寫凍結範圍、期限與解除條件。",
    reason: "會員命中高風險投注與異常連勝規則，且可能存在多帳號或出金風險，需要暫停交易避免風險擴大。",
    evidence: ["命中高風險規則", "可能影響登入、投注或交易"],
  },
  noop: {
    suggested: "確認本次風險訊號已檢視，但不調整限額、不加入觀察、不凍結帳號，僅保留人工判斷紀錄。",
    reason: "資料可能屬於合理投注波動、樣本不足或已由既有規則涵蓋，可選擇不做處置並留下判斷原因。",
    evidence: ["需填寫不做處置原因", "案件會標記已完成", "稽核紀錄會保留人工結論"],
  },
  remark: {
    suggested: "補充人工判斷、追蹤方向與下一步檢查項目，讓下一位處理人員不用重新判讀。",
    reason: "風險處理需要可追溯的判斷脈絡，僅有系統規則不足以支撐後續客服、稽核或主管覆核。",
    evidence: ["需記錄操作原因", "需保留人工覆核脈絡"],
  },
};

const tableData = {
  bets: {
    toolbar: ["遊戲類型", "投注類型", "風險等級", "結算狀態", "關鍵字"],
    columns: ["投注時間", "注單號", "遊戲類型", "局號", "投注類型", "投注金額", "輸贏金額", "風險標籤", "狀態", "操作"],
    rows: Array.from({ length: 28 }, (_, i) => [
      `2025-04-${String(3 - Math.floor(i / 14)).padStart(2, "0")} ${String(14 - (i % 6)).padStart(2, "0")}:${String(10 + i).padStart(2, "0")}:22`,
      `BT20250403${String(1000 + i)}`,
      "百家樂",
      `BC-${84520 + i}`,
      ["莊", "閒", "Tie", "Pair"][i % 4],
      money([100000, 85000, 60000, 22000][i % 4]),
      money([85000, -22000, 12000, -9000][i % 4]),
      i % 3 === 0 ? "高風險" : i % 3 === 1 ? "中風險" : "正常",
      "已結算",
      "查看詳情",
    ]),
  },
  games: {
    columns: ["遊戲時間", "遊戲類型", "遊戲局號", "桌號", "局結果", "會員投注項", "總投注金額", "總輸贏", "是否高風險", "命中規則"],
    rows: Array.from({ length: 18 }, (_, i) => [
      `2025-04-03 ${String(13 - (i % 5)).padStart(2, "0")}:${String(20 + i).padStart(2, "0")}:09`,
      "百家樂",
      `BC-${84520 + i}`,
      `T-${12 + (i % 4)}`,
      ["莊勝", "閒勝", "和局"][i % 3],
      ["莊", "閒", "Tie"][i % 3],
      money(35000 + i * 4200),
      money((i % 2 ? -1 : 1) * (8000 + i * 1800)),
      i % 2 ? "否" : "是",
      i % 2 ? "-" : "連勝 / 高風險玩法",
    ]),
  },
  analysis: {
    columns: ["命中時間", "規則名稱", "規則類型", "觸發值", "閾值", "風險等級", "關聯注單", "處理狀態", "操作"],
    rows: [
      ["2025-04-03 14:15:22", "Tie 高額命中", "行為", "85,000.00", "50,000.00", "高風險", "BT202504031000", "未處理", "標記處理"],
      ["2025-04-03 13:42:11", "連續贏局", "頻率", "12 局", "8 局", "高風險", "8 筆", "已處理", "查看"],
      ["2025-04-03 11:08:33", "單注超額", "金額", "100,000.00", "50,000.00", "中風險", "BT202504031008", "已處理", "查看"],
      ["2025-04-02 22:35:45", "異常時段投注", "行為", "32.14%", "20%", "中風險", "13 筆", "已處理", "查看"],
    ],
  },
  history: {
    columns: ["日期", "下注筆數", "投注金額", "有效投注", "輸贏金額", "盈虧率", "高風險投注金額", "高風險比例"],
    rows: Array.from({ length: 30 }, (_, i) => [
      `2025-03-${String(5 + i).padStart(2, "0")}`,
      120 + i * 7,
      money(280000 + i * 21000),
      money(260000 + i * 18000),
      money(profitSeries[i]),
      `${(profitSeries[i] / (280000 + i * 21000) * 100).toFixed(2)}%`,
      money(90000 + i * 4700),
      `${(28 + (i % 9) * 1.6).toFixed(2)}%`,
    ]).reverse(),
  },
  limits: {
    columns: ["調整時間", "限額類型", "原限額", "新限額", "生效時間", "到期時間", "調整原因", "操作人", "狀態"],
    rows: [
      ["2025-04-03 11:10:00", "單注限額", "100,000.00", "50,000.00", "2025-04-03 11:10:00", "2025-04-10 23:59:59", "大額投注提醒", "admin", "生效中"],
      ["2025-03-18 09:20:10", "單日限額", "500,000.00", "300,000.00", "2025-03-18 09:20:10", "2025-03-25 23:59:59", "玩家獲利波動", "risk01", "已失效"],
    ],
  },
  remarks: {
    columns: ["建立時間", "備註類型", "備註內容", "建立人", "是否重要", "操作"],
    rows: [
      ["2025-04-03 15:02:11", "風控", "已人工覆核，需觀察 Tie 與 Pair 投注比例。", "admin", "是", "查看"],
      ["2025-04-02 23:12:45", "處置", "凌晨投注比例過高，建議降低單注限額。", "risk01", "否", "查看"],
    ],
  },
};

const pageTables = {
  betting: {
    columns: ["時間", "會員", "遊戲", "行為模式", "投注金額", "輸贏", "命中規則", "風險等級", "操作"],
    rows: [
      ["2025-04-03 14:15:22", "test003", "百家樂", "高額 Tie 命中", "100,000.00", "85,000.00", "高風險玩法", "高風險", "查看"],
      ["2025-04-03 13:44:18", "vip118", "百家樂", "連續追注 9 局", "72,000.00", "-18,000.00", "追注異常", "中風險", "查看"],
      ["2025-04-03 12:20:04", "mike77", "輪盤", "凌晨集中投注", "45,500.00", "12,400.00", "異常時段", "中風險", "查看"],
      ["2025-04-03 11:02:30", "amy900", "百家樂", "疑似對打", "180,000.00", "3,200.00", "關聯帳號", "高風險", "查看"],
    ],
  },
  group: {
    columns: ["集團ID", "關聯帳號數", "共同IP", "共同裝置", "總投注", "總輸贏", "主要風險", "等級", "操作"],
    rows: [
      ["GRP-2048", "12", "3", "5", "2,850,000.00", "186,500.00", "對打 / 同裝置", "高風險", "查看"],
      ["GRP-1831", "7", "2", "2", "920,000.00", "-52,300.00", "批量註冊", "中風險", "查看"],
      ["GRP-1622", "4", "1", "3", "610,000.00", "44,900.00", "登入時段重疊", "中風險", "查看"],
    ],
  },
  limitsPage: {
    columns: ["會員", "限額類型", "目前限額", "生效時間", "到期時間", "原因", "操作人", "狀態", "操作"],
    rows: [
      ["test003", "單注投注上限", "50,000.00", "2025-04-03 11:10:00", "2025-04-10 23:59:59", "大額投注提醒", "admin", "生效中", "查看"],
      ["amy900", "單日投注額上限", "300,000.00", "2025-04-03 10:00:00", "永久", "疑似套利", "risk01", "生效中", "查看"],
      ["vip118", "單日提款上限", "80,000.00", "2025-04-02 18:45:00", "2025-04-09 23:59:59", "玩家獲利異常", "admin", "生效中", "查看"],
      ["risk888", "群組單日曝險上限", "150,000.00", "2025-04-03 09:20:00", "2025-04-06 23:59:59", "多帳號同裝置", "risk02", "生效中", "查看"],
      ["mike77", "單玩法上限", "20,000.00", "2025-04-01 16:30:00", "2025-04-08 23:59:59", "高賠率玩法集中投注", "risk01", "生效中", "查看"],
    ],
  },
  rules: {
    columns: ["規則名稱", "規則類型", "觸發條件", "風險等級", "處置方式", "幣別風險值", "狀態", "最後更新", "操作"],
    rows: [
      ["高額 Tie 命中", "行為", "依會員幣別玩家盈利門檻", "高風險", "事件 + 限額提醒", "已設定", "啟用", "2025-04-01 09:20:00", "查看"],
      ["連續贏局", "頻率", "連續玩家盈利 >= 8 局", "高風險", "事件 + 觀察名單", "不適用", "啟用", "2025-04-01 09:20:00", "查看"],
      ["異常時段投注", "行為", "00:00-06:00 投注比例 >= 30%", "中風險", "事件", "不適用", "啟用", "2025-03-29 16:10:00", "查看"],
      ["多帳號同裝置", "關聯", "同裝置帳號 >= 3", "高風險", "事件 + 人工覆核", "不適用", "停用", "2025-03-22 11:02:00", "查看"],
    ],
  },
  reports: {
    columns: ["報表名稱", "週期", "資料範圍", "產生時間", "建立人", "狀態", "操作"],
    rows: [
      ["會員高風險日報", "每日", "2025-04-03", "2025-04-03 23:59:00", "system", "已完成", "查看"],
      ["代理風險排行週報", "每週", "2025-W14", "2025-04-06 08:00:00", "system", "已完成", "查看"],
      ["限額處置月報", "每月", "2025-03", "2025-04-01 09:00:00", "admin", "已完成", "查看"],
    ],
  },
  settings: {
    columns: ["設定項", "目前值", "影響範圍", "最後更新", "操作人", "操作"],
    rows: [
      ["自動刷新", "60 秒", "全後台", "2025-04-01 10:00:00", "admin", "查看"],
      ["查詢最大區間", "90 天", "查詢頁面", "2025-03-28 14:30:00", "admin", "查看"],
      ["顯示幣別", "CNY", "全後台金額顯示", "2025-03-25 09:40:00", "admin", "查看"],
      ["敏感操作二次確認", "啟用", "凍結 / 限額", "2025-03-20 16:12:00", "system", "查看"],
    ],
  },
};

const adminAccountTable = {
  columns: ["管理帳號", "管理者姓名", "帳號歸屬", "所屬代理", "角色", "資料範圍", "成本歸屬", "帳號狀態", "最後登入", "雙因素驗證", "操作"],
  rows: [
    ["admin", "系統管理員", "平台", "全站", "系統管理員", "全站系統設定 / 帳號權限", "平台負擔", "啟用", "2025-04-03 15:22:18", "已啟用", "查看"],
    ["risk01", "平台風控專員", "平台", "全站", "平台風控管理員", "全站風險事件 / 限額 / 集團", "平台負擔", "啟用", "2025-04-03 14:02:41", "已啟用", "查看"],
    ["audit01", "稽核人員", "平台", "全站", "平台風控審核員", "全站覆核 / 稽核紀錄", "平台負擔", "啟用", "2025-04-02 18:35:09", "已啟用", "查看"],
    ["cq9-risk-lead", "CQ9 風控主管", "代理", "CQ9", "代理風控主管", "CQ9 代理線與其會員", "代理負擔", "啟用", "2025-04-03 13:02:18", "已啟用", "查看"],
    ["cq9-risk01", "CQ9 風控監控員", "代理", "CQ9", "代理風控監控員", "CQ9 會員監控 / 事件初審", "代理負擔", "啟用", "2025-04-03 12:48:20", "已啟用", "查看"],
    ["opslead", "營運主管", "平台", "全站", "平台營運主管", "全站覆核 / 營運報表", "平台負擔", "停用", "2025-03-28 09:11:20", "未啟用", "查看"],
  ],
};

const permissionMatrix = {
  columns: ["功能模組", "代理風控監控員", "代理風控主管", "平台風控審核員", "平台風控管理員", "平台營運主管", "系統管理員"],
  rows: [
    ["首頁儀表板", "本代理 KPI / 待辦", "本代理 KPI / 派案 / 覆核", "全站查看 / 初審", "全站查看 / 處置", "全站查看 / 覆核", "完整權限"],
    ["會員風險分析", "本代理會員查看 / 初審 / 備註", "本代理處置 / 覆核", "全站初審 / 備註", "全站處置 / 備註", "全站覆核", "完整權限"],
    ["投注行為分析", "本代理注單查看 / 提交建議", "本代理標記處理", "全站初審 / 提交建議", "全站標記處理", "全站覆核", "完整權限"],
    ["集團風險偵測", "本代理關聯查看 / 提交覆核", "本代理關聯標記", "跨代理關聯初審", "跨代理集團覆核 / 處置", "跨代理重大覆核", "完整權限"],
    ["限額管理", "查看 / 提出調整申請", "本代理中低額核准", "全站查看 / 提出建議", "全站新增 / 調整 / 取消", "高額 / L3+ 覆核", "完整權限"],
    ["風控規則設定", "查看本代理適用規則", "提出代理規則建議", "查看 / 提出調整建議", "新增 / 編輯 / 測試", "核准重大規則", "完整權限"],
    ["報表管理", "本代理報表", "本代理匯出 / 派發", "全站指派報表", "全站產生 / 下載", "全站產生 / 下載", "完整權限"],
    ["系統設定", "個人安全設定", "代理人員查看 / 申請", "個人安全設定", "查看角色矩陣", "查看", "完整權限"],
  ],
};

const dashboardDetails = {
  highRiskMembers: {
    title: "高風險會員詳細表單",
    breadcrumb: "首頁 / 首頁儀表板 / 高風險會員",
    subtitle: "查看高風險會員清單、風險原因與處置建議。",
    guidance: "member",
    columns: ["會員帳號", "會員ID", "代理帳號", "風險評分", "風險等級", "主要原因", "帳號狀態", "操作"],
    rows: [
      ["test003", "M0001003", "CQ9", "91", "高風險", "高額 Tie 命中 / 連勝", "正常", "查看"],
      ["amy900", "M0001090", "CQ9", "87", "高風險", "疑似對打 / 關聯帳號", "觀察中", "查看"],
      ["risk888", "M0001888", "AG01", "94", "高風險", "多帳號同裝置", "凍結", "查看"],
    ],
    formTitle: "會員處置",
    formFields: [
      ["處置方式", "select", ["加入觀察名單", "調整限額", "凍結帳號", "新增備註"]],
      ["覆核期限", "datetime"],
      ["處置原因", "textarea"],
    ],
  },
  pendingEvents: {
    title: "今日待辦明細",
    breadcrumb: "首頁 / 首頁儀表板 / 今日待辦",
    subtitle: "處理逾期與未覆核的風險事件。",
    guidance: "event",
    columns: ["事件時間", "會員", "事件類型", "事件描述", "風險等級", "逾期狀態", "操作"],
    rows: [
      ["2025-04-03 14:15:22", "test003", "高風險投注命中", "Tie投注命中，玩家輸贏 85,000.00", "高風險", "逾期", "處理"],
      ["2025-04-03 13:42:11", "amy900", "疑似對打", "同局反向投注 4 次", "高風險", "待處理", "處理"],
      ["2025-04-03 11:08:33", "vip118", "大額投注", "單注金額達 100,000.00", "中風險", "待處理", "處理"],
    ],
    formTitle: "事件處理",
    formFields: [
      ["處理結果", "select", ["標記已處理", "加入觀察", "升級覆核", "忽略事件"]],
      ["處理備註", "textarea"],
    ],
  },
  todayBetAmount: {
    title: "今日投注額詳細表單",
    breadcrumb: "首頁 / 首頁儀表板 / 今日投注額",
    subtitle: "拆解今日投注額來源、產品分布與異常投注占比。",
    guidance: "bet",
    columns: ["時間", "會員", "遊戲", "投注金額", "有效投注", "輸贏", "風險標籤", "操作"],
    rows: [
      ["2025-04-03 14:15:22", "test003", "百家樂", "100,000.00", "100,000.00", "85,000.00", "高風險", "查看"],
      ["2025-04-03 13:44:18", "vip118", "百家樂", "72,000.00", "72,000.00", "-18,000.00", "中風險", "查看"],
      ["2025-04-03 12:20:04", "mike77", "輪盤", "45,500.00", "45,500.00", "12,400.00", "中風險", "查看"],
      ["2025-04-03 11:02:30", "amy900", "百家樂", "180,000.00", "180,000.00", "3,200.00", "高風險", "查看"],
    ],
    formTitle: "投注覆核",
    formFields: [
      ["覆核類型", "select", ["投注正常", "大額投注提醒", "高風險投注", "關聯投注"]],
      ["覆核備註", "textarea"],
    ],
  },
  frozenAccounts: {
    title: "凍結帳號詳細表單",
    breadcrumb: "首頁 / 首頁儀表板 / 凍結帳號",
    subtitle: "查看今日凍結帳號、凍結來源與解凍覆核狀態。",
    guidance: "frozen",
    columns: ["會員帳號", "會員ID", "凍結範圍", "凍結來源", "凍結時間", "凍結原因", "狀態", "操作"],
    rows: [
      ["risk888", "M0001888", "全部凍結", "自動", "2025-04-03 10:22:18", "多帳號同裝置", "凍結", "查看"],
      ["kk2025", "M0003025", "禁止出金", "人工", "2025-04-03 09:14:02", "出金資料異常", "凍結", "查看"],
      ["bb168", "M0002168", "禁止投注", "自動", "2025-04-03 08:40:59", "疑似對打", "凍結", "查看"],
    ],
    formTitle: "凍結覆核",
    formFields: [
      ["覆核結果", "select", ["維持凍結", "解除凍結", "改為限額", "升級審核"]],
      ["覆核原因", "textarea"],
    ],
  },
};

const specDocuments = {
  "首頁儀表板": {
    purpose: "提供全站風控即時概況與待辦入口，協助風控人員快速掌握今日高風險會員、事件處理、投注異常與凍結狀態。",
    fields: ["高風險會員", "今日待辦", "今日投注額", "凍結帳號", "近30天風險事件趨勢", "風險類型分布", "提醒事件", "連結頁面"],
    actions: ["點擊 KPI 卡片進入對應詳細表單", "點擊待辦開啟事件詳情", "點擊提醒前往對應頁面", "匯出資料", "刷新資料"],
    api: ["GET /api/risk/dashboard/summary", "GET /api/risk/dashboard/trends", "GET /api/risk/dashboard/event-types", "GET /api/risk/dashboard/tasks"],
    acceptance: ["KPI 顯示正確", "風險事件趨勢以事件數量呈現", "風險類型分布需顯示超過限額、出金上限、集團投注、對押 / 對打等事件統計，不可顯示下注玩法", "四張 KPI 卡可鑽取", "提醒事件可連結到會員、集團、事件、凍結或投注分析頁", "詳細表單可返回儀表板"],
  },
  "高風險會員詳細表單": {
    purpose: "展示由首頁高風險會員 KPI 鑽取出的會員清單，並提供處置表單。",
    fields: ["會員帳號", "會員ID", "代理帳號", "幣別", "風險評分", "風險等級", "主要原因", "建議處理方式", "被列入風險原因", "帳號狀態", "處置方式", "覆核期限", "處置原因"],
    actions: ["查詢", "查看會員詳情", "儲存處理", "返回儀表板"],
    api: ["GET /api/risk/dashboard/high-risk-members", "POST /api/risk/member/actions"],
    acceptance: ["可查看高風險原因", "處置原因必填", "儲存後提示成功並寫入操作日誌"],
  },
  "今日待辦明細": {
    purpose: "列出未處理或逾期的風險事件，支援風控人員集中覆核。",
    fields: ["事件時間", "會員", "事件類型", "事件描述", "風險等級", "建議處理方式", "被列入風險原因", "逾期狀態", "處理結果", "處理備註"],
    actions: ["查詢", "處理事件", "儲存處理", "返回儀表板"],
    api: ["GET /api/risk/events/pending", "POST /api/risk/events/{id}/resolve"],
    acceptance: ["逾期事件需標示", "處理結果必選", "處理備註需寫入審計日誌"],
  },
  "今日投注額詳細表單": {
    purpose: "拆解今日投注額來源，輔助分析投注量異常與高風險投注占比。",
    fields: ["時間", "會員", "幣別", "遊戲", "投注金額", "有效投注", "輸贏", "風險標籤", "建議處理方式", "被列入風險原因", "覆核類型", "覆核備註"],
    actions: ["查詢", "查看注單", "儲存覆核", "返回儀表板"],
    api: ["GET /api/risk/dashboard/today-bets", "POST /api/risk/bets/review"],
    acceptance: ["金額格式需一致", "高風險投注需標示", "覆核結果可保存"],
  },
  "凍結帳號詳細表單": {
    purpose: "檢視今日凍結帳號、凍結來源與覆核結果，支援解凍或維持凍結決策。",
    fields: ["會員帳號", "會員ID", "凍結範圍", "凍結來源", "凍結時間", "凍結原因", "建議處理方式", "被列入風險原因", "狀態", "覆核結果", "覆核原因"],
    actions: ["查詢", "查看帳號", "儲存覆核", "返回儀表板"],
    api: ["GET /api/risk/frozen-accounts", "POST /api/risk/frozen-accounts/{id}/review"],
    acceptance: ["凍結來源需區分人工/自動", "解除凍結需二次確認", "覆核結果需留存"],
  },
  "會員風險分析": {
    purpose: "提供會員風險列表，讓風控人員先篩選會員，再進入單一會員風險檢視。",
    fields: ["會員帳號", "會員ID", "代理帳號", "會員層級", "幣別", "風險評分", "風險等級", "帳號狀態", "最後登入"],
    actions: ["查詢會員", "匯出資料", "進入詳情"],
    api: ["GET /api/risk/members"],
    acceptance: ["列表可依幣別、風險等級與狀態篩選", "詳情需帶入會員摘要資料", "返回後保留列表"],
  },
  "會員風險檢視": {
    purpose: "查看單一會員風險評分、投注行為、盈虧趨勢、事件紀錄與處置操作。",
    fields: ["會員帳號", "日期範圍", "類型", "代理帳號", "幣別", "會員摘要", "核心指標", "建議處理方式", "被列入風險原因", "風險總覽", "風險計算說明", "投注明細", "遊戲紀錄", "高風險投注分析", "盈虧歷史", "限額紀錄", "備註紀錄"],
    actions: ["查詢", "返回列表", "調整限額", "加入觀察名單", "凍結帳號", "新增備註", "查看詳情"],
    api: ["GET /api/risk/member/summary", "GET /api/risk/member/metrics", "GET /api/risk/member/overview", "POST /api/risk/member/actions/*"],
    acceptance: ["日期不可超過 90 天", "可依會員交易幣別篩選風險資料", "風險等級顏色正確", "所有操作需填寫原因", "敏感操作需二次確認"],
  },
  "投注行為分析": {
    purpose: "辨識高額投注、追注、異常時段、疑似對打與高風險玩法等投注模式。",
    fields: ["日期範圍", "遊戲類型", "風險等級", "幣別", "會員帳號", "命中規則", "時間", "行為模式", "投注金額", "輸贏"],
    actions: ["查詢", "查看行為詳情", "匯出資料"],
    api: ["GET /api/risk/betting-behaviors", "GET /api/risk/betting-behaviors/{id}"],
    acceptance: ["高風險資料需醒目標示", "查看可開啟詳情", "篩選條件變更需刷新列表"],
  },
  "集團風險偵測": {
    purpose: "偵測多帳號關聯、共同 IP、共同裝置、同局對打與集團式套利風險。",
    fields: ["日期範圍", "集團ID", "幣別", "風險等級", "代理帳號", "關聯帳號數", "共同IP", "共同裝置", "總投注", "總輸贏", "主要風險", "等級"],
    actions: ["點擊集團ID看總覽", "點擊關聯帳號數看帳號", "點擊共同IP看 IP 關聯", "點擊共同裝置看裝置關聯", "標記覆核"],
    api: ["GET /api/risk/groups", "GET /api/risk/groups/{groupId}", "POST /api/risk/groups/{groupId}/review"],
    acceptance: ["關聯圖一次顯示一個集團", "可切換不同集團查看圖譜", "可依幣別查詢集團風險", "關聯欄位可鑽取", "關聯明細需列出帳號", "覆核需記錄原因"],
  },
  "限額管理": {
    purpose: "處理會員限額調整、審核、取消與操作追蹤；單一會員目前限額查詢放在會員風險分析的限額檢視。",
    fields: ["會員帳號", "幣別", "限額類型", "限額層級", "設定額度", "建議區間", "風險分數", "AML 分數", "責任博彩分數", "生效時間", "到期時間", "原因", "審核人", "操作人", "狀態"],
    actions: ["新增限額", "調整限額", "取消限額", "提交升額申請", "調降限額", "凍結升額", "查看審核紀錄", "匯出資料"],
    api: ["GET /api/risk/limits", "GET /api/risk/limits/templates", "GET /api/risk/limits/usage", "POST /api/risk/limits/applications", "PUT /api/risk/limits/{id}", "POST /api/risk/limits/{id}/cancel", "POST /api/risk/limits/{id}/approve"],
    acceptance: ["會員風險分析可查看單一會員目前限額、使用量與剩餘額度", "限額管理負責新增、調整、取消與審核，不作為會員限額查詢入口", "9 種限額類型需由系統設定維護，限額管理只引用", "投注檢查順序需涵蓋單注、單日、淨輸、單局 / 單場、玩法、派彩、群組與 AML", "L3 以上或高額升額不可自動通過", "異動需寫入審核紀錄與操作日誌"],
  },
  "風控規則設定": {
    purpose: "維護風控規則、觸發閾值、風險等級、自動處置與版本紀錄。",
    fields: ["規則名稱", "規則類型", "觸發條件", "風險等級", "處置方式", "會員幣別", "幣別風險值", "幣別風險門檻", "狀態", "最後更新"],
    actions: ["查詢", "新增規則", "查看規則", "啟用/停用", "設定各幣別風險值"],
    api: ["GET /api/risk/rules", "GET /api/risk/rules/currency-thresholds", "PUT /api/risk/rules/currency-thresholds", "POST /api/risk/rules/{id}/toggle"],
    acceptance: ["規則清單可依幣別查詢", "新增規則可進入表單", "金額型規則需可依會員幣別套用不同風險值", "重大異動需二次確認"],
  },
  "新增風控規則": {
    purpose: "建立新的風控規則，包含基本資料、觸發條件、自動處置與測試樣本。",
    fields: ["規則名稱", "規則代碼", "規則類型", "適用產品", "風險等級", "啟用狀態", "統計維度", "指標欄位", "比較方式", "基準風險值", "幣別風險門檻", "冷卻時間", "自動處置"],
    actions: ["測試規則", "儲存規則", "返回列表"],
    api: ["POST /api/risk/rules", "POST /api/risk/rules/test"],
    acceptance: ["必填欄位未填不可儲存", "各幣別風險值不可小於 0", "測試需顯示命中結果", "儲存後回列表"],
  },
  "報表管理": {
    purpose: "產出與下載風控營運報表，支援日、週、月與自訂區間。",
    fields: ["報表名稱", "週期", "幣別", "資料範圍", "產生時間", "建立人", "狀態"],
    actions: ["查詢", "產生報表", "下載報表", "匯出資料"],
    api: ["GET /api/risk/reports", "POST /api/risk/reports/generate", "GET /api/risk/reports/{id}/download"],
    acceptance: ["可依幣別產生與查詢報表", "報表狀態需顯示", "下載需權限控管", "下載行為需記錄日誌"],
  },
  "系統設定": {
    purpose: "管理後台安全、刷新、查詢限制、幣別顯示、API 匯率同步、通知、管理者帳號、角色權限與限額設定類別。",
    fields: ["自動刷新秒數", "最大查詢區間", "敏感操作二次確認", "顯示幣別", "基準幣別", "匯率API端點", "最後同步時間", "幣別匯率", "限額類型", "控制對象", "設定目的", "玩家類別", "VIP 對應", "建議下限", "建議上限", "檢查公式", "審核要求", "觸發處理", "玩家限額層級範本", "高風險事件收件人", "通知頻道", "管理帳號", "管理者姓名", "帳號歸屬", "所屬代理", "角色", "資料範圍", "成本歸屬", "審核層級", "Email", "帳號狀態", "最後登入", "雙因素驗證", "權限範圍", "角色權限矩陣", "設定異動紀錄"],
    actions: ["切換子項目", "儲存設定", "儲存限額類別設定", "套用幣別", "同步匯率", "測試通知", "新增管理帳號", "查看管理帳號", "編輯權限", "停用管理帳號", "查看異動"],
    api: ["GET /api/system/settings", "PUT /api/system/settings", "GET /api/system/limit-categories", "PUT /api/system/limit-categories/{type}", "GET /api/system/limit-level-templates", "PUT /api/system/limit-level-templates", "GET /api/system/exchange-rates?base=CNY", "POST /api/system/exchange-rates/sync", "PUT /api/system/currency-display", "GET /api/system/admin-accounts", "POST /api/system/admin-accounts", "PUT /api/system/admin-accounts/{account}", "POST /api/system/admin-accounts/{account}/disable", "GET /api/system/admin-account-hierarchy", "GET /api/system/risk-staff-cost-allocation", "GET /api/system/roles/permissions", "GET /api/system/settings/audit-logs"],
    acceptance: ["設定可編輯", "管理帳號需區分平台與代理歸屬", "代理風控帳號必須指定所屬代理、資料範圍與成本歸屬", "代理風控不可查看其他代理資料或修改全站規則", "限額設定類別需在系統設定子項目維護", "每個限額類型需可依玩家類別 / VIP 對應設定建議下限與上限", "新增管理帳號需驗證必填欄位", "管理帳號需指定角色並啟用雙因素驗證", "權限異動需寫入設定異動紀錄"],
  },
};

const fieldDescriptions = {
  "高風險會員": ["目前符合高風險條件的會員總數，通常由風險評分、規則命中與人工處置狀態綜合計算。", "數值型 KPI；點擊後進入高風險會員詳細表單。"],
  "待處理事件": ["尚未完成人工覆核或系統處理的風險事件數量，包含逾期事件。", "數值型 KPI；逾期事件需以紅色或警示文字標示。"],
  "今日投注額": ["統計今日所有有效投注金額，用於觀察投注量是否異常放大。", "金額格式；保留兩位小數，需可鑽取投注明細。"],
  "凍結帳號": ["目前處於凍結或部分限制狀態的帳號數量。", "數值型 KPI；需區分人工凍結與自動凍結。"],
  "近30天風險事件趨勢": ["顯示近 30 天每日風險事件數量變化。", "折線圖；Y 軸為事件數量，不可顯示投注額。"],
  "風險類型分布": ["顯示風控事件類型占比，例如超過限額、出金上限、集團投注、對押 / 對打、異常登入與 AML 入金異常。", "圓環圖；以事件件數計算，比例總和需為 100%，不可用莊閒和等下注類型。"],
  "今日待辦": ["列出風控人員今日需要優先處理的事件與覆核任務。", "可點擊開啟事件詳情或處理視窗。"],
  "提醒事件": ["右上角通知鈴鐺顯示的風險提醒清單，包含會員、集團、事件、凍結與投注異常。", "點擊後需顯示提醒詳情，並提供前往對應頁面的連結。"],
  "連結頁面": ["提醒事件對應的後台頁面，例如會員風險檢視、集團風險偵測、待處理事件、凍結帳號或投注行為分析。", "按鈕或連結；點擊後需切換左側選單狀態並保留必要上下文。"],
  "會員帳號": ["會員登入使用的唯一帳號，也是風控查詢與處置的主要識別欄位。", "字串；允許英文、數字、底線與連字號。"],
  "會員ID": ["系統內部會員唯一識別碼，用於 API、日誌與跨系統追蹤。", "字串；通常不可編輯。"],
  "會員": ["事件或投注紀錄對應的會員帳號。", "字串；可連結至會員風險檢視。"],
  "代理帳號": ["會員所屬代理或渠道，用於分析代理線風險聚集情況。", "下拉選單或字串；支援全部代理。"],
  "會員層級": ["會員 VIP 或分層等級，輔助判斷投注額與限額合理性。", "字串；例如 VIP 6。"],
  "幣別": ["會員交易與投注使用的主要幣別。", "ISO 或平台幣別代碼，例如 CNY、USD。"],
  "顯示幣別": ["後台目前用來呈現金額的幣別。切換後，首頁 KPI、會員指標、投注表格、限額資料、提醒內容與圖表座標需同步換算顯示。", "下拉選單；支援 CNY、USD、HKD、TWD、JPY、KRW。"],
  "基準幣別": ["系統儲存與風控統計使用的原始幣別，作為所有換算的基準。前端顯示可切換，但後端計算仍需保留基準值避免精度誤差。", "唯讀欄位；目前為 CNY。"],
  "匯率API端點": ["後台用來取得最新匯率資料的 API 位址。畫面匯率不可手動輸入，需由 API 回傳後更新。", "唯讀文字；例如 GET /api/system/exchange-rates?base=CNY。"],
  "最後同步時間": ["匯率 API 最近一次成功同步的時間，協助判斷目前顯示換算是否使用最新匯率。", "日期時間；API 失敗時需保留上次成功時間並提示。"],
  "幣別匯率": ["API 回傳的各幣別與基準幣別 CNY 的換算比例，用於畫面金額顯示換算。", "數值；由 API 提供，匯率不可為 0 或負數。"],
  "會員幣別": ["會員交易與風控判斷使用的原幣別。金額型規則應先看會員幣別，再套用該幣別的風險值。", "ISO 或平台幣別代碼，例如 CNY、USD。"],
  "幣別風險值": ["金額型風控規則是否已設定各幣別獨立門檻。設定後，同一規則會依會員幣別套用不同風險值。", "已設定 / 不適用；金額型規則建議必填。"],
  "幣別風險門檻": ["每個幣別各自的風險判斷門檻，例如 CNY 50,000、USD 7,000、JPY 1,040,000。此值用於風控判斷，不會因畫面顯示幣別切換而自動換算。", "數值；不可小於 0，需依幣別小數位驗證。"],
  "基準風險值": ["新增規則時用於快速產生各幣別門檻的基準值，通常以 CNY 表示。實際判斷仍以各幣別風險門檻為準。", "數值；不可小於 0。"],
  "最後登入": ["會員最近一次登入後台或遊戲端的時間。", "日期時間；格式 YYYY-MM-DD HH:mm:ss。"],
  "風險評分": ["系統根據投注、盈虧、關聯、事件與處置紀錄計算的綜合分數。", "0-100；70 以上高風險、40-69 中風險、39 以下低風險。"],
  "風險等級": ["將風險評分或規則命中結果轉換為可視化等級。", "低風險 / 中風險 / 高風險；需以顏色標示。"],
  "主要原因": ["會員或事件被判定為高風險的主要觸發原因摘要。", "文字；需可追溯到規則或事件紀錄。"],
  "建議處理方式": ["系統根據風險等級、命中規則與證據鏈提出的下一步處理建議，協助初學者判斷先觀察、限額、覆核或凍結。", "唯讀文字；可由規則引擎產生，人工可在處理備註中補充。"],
  "被列入風險原因": ["清楚說明會員、事件或帳號為什麼被列入風險名單，需列出主要觸發條件與可追溯證據。", "唯讀文字；至少包含命中規則、觸發值或關聯證據之一。"],
  "帳號狀態": ["會員目前帳號狀態，例如正常、觀察中、限額中、凍結。", "枚舉值；敏感狀態需明顯標示。"],
  "處置方式": ["風控人員對會員採取的處置類型。", "下拉選單；如觀察、限額、凍結、備註。"],
  "覆核期限": ["該風險事件或會員處置必須完成覆核的截止時間。", "日期時間；逾期需標示。"],
  "處置原因": ["執行風控處置時填寫的原因，供審計與後續追蹤。", "必填文字；不可僅輸入空白。"],
  "事件時間": ["風險事件被觸發或寫入系統的時間。", "日期時間；格式 YYYY-MM-DD HH:mm:ss。"],
  "事件類型": ["事件所屬分類，例如高風險投注、異常連勝、大額投注。", "枚舉值；由風控規則或事件系統定義。"],
  "事件描述": ["事件的具體內容，描述觸發值、命中規則與相關投注。", "文字；需包含足夠判斷資訊。"],
  "逾期狀態": ["事件是否超過覆核期限。", "枚舉值；待處理 / 逾期 / 已處理。"],
  "處理結果": ["風控人員對事件的處理結論。", "下拉選單；如已處理、升級覆核、忽略。"],
  "處理備註": ["事件處理時的人工說明。", "文字；敏感事件建議必填。"],
  "時間": ["列表紀錄發生的時間，依頁面可能代表投注時間、事件時間或產生時間。", "日期時間；需與使用者時區一致。"],
  "遊戲": ["投注或事件發生的遊戲名稱。", "字串；例如百家樂、輪盤。"],
  "遊戲類型": ["遊戲所屬分類，用於篩選投注行為。", "下拉選單；可為全部、百家樂、老虎機、輪盤、其他。"],
  "投注金額": ["會員下注金額總和或單筆投注金額。", "金額；需千分位與兩位小數。"],
  "有效投注": ["扣除取消、無效或不計流水後的有效投注額。", "金額；作為盈虧率與風險比例計算基礎。"],
  "輸贏": ["以玩家視角呈現會員相對平台的輸贏結果。", "金額；正數代表玩家贏錢 / 平台輸錢，負數代表玩家輸錢 / 平台贏錢。"],
  "風險標籤": ["投注或事件的風險標示。", "正常 / 中風險 / 高風險；需以 badge 顯示。"],
  "覆核類型": ["投注覆核的分類結果。", "下拉選單；如投注正常、大額投注提醒、高風險投注。"],
  "覆核備註": ["投注覆核時填寫的人工說明。", "文字；需寫入操作日誌。"],
  "凍結範圍": ["帳號凍結影響的功能範圍。", "枚舉值；禁止登入、禁止投注、禁止出金、全部凍結。"],
  "凍結來源": ["凍結操作來源。", "人工 / 自動；自動凍結需對應命中規則。"],
  "凍結時間": ["帳號被凍結的時間。", "日期時間；需可追溯操作人或系統規則。"],
  "凍結原因": ["帳號凍結的原因描述。", "必填文字；需可供稽核。"],
  "狀態": ["資料目前狀態，例如啟用、停用、生效中、已完成、凍結。", "枚舉值；需依狀態套用顏色。"],
  "覆核結果": ["凍結或事件覆核後的結論。", "下拉選單；例如維持凍結、解除凍結、升級審核。"],
  "覆核原因": ["覆核結果的原因說明。", "文字；敏感操作必填。"],
  "日期範圍": ["查詢統計資料的起訖日期。", "日期區間；不可查未來日期，預設最大 90 天。"],
  "類型": ["目前查詢的產品、品牌或投注類型。", "下拉選單；實際選項由後端提供。"],
  "會員摘要": ["單一會員的基本資料與目前風險狀態。", "包含帳號、ID、代理、VIP、幣別、登入與狀態。"],
  "核心指標": ["會員在查詢期間的風險評分、投注、輸贏與高風險比例。", "卡片式 KPI；需顯示比較值。"],
  "風險總覽": ["整合風險指標、趨勢圖、投注分布與風險事件。", "預設 Tab；用於快速判斷風險輪廓。"],
  "風險計算說明": ["逐項說明會員風險指標的計算公式、資料來源、風險判讀與注意事項。", "說明文字；需讓初學者可理解每個數值如何產生，以及何時不宜直接處置。"],
  "投注明細": ["會員投注單列表。", "表格；需支援分頁與查看詳情。"],
  "遊戲紀錄": ["會員參與的遊戲局紀錄。", "表格；用於分析連勝、同局投注與遊戲結果。"],
  "高風險投注分析": ["集中展示命中風控規則的投注行為。", "表格與分析區；可標記處理。"],
  "盈虧歷史": ["會員歷史盈虧趨勢與統計表。", "圖表 + 表格；支援日週月維度。"],
  "限額紀錄": ["會員限額調整的歷史紀錄。", "表格；需包含原限額、新限額、原因與操作人。"],
  "備註紀錄": ["風控人員對會員留下的備註與審核意見。", "表格；重要備註需標示。"],
  "命中規則": ["投注或事件命中的風控規則名稱。", "字串；需可追溯規則版本。"],
  "行為模式": ["系統判定的投注行為型態。", "例如追注、高額命中、異常時段、疑似對打。"],
  "集團ID": ["多帳號關聯群組的唯一編號。", "字串；點擊可查看關聯總覽。"],
  "關聯帳號數": ["該集團內被判定有關聯的會員帳號數量。", "數值；點擊可列出帳號明細。"],
  "共同IP": ["集團帳號共用或重疊的登入 IP 數量。", "數值；點擊顯示 IP 與對應帳號。"],
  "共同裝置": ["集團帳號共用或相似的裝置指紋數量。", "數值；點擊顯示裝置與對應帳號。"],
  "總投注": ["該集團在查詢期間的投注金額總和。", "金額；需依幣別格式化。"],
  "總輸贏": ["該集團在查詢期間的合計玩家輸贏。", "金額；正數代表集團玩家整體贏錢，負數代表平台贏錢。"],
  "主要風險": ["集團目前最主要的風險類型。", "文字；例如同裝置、同 IP、同局對打。"],
  "等級": ["集團風險等級。", "低 / 中 / 高；需以 badge 顯示。"],
  "限額類型": ["限制會員的限額分類。", "例如單注、單日、出金、遊戲類型限額。"],
  "限額層級": ["玩家目前套用的限額分層，用於決定基礎額度與審核流程。", "枚舉值；L0、L1、L2、L3、L4、R。"],
  "目前限額": ["目前對會員生效的限額值。", "金額；永久或臨時限額需區分。"],
  "使用量": ["會員今日或指定週期已使用的限額量。", "金額或比例；需依限額類型顯示。"],
  "剩餘額度": ["目前仍可使用的投注、淨輸、派彩或曝險額度。", "剩餘額度 = 上限 - 已使用量，不可小於 0。"],
  "風險分數": ["系統綜合 KYC、資金、行為、玩法、AML、責任博彩與群組風險的分數。", "0-100；分數越高代表越不建議升額。"],
  "AML 分數": ["洗錢風險評分，用於限制入金、提款、投注與升額。", "0-100；中高風險需人工審核。"],
  "責任博彩分數": ["玩家保護與沉迷風險評分。", "0-100；自我排除或冷靜期需限額歸零。"],
  "生效時間": ["限額、規則或設定開始生效的時間。", "日期時間；不可晚於到期時間。"],
  "到期時間": ["限額或規則停止生效的時間。", "日期時間；空值表示永久有效。"],
  "原因": ["限額或操作建立原因。", "文字；需能支撐風控決策。"],
  "審核人": ["限額升降額或特殊額度的核准人。", "帳號；L3 以上或高額升額需主管 / 高層審批。"],
  "操作人": ["執行操作的後台帳號或系統識別。", "字串；system 代表自動流程。"],
  "規則名稱": ["風控規則的顯示名稱。", "字串；需清楚描述規則用途。"],
  "規則類型": ["規則分類。", "金額 / 頻率 / 行為 / 關聯。"],
  "觸發條件": ["規則被命中時需滿足的條件摘要。", "文字；需包含指標、比較方式與閾值。"],
  "最後更新": ["資料、規則或設定最後修改時間。", "日期時間；需搭配操作人。"],
  "規則代碼": ["規則在系統內使用的唯一代碼。", "英文大寫、數字與底線；不可重複。"],
  "適用產品": ["規則適用的遊戲或產品範圍。", "下拉選單；可為全部產品或指定產品。"],
  "啟用狀態": ["新增規則目前是否啟用。", "啟用 / 停用 / 草稿。"],
  "統計維度": ["規則計算的時間或局域範圍。", "例如單局、單日、近 7 日、近 30 日。"],
  "指標欄位": ["規則用來判斷的資料指標。", "例如投注金額、連勝局數、共同裝置數。"],
  "比較方式": ["觸發值與閾值的比較運算。", "例如 >=、>、=、<=。"],
  "觸發閾值": ["規則命中的臨界值。", "數值；不可小於 0，需依指標單位解讀。"],
  "冷卻時間": ["同一會員或事件命中後暫停重複告警的時間。", "時間區間；避免短時間重複通知。"],
  "自動處置": ["規則命中後系統自動執行的動作。", "例如建立事件、通知、加入觀察或限額提醒。"],
  "報表名稱": ["風控報表的名稱。", "字串；需能辨識報表目的。"],
  "週期": ["報表產生週期。", "每日 / 每週 / 每月 / 自訂。"],
  "資料範圍": ["報表統計的資料期間或批次。", "日期、週期代碼或月份。"],
  "產生時間": ["報表產生完成或排程執行時間。", "日期時間。"],
  "建立人": ["報表或資料由誰建立。", "後台帳號或 system。"],
  "自動刷新秒數": ["系統自動刷新資料的時間間隔。", "秒數；需大於 0。"],
  "最大查詢區間": ["系統允許一次查詢的最大日期範圍。", "天數；目前建議 90 天。"],
  "敏感操作二次確認": ["是否要求凍結、解除、限額等敏感操作再次確認。", "布林值；建議預設啟用。"],
  "高風險事件收件人": ["高風險通知的收件人或群組。", "Email 或內部角色群組。"],
  "通知頻道": ["系統發送提醒的渠道。", "站內通知、Email 或兩者。"],
  "管理帳號": ["可登入後台的管理者帳號，用於操作追蹤、權限控管與稽核。", "英文、數字、底線與連字號；不可與既有帳號重複。"],
  "管理者姓名": ["管理帳號對應的人員名稱，方便客服、風控、稽核追蹤操作來源。", "字串；新增帳號時必填。"],
  "帳號歸屬": ["管理帳號由平台或代理建立與負責，用於區分資料可見範圍與人員成本。", "平台 / 代理；代理帳號必須綁定所屬代理。"],
  "所屬代理": ["代理風控人員可查看與處理的代理線範圍。", "代理代碼；平台帳號可為全站。"],
  "角色": ["管理帳號套用的權限角色，例如代理風控監控員、代理風控主管、平台風控管理員、平台營運主管、系統管理員。", "下拉選單；每個帳號至少需指定一個角色。"],
  "資料範圍": ["帳號可查看與處理的資料邊界，代理帳號只能限制在本代理與其下級會員。", "全站或指定代理線；不可留空。"],
  "成本歸屬": ["該風控人員的成本由平台、代理或代管方案分攤。", "平台負擔 / 代理負擔 / 平台代管 / 代理分攤。"],
  "審核層級": ["帳號建立、升權或敏感操作需要經過的覆核路徑。", "代理主管覆核、平台主管覆核或系統管理員覆核。"],
  "部門": ["管理者所屬部門，用於權限審核與操作責任歸屬。", "下拉或字串；例如風控部、營運部、資訊部。"],
  "Email": ["管理者接收通知、重設密碼或安全提醒的電子信箱。", "Email 格式；新增帳號時必填。"],
  "雙因素驗證": ["管理帳號是否已啟用第二因素驗證，用於降低帳號被盜用風險。", "已啟用 / 未啟用；高權限角色建議必須啟用。"],
  "權限範圍": ["該角色或帳號可查看、處理、核准或設定的功能範圍。", "以角色權限矩陣呈現；重大權限異動需記錄。"],
  "角色權限矩陣": ["列出各角色對每個功能模組的權限層級，讓管理者知道誰可以查看、處置、核准或設定。", "表格；不可出現空白權限，未授權需明確標示不可存取。"],
  "設定異動紀錄": ["系統設定被修改的歷史紀錄。", "需包含時間、操作人、前後值。"],
};

const groupRelations = {
  "GRP-2048": {
    accounts: ["test003", "amy900", "vip118", "risk888", "chen516", "lin0520", "qaz7788", "bb168", "leo909", "nina31", "mark66", "sunny11"],
    ips: [
      ["203.0.113.45", "test003、amy900、vip118、risk888"],
      ["198.51.100.22", "chen516、lin0520、qaz7788"],
      ["192.0.2.18", "bb168、leo909、nina31、mark66、sunny11"],
    ],
    devices: [
      ["Device A91", "test003、amy900、vip118"],
      ["Device C72", "risk888、chen516、lin0520"],
      ["Device K18", "qaz7788、bb168"],
      ["Device M33", "leo909、nina31"],
      ["Device R09", "mark66、sunny11"],
    ],
    reason: "同 IP、同裝置、多帳號同局對打與高風險玩法集中投注。",
  },
  "GRP-1831": {
    accounts: ["jack01", "jack02", "jack03", "jack04", "jack05", "jack06", "jack07"],
    ips: [
      ["203.0.113.88", "jack01、jack02、jack03、jack04"],
      ["198.51.100.51", "jack05、jack06、jack07"],
    ],
    devices: [
      ["Device B22", "jack01、jack03、jack05"],
      ["Device B23", "jack02、jack04、jack06、jack07"],
    ],
    reason: "批量註冊、登入時段高度重疊、投注金額級距相近。",
  },
  "GRP-1622": {
    accounts: ["hana88", "tom777", "mei168", "ray555"],
    ips: [["192.0.2.71", "hana88、tom777、mei168、ray555"]],
    devices: [
      ["Device P10", "hana88、tom777"],
      ["Device P11", "mei168"],
      ["Device P12", "ray555"],
    ],
    reason: "相同登入地區、登入時段重疊與相近投注路徑。",
  },
};

const limitControlTypes = [
  ["單日投注額上限", "玩家一天總下注金額", "控制流水與投注強度"],
  ["單日淨輸上限", "玩家一天最多可輸金額", "責任博彩與玩家保護"],
  ["單日入金上限", "玩家一天最多存款", "AML 與資金異常控制"],
  ["單日提款上限", "玩家一天最多提款", "防詐騙與出金風控"],
  ["單注投注上限", "單筆下注金額", "防止單筆大額衝擊"],
  ["單局 / 單場上限", "同一局遊戲或同一場賽事", "控制集中曝險"],
  ["單玩法上限", "指定玩法或投注區", "控制高風險玩法"],
  ["單日最大派彩上限", "玩家一天最大可贏金額", "控制平台最大賠付"],
  ["群組單日曝險上限", "多帳號關聯群組", "防工作室、套利與拆帳號"],
];

const limitLevelTemplates = [
  ["L0", "未完整 KYC / 新註冊", "10,000 ~ 30,000", "3,000 ~ 10,000", "1,000 ~ 3,000", "30,000 ~ 100,000", "系統自動"],
  ["L1", "基本 KYC 玩家", "50,000 ~ 100,000", "10,000 ~ 30,000", "5,000 ~ 10,000", "100,000 ~ 300,000", "系統自動"],
  ["L2", "穩定一般玩家", "300,000 ~ 500,000", "50,000 ~ 150,000", "20,000 ~ 50,000", "500,000 ~ 1,000,000", "半自動"],
  ["L3", "中階 VIP", "1,000,000 ~ 3,000,000", "300,000 ~ 800,000", "100,000 ~ 300,000", "3,000,000 ~ 5,000,000", "人工審核"],
  ["L4", "高端 VIP", "5,000,000 ~ 10,000,000+", "1,000,000 ~ 3,000,000+", "300,000 ~ 1,000,000", "10,000,000+", "強制人工審核"],
  ["R", "高風險玩家", "原額度 10% ~ 50%", "原額度 10% ~ 50%", "原額度 10% ~ 50%", "原額度 10% ~ 50%", "風控限制"],
];

const limitLayerDetails = [
  ["L0", "註冊未滿 7 天、KYC 未完成、首次入金或無穩定投注紀錄；不可自動提高額度，需先完成 KYC。"],
  ["L1", "手機、Email、身份證件與銀行或錢包綁定完成，註冊滿 7 天，近 7 日無重大異常。"],
  ["L2", "帳號年齡滿 30 天，有近 30 日穩定投注紀錄，無 AML 高風險與明顯套利 / 多帳號風險。"],
  ["L3", "帳號年齡 60 ~ 90 天，KYC 完整且資金紀錄穩定，需檢查歷史輸贏、玩法集中度與問題博彩訊號。"],
  ["L4", "資金來源已驗證，VIP / 風控 / 財務共同審核，不得自動升額，調整必須有有效期限與審批紀錄。"],
  ["R", "命中高風險、AML、對打、套利、多帳號或責任博彩訊號時套用，限額可降至原額度 10% ~ 50% 或歸零。"],
];

const limitFormulaCards = [
  ["最終單日投注限額", "基礎層級額度 × KYC係數 × 資金能力係數 × 行為風險係數 × 遊戲風險係數 × AML係數 × 責任博彩係數 × 平台曝險係數"],
  ["單日淨輸上限", "不得高於近 30 日平均日入金 × 2 ~ 3；高風險玩家降為 × 0.5 ~ 1。"],
  ["單日投注額上限", "不得高於近 30 日平均日投注額 × 3 ~ 5；投注突然放大時即時降額。"],
  ["群組單日曝險上限", "關聯群組今日最大可能派彩 + 本次最大可能派彩 ≤ 群組單日曝險上限。"],
];

const limitFactorRows = [
  ["KYC 係數", "未驗證 0.1 ~ 0.2；手機 / Email 0.3 ~ 0.5；身份證件 1.0；銀行帳戶 1.2；地址 1.3；收入證明 1.5 ~ 2.0；資金來源 2.0 ~ 5.0"],
  ["資金能力係數", "看近 7 / 30 / 90 日平均入金、歷史最大單日入金、可驗證收入與可驗證資產。"],
  ["行為風險係數", "行為穩定 1.0；長期低風險 1.2 ~ 1.5；突然放大 0.5 ~ 0.8；追損 0.2 ~ 0.5；套利 / 多帳號 0.1 ~ 0.5。"],
  ["遊戲風險係數", "一般老虎機 1.0；高波動老虎機 0.6 ~ 0.8；百家樂主注 0.5 ~ 0.8；Side Bet 0.1 ~ 0.4；體育串關 0.2 ~ 0.5。"],
  ["AML 係數", "低風險正常；中風險降低入金 / 出金 / 投注；高風險暫停升額並人工審核；嚴重風險暫停交易或凍結。"],
  ["責任博彩係數", "達淨輸上限 50% 提醒、70% 強提醒、90% 再確認、100% 停止投注；冷靜期或自我排除時額度歸零。"],
  ["平台曝險係數", "依產品、盤口、單日最大派彩、群組曝險與全站單賽事曝險調整，不可只看玩家 VIP 等級。"],
];

const limitCheckSteps = [
  "玩家帳號狀態",
  "KYC 狀態",
  "冷靜期 / 自我排除",
  "單注上限",
  "單日投注額上限",
  "單日淨輸上限",
  "單局 / 單場上限",
  "單玩法上限",
  "單日最大派彩上限",
  "群組曝險上限",
  "平台整體曝險上限",
  "AML / 異常行為規則",
];

const limitTriggerRows = [
  ["今日投注額 > 近 30 日平均 3 倍", "降額 30% ~ 50%", "自動降額並建立事件"],
  ["今日投注額 > 近 30 日平均 5 倍", "降額 50% ~ 80%", "自動降額並要求人工覆核"],
  ["今日淨輸達單日淨輸上限 70%", "強提醒", "責任博彩提醒與風控記錄"],
  ["今日淨輸達單日淨輸上限 100%", "停止投注", "拒絕下注並鎖定當日投注"],
  ["1 小時內入金 ≥ 3 次", "暫停升額 / 降額", "AML 與責任博彩雙重檢查"],
  ["同一玩法集中投注 > 80%", "降低該玩法額度", "玩法級限額調整"],
  ["多帳號關聯 / 對打 / 套利嫌疑", "降額或限制指定玩法", "進入集團風險覆核"],
  ["AML 高風險", "暫停投注或人工審核", "凍結升額並建立 AML 事件"],
  ["自我排除 / 冷靜期", "限額歸零", "立即限制投注與升額"],
];

const limitReviewRows = [
  ["系統預檢", "KYC、帳號年齡、拒付 / 退款、異常登入、多帳號關聯、冷靜期、今日淨輸與投注暴增。"],
  ["自動拒絕", "KYC 未完成、近 7 日高風險標記、拒付 / 退款、異常登入、多帳號關聯、自我排除或今日已達淨輸上限。"],
  ["風控初審", "檢查 KYC、資金來源、入金紀錄、投注紀錄、玩法集中度、AML、責任博彩與平台曝險。"],
  ["主管二審", "L3 以上、單日投注額超過 1,000,000、單日淨輸超過 300,000、派彩上限超過 3,000,000。"],
  ["高層三審", "高端 VIP、個人化限額、超高額派彩、特殊產品或全站曝險影響。"],
  ["生效與監控", "核准後設定有效期限，持續監控使用率、降額觸發、群組曝險與責任博彩訊號。"],
];

const limitBackendFields = [
  ["player_id", "玩家 ID"],
  ["limit_level", "玩家限額層級"],
  ["daily_deposit_limit", "單日入金上限"],
  ["daily_bet_limit", "單日投注額上限"],
  ["daily_loss_limit", "單日淨輸上限"],
  ["daily_withdraw_limit", "單日提款上限"],
  ["single_bet_limit", "單注上限"],
  ["single_round_limit", "單局上限"],
  ["single_event_limit", "單場賽事上限"],
  ["single_market_limit", "單市場上限"],
  ["single_play_limit", "單玩法上限"],
  ["daily_payout_limit", "單日最大派彩上限"],
  ["group_exposure_limit", "群組曝險上限"],
  ["limit_currency", "幣別"],
  ["effective_from / effective_to", "生效與失效時間"],
  ["created_by / approved_by", "建立人與審核人"],
  ["approval_reason", "審核理由"],
  ["risk_score / aml_score / responsible_gaming_score", "風險、AML 與責任博彩分數"],
];

const limitUsageFields = [
  ["used_daily_deposit", "今日已入金"],
  ["used_daily_bet", "今日已投注"],
  ["used_daily_loss", "今日已淨輸"],
  ["used_daily_withdraw", "今日已提款"],
  ["used_daily_payout", "今日已派彩"],
  ["used_single_event_exposure", "單場已累計曝險"],
  ["used_single_market_exposure", "單市場已累計曝險"],
  ["used_group_exposure", "關聯群組已累計曝險"],
  ["remaining_daily_bet", "今日剩餘可投注"],
  ["remaining_daily_loss", "今日剩餘可輸"],
  ["remaining_payout", "今日剩餘可派彩"],
];

const limitMonitorRows = [
  ["限額使用率", "used_daily_bet / daily_bet_limit、used_daily_loss / daily_loss_limit、used_daily_payout / daily_payout_limit。"],
  ["升額風險", "升額申請金額、系統建議額度、風險分、AML 分、RG 分與審核層級。"],
  ["責任博彩", "投注時間過長、深夜連續投注、連續入金、輸錢後加大投注、頻繁取消提款。"],
  ["AML", "短時間多次小額入金、多工具入金、低風險下注後出金、入出金帳戶不一致、異常地區登入後入金。"],
  ["產品曝險", "百家樂 Side Bet、輪盤高倍區、牛牛高倍牌型、老虎機 Bonus Buy、體育串關與 Live Betting。"],
  ["群組曝險", "同 IP、同裝置、同銀行卡、同錢包、同代理、同投注模式、同賽事 / 盤口 / 方向投注。"],
];

const limitProductRows = [
  ["真人百家樂", "單注、單桌、單靴、Side Bet、單日最大派彩、群組同桌曝險；Side Bet 額度需明顯低於主注。"],
  ["輪盤", "單號、分注 / 街注、紅黑 / 大小 / 單雙、單局總下注與高倍區曝險；同局多區覆蓋需算最壞派彩。"],
  ["牛牛", "莊閒曝險、倍數牌型、單局最大損失、同桌關聯帳號與特殊牌型派彩。"],
  ["老虎機", "單轉投注、單日投注、Bonus Buy、高波動機台與 Jackpot 類派彩限制。"],
  ["體育投注", "單注、單賽事、單聯盟、單市場、單選項、串關派彩、滾球、早盤、全站單賽事曝險。"],
];

const limitAuditFields = [
  ["申請人 / 申請時間", "玩家、客服或 VIP 經理與申請時間戳。"],
  ["原限額 / 申請限額 / 建議限額 / 核准限額", "保留調整前、玩家要求、系統建議與最終通過額度。"],
  ["申請理由 / 審核結論 / 備註", "記錄升額原因、通過 / 拒絕 / 降低與人工說明。"],
  ["系統風險分 / AML 風險分 / RG 風險分", "用於審批與後續稽核追蹤。"],
  ["審核人 / 有效期限", "風控、主管或高層審核人，以及 7 天、30 天或個案期限。"],
];

const limitDetailedLevelRows = [
  ["L0 新註冊 / 未完整 KYC", "10,000 ~ 30,000", "10,000 ~ 30,000", "3,000 ~ 10,000", "1,000 ~ 3,000", "3,000 ~ 10,000", "3,000 ~ 10,000", "30,000 ~ 100,000", "不允許或需完成 KYC"],
  ["L1 基本 KYC", "50,000 ~ 100,000", "50,000 ~ 100,000", "10,000 ~ 30,000", "5,000 ~ 10,000", "10,000 ~ 30,000", "10,000 ~ 30,000", "100,000 ~ 300,000", "可自動申請但需通過條件"],
  ["L2 穩定一般玩家", "100,000 ~ 300,000", "300,000 ~ 500,000", "50,000 ~ 150,000", "20,000 ~ 50,000", "50,000 ~ 150,000", "50,000 ~ 150,000", "500,000 ~ 1,000,000", "半自動或人工審核"],
  ["L3 中階 VIP", "300,000 ~ 1,000,000", "1,000,000 ~ 3,000,000", "300,000 ~ 800,000", "100,000 ~ 300,000", "300,000 ~ 1,000,000", "300,000 ~ 1,000,000", "3,000,000 ~ 5,000,000", "人工審核"],
  ["L4 高端 VIP", "個案設定", "5,000,000 ~ 10,000,000+", "1,000,000 ~ 3,000,000+", "300,000 ~ 1,000,000", "1,000,000 ~ 3,000,000", "個案設定", "10,000,000+", "高層審批"],
];

const limitPlayerCategories = [
  { level: "L0", label: "新註冊 / 未完整 KYC", vip: "未入 VIP / 新會員", review: "系統自動" },
  { level: "L1", label: "基本 KYC 玩家", vip: "VIP 0-1", review: "系統自動" },
  { level: "L2", label: "穩定一般玩家", vip: "VIP 2-3", review: "半自動或人工審核" },
  { level: "L3", label: "中階 VIP", vip: "VIP 4-6", review: "人工審核" },
  { level: "L4", label: "高端 VIP", vip: "VIP 7+", review: "高層審批" },
  { level: "R", label: "高風險玩家", vip: "不限 VIP / 風控標記", review: "風控限制" },
];

const limitTypeColumnMap = {
  "單日入金上限": 1,
  "單日投注額上限": 2,
  "單日淨輸上限": 3,
  "單注投注上限": 4,
  "單局 / 單場上限": 5,
  "單玩法上限": 6,
  "單日最大派彩上限": 7,
  "單日提款上限": 1,
  "群組單日曝險上限": 7,
};

function rangeToLimitAmounts(range, unit = "amount") {
  const values = String(range || "").match(/\d[\d,]*/g)?.map((value) => value.replaceAll(",", "")) || [];
  return {
    min: values[0] || "",
    max: values[1] || values[0] || "",
    unit,
  };
}

function seedLimitCategoryAmounts(type) {
  const column = limitTypeColumnMap[type];
  return Object.fromEntries(limitPlayerCategories.map((category) => {
    if (category.level === "R") return [category.level, { min: "10", max: "50", unit: "percent" }];
    const row = limitDetailedLevelRows.find((item) => item[0].startsWith(category.level));
    return [category.level, rangeToLimitAmounts(row?.[column], "amount")];
  }));
}

const limitCategoryAmountSettings = Object.fromEntries(
  limitControlTypes.map(([type]) => [type, seedLimitCategoryAmounts(type)])
);

const limitRiskScoreBands = [
  ["0 ~ 20", "低風險", "可正常升額"],
  ["21 ~ 40", "中低風險", "小幅升額"],
  ["41 ~ 60", "中風險", "需人工審核"],
  ["61 ~ 80", "高風險", "不建議升額"],
  ["81 ~ 100", "極高風險", "降額 / 限制"],
];

const limitRiskScoreWeights = [
  ["KYC 完整度", "15%"],
  ["資金來源可信度", "15%"],
  ["投注行為穩定性", "20%"],
  ["遊戲 / 玩法風險", "15%"],
  ["AML 風險", "15%"],
  ["責任博彩風險", "10%"],
  ["多帳號 / 群組風險", "10%"],
];

const limitStandardTemplates = [
  ["一般玩家", "50,000", "100,000", "30,000", "10,000", "30,000", "20,000", "300,000"],
  ["穩定玩家", "200,000", "500,000", "150,000", "50,000", "150,000", "100,000", "1,000,000"],
  ["VIP 玩家", "500,000 ~ 1,000,000", "1,000,000 ~ 3,000,000", "300,000 ~ 800,000", "100,000 ~ 300,000", "300,000 ~ 1,000,000", "300,000 ~ 1,000,000", "3,000,000 ~ 5,000,000"],
  ["高端 VIP", "個案審核", "5,000,000+", "1,000,000+", "300,000 ~ 1,000,000", "1,000,000 ~ 3,000,000", "個案審核", "10,000,000+"],
];

const limitResponsibleGamingRows = [
  ["達 50% 單日淨輸上限", "提醒"],
  ["達 70% 單日淨輸上限", "強提醒"],
  ["達 90% 單日淨輸上限", "再確認"],
  ["達 100% 單日淨輸上限", "停止投注"],
  ["連續多日達損失上限", "降額 / 冷靜期"],
  ["玩家要求解除限制", "設定等待期"],
  ["玩家自我排除", "立即限制"],
];

const limitAmlRows = [
  ["低風險", "正常限額"],
  ["中風險", "降低入金 / 出金 / 投注限額"],
  ["高風險", "暫停升額，人工審核"],
  ["嚴重風險", "暫停交易或凍結"],
];

const limitPermissionRows = [
  ["客服", "查看目前限額、剩餘限額、限額層級、限制狀態；提交升額申請。", "不能直接調整高額限額。"],
  ["VIP 經理", "查看 VIP 額度、提交升額申請、填寫升額理由、查看審核狀態。", "不能單獨批准高額限額。"],
  ["風控", "調降限額、凍結升額、設定玩法限制、設定臨時限額、要求補 KYC、拒絕升額申請、批准中低額升額。", "高額與 L3 以上仍需主管或高層覆核。"],
  ["高層 / 管理員", "批准高端 VIP 額度、設定特殊個人限額、設定全站風險上限、修改限額模型參數、覆核風控決策。", "所有異動需留存審核紀錄。"],
];

const limitTypeRecommendations = {
  "單日投注額上限": {
    formula: "今日已投注額 + 本次下注額 ≤ 單日投注額上限",
    focus: "控制流水與投注強度；不可只依 VIP 等級放大，需看近 30 日平均日投注額。",
    review: "L0-L1 可系統自動；L2 半自動；L3 以上需人工審核。",
    trigger: "今日投注額超過近 30 日平均 3 倍時降額 30% ~ 50%，超過 5 倍時降額 50% ~ 80%。",
  },
  "單日淨輸上限": {
    formula: "今日淨輸 + 本次可能最大損失 ≤ 單日淨輸上限",
    focus: "責任博彩核心欄位；達 50% 提醒、70% 強提醒、90% 再確認、100% 停止投注。",
    review: "升額需檢查近 30 日平均入金、追損、深夜連續投注與冷靜期狀態。",
    trigger: "連續多日達損失上限時自動降額或進入冷靜期；自我排除時限額歸零。",
  },
  "單日入金上限": {
    formula: "今日已入金 + 本次入金 ≤ 單日入金上限",
    focus: "AML 與資金異常控制；短時間多次小額入金、多工具入金需降低或暫停升額。",
    review: "高額升額需看資金來源、銀行 / 錢包綁定、可驗證收入與資產。",
    trigger: "1 小時內入金 ≥ 3 次時暫停升額並建立 AML / 責任博彩檢查。",
  },
  "單日提款上限": {
    formula: "今日已提款 + 本次提款 ≤ 單日提款上限",
    focus: "防詐騙與出金風控；入金後低風險下注再出金、入出金帳戶不一致需人工覆核。",
    review: "中高風險 AML 會員不可自動提高提款限額。",
    trigger: "提款帳戶異常、同付款工具關聯多帳號或異常地區登入後提款時暫停出金審核。",
  },
  "單注投注上限": {
    formula: "本次下注額 ≤ 單注投注上限",
    focus: "防止單筆大額衝擊；高賠率玩法需比一般主注更低。",
    review: "單注超出層級基準時需風控確認，L3 以上需人工審核。",
    trigger: "短時間連續大額下注或追損明顯時降額 50% 以上。",
  },
  "單局 / 單場上限": {
    formula: "同局 / 同場累積投注 + 本次下注 ≤ 單局 / 單場上限",
    focus: "控制集中曝險；百家樂單桌 / 單靴、體育單賽事都需要獨立計算。",
    review: "體育早盤、滾球、同場多帳號投注需降低上限。",
    trigger: "同場多帳號、同方向投注或盤口集中時合併群組曝險。",
  },
  "單玩法上限": {
    formula: "該玩法今日已下注 + 本次下注 ≤ 該玩法單日上限",
    focus: "控制高風險玩法；Side Bet、輪盤高倍區、牛牛高倍牌型、體育串關需更低。",
    review: "同一玩法集中投注 > 80% 時降低該玩法額度。",
    trigger: "玩法集中、命中高賠率或短時間切換高風險玩法時建立風控事件。",
  },
  "單日最大派彩上限": {
    formula: "今日已派彩 + 本次最大可能派彩 ≤ 單日最大派彩上限",
    focus: "控制平台最大賠付；高波動產品與 Jackpot 類需額外限制。",
    review: "單日派彩上限超過 3,000,000 不允許自動通過。",
    trigger: "接近派彩上限時拒絕下注或降低本次可下注金額。",
  },
  "群組單日曝險上限": {
    formula: "關聯群組今日最大可能派彩 + 本次最大可能派彩 ≤ 群組單日曝險上限",
    focus: "防工作室、套利與拆帳號；需串接同 IP、同裝置、同錢包、同代理與同下注模式。",
    review: "命中多帳號、套利或對打嫌疑時凍結升額並交由集團風險覆核。",
    trigger: "群組同賽事 / 同盤口 / 同方向投注時合併曝險，必要時限制指定玩法。",
  },
};

const pageSpecs = {
  dashboard: [
    ["頁面目的", "提供全站風控即時概況，聚合高風險會員、事件處理、代理風險與今日投注異常。"],
    ["核心功能", "KPI 監控、風險趨勢、事件待辦、代理排行、快速跳轉會員風險檢視。"],
    ["驗收標準", "統計卡、趨勢圖與待辦列表可刷新；點擊待辦可開啟處理視窗。"],
  ],
  betting: [
    ["頁面目的", "分析投注行為模式，找出高額、追注、異常時段、疑似對打與高風險玩法。"],
    ["核心功能", "多條件篩選、行為標籤、命中規則、注單詳情、標記已處理。"],
    ["API 建議", "GET /api/risk/betting-behaviors；POST /api/risk/events/{id}/resolve。"],
  ],
  group: [
    ["頁面目的", "偵測多帳號關聯與集團式風險，聚合 IP、裝置、登入時段與投注同步行為。"],
    ["核心功能", "單一集團關聯圖、集團選擇器、集團清單、共同特徵、群組詳情、人工標記與解除關聯。"],
    ["驗收標準", "關聯圖一次只呈現一個集團；切換集團後節點與摘要需同步更新，關聯節點可檢視，操作需寫入審計日誌。"],
  ],
  limitsPage: [
    ["頁面目的", "處理會員限額調整、審核、取消與操作追蹤；會員目前限額查詢放在會員風險分析。"],
    ["核心功能", "新增限額、調整限額、取消限額、審核清單、生效狀態管理；限額類型與建議規則引用系統設定。"],
    ["權限規則", "客服與 VIP 經理可提交申請；風控可調降與批准中低額；L3 以上、高額升額與高端 VIP 需主管或高層審批。"],
  ],
  rules: [
    ["頁面目的", "維護風控規則、閾值、風險等級與自動處置方式。"],
    ["核心功能", "新增規則、啟停規則、調整各幣別風險值、測試命中、版本紀錄。"],
    ["安全要求", "規則異動需記錄操作前後 JSON；各幣別門檻異動需保留審計紀錄，重大規則需二次確認。"],
  ],
  reports: [
    ["頁面目的", "產出與下載風控營運報表，支援日、週、月與自訂區間。"],
    ["核心功能", "報表查詢、產生報表、下載 CSV、排程管理、產生狀態追蹤。"],
    ["資料規則", "報表下載需權限控管，下載行為需寫入操作日誌。"],
  ],
  settings: [
    ["頁面目的", "管理後台系統層級設定、API 匯率同步、幣別顯示、角色權限、通知、安全策略與限額設定類別。"],
    ["核心功能", "以子項目切換一般設定、限額設定類別、管理者與權限、異動紀錄；管理帳號需區分平台與代理歸屬、資料範圍、成本歸屬與審核鏈。"],
    ["驗收標準", "設定可編輯、儲存有提示；代理風控帳號只能看所屬代理資料，且成本可歸代理負擔或平台代管分攤。"],
  ],
};

const pageTemplates = {
  dashboard: () => {
    const summary = dashboardSummary();
    return `
      ${pageHeader("首頁儀表板", "首頁 / 首頁儀表板", "全站風控即時監控與待辦工作台")}
      <section class="metric-grid dashboard-metrics">
        ${smallMetric("高風險會員", String(summary.highRiskMembers), "由風險案件歸戶", "up", "highRiskMembers")}
        ${smallMetric("今日待辦", String(summary.pendingCases), `逾期 ${summary.overdueCases} 件，點擊查看`, "up", "pendingEvents")}
        ${smallMetric("今日投注額", money(summary.todayBetAmount), "依案件有效投注加總", "good", "todayBetAmount")}
        ${smallMetric("凍結帳號", String(summary.frozenAccounts), `自動 ${summary.autoFrozen} / 人工 ${Math.max(0, summary.frozenAccounts - summary.autoFrozen)}`, "up", "frozenAccounts")}
      </section>
      <section class="overview-grid dashboard-chart-grid">
        <div class="content-card"><h2>近30天風險事件趨勢</h2><canvas id="lineChart" height="260"></canvas></div>
        <div class="content-card"><h2>風險類型分布</h2><div class="donut-layout"><canvas id="donutChart" height="260"></canvas>${donutLegend()}</div></div>
      </section>
      <section class="content-card section-gap">
        <div class="section-title-row">
          <h2>風險案件中心</h2>
          <span class="helper-text">KPI、待辦與鑽取清單都由同一批案件資料產生。</span>
        </div>
        ${tableTemplate(["案件ID", "時間", "會員", "事件類型", "風險等級", "案件狀態", "SLA", "負責人", "操作"], caseCenterRows())}
      </section>
      ${specSection(pageSpecs.dashboard)}
    `;
  },
  betting: () => dataPage("投注行為分析", "首頁 / 投注行為分析", "投注行為偵測、規則命中與注單風險分析", pageTables.betting, [
    ["日期範圍", "date"], ["遊戲類型", "select"], ["風險等級", "select"], ["幣別", "select"], ["會員帳號", "input"], ["命中規則", "select"]
  ], pageSpecs.betting),
  group: () => {
    const values = activeFilters("group");
    const groupRows = filterRows(pageTables.group.columns, pageTables.group.rows, values);
    return `
      ${pageHeader("集團風險偵測", "首頁 / 集團風險偵測", "多帳號關聯、共同裝置、共同 IP 與疑似集團套利偵測")}
      <section class="filter-bar generic-filter">
        ${filterControl(["日期範圍", "date"], values)}
        <label><span>集團ID</span><input placeholder="請輸入集團ID" value="${escapeHtml(values["集團ID"] || "")}" /></label>
        ${filterControl(["幣別", "select"], values)}
        ${filterControl(["風險等級", "select"], values)}
        <label><span>代理帳號</span><select><option ${!values["代理帳號"] || values["代理帳號"] === "全部" ? "selected" : ""}>全部</option><option ${values["代理帳號"] === "CQ9" ? "selected" : ""}>CQ9</option><option ${values["代理帳號"] === "AG01" ? "selected" : ""}>AG01</option><option ${values["代理帳號"] === "BBIN" ? "selected" : ""}>BBIN</option></select></label>
        <button class="primary generic-action">查詢</button>
        <button class="secondary filter-reset" type="button">清除條件</button>
      </section>
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
      <section class="content-card section-gap"><h2>高風險集團清單</h2>${groupTableTemplate(groupRows)}<div class="table-footer"><span>共 ${groupRows.length} 筆</span><span>可點擊欄位鑽取關聯證據</span></div></section>
      ${specSection(pageSpecs.group)}
    `;
  },
  limitsQuery: () => limitsQueryTemplate(),
  limitsSetting: () => limitsSettingTemplate(),
  limitsPage: () => limitsQueryTemplate(),
  rulesQuery: () => rulesQueryTemplate(),
  rulesSetting: () => rulesSettingTemplate(),
  rules: () => rulesQueryTemplate(),
  reportsQuery: () => reportsQueryTemplate(),
  reportsSetting: () => reportsSettingTemplate(),
  reports: () => reportsQueryTemplate(),
  settings: () => settingsPageTemplate(),
};

const beginnerGuides = {
  "首頁儀表板": ["先看紅色或上升的 KPI", "點 KPI 或提醒查看明細", "前往對應頁面處理"],
  "高風險會員詳細表單": ["先看風險評分最高的會員", "確認主要原因", "填寫處置原因後儲存"],
  "今日待辦明細": ["先處理逾期事件", "查看事件描述", "選擇處理結果並填寫備註"],
  "今日投注額詳細表單": ["先看高風險標籤", "核對投注金額與輸贏", "填寫覆核備註"],
  "凍結帳號詳細表單": ["確認凍結來源", "核對凍結原因", "選擇覆核結果"],
  "會員風險分析": ["先用風險等級篩選", "點詳情進入會員檢視", "必要時匯出清單"],
  "會員風險檢視": ["先看風險評分與核心指標", "切換 Tab 查看明細", "敏感處置需填寫原因"],
  "投注行為分析": ["先設定日期與風險等級", "查看命中規則", "點查看開啟明細"],
  "集團風險偵測": ["先看關聯圖譜", "點節點或數字查看關聯帳號", "確認後標記覆核"],
  "限額管理": ["先查會員目前限額", "確認是否需要調整", "前往限額設定處理"],
  "限額查詢": ["先設定幣別與限額類型", "查看生效與到期狀態", "需要調整時前往限額設定"],
  "限額設定": ["先選會員與限額類型", "確認建議區間與審核要求", "儲存後進入調整紀錄"],
  "風控規則設定": ["先查現有規則", "確認狀態是否啟用", "需要時新增規則"],
  "規則查詢": ["先設定規則類型與風險等級", "查看啟用狀態與門檻", "需要異動時前往規則設定"],
  "規則設定": ["先確認幣別風險值", "同步匯率只作參考", "新增規則前先測試命中"],
  "新增風控規則": ["先填基本資料", "設定觸發條件", "測試通過後儲存"],
  "報表管理": ["選擇報表類型與週期", "產生報表", "完成後下載或匯出"],
  "報表查詢": ["先設定報表類型與日期", "查看產生狀態", "完成後下載或匯出"],
  "報表設定": ["先選報表類型與週期", "設定產生方式與收件人", "送出後到查詢頁追蹤狀態"],
  "系統設定": ["先確認一般設定與幣別", "查看管理帳號與角色權限", "新增帳號或儲存設定後確認提示"],
};

const el = (id) => document.getElementById(id);

function activeCase(caseItem) {
  return !["已完成", "誤判關閉"].includes(caseItem.caseStatus);
}

function caseGuidance(caseItem) {
  if (!caseItem) return riskHandlingGuidance.member;
  return {
    suggested: caseItem.suggested,
    reason: `${caseItem.id}｜${caseItem.reason}`,
    evidence: caseItem.evidence,
  };
}

function caseLifecycleLabel(caseItem) {
  if (!caseItem) return "未建案";
  return `${caseItem.caseStatus} / ${caseItem.sla} / 負責人 ${caseItem.owner}`;
}

function dashboardSummary() {
  const highRiskMembers = new Set(riskCases.filter((item) => item.riskLevel === "高風險").map((item) => item.member));
  const pendingCases = riskCases.filter(activeCase);
  const overdueCases = pendingCases.filter((item) => item.sla === "逾期");
  const todayBetAmount = riskCases.reduce((sum, item) => sum + Number(item.validBet || item.betAmount || 0), 0);
  const frozenMembers = new Set(riskCases.filter((item) => item.accountStatus === "凍結").map((item) => item.member));
  return {
    highRiskMembers: highRiskMembers.size,
    pendingCases: pendingCases.length,
    overdueCases: overdueCases.length,
    todayBetAmount,
    frozenAccounts: frozenMembers.size,
    autoFrozen: riskCases.filter((item) => item.freezeSource === "自動").length,
  };
}

function caseCenterRows(limit = 5) {
  return riskCases
    .filter(activeCase)
    .slice(0, limit)
    .map((item) => [
      item.id,
      item.time,
      item.member,
      item.type,
      item.riskLevel,
      item.caseStatus,
      item.sla,
      item.owner,
      "處理",
    ]);
}

function currentMemberCaseRows() {
  const rows = riskCases
    .filter((item) => item.member === state.member)
    .map((item) => [item.id, item.time, item.type, item.reason, item.riskLevel, item.caseStatus, item.owner, item.caseStatus === "已完成" ? "查看" : "處理"]);
  if (rows.length) return rows;
  return events.map((row) => [`未建案-${row[0]}`, ...row.slice(0, 5), row[5], "查看"]);
}

function registerRowContext(columns, row, source = "") {
  const id = `row-${++rowContextCounter}`;
  rowContexts.set(id, { columns, row, source });
  return id;
}

function rowObjectFromContext(context) {
  if (!context) return {};
  return context.columns.reduce((result, column, index) => {
    result[column] = stripHtml(context.row[index]);
    return result;
  }, {});
}

function stripHtml(value) {
  const node = document.createElement("span");
  node.innerHTML = String(value);
  return node.textContent || node.innerText || "";
}

function findCaseByRow(rowData = {}) {
  const caseId = rowData["案件ID"] || rowData["案件編號"];
  if (caseId) return riskCases.find((item) => item.id === caseId);
  const member = rowData["會員"] || rowData["會員帳號"];
  const time = rowData["時間"] || rowData["事件時間"] || rowData["投注時間"] || rowData["命中時間"] || rowData["凍結時間"];
  const rule = rowData["命中規則"] || rowData["事件類型"] || rowData["規則名稱"] || rowData["行為模式"];
  return riskCases.find((item) => (
    (!member || item.member === member) &&
    (!time || item.time === time) &&
    (!rule || item.rule === rule || item.type === rule || item.behavior === rule)
  )) || riskCases.find((item) => member && item.member === member);
}

function updateCaseStatus(caseItem, nextStatus, note = "") {
  if (!caseItem) return null;
  const before = caseItem.caseStatus;
  caseItem.caseStatus = nextStatus;
  caseItem.sla = nextStatus === "已完成" || nextStatus === "誤判關閉" ? "已處理" : caseItem.sla;
  appendAuditLog("案件狀態", `${caseItem.id} ${before} → ${nextStatus}${note ? `｜${note}` : ""}`, "風險案件中心", "admin");
  return before;
}

function createManualCase(action, note = "") {
  const row = memberRows.find((item) => item[0] === state.member);
  const id = `RC-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${String(riskCases.length + 1).padStart(3, "0")}`;
  const typeMap = { limit: "人工限額", watch: "人工觀察", freeze: "人工凍結", noop: "不做處置", remark: "人工備註" };
  const caseItem = {
    id,
    time: updateTimestamp(),
    member: state.member,
    memberId: row?.[1] || "-",
    agent: row?.[2] || "-",
    currency: row?.[4] || currentCurrency(),
    riskScore: Number(row?.[5] || 0),
    riskLevel: row?.[6] || "中風險",
    accountStatus: row?.[7] || state.accountStatus,
    caseStatus: "處理中",
    sla: "待處理",
    owner: "admin",
    type: typeMap[action] || "人工處置",
    behavior: typeMap[action] || "人工處置",
    game: "全部",
    rule: "人工處置",
    betAmount: 0,
    validBet: 0,
    winLoss: 0,
    reason: note || "由風控人員從會員檢視手動建立案件。",
    suggested: "依人工處置結果追蹤案件狀態，必要時交由主管覆核。",
    evidence: ["人工建立案件", `會員 ${state.member}`, note || "已補充操作原因"],
  };
  riskCases.unshift(caseItem);
  appendAuditLog("新增風險案件", `${id}｜${caseItem.member}｜${caseItem.type}`, "會員風險檢視", "admin");
  return caseItem;
}

function appendAuditLog(item, value, scope = "風險案件中心", actor = "admin") {
  pageTables.settings.rows.unshift([item, value, scope, updateTimestamp(), actor, "查看"]);
}

function updateMemberStatus(member, status) {
  const row = memberRows.find((item) => item[0] === member);
  if (row) row[7] = status;
}

function caseActionOptions(caseItem = null) {
  const frozen = caseItem?.accountStatus === "凍結" || Boolean(caseItem?.freezeScope);
  return [
    { key: "complete", label: "標記已完成", status: "已完成", tone: "success", note: "已完成覆核，案件證據與處理結論已確認。" },
    { key: "watch", label: "加入觀察", status: "處理中", tone: "warning", note: "已加入觀察名單，後續同類規則命中需再次提醒。" },
    { key: "limit", label: "調整限額", status: "處理中", tone: "warning", note: "已調整會員限額，先降低平台曝險並持續觀察。" },
    { key: "freeze", label: frozen ? "維持凍結" : "凍結會員", status: "待主管覆核", tone: "danger", note: frozen ? "維持凍結，等待主管覆核後再決定是否解除。" : "已凍結帳號交易權限，等待主管覆核。" },
    { key: "escalate", label: "升級覆核", status: "待主管覆核", tone: "warning", note: "已升級主管覆核，需補充關聯證據與資金紀錄。" },
    { key: "falsePositive", label: "誤判關閉", status: "誤判關閉", tone: "muted", note: "確認為誤判事件，案件關閉並保留稽核紀錄。" },
  ];
}

function caseActionByKey(key, caseItem = null) {
  return caseActionOptions(caseItem).find((item) => item.key === key) || caseActionOptions(caseItem)[0];
}

function caseActionButtonsTemplate(caseItem = null, inputId = "selectedCaseAction", selectedKey = "complete") {
  const options = caseActionOptions(caseItem);
  const activeKey = options.some((item) => item.key === selectedKey) ? selectedKey : options[0].key;
  return `
    <div class="case-action-panel">
      <span class="case-action-title">案件處置方式</span>
      <div class="case-action-grid" role="group" aria-label="案件處置方式">
        ${options.map((option) => `
          <button
            type="button"
            class="case-action-btn ${option.tone}${option.key === activeKey ? " active" : ""}"
            data-case-action="${option.key}"
            data-case-note="${escapeHtml(option.note)}"
            aria-pressed="${option.key === activeKey ? "true" : "false"}"
          >${option.label}</button>
        `).join("")}
      </div>
      <input id="${inputId}" type="hidden" value="${activeKey}" />
    </div>
  `;
}

function bindCaseActionButtons(container = document, inputId = "selectedCaseAction", textareaId = "actionReason") {
  const buttons = [...container.querySelectorAll("[data-case-action]")];
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", item === button ? "true" : "false");
      });
      const input = el(inputId);
      if (input) input.value = button.dataset.caseAction;
      const textarea = el(textareaId);
      if (textarea) textarea.value = translateText(button.dataset.caseNote || textarea.value);
    });
  });
}

function applyCaseAction(caseItem, actionKey, note = "", memberOverride = "") {
  const action = caseActionByKey(actionKey, caseItem);
  const member = caseItem?.member || memberOverride || state.member;
  if (!caseItem) return null;
  if (action.key === "watch") {
    updateMemberStatus(member, "觀察中");
    if (member === state.member) state.accountStatus = "觀察中";
  }
  if (action.key === "limit") {
    pageTables.limitsPage.rows.unshift([
      member,
      "單注投注上限",
      currencyInputValue(50000, caseItem.currency || currentCurrency()),
      updateTimestamp(),
      "2025-04-10 23:59:59",
      note || action.note,
      "admin",
      "生效中",
      "查看",
    ]);
    updateMemberStatus(member, "限額中");
    if (member === state.member) state.accountStatus = "限額中";
  }
  if (action.key === "freeze") {
    updateMemberStatus(member, "凍結");
    caseItem.accountStatus = "凍結";
    caseItem.freezeScope = caseItem.freezeScope || "禁止交易";
    caseItem.freezeSource = caseItem.freezeSource || "人工";
    if (member === state.member) state.accountStatus = "凍結";
  }
  updateCaseStatus(caseItem, action.status, note || action.note);
  return action;
}

function viewFilterKey(view = state.currentView) {
  if (view === "dashboard" && state.dashboardMode === "detail") return `dashboard:${state.dashboardDetail}`;
  if (view === "limitsQuery" || view === "limitsPage") return "limitsPage";
  if (view === "rulesQuery" || view === "rules") return "rules";
  if (view === "reportsQuery" || view === "reports") return "reports";
  return view;
}

function readFilterValues(container) {
  const values = {};
  container?.querySelectorAll("label").forEach((label) => {
    const labelText = canonicalText(label.querySelector("span")?.textContent);
    const inputs = [...label.querySelectorAll("input, select")];
    if (!labelText || !inputs.length) return;
    if (inputs.length === 2 && label.classList.contains("date-filter-range")) {
      values[`${labelText}_start`] = inputs[0].value;
      values[`${labelText}_end`] = inputs[1].value;
      return;
    }
    values[labelText] = inputs[0].value.trim ? inputs[0].value.trim() : inputs[0].value;
  });
  return values;
}

function activeFilters(key = viewFilterKey()) {
  return state.filters[key] || {};
}

function resetCurrentFilters() {
  delete state.filters[viewFilterKey()];
  state.page = 1;
  renderActiveView();
  toast("已清除查詢條件");
}

function filterRows(columns, rows, filters = {}) {
  const entries = Object.entries(filters).filter(([, value]) => value && value !== "全部" && value !== "all");
  if (!entries.length) return rows;
  return rows.filter((row) => entries.every(([filterName, value]) => rowMatchesFilter(columns, row, filterName, value)));
}

function rowMatchesFilter(columns, row, filterName, value) {
  const text = String(value).toLowerCase();
  if (filterName.endsWith("_start") || filterName.endsWith("_end")) {
    const rowDate = String(row[0] || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(rowDate)) return true;
    if (filterName.endsWith("_start")) return rowDate >= value;
    return rowDate <= value;
  }
  const namedIndexes = {
    "會員帳號": ["會員", "會員帳號"],
    "代理帳號": ["代理帳號"],
    "幣別": ["幣別"],
    "風險等級": ["風險等級", "風險標籤", "等級"],
    "帳號狀態": ["帳號狀態"],
    "狀態": ["狀態", "處理狀態", "案件狀態"],
    "遊戲類型": ["遊戲", "遊戲類型"],
    "命中規則": ["命中規則", "規則名稱", "主要風險"],
    "限額類型": ["限額類型"],
    "報表類型": ["報表名稱"],
    "週期": ["週期"],
    "建立人": ["建立人"],
    "集團ID": ["集團ID"],
    "生效日期": ["生效時間"],
    "日期": ["時間", "事件時間", "投注時間", "凍結時間", "產生時間"],
  };
  const targetColumns = namedIndexes[filterName];
  if (filterName === "關鍵字") return row.some((cell) => stripHtml(cell).toLowerCase().includes(text));
  if (!targetColumns) return row.some((cell) => stripHtml(cell).toLowerCase().includes(text));
  const values = targetColumns
    .map((column) => columns.indexOf(column))
    .filter((index) => index >= 0)
    .map((index) => stripHtml(row[index]).toLowerCase());
  if (!values.length) return true;
  return values.some((cell) => cell.includes(text));
}

function money(value) {
  return Number(value).toLocaleString("zh-TW", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function currentCurrency() {
  return currencySettings[state.currency] ? state.currency : "CNY";
}

function currencyMeta(code = currentCurrency()) {
  return currencySettings[code] || currencySettings.CNY;
}

function convertBaseAmount(value, code = currentCurrency()) {
  const meta = currencyMeta(code);
  return Number(value) / meta.rateToCny;
}

function displayMoney(value, code = currentCurrency()) {
  const meta = currencyMeta(code);
  const amount = convertBaseAmount(value, code);
  const sign = amount < 0 ? "-" : "";
  const formatted = Math.abs(amount).toLocaleString("zh-TW", {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  });
  return `${sign}${meta.symbol}${formatted} ${code}`;
}

function displayMoneyValue(value, code = currentCurrency()) {
  const meta = currencyMeta(code);
  const amount = convertBaseAmount(value, code);
  const sign = amount < 0 ? "-" : "";
  const formatted = Math.abs(amount).toLocaleString("zh-TW", {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  });
  return `${sign}${meta.symbol}${formatted}`;
}

function displayNativeMoney(value, code) {
  const meta = currencyMeta(code);
  const amount = Number(value);
  const sign = amount < 0 ? "-" : "";
  const formatted = Math.abs(amount).toLocaleString("zh-TW", {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  });
  return `${sign}${meta.symbol}${formatted} ${code}`;
}

function compactDisplayMoney(value, code = currentCurrency()) {
  const meta = currencyMeta(code);
  const amount = convertBaseAmount(value, code);
  const sign = amount < 0 ? "-" : "";
  const formatted = Math.abs(amount).toLocaleString("zh-TW", {
    maximumFractionDigits: 0,
  });
  return `${sign}${meta.symbol}${formatted}`;
}

function currencyInputValue(value, code = currentCurrency()) {
  const meta = currencyMeta(code);
  return convertBaseAmount(value, code).toFixed(meta.decimals);
}

function currencyInputStep(code = currentCurrency()) {
  return currencyMeta(code).decimals ? "0.01" : "1";
}

function parseMoneyText(value) {
  const numeric = String(value).replace(/[^\d.-]/g, "");
  return numeric ? Number(numeric) : NaN;
}

function isMoneyText(value) {
  return /^-?\d{1,3}(,\d{3})*(\.\d{2})$/.test(String(value)) || /^-?\d+\.\d{2}$/.test(String(value));
}

function formatMoneyText(value) {
  const amount = parseMoneyText(value);
  return Number.isFinite(amount) ? displayMoney(amount) : escapeHtml(value);
}

function escapeAndFormatMoneyText(value) {
  return escapeHtml(value).replace(/-?\d{1,3}(?:,\d{3})+(?:\.\d{2})?/g, (match) => {
    const amount = parseMoneyText(match);
    return Number.isFinite(amount) ? displayMoney(amount) : match;
  });
}

function formatMoneyForTextarea(value) {
  return escapeAndFormatMoneyText(value);
}

function isDirectionalValue(label = "") {
  return /輸贏|盈虧|玩家盈虧率|ROI/.test(label);
}

function directionalClass(value, label = "") {
  const numeric = parseMoneyText(value);
  if (!Number.isFinite(numeric) || numeric === 0) return "";
  if (!isDirectionalValue(label)) return "";
  return numeric > 0 ? "red-text" : "green-text";
}

function metricValue(label, value) {
  if (["今日投注額", "投注金額", "輸贏金額"].includes(label)) return formatMoneyText(value);
  return value;
}

function memberMetricLabel(label) {
  if (["投注金額", "輸贏金額"].includes(label)) return `${label}(${currentCurrency()})`;
  return label;
}

function memberMetricValue(label, value) {
  if (["投注金額", "輸贏金額"].includes(label)) {
    const amount = parseMoneyText(value);
    return Number.isFinite(amount) ? displayMoneyValue(amount) : escapeHtml(value);
  }
  return escapeHtml(value);
}

function riskBadge(level) {
  const cls = level === "高風險" ? "danger" : level === "中風險" ? "warning" : "success";
  return `<span class="badge ${cls}">${level}</span>`;
}

function pageHeader(title, breadcrumb, subtitle) {
  return `
    <div class="breadcrumb">${breadcrumb}</div>
    <div class="page-title-row">
      <div>
        <h1>${title} <button class="info-dot generic-info" aria-label="頁面說明">i</button></h1>
        <p>${subtitle}</p>
      </div>
      <div class="page-title-actions">
        <button class="secondary spec-doc-btn" data-spec-title="${title}" type="button">規格說明</button>
        <button class="secondary generic-action">匯出資料</button>
      </div>
    </div>
    ${beginnerGuide(title)}
  `;
}

function beginnerGuide(title) {
  const steps = beginnerGuides[title];
  if (!steps) return "";
  return `
    <details class="guide-strip" aria-label="${title} 建議流程">
      <summary>
        <strong>建議流程</strong>
        <span class="guide-summary-text">展開流程提示</span>
      </summary>
      <div class="guide-steps">
        ${steps.map((step, index) => `<span>${index + 1}. ${step}</span>`).join("")}
      </div>
    </details>
  `;
}

function smallMetric(label, value, compare, trend = "", detailKey = "") {
  return `
    <article class="metric-card ${detailKey ? "clickable-card" : ""}" ${detailKey ? `data-dashboard-detail="${detailKey}" tabindex="0" role="button"` : ""}>
      <div class="label">${label}</div>
      <div class="value">${metricValue(label, value)}</div>
      <div class="compare">${compare ? `<span class="${trend}">${compare}</span>` : ""}</div>
    </article>
  `;
}

function currencyOptionsMarkup() {
  return Object.entries(currencySettings)
    .map(([code, meta]) => `<option value="${code}" ${code === currentCurrency() ? "selected" : ""}>${meta.label}</option>`)
    .join("");
}

function currencyPreviewMarkup(code = currentCurrency()) {
  const rows = Object.entries(currencySettings)
    .map(([currencyCode, meta]) => `
      <tr>
        <td data-label="幣別">${currencyCode}</td>
        <td data-label="API 匯率">1 ${currencyCode} = ${meta.rateToCny.toLocaleString("zh-TW", { maximumFractionDigits: 4 })} CNY</td>
        <td data-label="金額範例">${displayMoney(100000, currencyCode)}</td>
        <td data-label="狀態">${exchangeRateApi.status}</td>
      </tr>
    `)
    .join("");
  return `
    <div class="currency-preview" id="currencyPreview">
      <span>目前顯示：${currencySettings[code]?.label || currencySettings.CNY.label}</span>
      <strong>100,000.00 CNY → ${displayMoney(100000, code)}</strong>
      <p class="helper-text">匯率由 ${exchangeRateApi.provider} 透過 API 同步；風控判斷請使用各幣別風險值，不直接拿顯示匯率換算門檻。</p>
      <div class="table-scroll mini-scroll">
        <table class="currency-table">
          <thead><tr><th>幣別</th><th>API 匯率</th><th>金額範例</th><th>狀態</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function currencyRiskThresholdTable() {
  const rows = riskCurrencyThresholds
    .map((row) => `
      <tr>
        <td data-label="會員幣別"><strong>${row.code}</strong></td>
        <td data-label="高額投注門檻">${displayNativeMoney(row.highBet, row.code)}</td>
        <td data-label="玩家盈利門檻">${displayNativeMoney(row.highWin, row.code)}</td>
        <td data-label="單日累積曝險">${displayNativeMoney(row.dailyExposure, row.code)}</td>
        <td data-label="預設處置">${escapeHtml(row.action)}</td>
      </tr>
    `)
    .join("");
  return `
    <div class="table-scroll mini-scroll">
      <table class="currency-threshold-table">
        <thead>
          <tr><th>會員幣別</th><th>高額投注門檻</th><th>玩家盈利門檻</th><th>單日累積曝險</th><th>預設處置</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function currencyThresholdInputsMarkup() {
  const inputs = riskCurrencyThresholds
    .map((row) => `
      <label>
        <span>${row.code} 高額 / 玩家盈利門檻</span>
        <input class="currency-threshold-input" data-currency-threshold="${row.code}" type="number" min="0" step="${currencyInputStep(row.code)}" value="${row.highBet}" />
      </label>
    `)
    .join("");
  return `
    <div class="threshold-grid">${inputs}</div>
    <p class="helper-text">這些是風控判斷用的會員原幣別門檻，不會因右上或系統設定的顯示幣別切換而改變。</p>
  `;
}

const filterOptions = {
  "遊戲類型": ["全部", "百家樂", "老虎機", "輪盤", "其他"],
  "風險等級": ["全部", "高風險", "中風險", "低風險"],
  "幣別": ["全部", "CNY", "USD", "HKD", "TWD", "JPY", "KRW"],
  "命中規則": ["全部", "高額 Tie 命中", "連續贏局", "異常時段投注", "多帳號同裝置"],
  "限額類型": ["全部", "單日投注額上限", "單日淨輸上限", "單日入金上限", "單日提款上限", "單注投注上限", "單局 / 單場上限", "單玩法上限", "單日最大派彩上限", "群組單日曝險上限"],
  "狀態": ["全部", "生效中", "已失效", "已取消"],
  "報表類型": ["全部", "會員高風險日報", "代理風險排行週報", "限額處置月報"],
  "週期": ["全部", "每日", "每週", "每月", "自訂"],
};

function filterControl([label, type], values = {}) {
  if (type === "select") {
    const options = filterOptions[label] || ["全部"];
    const currentValue = values[label] || "全部";
    return `<label><span>${label}</span><select>${options.map((option) => `<option ${option === currentValue ? "selected" : ""}>${option}</option>`).join("")}</select></label>`;
  }
  if (label === "日期範圍") {
    const start = values[`${label}_start`] || "";
    const end = values[`${label}_end`] || "";
    return `
      <label class="date-filter date-filter-range">
        <span>${label}</span>
        <div class="date-range">
          <input type="date" value="${escapeHtml(start)}" />
          <span>~</span>
          <input type="date" value="${escapeHtml(end)}" />
        </div>
      </label>
    `;
  }
  if (type === "date") {
    return `<label class="date-filter"><span>${label}</span><input type="date" value="${escapeHtml(values[label] || "")}" /></label>`;
  }
  return `<label><span>${label}</span><input placeholder="請輸入${label}" value="${escapeHtml(values[label] || "")}" /></label>`;
}

function pageMetricCards(title, data) {
  if (title === "報表管理") {
    return [
      smallMetric("總報表", String(data.rows.length), "目前可查詢報表"),
      smallMetric("已完成", String(data.rows.filter((row) => row.includes("已完成")).length), "可下載或匯出", "good"),
      smallMetric("排程報表", "2", "每日 / 每週自動產生"),
      smallMetric("產生中", "0", "目前無等待任務"),
    ].join("");
  }
  if (title === "限額管理") {
    return [
      smallMetric("限額筆數", String(data.rows.length), "本頁限額紀錄"),
      smallMetric("生效中", String(data.rows.filter((row) => row.includes("生效中")).length), "目前有效", "up"),
      smallMetric("即將到期", "1", "7 日內到期"),
      smallMetric("已失效", String(data.rows.filter((row) => row.includes("已失效")).length), "歷史紀錄"),
    ].join("");
  }
  return [
    smallMetric("總筆數", String(data.rows.length), "本頁模擬資料"),
    smallMetric("高風險", String(data.rows.filter((row) => row.includes("高風險")).length), "需優先處理", "up"),
    smallMetric("中風險", String(data.rows.filter((row) => row.includes("中風險")).length), "持續追蹤"),
    smallMetric("已處理", String(data.rows.filter((row) => row.includes("已處理") || row.includes("已完成")).length), "含系統處理", "good"),
  ].join("");
}

function runtimePageData(title, data) {
  if (title === "投注行為分析") {
    return {
      columns: ["案件ID", "時間", "會員", "幣別", "遊戲", "行為模式", "投注金額", "輸贏", "命中規則", "風險等級", "案件狀態", "操作"],
      rows: riskCases
        .filter((item) => Number(item.validBet || item.betAmount) > 0)
        .map((item) => [item.id, item.time, item.member, item.currency, item.game, item.behavior, money(item.betAmount), money(item.winLoss), item.rule, item.riskLevel, item.caseStatus, item.caseStatus === "已完成" ? "查看" : "處理"]),
    };
  }
  if (title === "限額管理") {
    return {
      ...data,
      columns: ["會員", "幣別", "限額類型", "目前限額", "生效時間", "到期時間", "原因", "操作人", "狀態", "操作"],
      rows: pageTables.limitsPage.rows.map((row) => {
        const member = memberRows.find((item) => item[0] === row[0]);
        return [row[0], member?.[4] || "CNY", ...row.slice(1)];
      }),
    };
  }
  return data;
}

function plainSpecTable(columns, rows, className = "") {
  if (!rows.length) return `<div class="empty">暫無資料</div>`;
  return `
    <div class="table-scroll limit-spec-scroll">
      <table class="${className}">
        <thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell, index) => `<td data-label="${escapeHtml(columns[index] || "")}">${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function limitFormulaCardsTemplate() {
  return `
    <div class="limit-formula-grid">
      ${limitFormulaCards.map(([title, formula]) => `
        <article class="limit-formula-card">
          <span>${escapeHtml(title)}</span>
          <strong>${escapeHtml(formula)}</strong>
        </article>
      `).join("")}
    </div>
  `;
}

function limitCheckSequenceTemplate() {
  return `
    <ol class="limit-check-sequence">
      ${limitCheckSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
    </ol>
  `;
}

function limitRecommendationRange(level, type) {
  const setting = limitCategoryAmountSettings[type]?.[level];
  if (!setting) return "依風控審核";
  return formatLimitAmountRange(setting);
}

function formatNumberText(value) {
  if (value === "" || value === undefined || value === null) return "";
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  return number.toLocaleString("en-US");
}

function formatLimitAmountRange(setting) {
  const min = String(setting?.min ?? "").trim();
  const max = String(setting?.max ?? "").trim();
  if (setting?.unit === "percent") {
    if (!min && !max) return "原額度個案設定";
    if (min && max) return `原額度 ${formatNumberText(min)}% ~ ${formatNumberText(max)}%`;
    return `原額度 ${formatNumberText(min || max)}%`;
  }
  if (!min && !max) return "個案設定";
  if (min && max && min !== max) return `${formatNumberText(min)} ~ ${formatNumberText(max)}`;
  return formatNumberText(min || max);
}

function suggestedLimitValue(range) {
  if (/原額度|個案/.test(String(range))) return "";
  const firstAmount = String(range).match(/\d[\d,]*/)?.[0];
  return firstAmount ? firstAmount.replaceAll(",", "") : "";
}

function limitSettingMemberOptions() {
  return memberRows
    .map((row) => `<option value="${escapeHtml(row[0])}" ${row[0] === state.selectedLimitMember ? "selected" : ""}>${escapeHtml(row[0])} / ${escapeHtml(row[6])}</option>`)
    .join("");
}

function limitLevelOptions() {
  return limitPlayerCategories
    .map((item) => `<option value="${item.level}" ${item.level === state.selectedLimitLevel ? "selected" : ""}>${escapeHtml(`${item.level} ${item.label} / ${item.vip}`)}</option>`)
    .join("");
}

function limitTypeOptions() {
  return limitControlTypes
    .map(([type]) => `<option value="${escapeHtml(type)}" ${type === state.selectedLimitType ? "selected" : ""}>${escapeHtml(type)}</option>`)
    .join("");
}

function normalizedLimitType(type) {
  return {
    "單注限額": "單注投注上限",
    "單日限額": "單日投注額上限",
  }[type] || type;
}

function memberLimitLevel(memberRow) {
  if (!memberRow) return "L1";
  if (memberRow[7] === "凍結") return "R";
  const vip = Number(String(memberRow[3] || "").match(/\d+/)?.[0] || 0);
  if (vip >= 7) return "L4";
  if (vip >= 4) return "L3";
  if (vip >= 2) return "L2";
  return "L1";
}

function currentMemberLimitRecords(member = state.member) {
  return pageTables.limitsPage.rows
    .filter((row) => row[0] === member)
    .map((row) => ({ ...rowObjectFromContext({ columns: pageTables.limitsPage.columns, row }), type: normalizedLimitType(row[1]) }));
}

function limitAmountForMember(memberRow, type) {
  const latest = pageTables.limitsPage.rows.find((row) => row[0] === memberRow?.[0] && normalizedLimitType(row[1]) === type && row[7] === "生效中");
  if (latest) return parseMoneyText(latest[2]);
  const range = limitRecommendationRange(memberLimitLevel(memberRow), type);
  const suggested = suggestedLimitValue(range);
  return suggested ? Number(suggested) : 0;
}

function memberLimitUsagePercent(memberRow, type, index) {
  const memberScore = Number(memberRow?.[5] || 50);
  const typeWeight = [58, 42, 36, 28, 51, 64, 45, 32, 72][index % 9];
  const riskBoost = memberScore >= 90 ? 12 : memberScore >= 70 ? 7 : 0;
  return Math.min(96, Math.max(8, typeWeight + riskBoost));
}

function memberCurrentLimitRows(member = state.member) {
  const memberRow = memberRows.find((row) => row[0] === member) || memberRows[0];
  return limitControlTypes.map(([type], index) => {
    const amount = limitAmountForMember(memberRow, type);
    const usage = amount ? Math.round(amount * memberLimitUsagePercent(memberRow, type, index) / 100) : 0;
    const remaining = Math.max(0, amount - usage);
    const latest = pageTables.limitsPage.rows.find((row) => row[0] === memberRow[0] && normalizedLimitType(row[1]) === type && row[7] === "生效中");
    const source = latest ? `人工調整 / ${latest[6]}` : `${memberLimitLevel(memberRow)} 系統範本`;
    const status = latest?.[7] || "生效中";
    return [
      type,
      amount ? displayMoney(amount, memberRow[4]) : "個案審核",
      amount ? displayMoney(usage, memberRow[4]) : "-",
      amount ? displayMoney(remaining, memberRow[4]) : "個案審核",
      amount ? `${Math.round(usage / amount * 100)}%` : "-",
      source,
      latest?.[3] || "依系統設定",
      latest?.[4] || "永久",
      status,
      "查看",
    ];
  });
}

function memberLimitHistoryRows(member = state.member) {
  return pageTables.limitsPage.rows
    .filter((row) => row[0] === member)
    .map((row) => [
      row[3],
      normalizedLimitType(row[1]),
      "-",
      row[2],
      row[3],
      row[4],
      row[5],
      row[6],
      row[7],
    ]);
}

function limitTypeButtonList() {
  return limitControlTypes
    .map(([type, target, purpose]) => `
      <button class="limit-type-option ${type === state.selectedLimitType ? "active" : ""}" type="button" data-limit-type="${escapeHtml(type)}">
        <strong>${escapeHtml(type)}</strong>
        <span>${escapeHtml(purpose)}</span>
        <small>${escapeHtml(target)}</small>
      </button>
    `)
    .join("");
}

function limitSettingTemplate() {
  const type = state.selectedLimitType;
  const level = state.selectedLimitLevel;
  const member = memberRows.find((row) => row[0] === state.selectedLimitMember) || memberRows[0];
  const recommendation = limitTypeRecommendations[type] || limitTypeRecommendations["單日投注額上限"];
  const suggestedRange = limitRecommendationRange(level, type);
  const suggestedValue = suggestedLimitValue(suggestedRange);

  return `
    <section class="content-card section-gap limit-setting-workspace">
      <div class="section-title-row">
        <div>
          <h2>會員限額設定</h2>
        </div>
      </div>
      <div class="limit-setting-layout limit-operation-layout">
        <form class="limit-setting-form" id="limitSettingForm">
          <div class="form-grid">
            <label><span>會員</span><select id="limitSettingMember">${limitSettingMemberOptions()}</select></label>
            <label><span>玩家限額層級</span><select id="limitSettingLevel">${limitLevelOptions()}</select></label>
            <label><span>限額類型</span><select id="limitSettingType">${limitTypeOptions()}</select></label>
            <label><span>目前限額</span><input id="limitCurrentAmount" type="number" min="0" step="${currencyInputStep()}" value="100000" /></label>
            <label><span>建議區間</span><input id="limitSuggestedRange" value="${escapeHtml(suggestedRange)}" readonly /></label>
            <label><span>設定額度（${currentCurrency()}）</span><input id="limitProposedAmount" type="number" min="0" step="${currencyInputStep()}" value="${escapeHtml(suggestedValue)}" /></label>
            <label><span>生效時間</span><input id="limitEffectiveFrom" type="datetime-local" value="2025-04-03T15:30" /></label>
            <label><span>到期時間</span><input id="limitEffectiveTo" type="datetime-local" value="2025-04-10T23:59" /></label>
          </div>
          <label><span>設定原因</span><textarea id="limitSettingReason" data-i18n-value="true">依 ${escapeHtml(member?.[6] || "風險等級")} 與 ${escapeHtml(type)} 建議區間調整。</textarea></label>
          <div class="limit-form-actions">
            <button class="secondary" id="applyLimitSuggestionBtn" type="button">套用建議下限</button>
            <button class="primary" type="submit">儲存限額設定</button>
          </div>
        </form>
        <aside class="limit-recommendation-panel">
          <span>系統設定建議</span>
          <strong>${escapeHtml(type)}</strong>
          <dl>
            <div><dt>設定來源</dt><dd>系統設定 / 限額設定類別</dd></div>
            <div><dt>建議區間</dt><dd>${escapeHtml(suggestedRange)}</dd></div>
            <div><dt>檢查公式</dt><dd>${escapeHtml(recommendation.formula)}</dd></div>
            <div><dt>設定重點</dt><dd>${escapeHtml(recommendation.focus)}</dd></div>
            <div><dt>審核要求</dt><dd>${escapeHtml(recommendation.review)}</dd></div>
            <div><dt>觸發處理</dt><dd>${escapeHtml(recommendation.trigger)}</dd></div>
          </dl>
        </aside>
      </div>
    </section>
  `;
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

function dataPage(title, breadcrumb, subtitle, data, filters, specs, actionLabel = "查詢") {
  const currentData = runtimePageData(title, data);
  const values = activeFilters(viewFilterKey());
  const rows = filterRows(currentData.columns, currentData.rows, values);
  const designSection = title === "限額管理" ? limitSettingTemplate() : "";
  return `
    ${pageHeader(title, breadcrumb, subtitle)}
    <section class="filter-bar generic-filter">
      ${filters.map((filter) => filterControl(filter, values)).join("")}
      ${actionLabel === "查詢" ? `<button class="primary generic-action">查詢</button><button class="secondary filter-reset" type="button">清除條件</button>` : `<button class="secondary generic-action">查詢</button><button class="secondary filter-reset" type="button">清除條件</button><button class="primary generic-action">${actionLabel}</button>`}
    </section>
    <section class="metric-grid dashboard-metrics">
      ${pageMetricCards(title, { ...currentData, rows })}
    </section>
    <section class="content-card section-gap">
      <h2>${title}清單</h2>
      ${tableTemplate(currentData.columns, rows)}
      <div class="table-footer"><span>共 ${rows.length} 筆</span><span>已套用目前查詢條件</span></div>
    </section>
    ${designSection}
    ${specSection(specs)}
  `;
}

function dashboardDetailData(detailKey) {
  const detail = dashboardDetails[detailKey];
  if (detailKey === "highRiskMembers") {
    return {
      ...detail,
      columns: ["案件ID", "會員帳號", "會員ID", "代理帳號", "幣別", "風險評分", "風險等級", "主要原因", "帳號狀態", "案件狀態", "操作"],
      rows: riskCases
        .filter((item) => item.riskLevel === "高風險")
        .map((item) => [item.id, item.member, item.memberId, item.agent, item.currency, String(item.riskScore), item.riskLevel, item.reason, item.accountStatus, item.caseStatus, "查看"]),
    };
  }
  if (detailKey === "pendingEvents") {
    return {
      ...detail,
      columns: ["案件ID", "事件時間", "會員", "事件類型", "事件描述", "風險等級", "案件狀態", "SLA", "操作"],
      rows: riskCases
        .filter(activeCase)
        .map((item) => [item.id, item.time, item.member, item.type, item.reason, item.riskLevel, item.caseStatus, item.sla, "處理"]),
    };
  }
  if (detailKey === "todayBetAmount") {
    return {
      ...detail,
      columns: ["案件ID", "時間", "會員", "幣別", "遊戲", "投注金額", "有效投注", "輸贏", "命中規則", "風險標籤", "操作"],
      rows: riskCases
        .filter((item) => Number(item.validBet || item.betAmount) > 0)
        .map((item) => [item.id, item.time, item.member, item.currency, item.game, money(item.betAmount), money(item.validBet), money(item.winLoss), item.rule, item.riskLevel, "查看"]),
    };
  }
  if (detailKey === "frozenAccounts") {
    return {
      ...detail,
      columns: ["案件ID", "會員帳號", "會員ID", "凍結範圍", "凍結來源", "凍結時間", "凍結原因", "狀態", "案件狀態", "操作"],
      rows: riskCases
        .filter((item) => item.accountStatus === "凍結" || item.freezeScope)
        .map((item) => [item.id, item.member, item.memberId, item.freezeScope || "禁止交易", item.freezeSource || "人工", item.time, item.reason, item.accountStatus, item.caseStatus, "查看"]),
    };
  }
  return detail;
}

function dashboardDetailTemplate(detailKey) {
  const detail = dashboardDetailData(detailKey);
  const values = activeFilters(`dashboard:${detailKey}`);
  const rows = filterRows(detail.columns, detail.rows, values);
  const previewCase = findCaseByRow(rowObjectFromContext({ columns: detail.columns, row: rows[0] || detail.rows[0] || [] }));
  const defaultAction = detailKey === "frozenAccounts" ? "freeze" : "complete";
  return `
    ${pageHeader(detail.title, detail.breadcrumb, detail.subtitle)}
    <section class="filter-bar generic-filter">
      ${filterControl(["日期", "date"], values)}
      ${filterControl(["風險等級", "select"], values)}
      <label><span>代理帳號</span><select><option ${!values["代理帳號"] || values["代理帳號"] === "全部" ? "selected" : ""}>全部</option><option ${values["代理帳號"] === "CQ9" ? "selected" : ""}>CQ9</option><option ${values["代理帳號"] === "AG01" ? "selected" : ""}>AG01</option><option ${values["代理帳號"] === "BBIN" ? "selected" : ""}>BBIN</option></select></label>
      ${filterControl(["幣別", "select"], values)}
      <label><span>關鍵字</span><input placeholder="會員、事件或單號" value="${escapeHtml(values["關鍵字"] || "")}" /></label>
      <button class="secondary generic-action">查詢</button>
      <button class="secondary filter-reset" type="button">清除條件</button>
      <button class="primary" id="backDashboardBtn">返回儀表板</button>
    </section>
    <section class="dashboard-detail-layout">
      <div class="content-card">
        <h2>詳細清單</h2>
        ${tableTemplate(detail.columns, rows)}
        <div class="table-footer"><span>共 ${rows.length} 筆</span><span>每筆操作都會寫入案件紀錄</span></div>
      </div>
      <aside class="content-card">
        <h2>${detail.formTitle}</h2>
        ${riskGuidancePanel(riskHandlingGuidance[detail.guidance] || riskHandlingGuidance.member)}
        <div class="stack">
          ${caseActionButtonsTemplate(previewCase, "dashboardSelectedCaseAction", defaultAction)}
          <label><span>處理備註</span><textarea id="dashboardDetailReason">${translateText(caseActionByKey(defaultAction, previewCase).note)}</textarea></label>
          <button class="primary" id="saveDashboardDetailBtn">儲存處理</button>
        </div>
      </aside>
    </section>
  `;
}

function detailFormControl(label, type, options = []) {
  if (type === "select") return `<label><span>${label}</span><select>${options.map((option) => `<option>${option}</option>`).join("")}</select></label>`;
  if (type === "datetime") return `<label><span>${label}</span><input type="datetime-local" value="2025-04-03T18:00" /></label>`;
  if (type === "textarea") return `<label><span>${label}</span><textarea id="dashboardDetailReason">請輸入處理原因與覆核結論。</textarea></label>`;
  return `<label><span>${label}</span><input /></label>`;
}

function riskGuidancePanel(guidance) {
  const data = guidance || riskHandlingGuidance.member;
  return `
    <div class="risk-guidance">
      <div class="guidance-item">
        <span>建議處理方式</span>
        <strong>${escapeAndFormatMoneyText(data.suggested)}</strong>
      </div>
      <div class="guidance-item">
        <span>被列入風險原因</span>
        <p>${escapeAndFormatMoneyText(data.reason)}</p>
      </div>
      ${data.evidence?.length ? `<ul class="guidance-evidence">${data.evidence.map((item) => `<li>${escapeAndFormatMoneyText(item)}</li>`).join("")}</ul>` : ""}
    </div>
  `;
}

function selectedGroupRow() {
  const row = pageTables.group.rows.find((item) => item[0] === state.selectedGroup) || pageTables.group.rows[0];
  state.selectedGroup = row?.[0] || "";
  return row;
}

function groupOptionsMarkup() {
  const selected = selectedGroupRow()?.[0];
  return pageTables.group.rows
    .map((row) => `<option value="${escapeHtml(row[0])}" ${row[0] === selected ? "selected" : ""}>${escapeHtml(row[0])} / ${escapeHtml(row[7])}</option>`)
    .join("");
}

function groupSummaryTemplate() {
  const row = selectedGroupRow();
  if (!row) return `<div class="empty">暫無集團資料</div>`;
  const data = groupRelations[row[0]];
  return taskList([
    `目前集團：${row[0]}`,
    `風險等級：${row[7]}`,
    `關聯帳號：${row[1]} 個`,
    `共同 IP：${row[2]} 組`,
    `共同裝置：${row[3]} 台`,
    `主要風險：${row[6]}`,
    `判定原因：${data?.reason || "尚無補充說明"}`,
  ]);
}

function relationAccountNames(value) {
  return String(value || "")
    .split(/[、,，\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function relationNodeStyle(node, width, height) {
  return `left:${((node.x / width) * 100).toFixed(2)}%;top:${((node.y / height) * 100).toFixed(2)}%;`;
}

function relationPath(source, target) {
  const dx = target.x - source.x;
  const curve = Math.min(160, Math.max(52, Math.abs(dx) * 0.42));
  const direction = dx >= 0 ? 1 : -1;
  const c1x = source.x + direction * curve;
  const c2x = target.x - direction * curve;
  return `M ${source.x} ${source.y} C ${c1x} ${source.y}, ${c2x} ${target.y}, ${target.x} ${target.y}`;
}

function relationNodeButton(node, width, height, groupId) {
  const count = node.count ? `<em>${escapeHtml(node.count)}</em>` : "";
  return `
    <button class="relation-node relation-${node.kind} group-drill${node.compact ? " compact-node" : ""}" data-group="${escapeHtml(groupId)}" data-kind="${escapeHtml(node.drillKind || "overview")}" style="${relationNodeStyle(node, width, height)}">
      ${count}
      <strong>${escapeHtml(node.label)}</strong>
      <span>${escapeHtml(node.subtitle)}</span>
    </button>
  `;
}

function compactGroupGraph(row, data) {
  const width = 1000;
  const height = 430;
  const groupId = row[0];
  const topAccount = data?.accounts?.[0] || "會員";
  const coreDevice = data?.devices?.[0]?.[0] || "核心裝置";
  const nodes = [
    { id: "center", kind: "group", x: 500, y: 215, label: groupId, subtitle: `${row[7]}集團`, drillKind: "overview" },
    { id: "accounts", kind: "account", x: 214, y: 96, label: `${topAccount} 等 ${row[1]} 個`, subtitle: "關聯帳號", drillKind: "accounts", count: row[1] },
    { id: "risk", kind: "risk", x: 198, y: 218, label: row[6], subtitle: "主要風險", drillKind: "overview" },
    { id: "login", kind: "risk", x: 250, y: 336, label: "登入重疊", subtitle: "行為關聯", drillKind: "overview" },
    { id: "ips", kind: "ip", x: 794, y: 98, label: `${row[2]} 組 IP`, subtitle: "共同登入", drillKind: "ips", count: row[2] },
    { id: "devices", kind: "device", x: 816, y: 220, label: `${row[3]} 台裝置`, subtitle: "裝置指紋", drillKind: "devices", count: row[3] },
    { id: "coreDevice", kind: "device", x: 746, y: 338, label: coreDevice, subtitle: "核心裝置", drillKind: "devices" },
  ];
  const strength = row[7] === "高風險" ? "strong" : "medium";
  const links = [
    ["center", "accounts", strength],
    ["center", "ips", strength],
    ["center", "devices", "medium"],
    ["center", "risk", "weak"],
    ["center", "login", "weak"],
    ["center", "coreDevice", "weak"],
    ["accounts", "ips", "dashed"],
    ["risk", "devices", "dashed"],
    ["ips", "coreDevice", "dashed"],
  ];
  return { width, height, nodes, links };
}

function expandedGroupGraph(row, data) {
  const width = 1000;
  const groupId = row[0];
  const accounts = data?.accounts || [];
  const ips = data?.ips || [];
  const devices = data?.devices || [];
  const accountColumns = accounts.length > 8 ? 2 : 1;
  const accountsPerColumn = Math.max(1, Math.ceil(accounts.length / accountColumns));
  const rightCount = Math.max(1, ips.length + devices.length);
  const height = Math.max(520, Math.max(accountsPerColumn, rightCount) * 74 + 128);
  const centerY = height / 2;
  const nodes = [
    { id: "center", kind: "group", x: 500, y: centerY, label: groupId, subtitle: `${row[7]}集團`, drillKind: "overview" },
    { id: "risk", kind: "risk", x: 500, y: Math.max(74, centerY - 128), label: row[6], subtitle: "主要風險", drillKind: "overview", compact: true },
    { id: "login", kind: "risk", x: 500, y: Math.min(height - 74, centerY + 128), label: "登入重疊", subtitle: "行為關聯", drillKind: "overview", compact: true },
  ];
  const links = [
    ["center", "risk", "weak"],
    ["center", "login", "weak"],
  ];
  const accountNodeByName = new Map();
  const accountStep = accountsPerColumn <= 1 ? 0 : (height - 128) / (accountsPerColumn - 1);
  accounts.forEach((account, index) => {
    const column = Math.floor(index / accountsPerColumn);
    const rowIndex = index % accountsPerColumn;
    const x = accountColumns === 2 ? 140 + column * 190 : 210;
    const y = accountsPerColumn <= 1 ? centerY : 64 + rowIndex * accountStep;
    const node = {
      id: `account-${index}`,
      kind: "account",
      x,
      y,
      label: account,
      subtitle: index === 0 ? "核心帳號" : "關聯帳號",
      drillKind: "accounts",
      compact: true,
    };
    nodes.push(node);
    accountNodeByName.set(account, node.id);
    links.push(["center", node.id, index < 3 ? "medium" : "weak"]);
  });
  const rightItems = [
    ...ips.map(([label, members], index) => ({ id: `ip-${index}`, kind: "ip", label, subtitle: "共同登入", members, drillKind: "ips" })),
    ...devices.map(([label, members], index) => ({ id: `device-${index}`, kind: "device", label, subtitle: index === 0 ? "核心裝置" : "共同裝置", members, drillKind: "devices" })),
  ];
  const rightStep = rightItems.length <= 1 ? 0 : (height - 128) / (rightItems.length - 1);
  rightItems.forEach((item, index) => {
    const node = {
      ...item,
      x: item.kind === "ip" ? 768 : 838,
      y: rightItems.length <= 1 ? centerY : 64 + index * rightStep,
      compact: true,
    };
    nodes.push(node);
    links.push(["center", node.id, item.kind === "device" && index === ips.length ? "medium" : "weak"]);
    relationAccountNames(item.members).forEach((account) => {
      const accountNodeId = accountNodeByName.get(account);
      if (accountNodeId) links.push([node.id, accountNodeId, "dashed"]);
    });
  });
  return { width, height, nodes, links };
}

function groupGraphTemplate() {
  const row = selectedGroupRow();
  if (!row) return `<div class="empty">暫無集團資料</div>`;
  const groupId = row[0];
  const data = groupRelations[groupId];
  const graph = state.groupGraphExpanded ? expandedGroupGraph(row, data) : compactGroupGraph(row, data);
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
  const relationLines = graph.links
    .map(([sourceId, targetId, strength]) => {
      const source = nodesById.get(sourceId);
      const target = nodesById.get(targetId);
      if (!source || !target) return "";
      return `<path class="link ${strength}" d="${relationPath(source, target)}"></path>`;
    })
    .join("");

  return `
    <div class="relation-toolbar">
      <div>
        <strong>${state.groupGraphExpanded ? "展開明細" : "收合總覽"}</strong>
        <span>${state.groupGraphExpanded ? "顯示帳號、IP、裝置交叉關聯" : "將大量關聯聚合成一張圖"}</span>
      </div>
      <button class="secondary relation-mode-btn" type="button" data-expanded="${state.groupGraphExpanded ? "false" : "true"}">${state.groupGraphExpanded ? "收合群組" : "展開全部"}</button>
    </div>
    <div class="relation-legend">
      <span><i class="legend-key group"></i>集團</span>
      <span><i class="legend-key account"></i>會員帳號</span>
      <span><i class="legend-key ip"></i>共同 IP</span>
      <span><i class="legend-key device"></i>共同裝置</span>
      <span><i class="legend-key risk"></i>風險訊號</span>
    </div>
    <div class="network-map${state.groupGraphExpanded ? " is-expanded" : ""}" aria-label="${escapeHtml(groupId)} 關聯圖譜">
      <div class="relation-canvas" style="--relation-height:${graph.height}px;">
        <svg class="relation-lines" viewBox="0 0 ${graph.width} ${graph.height}" preserveAspectRatio="none" aria-hidden="true">
          ${relationLines}
        </svg>
        ${graph.nodes.map((node) => relationNodeButton(node, graph.width, graph.height, groupId)).join("")}
      </div>
    </div>
    <div class="relation-note">目前只顯示 ${escapeHtml(groupId)}；切換集團後圖譜會自動重新收合。線條越粗代表關聯強度越高，虛線代表帳號與 IP / 裝置的交叉證據。</div>
  `;
}

function settingsTabNav() {
  return `
    <section class="settings-subnav" aria-label="系統設定子項目">
      ${settingsTabs.map(([key, label]) => `
        <button type="button" class="${state.settingsTab === key ? "active" : ""}" data-settings-tab="${key}">
          ${escapeHtml(label)}
        </button>
      `).join("")}
    </section>
  `;
}

function settingsGeneralTemplate() {
  return `
    <section class="settings-grid">
      <div class="content-card">
        <h2>一般設定</h2>
        <label><span>自動刷新秒數</span><input type="number" value="60" /></label>
        <label><span>最大查詢區間</span><input type="number" value="90" /></label>
        <label class="check-row"><input type="checkbox" checked /> 敏感操作需二次確認</label>
        <button class="primary generic-action">儲存設定</button>
      </div>
      <div class="content-card">
        <h2>通知設定</h2>
        <label><span>高風險事件收件人</span><input value="risk-team@example.com" /></label>
        <label><span>通知頻道</span><select><option>站內通知 + Email</option><option>站內通知</option></select></label>
        <button class="secondary generic-action">測試通知</button>
      </div>
      <div class="content-card">
        <h2>幣別設定</h2>
        <label><span>語系</span><select id="languageSettingSelect">${languageOptionsMarkup()}</select></label>
        <label><span>顯示幣別</span><select id="currencySelect">${currencyOptionsMarkup()}</select></label>
        <label><span>基準幣別</span><input value="CNY / 以人民幣為統計基準" readonly /></label>
        <label><span>匯率 API</span><input value="${exchangeRateApi.endpoint}" readonly /></label>
        <label><span>最後同步</span><input id="rateUpdatedAt" value="${exchangeRateApi.updatedAt}" readonly /></label>
        ${currencyPreviewMarkup()}
        <div class="button-row">
          <button class="secondary" id="syncExchangeRatesBtn">同步匯率</button>
          <button class="primary" id="saveCurrencySettingsBtn">套用幣別</button>
        </div>
      </div>
    </section>
  `;
}

function limitCategoryRows() {
  return limitControlTypes.map(([type, target, purpose]) => {
    const recommendation = limitTypeRecommendations[type] || {};
    return [type, target, purpose, recommendation.formula || "依風控規則", recommendation.trigger || "依人工審核"];
  });
}

function limitLevelTemplateRows() {
  return limitPlayerCategories.map((category) => [
    category.level,
    category.label,
    category.vip,
    category.review,
  ]);
}

function limitAmountInput(type, category, field) {
  const setting = limitCategoryAmountSettings[type]?.[category.level] || {};
  const value = setting[field] ?? "";
  return `
    <input
      type="number"
      min="0"
      step="${setting.unit === "percent" ? "1" : currencyInputStep()}"
      value="${escapeHtml(value)}"
      data-limit-amount-level="${escapeHtml(category.level)}"
      data-limit-amount-field="${field}"
      aria-label="${escapeHtml(`${category.level} ${field === "min" ? "建議下限" : "建議上限"}`)}"
    />
  `;
}

function limitCategoryAmountEditor(type) {
  return `
    <div class="limit-amount-editor">
      <div class="limit-amount-heading">
        <strong>玩家類別 / VIP 額度設定</strong>
        <span>${escapeHtml(type)}｜L0-L4 金額，R 百分比</span>
      </div>
      <div class="limit-amount-table-wrap">
        <table class="limit-amount-table">
          <thead>
            <tr>
              <th>層級</th>
              <th>玩家類別</th>
              <th>VIP 對應</th>
              <th>建議下限</th>
              <th>建議上限</th>
              <th>審核方式</th>
            </tr>
          </thead>
          <tbody>
            ${limitPlayerCategories.map((category) => `
              <tr>
                <td><strong>${escapeHtml(category.level)}</strong></td>
                <td>${escapeHtml(category.label)}</td>
                <td>${escapeHtml(category.vip)}</td>
                <td>${limitAmountInput(type, category, "min")}</td>
                <td>${limitAmountInput(type, category, "max")}</td>
                <td>${escapeHtml(category.review)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function limitCategorySettingsTemplate() {
  const type = state.selectedLimitType;
  const control = limitControlTypes.find((row) => row[0] === type) || limitControlTypes[0];
  const recommendation = limitTypeRecommendations[type] || limitTypeRecommendations["單日投注額上限"];
  return `
    <section class="content-card section-gap limit-category-admin">
      <div class="section-title-row">
        <h2>限額設定類別</h2>
      </div>
      <form class="limit-category-form" id="limitCategoryForm">
        <div class="form-grid">
          <label><span>限額類型</span><select id="limitCategoryType">${limitTypeOptions()}</select></label>
          <label><span>控制對象</span><input id="limitCategoryTarget" value="${escapeHtml(control?.[1] || "")}" /></label>
          <label><span>啟用狀態</span><select id="limitCategoryStatus"><option>啟用</option><option>停用</option></select></label>
          <label><span>適用範圍</span><select><option>全站會員</option><option>指定產品</option><option>指定代理</option></select></label>
        </div>
        ${limitCategoryAmountEditor(type)}
        <details class="limit-rule-details">
          <summary>進階規則文字</summary>
          <div class="limit-rule-grid">
            <label><span>設定目的</span><textarea id="limitCategoryPurpose">${escapeHtml(control?.[2] || "")}</textarea></label>
            <label><span>檢查公式</span><textarea id="limitCategoryFormula">${escapeHtml(recommendation.formula)}</textarea></label>
            <label><span>設定重點</span><textarea id="limitCategoryFocus">${escapeHtml(recommendation.focus)}</textarea></label>
            <label><span>審核要求</span><textarea id="limitCategoryReview">${escapeHtml(recommendation.review)}</textarea></label>
            <label><span>觸發處理</span><textarea id="limitCategoryTrigger">${escapeHtml(recommendation.trigger)}</textarea></label>
          </div>
        </details>
        <div class="limit-form-actions">
          <button class="primary" type="submit">儲存類別設定</button>
        </div>
      </form>
    </section>
    <section class="content-card section-gap">
      <h2>限額類別清單</h2>
      ${tableTemplate(["限額類型", "控制對象", "設定目的", "檢查公式", "觸發處理"], limitCategoryRows())}
    </section>
    <section class="content-card section-gap">
      <h2>玩家類別對應</h2>
      ${tableTemplate(["層級", "玩家類別", "VIP 對應", "審核方式"], limitLevelTemplateRows(), "limit-level-table")}
    </section>
  `;
}

function settingsAdminTemplate() {
  return `
    <section class="content-card section-gap">
      <div class="section-title-row">
        <h2>管理者帳號</h2>
        <button class="primary" id="addAdminAccountBtn">新增管理帳號</button>
      </div>
      <section class="filter-bar generic-filter compact-filter">
        <label><span>管理帳號</span><input placeholder="請輸入管理帳號" /></label>
        <label><span>帳號歸屬</span><select><option>全部</option><option>平台</option><option>代理</option></select></label>
        <label><span>所屬代理</span><select><option>全部</option><option>CQ9</option><option>AG01</option><option>BBIN</option></select></label>
        <label><span>角色</span><select><option>全部</option><option>代理風控監控員</option><option>代理風控主管</option><option>平台風控審核員</option><option>平台風控管理員</option><option>平台營運主管</option><option>系統管理員</option></select></label>
        <label><span>帳號狀態</span><select><option>全部</option><option>啟用</option><option>停用</option></select></label>
        <button class="secondary generic-action">查詢</button>
      </section>
      ${tableTemplate(adminAccountTable.columns, adminAccountTable.rows)}
    </section>
    <section class="content-card section-gap">
      <h2>角色權限矩陣</h2>
      ${tableTemplate(permissionMatrix.columns, permissionMatrix.rows, "permission-table")}
    </section>
  `;
}

function settingsAuditTemplate() {
  return `
    <section class="content-card section-gap">
      <h2>設定異動紀錄</h2>
      ${tableTemplate(pageTables.settings.columns, pageTables.settings.rows)}
    </section>
  `;
}

function settingsContentTemplate() {
  if (state.settingsTab === "limitCategories") return limitCategorySettingsTemplate();
  if (state.settingsTab === "admins") return settingsAdminTemplate();
  if (state.settingsTab === "audit") return settingsAuditTemplate();
  return settingsGeneralTemplate();
}

function settingsPageTemplate() {
  return `
    ${pageHeader("系統設定", "首頁 / 系統設定", "後台安全、刷新、查詢限制、幣別、通知、角色權限與限額設定類別")}
    ${settingsTabNav()}
    ${settingsContentTemplate()}
  `;
}

function bindSpecButtons() {
  document.querySelectorAll(".spec-doc-btn").forEach((button) => {
    button.addEventListener("click", () => openSpecWindow(button.dataset.specTitle || currentSpecTitle()));
  });
  document.querySelectorAll(".risk-calc-doc-btn").forEach((button) => {
    button.addEventListener("click", openRiskCalculationModal);
  });
}

function currentSpecTitle() {
  if (state.currentView === "member" && state.memberMode === "detail") return "會員風險檢視";
  if (state.currentView === "member") return "會員風險分析";
  if (state.currentView === "rulesSetting" && state.ruleMode === "create") return "新增風控規則";
  if (state.currentView === "dashboard" && state.dashboardMode === "detail") return dashboardDetails[state.dashboardDetail]?.title || "首頁儀表板";
  const viewTitleMap = {
    dashboard: "首頁儀表板",
    betting: "投注行為分析",
    group: "集團風險偵測",
    limitsPage: "限額管理",
    limitsQuery: "限額管理",
    limitsSetting: "限額管理",
    rules: "風控規則設定",
    rulesQuery: "風控規則設定",
    rulesSetting: "風控規則設定",
    reports: "報表管理",
    reportsQuery: "報表管理",
    reportsSetting: "報表管理",
    settings: "系統設定",
  };
  return viewTitleMap[state.currentView] || "首頁儀表板";
}

function openSpecWindow(title) {
  const spec = specDocuments[title] || specDocuments[currentSpecTitle()] || specDocuments["首頁儀表板"];
  const doc = window.open("", "_blank", "width=980,height=760,scrollbars=yes,resizable=yes");
  if (!doc) {
    toast("瀏覽器阻擋了新視窗，請允許彈出視窗後再試");
    return;
  }
  doc.document.write(specWindowHtml(title, spec));
  doc.document.close();
}

function specList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function specFieldTable(fields) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>欄位 / 區塊</th><th>詳細說明</th><th>格式 / 驗證規則</th></tr>
        </thead>
        <tbody>
          ${fields.map((field) => {
            const detail = fieldDescriptions[field] || [`${field} 為本頁功能所需欄位，需依頁面情境顯示或輸入。`, "依後端 API 定義；前端需處理空值與錯誤狀態。"];
            return `<tr><td><strong>${escapeHtml(field)}</strong></td><td>${escapeHtml(detail[0])}</td><td>${escapeHtml(detail[1])}</td></tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function specWindowHtml(title, spec) {
  const theme = document.body.dataset.theme === "dark" ? "dark" : "light";
  return `
    <!doctype html>
    <html lang="zh-Hant">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(title)} 規格說明</title>
        <style>
          :root { color-scheme: light; --bg: #f4f7fb; --text: #17212b; --muted: #526071; --panel: #fff; --line: #e5ebf2; --head: #f7f9fc; --head-text: #425166; --shadow: 0 2px 10px rgba(20, 38, 62, 0.08); }
          body[data-theme="dark"] { color-scheme: dark; --bg: #07111d; --text: #e7eef8; --muted: #9fb0c4; --panel: #101a27; --line: #26374b; --head: #162538; --head-text: #cbd8e7; --shadow: 0 12px 28px rgba(0, 0, 0, 0.24); }
          body { margin: 0; background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC", Arial, sans-serif; line-height: 1.65; }
          main { max-width: 940px; margin: 0 auto; padding: 28px; }
          header { margin-bottom: 18px; }
          h1 { margin: 0 0 8px; font-size: 28px; }
          p { margin: 0; color: var(--muted); }
          section { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 18px; margin: 12px 0; box-shadow: var(--shadow); }
          h2 { margin: 0 0 10px; font-size: 18px; }
          ul { margin: 0; padding-left: 20px; }
          li { margin: 6px 0; }
          table { width: 100%; border-collapse: collapse; table-layout: fixed; }
          th, td { border: 1px solid var(--line); padding: 10px 12px; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
          th { background: var(--head); color: var(--head-text); }
          .table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .table-wrap table { min-width: 760px; }
          .meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
          @media (max-width: 720px) { main { padding: 18px; } .meta { grid-template-columns: 1fr; } }
        </style>
      </head>
      <body data-theme="${theme}">
        <main>
          <header>
            <h1>${escapeHtml(title)} 規格說明</h1>
            <p>${escapeHtml(spec.purpose)}</p>
          </header>
          <section>
            <h2>頁面目的</h2>
            <p>${escapeHtml(spec.purpose)}</p>
          </section>
          <div class="meta">
            <section>
              <h2>欄位總覽</h2>
              ${specList(spec.fields)}
            </section>
            <section>
              <h2>操作功能</h2>
              ${specList(spec.actions)}
            </section>
          </div>
          <section>
            <h2>欄位詳細說明</h2>
            ${specFieldTable(spec.fields)}
          </section>
          <section>
            <h2>API 建議</h2>
            ${specList(spec.api)}
          </section>
          <section>
            <h2>驗收標準</h2>
            ${specList(spec.acceptance)}
          </section>
        </main>
      </body>
    </html>
  `;
}

function createRuleTemplate() {
  return `
    ${pageHeader("新增風控規則", "首頁 / 風控規則設定 / 新增規則", "建立規則條件、風險等級、命中後處置與測試樣本。")}
    <section class="rule-create-layout">
      <div class="content-card">
        <h2>基本資料</h2>
        <div class="form-grid">
          <label><span>規則名稱</span><input id="ruleName" value="高額 Tie 命中" /></label>
          <label><span>規則代碼</span><input value="BAC_TIE_HIGH_WIN" /></label>
          <label><span>規則類型</span><select><option>行為</option><option>金額</option><option>頻率</option><option>關聯</option></select></label>
          <label><span>適用產品</span><select><option>百家樂</option><option>全部產品</option><option>輪盤</option></select></label>
          <label><span>風險等級</span><select><option>高風險</option><option>中風險</option><option>低風險</option></select></label>
          <label><span>啟用狀態</span><select><option>啟用</option><option>停用</option><option>草稿</option></select></label>
        </div>
      </div>
      <div class="content-card">
        <h2>觸發條件</h2>
        <div class="form-grid">
          <label><span>統計維度</span><select><option>單局</option><option>單日</option><option>近 7 日</option><option>近 30 日</option></select></label>
          <label><span>指標欄位</span><select><option>Tie 玩家盈利金額</option><option>投注金額</option><option>連勝局數</option><option>共同裝置數</option></select></label>
          <label><span>比較方式</span><select><option>>=</option><option>></option><option>=</option><option><=</option></select></label>
          <label><span>基準風險值（CNY）</span><input id="ruleThreshold" type="number" value="50000" min="0" /></label>
          <label><span>命中冷卻時間</span><select><option>30 分鐘</option><option>1 小時</option><option>24 小時</option><option>不冷卻</option></select></label>
          <label><span>最低樣本數</span><input type="number" value="1" min="1" /></label>
        </div>
      </div>
      <div class="content-card">
        <h2>各幣別風險值</h2>
        ${currencyThresholdInputsMarkup()}
      </div>
      <div class="content-card">
        <h2>自動處置</h2>
        <div class="form-grid">
          <label class="check-row"><input type="checkbox" checked /> 建立風險事件</label>
          <label class="check-row"><input type="checkbox" checked /> 發送站內通知</label>
          <label class="check-row"><input type="checkbox" /> 加入觀察名單</label>
          <label class="check-row"><input type="checkbox" /> 自動調整限額</label>
          <label><span>通知角色</span><select><option>風控管理員</option><option>營運主管</option><option>系統管理員</option></select></label>
          <label><span>覆核時限</span><select><option>4 小時</option><option>8 小時</option><option>24 小時</option></select></label>
        </div>
      </div>
      <aside class="content-card">
        <h2>操作</h2>
        <div class="stack">
          <button class="secondary" id="testRuleBtn">測試規則</button>
          <button class="primary" id="saveRuleBtn">儲存規則</button>
          <button class="muted-button" id="backRulesBtn">返回列表</button>
        </div>
      </aside>
    </section>
  `;
}

function taskList(items) {
  return `<div class="task-list">${items.map((item) => `<button class="task-item" data-detail="task"><span class="task-label">${escapeHtml(item)}</span><span aria-hidden="true">›</span></button>`).join("")}</div>`;
}

function specSection(specs) {
  return "";
}

function bindLimitSettingWorkspace() {
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
    const type = el("limitSettingType")?.value || state.selectedLimitType;
    pageTables.limitsPage.rows.unshift([
      member,
      type,
      String(amount),
      updateTimestamp(),
      (el("limitEffectiveTo")?.value || "2025-04-10T23:59").replace("T", " "),
      reason,
      "admin",
      "生效中",
      "查看",
    ]);
    updateMemberStatus(member, "限額中");
    renderActiveView();
    toast(`${member} 的 ${type} 已儲存`);
  });
}

function bindSettingsPage() {
  document.querySelectorAll("[data-settings-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.settingsTab = button.dataset.settingsTab || "general";
      renderActiveView();
    });
  });

  el("limitCategoryType")?.addEventListener("change", () => {
    state.selectedLimitType = el("limitCategoryType").value;
    renderActiveView();
  });

  const categoryForm = el("limitCategoryForm");
  categoryForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const type = el("limitCategoryType")?.value || state.selectedLimitType;
    const control = limitControlTypes.find((row) => row[0] === type);
    const recommendation = limitTypeRecommendations[type];
    if (!control || !recommendation) {
      toast("找不到限額類別設定");
      return;
    }
    control[1] = el("limitCategoryTarget")?.value.trim() || control[1];
    control[2] = el("limitCategoryPurpose")?.value.trim() || control[2];
    recommendation.formula = el("limitCategoryFormula")?.value.trim() || recommendation.formula;
    recommendation.focus = el("limitCategoryFocus")?.value.trim() || recommendation.focus;
    recommendation.review = el("limitCategoryReview")?.value.trim() || recommendation.review;
    recommendation.trigger = el("limitCategoryTrigger")?.value.trim() || recommendation.trigger;
    const nextAmounts = {};
    for (const category of limitPlayerCategories) {
      const minInput = categoryForm.querySelector(`[data-limit-amount-level="${category.level}"][data-limit-amount-field="min"]`);
      const maxInput = categoryForm.querySelector(`[data-limit-amount-level="${category.level}"][data-limit-amount-field="max"]`);
      const min = minInput?.value.trim() || "";
      const max = maxInput?.value.trim() || "";
      const minNumber = min === "" ? null : Number(min);
      const maxNumber = max === "" ? null : Number(max);
      if ((minNumber !== null && (!Number.isFinite(minNumber) || minNumber < 0)) || (maxNumber !== null && (!Number.isFinite(maxNumber) || maxNumber < 0))) {
        toast(`${category.level} 請輸入有效的非負數字`);
        return;
      }
      if (minNumber !== null && maxNumber !== null && minNumber > maxNumber) {
        toast(`${category.level} 建議下限不可大於上限`);
        return;
      }
      nextAmounts[category.level] = {
        min,
        max,
        unit: category.level === "R" ? "percent" : "amount",
      };
    }
    limitCategoryAmountSettings[type] = nextAmounts;
    appendAuditLog("限額設定類別", `${type} 類別規則與玩家類別額度更新`, "系統設定 / 限額設定類別", "admin");
    renderActiveView();
    toast(`${type} 類別設定已儲存`);
  });
}

function bindGenericPage() {
  bindSpecButtons();
  bindLimitSettingWorkspace();
  bindSettingsPage();
  document.querySelectorAll(".generic-action").forEach((button) => {
    button.addEventListener("click", () => handleGenericAction(button));
  });
  document.querySelectorAll("[data-view-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetView = button.dataset.viewTarget;
      navigateToView(targetView);
      if (targetView === "limitsSetting") toast("已前往限額設定");
      if (targetView === "limitsQuery") toast("已返回限額查詢");
      if (targetView === "rulesSetting") toast("已前往規則設定");
      if (targetView === "rulesQuery") toast("已返回規則查詢");
      if (targetView === "reportsSetting") toast("已前往報表設定");
      if (targetView === "reportsQuery") toast("已返回報表查詢");
    });
  });
  document.querySelectorAll(".filter-reset").forEach((button) => {
    button.addEventListener("click", resetCurrentFilters);
  });
  document.querySelectorAll("[data-dashboard-detail]").forEach((card) => {
    const open = () => {
      state.dashboardMode = "detail";
      state.dashboardDetail = card.dataset.dashboardDetail;
      renderDashboardPage();
    };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
  el("backDashboardBtn")?.addEventListener("click", () => {
    state.dashboardMode = "main";
    renderDashboardPage();
  });
  bindCaseActionButtons(document, "dashboardSelectedCaseAction", "dashboardDetailReason");
  el("saveDashboardDetailBtn")?.addEventListener("click", () => {
    const reason = el("dashboardDetailReason")?.value.trim();
    if (!reason) {
      toast("請輸入處理原因與覆核結論");
      return;
    }
    const detail = dashboardDetailData(state.dashboardDetail);
    const rows = filterRows(detail.columns, detail.rows, activeFilters(`dashboard:${state.dashboardDetail}`));
    const rowData = rowObjectFromContext({ columns: detail.columns, row: rows[0] || detail.rows[0] || [] });
    const targetCase = findCaseByRow(rowData);
    const selectedAction = el("dashboardSelectedCaseAction")?.value || "complete";
    applyCaseAction(targetCase, selectedAction, reason, rowData["會員"] || rowData["會員帳號"]);
    renderDashboardPage();
    toast(targetCase ? `${targetCase.id} 處理資料已儲存` : "處理資料已儲存");
  });
  el("addRuleBtn")?.addEventListener("click", () => {
    state.ruleMode = "create";
    renderRulesPage();
  });
  el("backRulesBtn")?.addEventListener("click", () => {
    state.ruleMode = "list";
    renderRulesPage();
  });
  el("saveRuleBtn")?.addEventListener("click", () => {
    const name = el("ruleName")?.value.trim();
    const threshold = el("ruleThreshold")?.value;
    const currencyThresholdInputs = [...document.querySelectorAll("[data-currency-threshold]")];
    if (!name) {
      toast("請輸入規則名稱");
      return;
    }
    if (!threshold || Number(threshold) < 0) {
      toast("請輸入有效基準風險值");
      return;
    }
    if (currencyThresholdInputs.some((input) => input.value === "" || Number(input.value) < 0)) {
      toast("請輸入有效的各幣別風險值");
      return;
    }
    toast("新增規則成功");
    state.ruleMode = "list";
    renderRulesPage();
  });
  el("testRuleBtn")?.addEventListener("click", () => toast("規則測試完成：已依會員幣別門檻模擬命中 18 筆"));
  el("addAdminAccountBtn")?.addEventListener("click", openAdminAccountModal);
  el("currencySelect")?.addEventListener("change", () => {
    const selected = el("currencySelect").value;
    el("currencyPreview").outerHTML = currencyPreviewMarkup(selected);
  });
  el("languageSettingSelect")?.addEventListener("change", () => {
    applyLanguage(el("languageSettingSelect").value, { persist: true, announce: true });
  });
  el("saveCurrencySettingsBtn")?.addEventListener("click", () => {
    applyCurrency(el("currencySelect")?.value, { persist: true, rerender: true, announce: true });
  });
  el("syncExchangeRatesBtn")?.addEventListener("click", syncExchangeRates);
  el("syncRuleRateBtn")?.addEventListener("click", syncExchangeRates);
  el("groupGraphSelect")?.addEventListener("change", () => {
    state.selectedGroup = el("groupGraphSelect").value;
    state.groupGraphExpanded = false;
    renderView("group");
    toast(`已切換至 ${state.selectedGroup} 關聯圖譜`);
  });
  document.querySelectorAll(".relation-mode-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.groupGraphExpanded = button.dataset.expanded === "true";
      renderView("group");
    });
  });
  document.querySelectorAll(".generic-info").forEach((button) => {
    button.addEventListener("click", () => toast("此頁已補齊功能規格摘要與互動原型。"));
  });
  document.querySelectorAll(".group-drill").forEach((button) => {
    button.addEventListener("click", () => openGroupDrillModal(button.dataset.group, button.dataset.kind));
  });
  document.querySelectorAll(".row-action, [data-detail]").forEach((button) => {
    button.addEventListener("click", () => openDetailModal(canonicalText(button.textContent) || "查看", rowContexts.get(button.dataset.rowContext)));
  });
}

function handleGenericAction(button) {
  const label = canonicalText(button.textContent);
  if (label === "匯出資料") {
    toast("已建立匯出任務，完成後會出現在報表管理");
    return;
  }
  if (label === "查詢") {
    state.filters[viewFilterKey()] = readFilterValues(button.closest(".filter-bar"));
    renderActiveView();
    toast("查詢完成，列表與統計已依目前條件更新");
    return;
  }
  if (label === "新增限額") {
    openActionModal("limit");
    return;
  }
  if (label === "產生報表") {
    toast("已建立報表產生任務，可到報表管理查看狀態");
    return;
  }
  if (label === "測試通知") {
    toast("測試通知已送出，請查看右上角提醒");
    return;
  }
  if (label === "儲存設定") {
    toast("設定已儲存，敏感設定異動已記錄");
    return;
  }
  if (label === "查看管理帳號" || label === "查看") {
    toast("已開啟資料詳情，可依角色查看可用權限");
    return;
  }
  toast(`${label}完成`);
}

function renderRulesPage() {
  state.currentView = "rulesSetting";
  activateNav("rulesSetting");
  document.querySelector(".content").innerHTML = state.ruleMode === "create" ? createRuleTemplate() : pageTemplates.rulesSetting();
  bindGenericPage();
  resetScrollPosition();
}

function renderDashboardPage() {
  state.currentView = "dashboard";
  document.querySelector(".content").innerHTML = state.dashboardMode === "detail" ? dashboardDetailTemplate(state.dashboardDetail) : pageTemplates.dashboard();
  bindGenericPage();
  drawChartsSoon();
  resetScrollPosition();
}

function isAuthenticated() {
  try {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
  } catch (error) {
    return false;
  }
}

function lockApp() {
  document.body.classList.add("login-locked");
  document.body.classList.remove("is-authenticated");
  el("loginAccount")?.focus();
}

function unlockApp() {
  document.body.classList.remove("login-locked");
  document.body.classList.add("is-authenticated");
}

function startApp() {
  unlockApp();
  if (appStarted) {
    renderDashboardPage();
    applyLanguageToDom();
    return;
  }
  appStarted = true;
  state.memberPageHTML = document.querySelector(".content").innerHTML;
  bindGlobalEvents();
  observeLanguageDom();
  renderDashboardPage();
  bindNav();
  applyLanguageToDom();
  drawChartsSoon();
}

function bindLoginEvents() {
  el("loginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const account = el("loginAccount")?.value.trim();
    const password = el("loginPassword")?.value.trim();
    if (account !== LOGIN_CREDENTIAL || password !== LOGIN_CREDENTIAL) {
      el("loginError").textContent = translateText("帳號或密碼錯誤");
      return;
    }
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
    } catch (error) {
      // Authentication still works for the current page load if sessionStorage is blocked.
    }
    el("loginError").textContent = "";
    startApp();
    toast("登入成功");
  });
  el("logoutBtn")?.addEventListener("click", () => {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      // No-op when sessionStorage is blocked.
    }
    closeModal();
    lockApp();
    toast("已登出");
  });
}

function init() {
  state.language = preferredLanguage();
  applyTheme(preferredTheme(), { redraw: false });
  applyCurrency(preferredCurrency(), { redraw: false, rerender: false });
  bindLoginEvents();
  if (isAuthenticated()) {
    startApp();
  } else {
    lockApp();
  }
  applyLanguageToDom();
}

function preferredTheme() {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "dark" || storedTheme === "light") return storedTheme;
  } catch (error) {
    // localStorage can be unavailable in some file:// browser settings.
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

function applyTheme(theme, options = {}) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.body.dataset.theme = nextTheme;
  const button = el("themeToggleBtn");
  if (button) {
    const darkMode = nextTheme === "dark";
    const icon = button.querySelector(".theme-toggle-icon");
    const label = button.querySelector(".theme-toggle-label");
    if (icon && label) {
      icon.textContent = darkMode ? "☀" : "◐";
      label.textContent = darkMode ? "淺色" : "深色";
    } else {
      button.textContent = darkMode ? "☀ 淺色" : "◐ 深色";
    }
    button.title = darkMode ? "切換淺色模式" : "切換深色模式";
    button.setAttribute("aria-label", button.title);
    button.setAttribute("aria-pressed", String(darkMode));
  }
  if (options.persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      // Theme still works for this session if localStorage is blocked.
    }
  }
  if (options.redraw !== false) drawChartsSoon();
  if (options.announce) toast(nextTheme === "dark" ? "已切換為深色模式" : "已切換為淺色模式");
  applyLanguageToDom();
}

function toggleTheme() {
  applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark", { persist: true, announce: true });
}

function preferredCurrency() {
  try {
    const storedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (currencySettings[storedCurrency]) return storedCurrency;
  } catch (error) {
    // localStorage can be unavailable in some file:// browser settings.
  }
  return "CNY";
}

function applyCurrency(code, options = {}) {
  const nextCurrency = currencySettings[code] ? code : "CNY";
  const previousCurrency = state.currency;
  state.currency = nextCurrency;
  if (options.persist) {
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, nextCurrency);
    } catch (error) {
      // Currency still works for this session if localStorage is blocked.
    }
    if (previousCurrency !== nextCurrency) {
      pageTables.settings.rows.unshift(["顯示幣別", nextCurrency, "全後台金額顯示", updateTimestamp(), "admin", "查看"]);
    }
  }
  const currencySettingRow = pageTables.settings.rows.find((row) => row[0] === "顯示幣別");
  if (currencySettingRow) currencySettingRow[1] = nextCurrency;
  if (options.rerender) {
    renderActiveView();
  } else if (options.redraw !== false) {
    drawChartsSoon();
  }
  if (options.announce) toast(`顯示幣別已切換為 ${nextCurrency}`);
}

function syncExchangeRates() {
  exchangeRateApi.updatedAt = updateTimestamp();
  exchangeRateApi.status = "API 已同步";
  pageTables.settings.rows.unshift(["匯率 API 同步", exchangeRateApi.updatedAt, "全後台金額顯示", exchangeRateApi.updatedAt, "system", "查看"]);
  const updatedAtInput = el("rateUpdatedAt");
  if (updatedAtInput) updatedAtInput.value = exchangeRateApi.updatedAt;
  const preview = el("currencyPreview");
  if (preview) preview.outerHTML = currencyPreviewMarkup(el("currencySelect")?.value || currentCurrency());
  toast(`已透過 ${exchangeRateApi.endpoint} 同步匯率；風控幣別門檻不會被自動覆蓋`);
}

function renderActiveView() {
  state.currentView = canonicalView(state.currentView);
  if (state.currentView === "dashboard") {
    renderDashboardPage();
    return;
  }
  if (state.currentView === "member") {
    renderMemberPage();
    return;
  }
  if (state.currentView === "rulesSetting" && state.ruleMode === "create") {
    renderRulesPage();
    return;
  }
  renderView(state.currentView);
}

function bindGlobalEvents() {
  el("languageSelect")?.addEventListener("change", () => {
    applyLanguage(el("languageSelect").value, { persist: true, announce: true });
  });
  el("menuBtn")?.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 760px)").matches) {
      document.querySelector(".nav-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
      toast("手機版選單在上方，可左右滑動切換頁面");
      return;
    }
    document.querySelector(".app-shell").classList.toggle("nav-collapsed");
    toast(document.querySelector(".app-shell").classList.contains("nav-collapsed") ? "左側選單已收合" : "左側選單已展開");
  });
  el("themeToggleBtn")?.addEventListener("click", toggleTheme);
  el("notifyBtn")?.addEventListener("click", openNotificationsModal);
  el("userMenuBtn")?.addEventListener("click", openUserMenuModal);
  el("refreshBtn")?.addEventListener("click", () => {
    updateTime();
    toast("已重新載入目前查詢條件");
    if (state.currentView === "dashboard") renderDashboardPage();
    else if (state.currentView === "member" && state.memberMode === "detail") renderTab();
    else if (state.currentView === "member") renderMemberPage();
    else renderView(state.currentView);
  });
  el("modalClose").addEventListener("click", closeModal);
  el("modalBackdrop").addEventListener("click", (event) => {
    if (event.target.id === "modalBackdrop") closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });
}

function bindMemberEvents() {
  bindSpecButtons();
  el("filterForm")?.addEventListener("submit", handleSearch);
  el("backBtn")?.addEventListener("click", () => {
    state.memberMode = "list";
    renderMemberPage();
    toast("已返回會員風險分析列表頁");
  });
  el("infoBtn")?.addEventListener("click", () => {
    toast("此頁用於查詢單一會員的風險評分、投注異常、盈虧趨勢及風控處置紀錄。");
  });
}

function bindNav() {
  document.querySelectorAll(".nav-item").forEach((button) => {
    button.title = button.textContent.trim();
    button.addEventListener("click", () => {
      navigateToView(button.dataset.view);
    });
  });
}

function renderView(view) {
  view = canonicalView(view);
  state.currentView = view;
  if (view === "dashboard") {
    state.dashboardMode = "main";
    renderDashboardPage();
    return;
  }
  if (view === "member") {
    state.memberMode = "list";
    renderMemberPage();
    return;
  }
  if (view === "rulesSetting" && state.ruleMode === "create") {
    renderRulesPage();
    return;
  }
  document.querySelector(".content").innerHTML = pageTemplates[view]();
  bindGenericPage();
  drawChartsSoon();
  resetScrollPosition();
}

function canonicalView(view) {
  if (view === "limitsPage") return "limitsQuery";
  if (view === "rules") return "rulesQuery";
  if (view === "reports") return "reportsQuery";
  return view;
}

function navigateToView(view) {
  const nextView = canonicalView(view);
  state.currentView = nextView;
  state.page = 1;
  if (nextView === "rulesQuery" || nextView === "rulesSetting") state.ruleMode = "list";
  activateNav(nextView);
  renderView(nextView);
}

function resetScrollPosition() {
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.querySelector(".content")?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
  });
}

function activateNav(view) {
  const activeView = canonicalView(view);
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === activeView);
  });
  document.querySelectorAll(".nav-group").forEach((group) => {
    group.classList.toggle("active", Boolean(group.querySelector(`.nav-item[data-view="${activeView}"]`)));
  });
}

function goToNotificationTarget(item) {
  const target = item.target;
  if (!target) {
    closeModal();
    toast("此提醒尚未設定連結頁面");
    return;
  }

  closeModal();
  if (target.view === "member") {
    state.currentView = "member";
    state.member = target.member || state.member;
    state.memberMode = "detail";
    activateNav("member");
    renderMemberPage();
    toast(`已前往 ${state.member} 會員風險檢視`);
    return;
  }

  if (target.view === "dashboard" && target.detail) {
    state.currentView = "dashboard";
    state.dashboardMode = "detail";
    state.dashboardDetail = target.detail;
    activateNav("dashboard");
    renderDashboardPage();
    toast(`已前往${target.label}`);
    return;
  }

  state.currentView = canonicalView(target.view);
  if (target.view === "group" && target.group) {
    state.selectedGroup = target.group;
  }
  activateNav(state.currentView);
  renderView(state.currentView);
  if (target.view === "group" && target.group) {
    openGroupDrillModal(target.group, target.kind || "overview");
  }
  toast(`已前往${target.label || "相關頁面"}`);
}

function renderMemberPage() {
  if (state.memberMode === "detail") {
    renderMemberDetail();
    return;
  }
  document.querySelector(".content").innerHTML = memberListTemplate();
  bindMemberListEvents();
  resetScrollPosition();
}

function renderMemberDetail() {
  document.querySelector(".content").innerHTML = state.memberPageHTML;
  bindMemberEvents();
  el("memberName").textContent = state.member;
  const row = memberRows.find((item) => item[0] === state.member);
  if (row) {
    el("memberId").textContent = row[1];
    el("summaryAgent").textContent = row[2];
    el("riskBadge").outerHTML = riskBadge(row[6]);
    el("accountStatus").textContent = row[7];
    el("accountStatus").className = row[7] === "凍結" ? "badge danger" : row[7] === "正常" ? "status-ok" : "badge warning";
  }
  renderMetrics();
  renderTabs();
  renderTab();
  resetScrollPosition();
}

function memberListTemplate() {
  const columns = ["會員帳號", "會員ID", "代理帳號", "會員層級", "幣別", "風險評分", "風險等級", "帳號狀態", "最後登入", "操作"];
  const values = activeFilters("member");
  const filteredRows = filterRows(columns.slice(0, -1), memberRows, values);
  const rows = filteredRows.map((row) => [...row, `<button class="secondary member-detail-btn" data-member="${row[0]}">詳情</button>`]);
  return `
    ${pageHeader("會員風險分析", "首頁 / 會員風險分析 / 會員列表", "先從會員列表篩選目標會員，點擊詳情後進入單一會員風險檢視。")}
    <section class="filter-bar generic-filter member-list-filter">
      <label><span>會員帳號</span><input id="memberListKeyword" placeholder="請輸入會員帳號" value="${escapeHtml(values["會員帳號"] || "")}" /></label>
      <label><span>代理帳號</span><select><option ${!values["代理帳號"] || values["代理帳號"] === "全部" ? "selected" : ""}>全部</option><option ${values["代理帳號"] === "CQ9" ? "selected" : ""}>CQ9</option><option ${values["代理帳號"] === "AG01" ? "selected" : ""}>AG01</option><option ${values["代理帳號"] === "BBIN" ? "selected" : ""}>BBIN</option></select></label>
      ${filterControl(["幣別", "select"], values)}
      ${filterControl(["風險等級", "select"], values)}
      <label><span>帳號狀態</span><select><option ${!values["帳號狀態"] || values["帳號狀態"] === "全部" ? "selected" : ""}>全部</option><option ${values["帳號狀態"] === "正常" ? "selected" : ""}>正常</option><option ${values["帳號狀態"] === "觀察中" ? "selected" : ""}>觀察中</option><option ${values["帳號狀態"] === "限額中" ? "selected" : ""}>限額中</option><option ${values["帳號狀態"] === "凍結" ? "selected" : ""}>凍結</option></select></label>
      <button class="primary" id="memberListSearch">查詢</button>
      <button class="secondary filter-reset" type="button">清除條件</button>
    </section>
    <section class="metric-grid dashboard-metrics">
      ${smallMetric("會員總數", String(filteredRows.length), "目前列表資料")}
      ${smallMetric("高風險會員", String(filteredRows.filter((row) => row[6] === "高風險").length), "需優先覆核", "up")}
      ${smallMetric("觀察 / 限額", String(filteredRows.filter((row) => row[7] === "觀察中" || row[7] === "限額中").length), "處置中")}
      ${smallMetric("已凍結", String(filteredRows.filter((row) => row[7] === "凍結").length), "敏感狀態", "up")}
    </section>
    <section class="content-card section-gap">
      <h2>會員列表</h2>
      ${memberListTable(columns, rows)}
      <div class="table-footer"><span>共 ${filteredRows.length} 筆</span><span>點擊詳情進入會員風險檢視</span></div>
    </section>
    ${specSection([
      ["頁面目的", "提供風控人員先篩選會員，再進入單一會員風險檢視，避免一進頁就鎖定固定會員。"],
      ["核心功能", "會員查詢、風險等級標示、帳號狀態檢視、詳情跳轉、返回列表。"],
      ["驗收標準", "點擊詳情可帶入會員帳號與摘要資料；詳情頁返回可回到會員列表。"],
    ])}
  `;
}

function memberListTable(columns, rows) {
  return `
    <div class="table-scroll">
      <table>
        <thead><tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              ${row.map((cell, index) => {
                const labelAttr = ` data-label="${escapeHtml(columns[index] || "")}"`;
                if (columns[index] === "風險等級") return `<td${labelAttr}>${riskBadge(cell)}</td>`;
                if (columns[index] === "帳號狀態") {
                  const cls = cell === "凍結" ? "danger" : cell === "正常" ? "success" : "warning";
                  return `<td${labelAttr}><span class="badge ${cls}">${cell}</span></td>`;
                }
                if (columns[index] === "風險評分") return `<td${labelAttr}><strong class="${Number(cell) >= 70 ? "red-text" : Number(cell) >= 40 ? "" : "green-text"}">${cell}</strong> / 100</td>`;
                return `<td${labelAttr}>${cell}</td>`;
              }).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function bindMemberListEvents() {
  bindSpecButtons();
  el("memberListSearch")?.addEventListener("click", () => {
    state.filters.member = readFilterValues(document.querySelector(".member-list-filter"));
    renderMemberPage();
    toast("會員查詢完成，統計與列表已更新");
  });
  document.querySelectorAll(".generic-action").forEach((button) => {
    button.addEventListener("click", () => handleGenericAction(button));
  });
  document.querySelectorAll(".filter-reset").forEach((button) => {
    button.addEventListener("click", resetCurrentFilters);
  });
  document.querySelectorAll(".member-detail-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.member = button.dataset.member;
      state.memberMode = "detail";
      state.activeTab = "overview";
      renderMemberDetail();
    });
  });
  document.querySelectorAll(".generic-info").forEach((button) => {
    button.addEventListener("click", () => toast("會員列表用於篩選風險會員，點擊詳情可進入單一會員風險檢視。"));
  });
}

function handleSearch(event) {
  event.preventDefault();
  const member = el("memberInput").value.trim();
  const start = el("startDate").value;
  const end = el("endDate").value;
  const error = validate(member, start, end);
  el("formError").textContent = error;
  if (error) return;

  el("searchBtn").textContent = "查詢中";
  el("searchBtn").disabled = true;
  document.querySelector(".content").classList.add("loading");
  setTimeout(() => {
    state.member = member;
    el("memberName").textContent = member;
    el("memberId").textContent = member === "test003" ? "M0001003" : `M${Math.floor(1000000 + Math.random() * 8999999)}`;
    el("summaryAgent").textContent = el("agent").value === "all" ? "全部" : el("agent").value;
    updateTime();
    renderMetrics();
    renderTab();
    document.querySelector(".content").classList.remove("loading");
    el("searchBtn").textContent = "查詢";
    el("searchBtn").disabled = false;
    toast("查詢完成");
  }, 520);
}

function validate(member, start, end) {
  if (!member) return "請輸入會員帳號";
  if (!/^[A-Za-z0-9_-]{3,50}$/.test(member)) return "會員帳號格式不正確";
  if (!start || !end) return "請選擇日期範圍";
  if (start > end) return "起始日期不可晚於結束日期";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (new Date(start) > today || new Date(end) > today) return "不可查詢未來日期";
  const days = (new Date(end) - new Date(start)) / 86400000;
  if (days > 90) return "日期範圍不可超過 90 天";
  return "";
}

function updateTime() {
  const now = new Date();
  el("lastUpdated").textContent = formatTimestamp(now);
}

function updateTimestamp() {
  return formatTimestamp(new Date());
}

function formatTimestamp(date) {
  const pad = (num) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function renderMetrics() {
  el("metricGrid").innerHTML = metrics
    .map((metric) => `
      <article class="metric-card member-metric-card">
        <div class="label">${memberMetricLabel(metric.label)}</div>
        <div class="value ${directionalClass(metric.value, metric.label)}">${memberMetricValue(metric.label, metric.value)}</div>
        ${
          metric.progress
            ? `<div class="progress" aria-label="風險評分"><span style="width:${metric.progress}%"></span></div>`
            : `<div class="compare">對比前一天 <span class="${metric.trend}">${metric.compare.replace("對比前一天 ", "")}</span></div>`
        }
      </article>
    `)
    .join("");
}

function renderTabs() {
  el("tabs").innerHTML = tabs.map(([key, label]) => `<button class="tab ${key === state.activeTab ? "active" : ""}" data-tab="${key}">${label}</button>`).join("");
  document.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      state.page = 1;
      renderTabs();
      renderTab();
    });
  });
}

function renderTab() {
  if (state.activeTab === "overview") {
    el("tabContent").innerHTML = overviewTemplate();
    bindActionButtons();
    drawChartsSoon();
    return;
  }

  if (state.activeTab === "limits") {
    renderMemberLimitTab();
    return;
  }

  const data = tableData[state.activeTab];
  const title = tabs.find(([key]) => key === state.activeTab)[1];
  const toolbar = data.toolbar ? `<div class="data-toolbar">${data.toolbar.map((name) => `<input placeholder="${name}" />`).join("")}</div>` : "";
  el("tabContent").innerHTML = `
    <section class="content-card">
      <h2>${title}</h2>
      ${toolbar}
      ${tableTemplate(data.columns, paginate(data.rows), state.activeTab)}
      ${pagerTemplate(data.rows.length)}
    </section>
  `;
  bindPager(data.rows.length);
}

function renderMemberLimitTab() {
  const currentColumns = ["限額類型", "目前限額", "今日已用", "剩餘額度", "使用率", "限額來源", "生效時間", "到期時間", "狀態", "操作"];
  const historyColumns = tableData.limits.columns;
  const currentRows = memberCurrentLimitRows(state.member);
  const historyRows = memberLimitHistoryRows(state.member);
  const activeCount = currentRows.filter((row) => row.includes("生效中")).length;
  el("tabContent").innerHTML = `
    <section class="metric-grid dashboard-metrics">
      ${smallMetric("會員目前限額", String(currentRows.length), "含 9 種限額類型")}
      ${smallMetric("生效中", String(activeCount), "目前有效", "good")}
      ${smallMetric("即將到期", String(historyRows.filter((row) => row[5] !== "永久").length), "需追蹤效期")}
      ${smallMetric("已失效", String(historyRows.filter((row) => row.includes("已失效")).length), "歷史紀錄")}
    </section>
    <section class="content-card section-gap">
      <div class="section-title-row">
        <div>
          <h2>會員目前限額</h2>
        </div>
        <button class="primary" id="memberLimitManageBtn">前往限額調整</button>
      </div>
      ${tableTemplate(currentColumns, currentRows, "member-limit-current-table")}
    </section>
    <section class="content-card section-gap">
      <h2>限額調整歷史</h2>
      ${tableTemplate(historyColumns, historyRows, "member-limit-history-table")}
    </section>
  `;
  el("memberLimitManageBtn")?.addEventListener("click", () => {
    state.currentView = "limitsSetting";
    state.selectedLimitMember = state.member;
    const memberRow = memberRows.find((row) => row[0] === state.member);
    state.selectedLimitLevel = memberLimitLevel(memberRow);
    activateNav("limitsSetting");
    renderView("limitsSetting");
    toast(`已帶入 ${state.member}，可進行限額調整`);
  });
  bindPager(currentRows.length);
}

function overviewTemplate() {
  return `
    <div class="overview-grid">
      <section class="content-card">
        <h2>風險指標分析</h2>
        ${riskIndicatorCards()}
      </section>
      <section class="content-card">
        <h2>近30天盈虧走勢</h2>
        <div class="chart-wrap"><canvas id="lineChart" height="260"></canvas></div>
      </section>
      <section class="content-card">
        <h2>風險事件類型分布（件數）</h2>
        <div class="donut-layout">
          <canvas id="donutChart" height="260"></canvas>
          ${donutLegend()}
        </div>
      </section>
    </div>
    <div class="lower-grid">
      <section class="content-card">
        <h2>風險事件紀錄</h2>
        ${tableTemplate(["案件ID", "事件時間", "事件類型", "事件描述", "風險等級", "案件狀態", "負責人", "操作"], currentMemberCaseRows(), "events-table")}
      </section>
      <aside class="action-card">
        <h2>操作</h2>
        ${riskGuidancePanel(riskHandlingGuidance.member)}
        <div class="stack">
          <button class="primary" data-action="limit">調整限額</button>
          <button class="warning-button" data-action="watch">加入觀察名單</button>
          <button class="danger-button" data-action="freeze">凍結帳號</button>
          <button class="secondary" data-action="noop">不做處置</button>
          <button class="muted-button" data-action="remark">備註</button>
        </div>
      </aside>
    </div>
  `;
}

function riskCalculationGuide() {
  return `
    <section class="content-card section-gap calculation-guide">
      <div class="section-title-row">
        <div>
          <h2>風險計算說明</h2>
          <p class="helper-text">以下說明每個風險數值怎麼來；輸贏採玩家視角，正數代表玩家贏錢，負數代表平台贏錢。</p>
        </div>
      </div>
      <div class="calculation-grid">
        ${riskCalculationDocs.map((item) => `
          <article class="calculation-card">
            <h3>${escapeHtml(item.title)}</h3>
            <dl>
              <div>
                <dt>公式</dt>
                <dd>${escapeHtml(item.formula)}</dd>
              </div>
              <div>
                <dt>資料來源</dt>
                <dd>${escapeHtml(item.source)}</dd>
              </div>
              <div>
                <dt>風險判讀</dt>
                <dd>${escapeHtml(item.interpretation)}</dd>
              </div>
              <div>
                <dt>注意事項</dt>
                <dd>${escapeHtml(item.note)}</dd>
              </div>
            </dl>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function openRiskCalculationModal() {
  document.querySelector(".modal")?.classList.add("wide-modal");
  el("modalTitle").textContent = "風險計算說明";
  el("modalBody").innerHTML = riskCalculationGuide();
  el("modalFooter").innerHTML = `<button class="primary" id="cancelAction">關閉</button>`;
  el("modalBackdrop").hidden = false;
  el("cancelAction").addEventListener("click", closeModal);
  applyLanguageToDom();
}

function riskIndicatorCards() {
  return `
    <div class="risk-indicator-list">
      ${riskRows.map(([name, value, compare, level]) => `
        <article class="risk-indicator-card">
          <div class="risk-indicator-main">
            <span>指標</span>
            <strong>${escapeHtml(name)}</strong>
          </div>
          <div>
            <span>數值</span>
            <strong class="${directionalClass(value, name) || "metric-neutral"}">${escapeAndFormatMoneyText(value)}</strong>
          </div>
          <div>
            <span>對比值</span>
            <strong class="${directionalClass(compare, name)}">${escapeAndFormatMoneyText(compare)}</strong>
          </div>
          <div>
            <span>風險等級</span>
            ${riskBadge(level)}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function tableTemplate(columns, rows, className = "") {
  if (!rows.length) return `<div class="empty">暫無資料</div>`;
  return `
    <div class="table-scroll">
      <table class="${className}">
        <thead><tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell, index) => formatCell(cell, index, columns, row, className)).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function groupTableTemplate(rows = pageTables.group.rows) {
  const columns = pageTables.group.columns;
  if (!rows.length) return `<div class="empty">暫無資料</div>`;
  return `
    <div class="table-scroll">
      <table>
        <thead><tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map((row) => {
            const groupId = row[0];
            return `
              <tr>
                <td data-label="${columns[0]}"><button class="link-button group-drill" data-group="${groupId}" data-kind="overview">${groupId}</button></td>
                <td data-label="${columns[1]}"><button class="link-button group-drill" data-group="${groupId}" data-kind="accounts">${row[1]} 個帳號</button></td>
                <td data-label="${columns[2]}"><button class="link-button group-drill" data-group="${groupId}" data-kind="ips">${row[2]} 組 IP</button></td>
                <td data-label="${columns[3]}"><button class="link-button group-drill" data-group="${groupId}" data-kind="devices">${row[3]} 台裝置</button></td>
                ${row.slice(4).map((cell, index) => formatCell(cell, index + 4, columns, row, "group")).join("")}
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function formatCell(cell, index, columns, row = [], source = "") {
  const text = String(cell);
  const labelAttr = ` data-label="${escapeHtml(columns[index] || "")}"`;
  if (columns[index] === "風險等級" || columns[index] === "風險標籤" || columns[index] === "等級") return `<td${labelAttr}>${riskBadge(text)}</td>`;
  if (columns[index] === "處理狀態" || columns[index] === "案件狀態" || columns[index] === "SLA" || columns[index] === "狀態" || columns[index] === "帳號狀態" || columns[index] === "雙因素驗證") {
    const cls = text.includes("逾期") || text.includes("凍結") ? "danger" : text.includes("待") || text.includes("未") || text.includes("停用") || text.includes("處理中") ? "warning" : "success";
    return `<td${labelAttr}><span class="badge ${cls}">${text}</span></td>`;
  }
  if (isMoneyText(text)) {
    return `<td${labelAttr} class="${directionalClass(text, columns[index])}">${formatMoneyText(text)}</td>`;
  }
  if (/^-?\d+\.\d{2}%$/.test(text)) {
    return `<td${labelAttr} class="${directionalClass(text, columns[index])}">${text}</td>`;
  }
  if (text === "查看詳情" || text === "標記處理" || text === "查看" || text === "處理") {
    const contextId = registerRowContext(columns, row, source);
    return `<td${labelAttr}><button class="secondary row-action" data-row-context="${contextId}">${text}</button></td>`;
  }
  return `<td${labelAttr}>${escapeAndFormatMoneyText(text)}</td>`;
}

function paginate(rows) {
  const start = (state.page - 1) * state.pageSize;
  return rows.slice(start, start + state.pageSize);
}

function pagerTemplate(total) {
  const pages = Math.ceil(total / state.pageSize);
  return `
    <div class="table-footer">
      <span>共 ${total} 筆，每頁 ${state.pageSize} 筆</span>
      <div class="page-buttons">
        <button data-page="prev">‹</button>
        ${Array.from({ length: pages }, (_, i) => `<button data-page="${i + 1}" ${state.page === i + 1 ? "class='active-page'" : ""}>${i + 1}</button>`).join("")}
        <button data-page="next">›</button>
      </div>
    </div>
  `;
}

function bindPager(total) {
  const pages = Math.ceil(total / state.pageSize);
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.page;
      if (target === "prev") state.page = Math.max(1, state.page - 1);
      else if (target === "next") state.page = Math.min(pages, state.page + 1);
      else state.page = Number(target);
      renderTab();
    });
  });
  document.querySelectorAll(".row-action").forEach((button) => {
    button.addEventListener("click", () => openDetailModal(button.textContent, rowContexts.get(button.dataset.rowContext)));
  });
}

function openDetailModal(actionText, context) {
  const canonicalAction = canonicalText(actionText);
  const rowData = rowObjectFromContext(context);
  const caseItem = findCaseByRow(rowData) || riskCases.find((item) => canonicalAction.includes(item.id) || canonicalAction.includes(item.member) || canonicalAction.includes(item.type));
  const isHandling = canonicalAction.includes("標記") || canonicalAction.includes("處理");
  const member = caseItem?.member || rowData["會員"] || rowData["會員帳號"] || state.member;
  const riskLevel = caseItem?.riskLevel || rowData["風險等級"] || rowData["風險標籤"] || rowData["等級"] || "中風險";
  const caseStatus = caseItem ? caseLifecycleLabel(caseItem) : "此資料尚未建案";
  const rowEntries = Object.entries(rowData).filter(([key]) => key !== "操作");
  const defaultAction = caseItem?.accountStatus === "凍結" || caseItem?.freezeScope ? "freeze" : "complete";
  el("modalTitle").textContent = isHandling ? "風險案件處理" : "資料詳情";
  el("modalBody").innerHTML = `
    ${riskGuidancePanel(caseItem ? caseGuidance(caseItem) : riskHandlingGuidance.member)}
    <div class="modal-grid">
      <label><span>案件ID</span><input value="${escapeHtml(caseItem?.id || rowData["案件ID"] || "未建案")}" readonly /></label>
      <label><span>會員帳號</span><input value="${escapeHtml(member)}" readonly /></label>
      <label><span>風險等級</span><input value="${escapeHtml(riskLevel)}" readonly /></label>
      <label><span>案件狀態</span><input value="${escapeHtml(caseStatus)}" readonly /></label>
    </div>
    ${rowEntries.length ? tableTemplate(["欄位", "內容"], rowEntries) : ""}
    ${isHandling ? caseActionButtonsTemplate(caseItem, "selectedCaseAction", defaultAction) : ""}
    <label><span>處理備註</span><textarea id="actionReason">${translateText(isHandling ? caseActionByKey(defaultAction, caseItem).note : "此筆資料目前僅供檢視。")}</textarea></label>
  `;
  el("modalFooter").innerHTML = `<button class="secondary" id="cancelAction">關閉</button><button class="primary" id="confirmAction">${isHandling ? "確認處理" : "確認"}</button>`;
  el("modalBackdrop").hidden = false;
  el("cancelAction").addEventListener("click", closeModal);
  bindCaseActionButtons(el("modalBody"), "selectedCaseAction", "actionReason");
  el("confirmAction").addEventListener("click", () => {
    const note = el("actionReason")?.value.trim();
    if (isHandling && !note) {
      toast("請填寫處理備註");
      return;
    }
    if (caseItem && isHandling) {
      const selectedAction = el("selectedCaseAction")?.value || "complete";
      const action = applyCaseAction(caseItem, selectedAction, note, member);
      closeModal();
      renderActiveView();
      toast(`${caseItem.id} 已執行${action?.label || "處理"}並寫入稽核紀錄`);
      return;
    }
    closeModal();
    toast(caseItem ? `已關閉 ${caseItem.id} 詳情` : "已關閉詳情");
  });
}

function openGroupDrillModal(groupId, kind) {
  const data = groupRelations[groupId];
  const titles = {
    overview: `${groupId} 關聯總覽`,
    accounts: `${groupId} 關聯帳號`,
    ips: `${groupId} 共同 IP`,
    devices: `${groupId} 共同裝置`,
  };
  const accountRows = data.accounts.map((account, index) => [
    account,
    `M${String(1001000 + index).padStart(7, "0")}`,
    ["高風險", "中風險", "高風險", "低風險"][index % 4],
    ["同 IP", "同裝置", "同局投注", "登入時段重疊"][index % 4],
  ]);
  const bodyMap = {
    overview: `
      <div class="summary-strip">
        <article><span>關聯帳號</span><strong>${data.accounts.length}</strong></article>
        <article><span>共同 IP</span><strong>${data.ips.length}</strong></article>
        <article><span>共同裝置</span><strong>${data.devices.length}</strong></article>
      </div>
      <label><span>關聯判定原因</span><textarea readonly>${data.reason}</textarea></label>
      ${tableTemplate(["帳號", "會員ID", "風險等級", "主要關聯"], accountRows.slice(0, 8))}
    `,
    accounts: tableTemplate(["帳號", "會員ID", "風險等級", "主要關聯"], accountRows),
    ips: tableTemplate(["共同IP", "關聯帳號"], data.ips),
    devices: tableTemplate(["共同裝置", "關聯帳號"], data.devices),
  };

  el("modalTitle").textContent = titles[kind] || titles.overview;
  el("modalBody").innerHTML = bodyMap[kind] || bodyMap.overview;
  el("modalFooter").innerHTML = `<button class="secondary" id="cancelAction">關閉</button><button class="primary" id="confirmAction">標記覆核</button>`;
  el("modalBackdrop").hidden = false;
  el("cancelAction").addEventListener("click", closeModal);
  el("confirmAction").addEventListener("click", () => {
    riskCases
      .filter((item) => item.groupId === groupId && activeCase(item))
      .forEach((item) => updateCaseStatus(item, "待主管覆核", "集團關聯已標記覆核"));
    closeModal();
    toast(`${groupId} 已標記覆核`);
  });
}

function donutLegend() {
  const total = riskEventTypes.reduce((sum, [, count]) => sum + count, 0);
  const rows = riskEventTypes
    .map(([type, count, ratio, color]) => `<tr><td><span class="legend-dot" style="background:${color}"></span>${type}</td><td>${count} 件</td><td>${ratio.toFixed(2)}%</td></tr>`)
    .join("");
  return `<table class="legend-table"><thead><tr><th>風險事件</th><th>件數</th><th>比例</th></tr></thead><tbody>${rows}<tr><td>總計</td><td>${total} 件</td><td>100.00%</td></tr></tbody></table>`;
}

function bindActionButtons() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => openActionModal(button.dataset.action));
  });
}

function openNotificationsModal() {
  el("modalTitle").textContent = "提醒事件";
  el("modalBody").innerHTML = `
    <div class="notification-list">
      ${notifications.map((item, index) => `
        <button class="notification-item" data-notification-index="${index}">
          <span class="badge ${item.level === "高風險" ? "danger" : "warning"}">${item.level}</span>
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeAndFormatMoneyText(item.body)}</p>
            <small>${item.time}</small>
          </div>
          <em>${escapeHtml(item.action)}</em>
        </button>
      `).join("")}
    </div>
  `;
  el("modalFooter").innerHTML = `<button class="secondary" id="cancelAction">關閉</button><button class="primary" id="markAllReadBtn">全部標記已讀</button>`;
  el("modalBackdrop").hidden = false;
  el("cancelAction").addEventListener("click", closeModal);
  el("markAllReadBtn").addEventListener("click", () => {
    el("notifyCount").textContent = "0";
    closeModal();
    toast("提醒事件已全部標記已讀");
  });
  document.querySelectorAll("[data-notification-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = notifications[Number(button.dataset.notificationIndex)];
      openNotificationDetail(item);
    });
  });
}

function openNotificationDetail(item) {
  const targetLabel = item.target?.label || item.action || "相關頁面";
  el("modalTitle").textContent = item.title;
  el("modalBody").innerHTML = `
    <div class="modal-grid">
      <label><span>風險等級</span><input value="${item.level}" readonly /></label>
      <label><span>提醒時間</span><input value="${item.time}" readonly /></label>
      <label><span>連結頁面</span><input value="${escapeHtml(targetLabel)}" readonly /></label>
      <label><span>建議動作</span><input value="${escapeHtml(item.action)}" readonly /></label>
    </div>
    <label><span>提醒內容</span><textarea readonly>${formatMoneyForTextarea(item.body)}</textarea></label>
    <label><span>處理備註</span><textarea id="actionReason">已查看提醒，後續依風控流程處理。</textarea></label>
  `;
  el("modalFooter").innerHTML = `<button class="secondary" id="backNotificationsBtn">返回提醒</button><button class="secondary" id="confirmAction">確認處理</button><button class="primary" id="goNotificationTargetBtn">前往${escapeHtml(targetLabel)}</button>`;
  el("backNotificationsBtn").addEventListener("click", openNotificationsModal);
  el("goNotificationTargetBtn").addEventListener("click", () => goToNotificationTarget(item));
  el("confirmAction").addEventListener("click", () => {
    closeModal();
    toast("提醒事件已確認處理");
  });
}

function openUserMenuModal() {
  el("modalTitle").textContent = "帳號資訊";
  el("modalBody").innerHTML = `
    <div class="summary-strip">
      <article><span>登入帳號</span><strong>admin</strong></article>
      <article><span>角色</span><strong>系統管理員</strong></article>
      <article><span>狀態</span><strong>正常</strong></article>
    </div>
    <label><span>可用功能</span><textarea readonly>查詢風險資料、處理提醒事件、調整限額、設定風控規則、產生報表、查閱主管以上紀錄。</textarea></label>
  `;
  el("modalFooter").innerHTML = `<button class="secondary" id="cancelAction">關閉</button><button class="primary" id="profileAction">查看操作日誌</button>`;
  el("modalBackdrop").hidden = false;
  el("cancelAction").addEventListener("click", closeModal);
  el("profileAction").addEventListener("click", () => {
    closeModal();
    toast("已切換到系統設定，可查看設定異動紀錄");
    document.querySelector('[data-view="settings"]')?.click();
  });
}

function openAdminAccountModal() {
  el("modalTitle").textContent = "新增管理帳號";
  el("modalBody").innerHTML = `
    <div class="modal-grid">
      <label><span>管理帳號</span><input id="newAdminAccount" value="risk02" autocomplete="off" /></label>
      <label><span>管理者姓名</span><input id="newAdminName" value="新風控專員" /></label>
      <label><span>Email</span><input id="newAdminEmail" value="risk02@example.com" /></label>
      <label><span>帳號歸屬</span><select id="newAdminOwner"><option selected>平台</option><option>代理</option></select></label>
      <label><span>所屬代理</span><select id="newAdminAgent"><option selected>全站</option><option>CQ9</option><option>AG01</option><option>BBIN</option></select></label>
      <label><span>角色</span><select id="newAdminRole"><option>代理風控監控員</option><option>代理風控主管</option><option>平台風控審核員</option><option selected>平台風控管理員</option><option>平台營運主管</option><option>系統管理員</option></select></label>
      <label><span>資料範圍</span><select id="newAdminScope"><option selected>全站風險事件 / 限額 / 集團</option><option>CQ9 代理線與其會員</option><option>AG01 代理線與其會員</option><option>BBIN 代理線與其會員</option></select></label>
      <label><span>成本歸屬</span><select id="newAdminCostOwner"><option selected>平台負擔</option><option>代理負擔</option><option>平台代管 / 代理分攤</option></select></label>
      <label><span>審核層級</span><select id="newAdminReviewRoute"><option selected>平台主管覆核</option><option>代理主管覆核</option><option>系統管理員覆核</option></select></label>
      <label><span>帳號狀態</span><select id="newAdminStatus"><option selected>啟用</option><option>停用</option></select></label>
    </div>
    <label><span>權限備註</span><textarea id="newAdminReason">新增風控人員帳號，需處理會員風險分析、投注行為分析與限額覆核。</textarea></label>
    <label class="check-row"><input id="newAdminMfa" type="checkbox" checked /> 啟用雙因素驗證</label>
    <label class="check-row"><input id="newAdminForcePassword" type="checkbox" checked /> 首次登入強制修改密碼</label>
    <label class="check-row"><input id="newAdminConfirm" type="checkbox" /> 我已確認此帳號會取得後台管理權限</label>
    <p class="form-error" id="newAdminError" role="alert"></p>
  `;
  el("modalFooter").innerHTML = `<button class="secondary" id="cancelAction">取消</button><button class="primary" id="confirmAction">建立帳號</button>`;
  el("modalBackdrop").hidden = false;
  el("cancelAction").addEventListener("click", closeModal);
  const syncAdminOwnershipDefaults = () => {
    const owner = el("newAdminOwner")?.value;
    const agentSelect = el("newAdminAgent");
    const roleSelect = el("newAdminRole");
    const scopeSelect = el("newAdminScope");
    const costSelect = el("newAdminCostOwner");
    const reviewSelect = el("newAdminReviewRoute");
    if (owner === "代理") {
      if (agentSelect?.value === "全站") agentSelect.value = "CQ9";
      if (roleSelect) roleSelect.value = "代理風控監控員";
      if (scopeSelect) scopeSelect.value = `${agentSelect.value} 代理線與其會員`;
      if (costSelect) costSelect.value = "代理負擔";
      if (reviewSelect) reviewSelect.value = "代理主管覆核";
      return;
    }
    if (agentSelect) agentSelect.value = "全站";
    if (roleSelect) roleSelect.value = "平台風控管理員";
    if (scopeSelect) scopeSelect.value = "全站風險事件 / 限額 / 集團";
    if (costSelect) costSelect.value = "平台負擔";
    if (reviewSelect) reviewSelect.value = "平台主管覆核";
  };
  el("newAdminOwner")?.addEventListener("change", syncAdminOwnershipDefaults);
  el("newAdminAgent")?.addEventListener("change", () => {
    if (el("newAdminOwner")?.value === "代理" && el("newAdminScope")) {
      el("newAdminScope").value = `${el("newAdminAgent").value} 代理線與其會員`;
    }
  });
  el("confirmAction").addEventListener("click", () => {
    const account = el("newAdminAccount").value.trim();
    const name = el("newAdminName").value.trim();
    const email = el("newAdminEmail").value.trim();
    const owner = el("newAdminOwner").value;
    const agent = el("newAdminAgent").value;
    const role = el("newAdminRole").value;
    const scope = el("newAdminScope").value;
    const costOwner = el("newAdminCostOwner").value;
    const reviewRoute = el("newAdminReviewRoute").value;
    const status = el("newAdminStatus").value;
    const reason = el("newAdminReason").value.trim();
    const mfa = el("newAdminMfa").checked;
    const confirmed = el("newAdminConfirm").checked;
    const errorEl = el("newAdminError");

    if (!/^[A-Za-z0-9_-]{3,32}$/.test(account)) {
      errorEl.textContent = "管理帳號需為 3-32 碼英文、數字、底線或連字號";
      return;
    }
    if (adminAccountTable.rows.some((row) => row[0] === account)) {
      errorEl.textContent = "管理帳號已存在，請更換帳號";
      return;
    }
    if (!name) {
      errorEl.textContent = "請輸入管理者姓名";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent = "請輸入有效 Email";
      return;
    }
    if (owner === "代理" && agent === "全站") {
      errorEl.textContent = "代理帳號必須指定所屬代理";
      return;
    }
    if (owner === "代理" && !role.startsWith("代理")) {
      errorEl.textContent = "代理帳號只能套用代理風控角色";
      return;
    }
    if (owner === "平台" && agent !== "全站" && !costOwner.includes("代理")) {
      errorEl.textContent = "平台帳號若綁定代理線，成本歸屬需選擇代管或代理分攤";
      return;
    }
    if (!reason) {
      errorEl.textContent = "請輸入新增帳號原因或權限備註";
      return;
    }
    if (!mfa) {
      errorEl.textContent = "管理帳號需啟用雙因素驗證";
      return;
    }
    if (!confirmed) {
      errorEl.textContent = "請確認此帳號會取得後台管理權限";
      return;
    }

    adminAccountTable.rows.unshift([account, name, owner, agent, role, scope, costOwner, status, "-", "已啟用", "查看"]);
    pageTables.settings.rows.unshift(["新增管理帳號", `${account}｜${owner}｜${agent}｜${reviewRoute}`, "管理者帳號權限", updateTimestamp(), "admin", "查看"]);
    closeModal();
    renderView("settings");
    toast(`管理帳號 ${account} 已建立，首次登入需修改密碼`);
  });
}

function openActionModal(action) {
  const templates = {
    limit: {
      title: "調整限額",
      body: `
        <div class="modal-grid">
          <label><span>限額類型</span><select id="limitTypeSelect"><option>單日投注額上限</option><option>單日淨輸上限</option><option>單日入金上限</option><option>單日提款上限</option><option>單注投注上限</option><option>單局 / 單場上限</option><option>單玩法上限</option><option>單日最大派彩上限</option><option>群組單日曝險上限</option></select></label>
          <label><span>遊戲類型</span><select><option>百家樂</option><option>全部</option></select></label>
          <label><span>原限額</span><input value="${displayMoney(100000)}" readonly /></label>
          <label><span>新限額（${currentCurrency()}）</span><input type="number" value="${currencyInputValue(50000)}" min="0" step="${currencyInputStep()}" /></label>
          <label><span>生效時間</span><input type="datetime-local" value="2025-04-03T15:30" /></label>
          <label><span>到期時間</span><input type="datetime-local" value="2025-04-10T23:59" /></label>
        </div>
        <label><span>調整原因</span><textarea id="actionReason">高風險投注比例過高，暫時降低單注投注上限。</textarea></label>
      `,
      confirm: "限額調整成功",
    },
    watch: {
      title: "加入觀察名單",
      body: `
        <p>是否將會員 ${state.member} 加入觀察名單？</p>
        <label><span>觀察原因</span><textarea id="actionReason">高風險玩法投注比例異常，需持續觀察。</textarea></label>
        <label><span>觀察期限</span><input type="datetime-local" value="2025-04-10T23:59" /></label>
      `,
      confirm: "已加入觀察名單",
      after: () => {
        state.watchlisted = true;
        state.accountStatus = "觀察中";
        updateMemberStatus(state.member, "觀察中");
        el("accountStatus").textContent = "觀察中";
      },
    },
    freeze: {
      title: "凍結帳號",
      body: `
        <p>凍結後會員將無法登入或進行交易，是否確定凍結會員 ${state.member}？</p>
        <label><span>凍結範圍</span><select><option>全部凍結</option><option>禁止登入</option><option>禁止投注</option><option>禁止出金</option></select></label>
        <label><span>凍結期限</span><input type="datetime-local" /></label>
        <label><span>凍結原因</span><textarea id="actionReason">命中高風險投注與異常連勝規則，需暫停帳號等待覆核。</textarea></label>
        <label class="check-row"><input id="freezeConfirm" type="checkbox" /> 我已確認此操作會影響會員登入與交易</label>
      `,
      confirm: "帳號凍結成功",
      after: () => {
        state.accountStatus = "凍結";
        updateMemberStatus(state.member, "凍結");
        el("accountStatus").textContent = "凍結";
        el("accountStatus").className = "badge danger";
      },
      requireCheck: true,
    },
    noop: {
      title: "不做處置",
      body: `
        <p>確認本次僅保留人工判斷紀錄，不調整限額、不加入觀察名單，也不凍結會員 ${state.member}？</p>
        <label><span>不做處置原因</span><textarea id="actionReason">已核對目前證據，判定本次屬合理波動或既有規則已涵蓋，暫不做額外處置。</textarea></label>
      `,
      confirm: "已記錄不做處置",
    },
    remark: {
      title: "新增備註",
      body: `
        <label><span>備註類型</span><select><option>風控</option><option>一般</option><option>處置</option><option>審核</option></select></label>
        <label><span>備註內容</span><textarea id="actionReason">需追蹤近 7 日 Tie / Pair 投注比例與登入 IP。</textarea></label>
        <label class="check-row"><input type="checkbox" checked /> 標記重要</label>
      `,
      confirm: "備註新增成功",
    },
  };

  const modal = templates[action];
  el("modalTitle").textContent = modal.title;
  el("modalBody").innerHTML = `${riskGuidancePanel(actionGuidance[action] || riskHandlingGuidance.member)}${modal.body}`;
  el("modalFooter").innerHTML = `<button class="secondary" id="cancelAction">取消</button><button class="primary" id="confirmAction">確認送出</button>`;
  el("modalBackdrop").hidden = false;
  el("cancelAction").addEventListener("click", closeModal);
  el("confirmAction").addEventListener("click", () => {
    const reason = el("actionReason");
    if (reason && !reason.value.trim()) {
      toast("請填寫操作原因");
      return;
    }
    if (modal.requireCheck && !el("freezeConfirm").checked) {
      toast("請先勾選二次確認");
      return;
    }
    let caseItem = riskCases.find((item) => item.member === state.member && activeCase(item));
    if (!caseItem) caseItem = createManualCase(action, reason.value.trim());
    if (action === "limit") {
      pageTables.limitsPage.rows.unshift([state.member, el("limitTypeSelect")?.value || "單注投注上限", currencyInputValue(50000), updateTimestamp(), "2025-04-10 23:59:59", reason.value.trim(), "admin", "生效中", "查看"]);
      updateMemberStatus(state.member, "限額中");
      if (el("accountStatus")) {
        el("accountStatus").textContent = "限額中";
        el("accountStatus").className = "badge warning";
      }
      if (caseItem) updateCaseStatus(caseItem, "處理中", reason.value.trim());
    }
    if (action === "watch" && caseItem) updateCaseStatus(caseItem, "處理中", reason.value.trim());
    if (action === "freeze" && caseItem) updateCaseStatus(caseItem, "待主管覆核", reason.value.trim());
    if (action === "noop" && caseItem) {
      updateCaseStatus(caseItem, "已完成", reason.value.trim());
      appendAuditLog("不做處置", `${caseItem.id}｜${reason.value.trim()}`, "會員風險檢視", "admin");
    }
    if (action === "remark" && caseItem) appendAuditLog("案件備註", `${caseItem.id}｜${reason.value.trim()}`, "會員風險檢視", "admin");
    if (modal.after) modal.after();
    closeModal();
    toast(modal.confirm);
  });
}

function closeModal() {
  el("modalBackdrop").hidden = true;
  document.querySelector(".modal")?.classList.remove("wide-modal");
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = translateText(message);
  el("toastStack").appendChild(node);
  setTimeout(() => node.remove(), 3200);
}

function drawChartsSoon() {
  requestAnimationFrame(() => {
    if (state.currentView === "dashboard") drawRiskEventChart();
    else drawLineChart();
    drawDonutChart();
  });
}

function setupCanvas(canvas) {
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  return { ctx, width: rect.width, height: rect.height };
}

function cssVar(name, fallback) {
  return getComputedStyle(document.body).getPropertyValue(name).trim() || fallback;
}

function chartPalette() {
  return {
    grid: cssVar("--chart-grid", "#e4ebf2"),
    label: cssVar("--chart-label", "#5b6878"),
    title: cssVar("--chart-title", "#2f3f50"),
    blue: cssVar("--primary", "#126bd8"),
    blueFill: cssVar("--chart-blue-fill", "rgba(35, 120, 220, 0.16)"),
    red: cssVar("--danger", "#f2282e"),
    redFill: cssVar("--chart-red-fill", "rgba(242, 40, 46, 0.13)"),
    donutHole: cssVar("--donut-hole", "#ffffff"),
  };
}

function drawLineChart() {
  const ready = setupCanvas(el("lineChart"));
  if (!ready) return;
  const { ctx, width, height } = ready;
  const palette = chartPalette();
  const min = -150000;
  const max = 150000;
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = palette.grid;
  ctx.fillStyle = palette.label;
  ctx.font = "12px sans-serif";
  const axisValues = Array.from({ length: 7 }, (_, index) => max - ((max - min) / 6) * index);
  const axisLabels = axisValues.map((value) => compactDisplayMoney(value));
  const axisLabelWidth = Math.max(...axisLabels.map((label) => ctx.measureText(label).width));
  const pad = { left: Math.min(132, Math.max(62, axisLabelWidth + 16)), right: 20, top: 24, bottom: 36 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  for (let i = 0; i <= 6; i++) {
    const y = pad.top + (plotH / 6) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.textAlign = "right";
    ctx.fillText(axisLabels[i], pad.left - 8, y + 4);
  }
  ctx.textAlign = "left";
  const points = profitSeries.map((value, index) => {
    const x = pad.left + (plotW / (profitSeries.length - 1)) * index;
    const y = pad.top + ((max - value) / (max - min)) * plotH;
    return [x, y];
  });
  const zeroY = pad.top + ((max - 0) / (max - min)) * plotH;
  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.lineTo(points[points.length - 1][0], zeroY);
  ctx.lineTo(points[0][0], zeroY);
  ctx.closePath();
  ctx.fillStyle = palette.blueFill;
  ctx.fill();
  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.strokeStyle = palette.blue;
  ctx.lineWidth = 2;
  ctx.stroke();
  points.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = palette.blue;
    ctx.fill();
  });
  ["03-05", "03-10", "03-15", "03-20", "03-25", "03-30", "04-03"].forEach((label, index) => {
    const x = pad.left + (plotW / 6) * index;
    ctx.fillStyle = palette.label;
    ctx.fillText(label, x - 16, height - 10);
  });
  ctx.fillStyle = palette.blue;
  ctx.fillRect(width / 2 - 56, 8, 18, 3);
  ctx.fillStyle = palette.title;
  ctx.fillText(translateText(`玩家輸贏金額（${currentCurrency()}）`), width / 2 - 30, 13);
}

function drawRiskEventChart() {
  const ready = setupCanvas(el("lineChart"));
  if (!ready) return;
  const { ctx, width, height } = ready;
  const palette = chartPalette();
  const pad = { left: 46, right: 20, top: 24, bottom: 36 };
  const min = 0;
  const max = 100;
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = palette.grid;
  ctx.fillStyle = palette.label;
  ctx.font = "12px sans-serif";
  for (let i = 0; i <= 5; i++) {
    const y = pad.top + (plotH / 5) * i;
    const value = max - ((max - min) / 5) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(String(value), 16, y + 4);
  }
  const points = riskEventSeries.map((value, index) => {
    const x = pad.left + (plotW / (riskEventSeries.length - 1)) * index;
    const y = pad.top + ((max - value) / (max - min)) * plotH;
    return [x, y];
  });
  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.lineTo(points[points.length - 1][0], height - pad.bottom);
  ctx.lineTo(points[0][0], height - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = palette.redFill;
  ctx.fill();
  ctx.beginPath();
  points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.strokeStyle = palette.red;
  ctx.lineWidth = 2;
  ctx.stroke();
  points.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = palette.red;
    ctx.fill();
  });
  ["03-05", "03-10", "03-15", "03-20", "03-25", "03-30", "04-03"].forEach((label, index) => {
    const x = pad.left + (plotW / 6) * index;
    ctx.fillStyle = palette.label;
    ctx.fillText(label, x - 16, height - 10);
  });
  ctx.fillStyle = palette.red;
  ctx.fillRect(width / 2 - 56, 8, 18, 3);
  ctx.fillStyle = palette.title;
  ctx.fillText(translateText("風險事件數"), width / 2 - 30, 13);
}

function drawDonutChart() {
  const ready = setupCanvas(el("donutChart"));
  if (!ready) return;
  const { ctx, width, height } = ready;
  const palette = chartPalette();
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.36;
  let start = -Math.PI / 2;
  ctx.clearRect(0, 0, width, height);
  riskEventTypes.forEach(([, , ratio, color]) => {
    const angle = Math.PI * 2 * (ratio / 100);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    start += angle;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = palette.donutHole;
  ctx.fill();
}

window.addEventListener("resize", drawChartsSoon);
init();
