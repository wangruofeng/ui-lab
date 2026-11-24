export function connectSlidingTabs(tablist, onSelect) {
  const tabs = [...tablist.querySelectorAll(':scope > [role="tab"]')];
  const indicator = tablist.querySelector(".sliding-tabs-indicator");
  let active = tabs.find(tab => tab.getAttribute("aria-selected") === "true") ?? tabs[0];

  function positionIndicator() {
    const selected = active.getBoundingClientRect();
    if (!selected.width) return;
    const track = tablist.getBoundingClientRect();
    indicator.style.setProperty("--tab-width", `${selected.width}px`);
    indicator.style.setProperty("--tab-offset", `${selected.left - track.left}px`);
  }

  function select(tab) {
    if (tab !== active) tablist.setAttribute("data-sliding", "");
    active = tab;
    for (const candidate of tabs) {
      const selected = candidate === active;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = selected ? 0 : -1;
    }
    positionIndicator();
    onSelect?.(active);
  }

  select(active);
  const observer = new ResizeObserver(() => {
    if (tablist.isConnected) positionIndicator();
    else observer.disconnect();
  });

  for (const tab of tabs) {
    observer.observe(tab);
    tab.addEventListener("click", () => select(tab));
  }

  tablist.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const index = tabs.indexOf(event.target);
    if (index < 0) return;

    let next;
    switch (event.key) {
      case "ArrowLeft": next = (index - 1 + tabs.length) % tabs.length; break;
      case "ArrowRight": next = (index + 1) % tabs.length; break;
      case "Home": next = 0; break;
      case "End": next = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    select(tabs[next]);
    tabs[next].focus({ preventScroll: true });
  });

  return select;
}
