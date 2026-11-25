import { useState } from "react"
import { t } from "./locale"
import { Toaster } from "./upstream/ui/base-nova/toast"
import { ToastPromise } from "./upstream/examples/toast-promise"
import { SliderRange } from "./upstream/examples/slider-range"
import { SliderMultiple } from "./upstream/examples/slider-multiple"
import { DropdownMenuCheckboxes } from "./upstream/examples/dropdown-menu-checkboxes"
import { DropdownMenuRadioGroupDemo } from "./upstream/examples/dropdown-menu-radio-group"
import AppSidebar from "./upstream/examples/sidebar-demo"

export function PromiseToastExample() {
  return <Toaster><ToastPromise /></Toaster>
}

export function SliderExamples() {
  return (
    <div className="grid w-full max-w-xs gap-8">
      <section className="grid gap-3" aria-label={t("双滑块", "Two thumbs")}>
        <h2 className="text-sm font-medium">{t("双滑块", "Two thumbs")}</h2>
        <SliderRange />
      </section>
      <section className="grid gap-3" aria-label={t("三个滑块", "Three thumbs")}>
        <h2 className="text-sm font-medium">{t("三个滑块", "Three thumbs")}</h2>
        <SliderMultiple />
      </section>
    </div>
  )
}

export function DropdownExamples() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      <section className="grid justify-items-center gap-3" aria-label={t("多选菜单", "Checkbox menu")}>
        <h2 className="text-sm font-medium">{t("多选菜单", "Checkbox menu")}</h2>
        <DropdownMenuCheckboxes />
      </section>
      <section className="grid justify-items-center gap-3" aria-label={t("单选菜单", "Radio menu")}>
        <h2 className="text-sm font-medium">{t("单选菜单", "Radio menu")}</h2>
        <DropdownMenuRadioGroupDemo />
      </section>
    </div>
  )
}

export function SidebarExample() {
  const [mode, setMode] = useState<"icon" | "offcanvas">("icon")

  return (
    <>
      <label className="sidebar-mode">
        {t("折叠方式", "Collapse mode")}
        <span className="select-control">
          <select value={mode} onChange={event => setMode(event.target.value === "icon" ? "icon" : "offcanvas")}>
          <option value="icon">{t("保留图标", "Keep icons")}</option>
          <option value="offcanvas">{t("完全收起", "Hide sidebar")}</option>
          </select>
        </span>
      </label>
      <AppSidebar collapsible={mode} />
    </>
  )
}
