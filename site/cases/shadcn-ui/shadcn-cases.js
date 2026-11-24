const groups = [
  {
    title: "内容工具",
    cases: [
      ["attachment", "Attachment · 浏览附件及上传状态", "使用 shadcn/ui 官方附件组件浏览图片、上传中的 PDF 和代码附件。窄屏可横向滚动图片组。", "使用官网顶部预览的组件、示例数据和样式。取消和移除按钮是禁用的静态示意。"],
      ["message-scroller", "Message Scroller · 流式回复与滚动跟随", "发送预设问题开始流式回复。发送下一条后向上翻阅，再用向下箭头回到末尾。", "发出新问题后锚定本轮对话，流式回复只在末尾时自动跟随，滚离末尾后保持阅读位置。", "https://ui.shadcn.com/docs/components/base/message-scroller#following-the-live-edge"],
      ["code-block", "Code Block · 换行、下载和复制终端输出", "终端输出默认换行。用标题栏按钮切换换行、下载日志或复制原始输出。", "换行只影响展示，下载与复制均保留原始文本和换行。复制成功后短暂显示确认图标。", "https://ui.shadcn.com/docs/components/base/code-block#actions"],
      ["trace", "Trace · 展开执行记录并重播", "展开思考、命令输出、失败原因或来源，再点重播查看完整过程。", "重播时依次呈现思考、执行、失败、来源和回答。完成后各条记录可独立展开，重播入口重新出现。"],
    ],
  },
  {
    title: "数据与筛选",
    cases: [
      ["data-table", "Data Table · 付款表格示例", "用电子邮件筛选付款记录，再试试排序、选择行和切换可见列。行菜单可以复制付款 ID。", "使用官网的五条示例付款。筛选、排序、列显隐和选中状态独立更新，底部分页按数据量禁用。"],
      ["chart", "Chart · 交互式访问量柱状图", "切换桌面端和移动端的访问量，悬停或用左右方向键查看某天的数据。", "切换设备时仅展示所选系列，保留官方示例的日期、总量和每日访问量。", "https://ui.shadcn.com/view/new-york-v4/chart-bar-interactive"],
    ],
  },
  {
    title: "输入与选择",
    cases: [
      ["combobox", "Combobox · 搜索和多选", "初始已选中 Next.js。输入框架名称筛选，回车选中高亮项，也可以点击已选项旁的叉号移除。", "多选项显示在输入框内。筛选时自动高亮第一个匹配项，选中后新增对应标签。", "https://ui.shadcn.com/docs/components/base/combobox#multiple"],
      ["date-picker", "Date Picker · 跨月日期范围", "点击已选日期范围打开并排日历，再点日期调整区间。用上一月或下一月继续浏览。", "初始区间为当年 1 月 20 日至 2 月 9 日，两个连续月份中同步高亮范围，触发按钮显示选区。", "https://ui.shadcn.com/docs/components/base/date-picker#range-picker"],
      ["input-otp", "Input OTP · 带分隔符的六位输入", "在六格内输入或粘贴验证码，可以用方向键和退格修正。", "三组各两位共用一个原生输入，分隔符用于视觉分组，保留标准文本选区、复制和粘贴。", "https://ui.shadcn.com/docs/components/base/input-otp#separator"],
    ],
  },
  {
    title: "命令与流程",
    cases: [
      ["command", "Command · 搜索与定位命令", "搜索 Calendar 或 Billing，再用方向键浏览匹配项。Calculator 是禁用示例。", "保留建议与设置分组、禁用项、快捷键提示及无结果状态；输入焦点保持在搜索框。"],
      ["questionnaire", "Questionnaire · 多步骤问卷", "选择或输入功能方向，填写或跳过进度信息，再选择开工时间并保存计划。", "保留三个原始步骤的单选、自定义输入、多选、跳过、回退、字母快捷键与保存反馈。"],
      ["context-menu", "Context Menu · 右键菜单与子菜单", "在示例区右键或长按，展开 More Tools，再试试勾选 Show Full URLs。", "保留原始菜单项、禁用前进、子菜单和勾选状态；悬停或方向键可浏览子菜单。"],
    ],
  },
  {
    title: "空间与布局",
    cases: [
      ["resizable", "Resizable · 调整嵌套分栏", "拖动面板之间的分隔柄，或聚焦后按方向键。左侧调整宽度，右侧上下两块调整高度。", "左右初始各占一半，右侧上下初始为 25% 和 75%。每个分隔柄独立响应拖动和对应轴的方向键。", "https://ui.shadcn.com/docs/components/base/resizable"],
    ],
  },
];

export const shadcnCategories = groups.map(({ title, cases }) => ({
  title,
  items: cases.map(([id, name, tip, criterion, reference]) => ({
    id,
    title: name,
    tip,
    criterion,
    scene: title,
    outline: [
      {
        "data-table": "行选择计数根据当前电子邮件筛选结果计算。",
        combobox: "搜索词可以随时替换，已选项作为独立状态保留。",
        "date-picker": "跨月时持续显示起点，避免用户在另一页重新确认选择。",
        resizable: "嵌套分隔线分别沿水平和垂直方向调整布局。",
        command: "输入框保留焦点，活动选项通过 aria-activedescendant 与键盘高亮同步。",
        "input-otp": "把验证码作为一个输入值处理，可以复用浏览器原生粘贴和编辑行为。",
        questionnaire: "返回上一步保留答案，能降低用户核对或修改的成本。",
      }[id],
    ].filter(Boolean),
    kind: "interactive",
    demo: "shadcn",
    variant: id,
    reference: reference ?? `https://ui.shadcn.com/docs/components/base/${id}`,
  })),
}));
