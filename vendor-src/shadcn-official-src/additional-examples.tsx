import { useState } from "react"
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
      <section className="grid gap-3" aria-label="双滑块">
        <h2 className="text-sm font-medium">双滑块</h2>
        <SliderRange />
      </section>
      <section className="grid gap-3" aria-label="三个滑块">
        <h2 className="text-sm font-medium">三个滑块</h2>
        <SliderMultiple />
      </section>
    </div>
  )
}

export function DropdownExamples() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      <section className="grid justify-items-center gap-3" aria-label="多选菜单">
        <h2 className="text-sm font-medium">多选菜单</h2>
        <DropdownMenuCheckboxes />
      </section>
      <section className="grid justify-items-center gap-3" aria-label="单选菜单">
        <h2 className="text-sm font-medium">单选菜单</h2>
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
        折叠方式
        <span className="select-control">
          <select value={mode} onChange={event => setMode(event.target.value === "icon" ? "icon" : "offcanvas")}>
          <option value="icon">保留图标</option>
          <option value="offcanvas">完全收起</option>
          </select>
        </span>
      </label>
      <AppSidebar collapsible={mode} />
    </>
  )
}
