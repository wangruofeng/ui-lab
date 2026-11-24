import { transitionsCatalog } from "./transitions-catalog.js";

const officialPageSlugs = {
  "drag-drop-physics": "drag-drop-with-physics",
  "spinner-check-morph": "spinner-to-check-morph",
  "smoky-dissolve": "delete-with-smoky-dissolve",
  "image-gen-placeholder": "image-generation-placeholder",
};

const groups = [
  {
    title: "表单反馈",
    cases: [
      ["error-state-shake", "错误出现时轻晃输入框", "点击「播放」，观察输入框依次向右、向左轻晃，然后回到原位。", "每次触发都显示模拟错误并重播四段轻晃。错误提示停留约三秒后恢复。"],
      ["input-clear-with-dissolve", "清空时让文字逐词淡出", "点击搜索框内的清空按钮，观察原文字向下淡出，占位文字从上方进入，再用「重置文字」重播。", "清空立即更新真实输入值，原文字与占位文字同时向下移动，重置可恢复预置内容。"],
      ["checkbox-check", "勾选时画出对勾", "勾选「通知我」，观察对勾从起点描出。", "使用原生复选框，勾选时描画对勾，取消勾选后恢复空白。"],
      ["toggle", "让开关滑块轻微回弹", "切换开关，观察轨道立即变色，滑块越过终点后轻轻回位。", "开关状态立即更新，滑块用 350ms 完成移动和回弹。"],
    ],
  },
  {
    title: "内容状态",
    cases: [
      ["card-resize", "让卡片平滑改变尺寸", "点击「播放」，在宽卡片和窄卡片之间切换。", "同一卡片的宽度和高度同步过渡，卡片内容保持一致。"],
      ["skeleton-loader-and-reveal", "骨架屏平滑交接到内容", "点击「播放」，观察骨架先脉冲一次，再与用户信息交叉淡化。", "占位与用户信息固定在同一位置。脉冲结束后，透明度和模糊交叉变化。"],
      ["reasoning-stream", "让连续输出自动跟随最新内容", "播放推理记录，观察内容每次向上移动约两行。暂停后再播放，检查是否从当前位置继续。", "保留两行的步进距离和停顿，播放循环无明显接缝，暂停后可续播。"],
      ["streaming-text", "让流式文字逐段清晰出现", "点击「播放」，观察段落从透明开始逐词清晰。", "文字以短间隔逐词淡入和消除模糊，过程中保留段落占位。"],
      ["drag-and-drop", "让放置区接住拖来的图片", "拖动示例图片放到目标区域，或聚焦图片后按 Enter。落位后等待图片自动回到原位。", "拖动时图片跟随指针，悬停目标时出现接收反馈，落位后放置区展开图像，随后恢复。", "drag-drop-physics"],
    ],
  },
  {
    title: "操作回应",
    cases: [
      ["like-button", "点赞时从按钮迸出粒子", "点一下赞，观察爱心填充、回弹及周围粒子；再点可取消。", "只有点赞时播放心形回弹和粒子，按钮按下状态立即更新。"],
      ["banner-stacking", "让多条通知有序堆叠", "连续添加通知，观察新通知从下方进入并把最旧一条挤出。悬停通知堆栈可展开。", "初始显示三层通知，新通知置顶，后两层缩小并后移，堆栈悬停或聚焦时平铺。"],
      ["notification-badge", "让新通知角标在固定位置弹入", "点击「播放」，观察角标斜向弹入。再次触发可以收起角标。", "角标沿对角线进入，同时独立缩放回弹。关闭时在锚点收缩并淡出。"],
      ["icon-swap", "用缩放和模糊交接状态图标", "点击「播放」，在菜单图标和关闭图标之间交替。", "在同一位置交叉缩放、淡入和模糊，快速切换仍显示最后一次的状态。"],
      ["spinner-to-check", "让处理中平滑过渡为完成", "点击「播放」，观察进行中的任务标记弹成对勾，稍后恢复旋转。", "旋转与描线对勾位于同一区域，完成态停留约两秒后回到处理中。", "spinner-check-morph"],
      ["delete-dissolve", "删除图片后让碎片消散", "删除图片，观察碎片坠落并扩散。动画结束后图片会自动出现。", "用局部碎片展示扩散和模糊，消散后自动补回图片，方便重播。", "smoky-dissolve"],
      ["learn-more-hover", "悬停时让箭头向外展开", "悬停在「了解更多」上，观察箭头右移、两臂张开，再移开指针看它复位。", "箭头整体右移 2px，上下两臂绕尖端各转动 8°。进入与复位均耗时 350ms，文字位置保持稳定。"],
    ],
  },
];

export const transitionsCategories = [...groups, ...transitionsCatalog.map(({ title, cases }) => ({
  title,
  cases: cases.map(([id, original, label, tip, criterion]) => [
    id, `${original} · ${label}`, tip, criterion,
  ]),
}))].map(({ title, cases }) => ({
  title,
  items: cases.map(([id, name, tip, criterion, officialId = id]) => ({
    id,
    title: name,
    tip,
    criterion,
    scene: title,
    outline: [],
    kind: "interactive",
    demo: "transitions",
    variant: id,
    officialId,
    reference: `https://transitions.dev/detail.html?t=${officialPageSlugs[officialId] ?? officialId}`,
  })),
}));
