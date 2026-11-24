const reference = "https://aiforui.dev/skills/break-ui";

const catalog = "https://github.com/emilkowalski/skills/blob/main/skills/break-ui/CATALOG.md";

function edgeCase(id, title, tip, section, criterion) {
  return {
    id,
    variant: id,
    kind: "interactive",
    demo: "break-ui",
    title,
    tip,
    reference: catalog + "#" + section,
    outline: [],
    criterion,
  };
}

export const breakUiCollection = {
  id: "break-ui",
  artwork: { kind: "logo", src: "./assets/source-art/break-ui.png" },
  type: "参考项目",
  title: "Break UI",
  author: "Emil Kowalski",
  description: "切换极端数据，对照成员资料、列表、日期、进度、内容密度和请求反馈的修复效果。",
  url: reference,
  categories: [{
    title: "极端数据测试",
    items: [{
      id: "team-member-row",
      kind: "interactive",
      demo: "break-ui",
      title: "用极端数据测试团队成员行",
      tip: "切换到极端数据，观察同一条成员记录在修复前后的布局和文案。",
      reference,
      outline: [
        "给文字列设置 min-width: 0，允许长邮箱在必要时换行。",
        "固定头像和角色徽章的尺寸，让它们在文字换行后保持顶部对齐。",
        "根据项目数量选择英文单复数，并为大数值设置千位分隔。",
      ],
      criterion: "用同一个数据入口切换普通和极端数据。至少覆盖长姓名、无空格邮箱和项目数为 1 的情况。在窄屏验证邮箱完整可读，头像和徽章保持尺寸，英文数量显示为 1 project。单独检查缺失字段、空列表和大数值。",
    }],
  }, {
    title: "人员资料",
    items: [
      edgeCase(
        "missing-member-fields", "成员资料缺失时保留身份线索",
        "切换到姓名和头像缺失的记录，观察邮箱如何成为主要身份线索。",
        "people-and-names",
        "用真实缺失值和空白字符串测试姓名、头像与角色。没有姓名时以邮箱辨认成员，提供可识别的头像占位，并省略空徽章。",
      ),
      edgeCase(
        "multilingual-names", "正确显示多语言姓名和 Emoji 头像",
        "切换到 Emoji 和阿拉伯文姓名，比较头像取字和姓名标点的显示。",
        "people-and-names",
        "用包含肤色修饰和零宽连接符的 Emoji 测试头像取字，检查完整字素。对阿拉伯文姓名启用自动文字方向，核对括号等标点的呈现。",
      ),
    ],
  }, {
    title: "数量与列表",
    items: [
      edgeCase(
        "project-counts", "格式化零、单个和大量项目",
        "调整后，1 projects 改为 1 project，1284 projects 加上千位分隔变为 1,284 projects。0 projects 在两侧相同。点击「极端数据」可切回普通数据。",
        "numbers-and-money",
        "使用目标语言的复数规则与数字格式化器，验证 0 projects、1 project 和 1,284 projects，检查数值在窄屏仍清楚可读。",
      ),
      edgeCase(
        "empty-member-list", "成员列表为空时显示明确状态",
        "将成员数据切为空数组，比较一片空白和明确的空状态提示。",
        "collections",
        "通过同一个数据入口测试空数组和非空列表。空列表时保留列表区域并显示明确提示，有数据时恢复成员行。",
      ),
      edgeCase(
        "pagination-boundary", "分页恰好满页时避免空白末页",
        "极端数据恰好填满每页 3 条。试点左侧「下一页」，再切回 4 条普通数据，确认两侧都能翻页。",
        "collections",
        "每页 3 条时验证总量为 3 和 4 的情况。总量恰好满页时禁用下一页，多出一条时第二页显示该记录，并可返回第一页。",
      ),
    ],
  }, {
    title: "日期与进度",
    items: [
      edgeCase(
        "date-time-zone", "跨年时按发布时区显示日期",
        "同一发布时间在洛杉矶仍是 12 月 31 日，在台北已是 1 月 1 日。调整后以发布计划采用的台北时区显示日期。",
        "time",
        "固定同一带时区的时间戳，按任务指定的时区格式化日期。验证洛杉矶与台北在跨年时显示不同日历日期，并明确标注时区。",
      ),
      edgeCase(
        "out-of-range-progress", "让异常进度值留在轨道内",
        "比较收到 142% 和 −3% 时的进度条。调整后按 100% 和 0% 显示。",
        "numbers-and-money",
        "让进度标签、视觉填充和辅助技术读取的值使用同一个 0 至 100 的范围。验证 142、−3 和正常的 68 三种输入。",
      ),
    ],
  }, {
    title: "文件与标签",
    items: [
      edgeCase(
        "long-file-name", "截断长文件名时保留扩展名",
        "左侧末尾截断会藏起 .pdf。右侧保留扩展名，点击「查看完整文件名」可在原位展开。",
        "emails-urls-identifiers",
        "用长文件名验证窄容器中的截断方式。保留扩展名，并提供触屏和键盘都能使用的完整名称入口。",
      ),
      edgeCase(
        "tag-overflow", "折叠过多标签并保留完整内容",
        "比较 12 个标签全部铺开和只显示前三个的版面。在右侧点开其余标签，查看完整列表。",
        "labels-titles-and-copy-from-data",
        "用多标签和超长单标签测试卡片。默认限制可见标签数，展开入口显示实际隐藏数量，展开后长标签可换行。",
      ),
    ],
  }, {
    title: "请求反馈",
    items: [
      edgeCase(
        "request-retry", "请求失败后提供就地重试",
        "两侧模拟同一个请求失败状态。右侧点击「重试」可恢复项目列表，左侧保留失败记录供对照。",
        "states",
        "模拟列表请求失败，显示用户能理解的说明和就地重试入口。重试成功后恢复列表并将键盘焦点移到结果。",
      ),
    ],
  }],
};
