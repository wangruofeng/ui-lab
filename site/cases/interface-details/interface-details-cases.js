const source = "https://jakub.kr/writing/details-that-make-interfaces-feel-better";

function example(id, title, tip, anchor, criterion) {
  return {
    id,
    title,
    tip,
    reference: `${source}#${anchor}`,
    criterion,
    outline: [],
    kind: "interactive",
    demo: "interface-details",
    variant: id,
  };
}

export const interfaceDetailsCollection = {
  id: "make-interfaces-feel-better",
  artwork: { kind: "logo", src: "./assets/source-art/interface-details.png" },
  type: "参考项目",
  title: "Details that make interfaces feel better",
  author: "Jakub Krehel",
  description: "对照文字换行、按钮留白、嵌套圆角、入场动效、状态图标和描边阴影。",
  url: source,
  categories: [
    {
      title: "排版与对齐",
      items: [
        example(
          "responsive-text-wrap", "同步调宽，比较标题和正文的换行",
          "拖动宽度滑块，对照标题行宽和正文末行的孤词。",
          "text-wrapping",
          "给两侧同一组内容和宽度。比较默认换行与标题 balance、正文 pretty 的结果，核对窄容器里没有水平溢出。",
        ),
        example(
          "optical-button-padding", "按视觉重心调整图文按钮留白",
          "右侧将图标一侧的 6 px 留白移到另一侧，补偿播放图标的视觉重心。关闭留白标记再比较。",
          "align-optically-not-geometrically",
          "保持同一按钮宽度、图标大小和文字。比较等距留白与光学补偿，检查图文组的视觉重心、触控区域和键盘焦点。",
        ),
        example(
          "concentric-radius", "拖动内边距，比较嵌套圆角是否同心",
          "两侧内层都为 12 px。拖动内边距，观察固定为 20 px 的外圆角与随内边距变化的外圆角。",
          "concentric-border-radius",
          "两侧使用相同的内圆角和内边距。固定组在 8 px 内边距时与公式组一致，改变内边距后，公式组应维持外圆角等于内圆角加内边距。",
        ),
      ],
    },
    {
      title: "动效与层次",
      items: [
        example(
          "staggered-entrance", "比较整体、分组和逐词入场",
          "切换三种入场方式并重播。逐词模式只拆标题，正文仍作为一组。",
          "split-and-stagger-entering-elements",
          "用同一组内容比较整体入场、分组错峰及标题逐词入场。重播时取消上一次效果，开启减少动态效果时直接展示内容。",
        ),
        example(
          "interruptible-motion", "动画中途反向时，从当前位置继续",
          "快速连按「打开面板」，在面板还在移动时改变方向。左侧会跳到预设起点，右侧从当下的位置反向。",
          "make-your-animations-interruptible",
          "用同一个开关控制两个面板。分别对比固定起点的关键帧与可重新设定目标的 CSS 过渡，检查快速反向和减少动态效果时的最终状态。",
        ),
        example(
          "subtle-drawer-exit", "比较抽屉完整滑出和短距离淡出",
          "关闭抽屉，比较左侧完整滑出和右侧短距离淡出。重新打开时，两侧入场方式相同。",
          "make-exit-animations-subtle",
          "保持抽屉内容、入场路径和动效时长一致。比较完整滑出与缩短离场位移并淡出的观感，检查快速开关后的最终状态。",
        ),
        example(
          "contextual-copy-icon", "比较复制确认图标的三种切换方式",
          "点击「复制示例文本」，同时比较图标瞬切、仅淡入淡出、淡入淡出加缩放和模糊。确认图标稍后会切回。",
          "animate-icons-contextually",
          "复制成功后才显示确认。两种动画使用相同时长，图标切换不改变容器尺寸。开启减少动态效果时直接切换，并保留文字反馈。",
        ),
        example(
          "shadow-on-backgrounds", "在不同背景上比较描边和阴影",
          "切换浅色、深色与照片背景，在同一背景上比较固定色描边与半透明阴影。悬停可查看阴影加深。",
          "use-shadows-instead-of-borders",
          "保持按钮大小、颜色和位置一致。切换底色时检查固定描边和半透明阴影的边缘清晰度，并验证悬停和键盘焦点。",
        ),
      ],
    },
  ],
};
