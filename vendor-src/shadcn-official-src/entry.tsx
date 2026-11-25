import type { ComponentType } from "react"
import { createRoot } from "react-dom/client"
import { t } from "./locale"

const examples: Record<string, () => Promise<ComponentType>> = {
  "toast-promise": () => import("./additional-examples").then(module => module.PromiseToastExample),
  "slider-range": () => import("./additional-examples").then(module => module.SliderExamples),
  "dropdown-menu": () => import("./additional-examples").then(module => module.DropdownExamples),
  sidebar: () => import("./additional-examples").then(module => module.SidebarExample),
  "message-scroller": () => import("./upstream/examples/message-scroller").then(module => module.MessageScrollerStreaming),
  "code-block": () => import("./upstream/examples/code-block").then(module => module.CodeBlockActionsExample),
  trace: () => import("./upstream/examples/trace").then(module => module.TraceDemo),
  "data-table": () => import("./upstream/examples/data-table").then(module => module.DataTableDemo),
  chart: () => import("./upstream/examples/chart").then(module => module.ChartBarInteractive),
  combobox: () => import("./upstream/examples/combobox").then(module => module.ComboboxMultiple),
  "date-picker": () => import("./upstream/examples/date-picker").then(module => module.DatePickerWithRange),
  "input-otp": () => import("./upstream/examples/input-otp").then(module => module.default),
  command: () => import("./upstream/examples/command").then(module => module.CommandDemo),
  questionnaire: () => import("./upstream/examples/questionnaire").then(module => module.QuestionnaireDemo),
  "context-menu": () => import("./upstream/examples/context-menu").then(module => module.ContextMenuDemo),
  resizable: () => import("./upstream/examples/resizable").then(module => module.default),
}

const container = document.querySelector("#official-demo")!
const slug = new URLSearchParams(location.search).get("case") ?? ""
const load = Object.hasOwn(examples, slug) ? examples[slug] : null

async function mount() {
  if (!load) throw new Error(t("案例不存在", "Case not found"))
  container.dataset.case = slug
  const Component = await load()
  const Toaster = slug === "questionnaire" ? (await import("sonner")).Toaster : null
  createRoot(container).render(
    <>{Toaster && <Toaster />}<Component /></>,
  )
}

mount().catch(error => {
  console.error(error)
  container.textContent = t("官方示例加载失败。", "The official demo could not load.")
})
