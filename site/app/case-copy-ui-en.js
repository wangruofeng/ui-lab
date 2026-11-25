import { loadingTips } from "./loading-en.js";

function guidanceByCase(rows) {
  return Object.fromEntries(rows.map(([id, scene, guidance]) => [
    id, { scene, tip: guidance, criterion: guidance },
  ]));
}

function copyByCase(rows) {
  return Object.fromEntries(rows.map(([id, scene, tip, criterion, note]) => [
    id, { scene, tip, criterion, ...(note ? { outline: [note] } : {}) },
  ]));
}


const playbook = guidanceByCase([
  ["reserve-space-with-aspect-ratio", "Reserve space for an image", "Declare an aspect ratio on the container before its media loads. Simulate slow loading and compare the body text position before and after the image appears to verify that content does not jump."],
  ["use-concentric-border-radius", "Use concentric corner radii", "Measure the corner inset and subtract it from the outer radius to get the inner radius. Check that the corner gap stays even at different container sizes."],
  ["group-with-space-not-lines", "Group content with spacing", "Identify information related to the same task. Use smaller gaps within groups than between them, then remove any dividers the spacing can replace. Check that the group order stays clear."],
  ["peek-the-next-scroll-item", "Reveal the next item in a horizontal list", "Leave about 16–32 px of the next item visible in a horizontal list. Test touch and keyboard scrolling and check how the end of the list looks."],
  ["give-targets-breathing-room", "Give adjacent controls room", "Start with about 12 px between adjacent controls with visible boundaries. On a compact viewport, verify that they're easy to distinguish by touch and mouse."],
  ["inset-primary-actions", "Align primary actions with the page inset", "Align a full-width primary button with the horizontal padding of the page content. Check narrow screens, safe areas, and long button labels."],
  ["fade-scroll-edges", "Fade the edges of scrollable lists", "Fade the edge when more content can be scrolled into view. Check how both ends are indicated and verify text readability and keyboard focus."],
  ["use-text-balance", "Balance headline wrapping", "Compare heading wraps with and without `text-wrap: balance`. Use `pretty` for body copy where appropriate. Check for isolated words and width changes on narrow screens and with long copy."],
  ["use-tabular-nums-for-data", "Align data with tabular numerals", "Use tabular numerals for values people compare down a column. Test negative numbers, decimals, and changing values to check alignment and stable column widths."],
  ["clamp-overflowing-titles", "Limit the visible lines of long titles", "Cap title lines based on available card space and provide a full accessible name or a way to open the details. Compare card heights with long titles and narrow screens."],
  ["cap-line-length", "Limit body text line length", "Set a maximum reading width. For English, start with 60–75 characters per line. Use representative text in each language to check wrapping across viewports."],
  ["use-sentence-case-labels", "Use consistent case for English controls", "Use sentence case for English control labels while retaining proper nouns and abbreviations. Check buttons, menus, and related filter options for consistency."],
  ["tighten-heading-line-height", "Tighten line height in multiline headings", "Try a line height of about 1.1 for short headings. Test real multiline headings with accented characters, Chinese text, and narrow-screen wrapping to check for clipping."],
  ["tune-tracking-by-size", "Adjust letter spacing by type size", "Tighten tracking slightly for large headings and keep natural spacing for small text. Test real upper- and lowercase letters and numerals for crowding."],
  ["fade-truncated-text", "Fade the end of truncated text", "Use a short, subtle fade for overflowing text and account for text direction. Keep the full content accessible and inline actions visible."],
  ["outline-images-neutrally", "Give images a neutral outline", "Replace a saturated image frame with a thin neutral edge. Test dark and light images to verify that the edge is visible without drawing attention away from the image."],
  ["limit-accent-color-usage", "Limit accents within a view", "Identify the page's primary action and reserve accent color for it and necessary links. Reduce the color weight of secondary actions and keep meaningful feedback colors."],
  ["use-shadow-for-elevation", "Show elevation with shadows", "Choose shadows proportional to the elevation of floating controls and use borders for structural boundaries. Verify the hierarchy against real backgrounds and across themes."],
  ["align-icons-optically", "Center icons optically", "Compare geometric and optical centering. Nudge asymmetric icons when needed and check them alongside neighboring text and icons."],
  ["match-icon-stroke-weight", "Match icon stroke to type weight", "Compare roughly 1.5 px strokes with regular text and 2 px strokes with semibold text. Check that the weights still feel balanced after scaling."],
  ["use-outline-icons-by-default", "Distinguish icon states with outline and fill", "Use outline icons by default and filled variants for selected items. Keep the semantic selection state in sync and test whether mouse and keyboard users can identify it."],
  ["avoid-glow-primary-actions", "Emphasize primary actions with contrast and space", "Remove the strong glow and keep the primary action prominent through foreground contrast, button shape, and surrounding space. Verify hover, press, and keyboard focus."],
  ["reserve-brand-color-for-links", "Reserve brand color for links and actions", "Use neutral colors for body copy and headings and keep brand color for interactive elements. Verify that color and other existing cues identify links."],
  ["use-solid-modal-scrims", "Separate modals with a solid-color scrim", "Compare full-screen blur with a translucent, solid-color scrim. Check how clearly the modal separates from the background, and test keyboard focus and dismissal."],
  ["use-large-touch-targets", "Enlarge touch targets", "Make interactive areas at least 44 × 44 CSS pixels. Verify that adjacent areas do not overlap. The visible icons can stay compact."],
  ["keep-secondary-text-readable", "Increase secondary text contrast", "Measure supporting text against its actual background and keep regular text at or above 4.5:1. Confirm that the visual hierarchy stays clear."],
  ["show-visible-focus-rings", "Show a visible keyboard focus ring", "Use Tab and Shift+Tab to check that the `:focus-visible` ring is fully visible and the focus order follows the reading order."],
  ["show-errors-beside-fields", "Place errors next to their fields", "Trigger errors in multiple fields. Put each message directly below its field, associate it with `aria-describedby`, and update the feedback as the issue is corrected."],
  ["label-every-form-field", "Give form fields visible labels", "Enter a value, clear it, and trigger validation to verify that the label always remains visible. Check the programmatic association between label and field."],
  ["give-empty-states-one-action", "Give an empty state one clear action", "Explain what will appear there and provide a primary action to add content. Verify that the copy and actions distinguish an empty state from a loading failure."],
  ["pair-status-with-labels", "Pair status color with text or icons", "Provide recognizable text or a symbol for every status. View the result in grayscale to check that success, pending, and failure still look distinct."],
  ["confirm-destructive-actions", "Confirm destructive actions", "For hard-to-undo actions, identify what will be affected and explain the consequences. Make confirmation and cancellation clear and verify that cancellation returns focus to the trigger."],
  ["add-scale-on-press", "Use a slight scale change on press", "Start with a pressed scale of about 0.96. Verify immediate press and release feedback without changing the hit area or shifting nearby layout."],
  ["anchor-popovers-to-triggers", "Open popovers from their triggers", "Set `transform-origin` toward the actual trigger for each opening direction. Test all trigger positions and verify that the popover can still be dismissed."],
  ["avoid-entering-from-scale-zero", "Start the entrance close to full size", "Fade in from a starting scale of about 0.95 and compare it with scaling up from zero. Check how quickly the popover content becomes readable."],
  ["use-structural-skeletons", "Match the skeleton to the loaded layout", "Preserve the proportions and structure of the final content in the loading state. Simulate a slow response and check for layout shifts when data arrives."],
  ["use-ease-out-on-enter", "Use ease-out on entrance", "Compare ease-in and ease-out at the same duration. Choose the entrance curve that responds sooner and settles more smoothly."],
  ["animate-icon-state-changes", "Transition between icon states", "Crossfade the two icons briefly in the same position and add a subtle scale change if needed. Switch repeatedly to verify the state stays correct."],
  ["stagger-infrequent-entrances", "Stagger infrequent entrances", "Use a slight stagger only for initial page loads or similarly infrequent events. Review the total duration and respect reduced-motion preferences."],
  ["keep-exits-subtle", "Keep exit motion brief and subtle", "Dismiss with a short fade and a small movement. Open and close repeatedly to check that the exit does not block the next click or temporarily lose focus."],
  ["warm-toolbar-tooltips", "Shorten the delay between adjacent tooltips", "Use a reasonable delay on the first hover and a shorter one when moving between adjacent tools. Verify keyboard focus and that the delay resets after leaving the toolbar."],
  ["use-interruptible-transitions", "Make open and close transitions interruptible", "Toggle quickly to verify that reversing the animation continues from its current position and that the final visible state matches the interaction state."],
  ["restrain-high-frequency-motion", "Reduce repeated animation in frequent actions", "Update immediately when people toggle frequently. Reserve motion for a first appearance or changes that benefit from visible feedback, and check responsiveness during repeated use."],
  ["use-ease-not-spring-for-feedback", "Let routine feedback settle smoothly", "Compare a spring with a short ease-out. Prioritize controls and feedback that settle promptly and check that rapid repetition does not introduce unnecessary bounce."],
  ["fade-menus-out", "Fade menus out in place", "Limit exit movement and use a short fade. Compare the feedback and focus restoration when dismissing with a keyboard and with a mouse."],
  ["enter-and-exit-on-the-same-path", "Use the same path for entrance and exit", "Reverse an element's entrance path when it exits. Toggle repeatedly and verify that position, clipping, and travel direction agree."],
  ["blur-imperfect-label-morphs", "Soften label changes with a short blur", "Gently crossfade labels with different lengths or shapes and apply a brief blur during the change only. Check that the final text is crisp and that the layout stays stable."],
]);

const killSlop = guidanceByCase([
  ["indigo-violet-gradient", "Project launch", "Use a brand color with a clear purpose on one primary action. Return backgrounds and shadows to neutral tones, then check that the button boundary and focus remain visible."],
  ["gradient-text", "Release history", "Replace gradient-filled text with a solid color that has sufficient contrast. Preserve hierarchy with type size, weight, and spacing."],
  ["warm-cozy-palette", "Community studio", "Use neutrals across large surfaces and keep warm colors for details that need attention. Convey approachability with specific information."],
  ["default-semantic-palette", "Import history", "Use neutrals for general information and success states, reserving accents for items that need action. Keep text status labels and verify that they make sense in grayscale."],
  ["mono-hue-alert", "File sync", "Rework the alert with a neutral background, clear status heading, and actionable directions. Verify that regular text has at least 4.5:1 contrast against the background."],
  ["atmosphere-gradient", "Service monitoring", "Unify the background and separate panels with thin dividers and subtle surface changes. Keep lighting effects that convey the actual point of focus."],
  ["serif-emphasis", "Team resource library", "Restore unexpectedly emphasized words to the same font family. Use weight or line breaks to emphasize the content that needs it."],
  ["serif-body-misuse", "Payment history", "Choose consistent, readable type for fields, actions, and numbers people compare in a row. Check mixed-language text and column alignment."],
  ["decorative-text-lines", "Registration page", "Remove text marks unrelated to links, deletion, or annotation. Convey emphasis through genuine headings, grouping, and explanatory copy."],
  ["section-kicker", "Project settings", "Keep eyebrow labels where they help people find their place. Remove redundant ones and check that group names and reading order remain clear."],
  ["oversized-hero-headline", "Handoff tool", "Use one short headline to identify the primary task and move secondary information into body copy. Check wrapping and primary action placement on desktop and narrow screens."],
  ["flat-type-hierarchy", "Delivery details", "Define distinct visual levels for headings, body copy, and supporting text. Verify type size, weight, and spacing with realistic long copy."],
  ["highlighted-keywords", "File collaboration", "Highlight only information that helps readers find their place. Write the remaining copy as natural sentences and check that readers can follow the full meaning."],
  ["ai-copy-tics", "Report generation", "State what goes in, what comes out, and what triggers the action. Remove unsupported promises so people can predict the result."],
  ["emoji-everywhere", "Reminder settings", "Remove emoji that duplicate the same information. Use consistent icons and labels for states that need to be recognized quickly, and check that the meaning holds without icons."],
  ["status-dot-glow", "Execution queue", "Convey status with a short label and a small marker. Limit the glow and check that the icon remains proportionate next to the text."],
  ["left-border-callout", "Export configuration", "Use typography and placement for general guidance. Reserve strong visual treatments for content that needs immediate attention."],
  ["pastel-icon-tiles", "Workspace tools", "Use consistent icon sizes and stroke widths. Remove color fills that serve only as decoration and verify alignment between icons and labels."],
  ["over-rounded-glass", "Quick settings", "Use a stable surface color and moderate corner radii. With the popover open, check readability, its boundary, and separation from the background."],
  ["oversized-shadow", "Quick actions", "Reduce shadow spread and opacity, and use a subtle edge to define the structure. Check that the overlay still separates from the content below."],
  ["nested-radius", "Photo card", "Calculate the inner radius from the outer radius and the actual padding. Inspect the four corners up close to check that the gaps stay even."],
  ["broken-corner-border", "File information", "Draw a continuous outline with one consistent border treatment. Check corners, clipping, and focus states for breaks."],
  ["badge-spam", "File delivery", "Show file type, date, and author as regular metadata. Reserve badges for states people need to recognize quickly."],
  ["ai-svg-icon", "Document status", "Use consistent dimensions, strokes, and composition across icons. Verify that each is easy to recognize at its actual display size."],
  ["tinted-icon-tile", "Shortcuts", "Check that the icon stands on its own, remove a background that repeats the same color emphasis, and align the icon with the text baseline."],
  ["springy-hover", "File preview", "Replace a large bounce with a short change to the background or border. Move quickly over several items and check that focus and hit targets stay stable."],
  ["wobbly-spinner", "Sync settings", "Fix the rotation center and reserved space, use a constant rotation speed, and provide a static text status for people who prefer reduced motion."],
  ["feature-grid", "Archiving tool", "Use natural capitalization and arrange feature names and descriptions in reading order. Keep even grouping without giving every headline equal visual emphasis."],
  ["fake-stat-trio", "Team backup", "Replace metrics of unknown origin with verifiable capabilities and known outcomes. If a number is needed, include its definition, scope, and date."],
  ["numbered-sections", "Configuration guide", "Number only steps that must be followed in sequence. Name other groups after the task and verify that readers can find the relevant section."],
  ["nested-cards", "Workspace summary", "Keep related information on one surface and use whitespace or dividers for internal hierarchy. Verify that groups and hit targets are still clear."],
  ["monotone-spacing", "Notification preferences", "Bring labels and descriptions closer together and space independent settings groups farther apart. Compare scanability and mistaken selections before and after."],
  ["overused-font", "Community exhibition", "Compare legibility and tone using actual headlines, numerals, and body copy. Explain the type choice and provide a system fallback."],
  ["tasteful-terminal", "Reading list", "Reserve monospace and command-style treatments for real code or logs. Use a familiar content hierarchy for ordinary reading and actions."],
  ["editorial-dashboard", "Ticket overview", "Lead with data that needs action. De-emphasize decorative titles and illustrations, then test how quickly readers can scan, compare, and identify the next step."],
]);

const loadingGroups = [
  ["Rings and Rotation", {
    arc: "Rotating arc",
    atom: "Atomic orbits",
    cascade: "Layered arcs",
    classic: "Fading spokes",
    "classic-v2": "Radial spokes",
    comet: "Comet trail",
    dual: "Dual rotating rings",
    orbit: "Orbiting dot",
    ring: "Ring indicator",
    trace: "Outline trace",
  }],
  ["Dots and Staggering", {
    "bouncing-dots": "Bouncing dots",
    "circular-dots": "Circular dots",
    gather: "Gathering blocks",
    leap: "Leaping dot",
    "linear-dots": "Linear dots",
    slide: "Sliding dots",
    split: "Splitting and merging dots",
  }],
  ["Scanning and Pulsing", {
    clock: "Clock hand",
    compass: "Compass ticks",
    eclipse: "Eclipse",
    phases: "Light and dark phases",
    pulse: "Pulsing outline",
    radar: "Radar sweep",
    ripple: "Expanding ripples",
    scan: "Scanning line",
  }],
  ["Grids and Waves", {
    blocks: "Block grid",
    steps: "Stepped sequence",
    swirl: "Swirling grid",
    wave: "Wave bars",
  }],
  ["Morphing and Paths", {
    chevrons: "Chevron sequence",
    fill: "Fill cycle",
    flip: "Flipping shape",
    loading: "Loading indicator",
    loop: "Loop path",
    morph: "Morphing outline",
    snake: "Snake trace",
  }],
];

const loading = Object.fromEntries(loadingGroups.flatMap(([scene, indicators]) =>
  Object.entries(indicators).map(([id, indicator]) => [
    id,
    {
      scene,
      tip: loadingTips[id],
      criterion: `Implement loading feedback for the ${indicator.toLowerCase()}. Provide readable status text and reserve a fixed amount of layout space. Verify that the animation can be paused and defaults to still when the system requests reduced motion.`,
      outline: ["Use text to explain what is loading."],
    },
  ]),
));

const formFeedback = "Form Feedback";
const contentStates = "Content States";
const actionFeedback = "Action Feedback";
const textAndNumbers = "Text and Numbers";
const disclosure = "Disclosure and Navigation";
const pointerEffects = "Pointer and Spatial Effects";
const feedbackAndLoading = "Feedback and Loading";

const transitions = copyByCase([
  ["error-state-shake", formFeedback, "Click Play and watch the input nudge right and left before settling back into place.", "Each trigger shows a simulated error and replays the four-part shake. The error message stays visible for about three seconds before clearing."],
  ["input-clear-with-dissolve", formFeedback, "Click the search field's clear button. Watch the existing text fade downward and the placeholder enter from above, then choose Reset text to replay.", "Clearing updates the actual input value immediately. Both the original text and the placeholder move downward, and resetting restores the preset text."],
  ["checkbox-check", formFeedback, "Select Notify me and watch the checkmark draw from its starting point.", "Use a native checkbox. Draw the checkmark on selection and return to an empty box on deselection."],
  ["toggle", formFeedback, "Toggle the switch and watch the track change color immediately as the thumb overshoots and settles back.", "Update the switch state immediately and complete the thumb's travel and rebound in 350 ms."],
  ["card-resize", contentStates, "Click Play to switch between the wide and narrow card.", "Transition the same card's width and height together while keeping its content consistent."],
  ["skeleton-loader-and-reveal", contentStates, "Click Play and watch the skeleton pulse once before crossfading into the user details.", "Keep the placeholder and user details in the same position. Once the pulse ends, crossfade their opacity and blur."],
  ["reasoning-stream", contentStates, "Play the reasoning log and watch the content move up about two lines at a time. Pause and play again to check that it resumes where it left off.", "Keep the two-line step and the pause between steps. Make the playback loop seamless and resume from the paused position."],
  ["streaming-text", contentStates, "Click Play and watch the paragraph go from invisible to readable one word at a time.", "Fade in and unblur words at short intervals while holding space for the full paragraph."],
  ["drag-and-drop", contentStates, "Drag the sample image onto the target or focus it and press Enter. Wait for it to return to its original position.", "Track the pointer during the drag and signal when the image is over the drop target. Expand the image in the target on drop, then restore its original position."],
  ["like-button", actionFeedback, "Click Like to see the heart fill and rebound and the particles scatter. Click again to unlike.", "Run the heart rebound and particles only when liking. Update the button's pressed state immediately."],
  ["banner-stacking", actionFeedback, "Add several notifications and watch each new one enter from below and push the oldest one out. Hover over the stack to expand it.", "Start with three stacked notifications. Place the new one on top, scale the next two down and move them backward, and spread the stack out on hover or focus."],
  ["notification-badge", actionFeedback, "Click Play and watch the badge spring in diagonally. Trigger it again to dismiss the badge.", "Bring the badge in on a diagonal with a separate scale rebound. On dismissal, shrink and fade it at its anchor."],
  ["icon-swap", actionFeedback, "Click Play to alternate between the menu and close icons.", "Crossfade, scale, and blur the icons in place. During rapid toggles, keep the most recent state visible."],
  ["spinner-to-check", actionFeedback, "Click Play and watch the task spinner spring into a checkmark, then return to spinning.", "Draw the checkmark in the same space as the spinner. Keep the completed state visible for about two seconds before returning to progress."],
  ["delete-dissolve", actionFeedback, "Delete the image and watch its fragments fall and spread. The image reappears automatically after the animation.", "Disperse and blur pieces of the image, then automatically restore it so the demo can be replayed."],
  ["learn-more-hover", actionFeedback, "Hover over Learn more to see the arrow move right and open. Move away to see it reset.", "Shift the arrow 2 px right and rotate both arms 8° around its tip. Allow 350 ms for both directions and keep the label in place."],
  ["number-pop-in", textAndNumbers, "Update the value to watch digits pop in from below, followed in sequence by decimal places.", "Keep the shared prefix and decimal point fixed and alternate the remaining digits as they enter and exit."],
  ["spinning-counter", textAndNumbers, "Click Update and watch the digit columns scroll downward. The target digits rise slightly before settling.", "Roll from 100 to 178 on the first run. Start each subsequent run at the previous target and hold unchanged digits still."],
  ["number-subtle-change", textAndNumbers, "Update the value and watch only the changed digits fade in.", "Keep unchanged digits, commas, and digit widths stable."],
  ["text-states-swap", textAndNumbers, "Switch between processing and complete.", "Move the old status up and out before bringing the new status in from below."],
  ["texts-reveal", textAndNumbers, "Reveal the heading and description, then click again to fade them out in place.", "Stagger the two lines on entry. Fade them out together and remove them from reading order on exit."],
  ["shimmer-text", textAndNumbers, "Play or pause the shimmer and watch the highlight sweep over the stationary text.", "Loop the shimmer during playback. Remove the highlight when paused and keep the text readable."],
  ["organic-shimmer", textAndNumbers, "Play or stop the curved highlight on the panel.", "Stagger multiple highlights across the panel during playback and return to a static surface when stopped."],
  ["pro-gradient-text", textAndNumbers, "Open the case and watch the colors cycle across the letterforms.", "Keep the text stationary as the colors move. Keep the gradient static when the system requests reduced motion."],
  ["thinking-states", textAndNumbers, "Play the rotating sequence, then pause to inspect the current status.", "Loop the shimmer and status changes during playback, and leave the current copy visible when paused."],
  ["menu-dropdown", disclosure, "Click Toggle menu above the menu to watch the three-line placeholder panel close and reopen.", "Start with the panel open and scale from its top center. On open, fade in and scale up from 97% over 250 ms. On close, fade out and scale to 99% over 150 ms."],
  ["modal-open-close", disclosure, "The modal preview starts open. Click Toggle modal to see how scale and opacity work together.", "Open and close around a fixed origin. Close faster than opening and switch immediately when reduced motion is requested."],
  ["panel-reveal", disclosure, "Click Toggle panel to close the expanded content and open it again.", "Move the panel vertically on enter and exit, adding a little blur and a fade. Keep the button's state in sync."],
  ["gooey-plus-menu", disclosure, "Click the plus in the center to reveal New file, Add image, and New folder. Click the main button again, choose an action, or press Esc to close.", "Fan the three round buttons upward from a shared center, keeping the left and right positions symmetric. Rotate the plus 45° and merge the circles again on close."],
  ["page-side-by-side", disclosure, "Choose Ethereum, Avalanche, or BNB to open the same sample amount page. Use the arrow in the top left to return to the token list.", "Slide the list out to the left and the amount page in from the right, then reverse on back. Finish the short movement, fades, and blur for both pages together within 250 ms."],
  ["tabs-sliding", disclosure, "Switch between Plan, Debug, and Ask and watch the white pill slide to the selected option.", "Update the selected state immediately and transition the indicator to the new option's position and width."],
  ["tooltip-open-close", disclosure, "Hover over or focus a button, then move to the button beside it.", "Use a short delay on first entry, reuse the same tooltip when switching buttons, and dismiss it quickly on exit."],
  ["dropdown-menu-morph", disclosure, "Click the plus to expand a four-row placeholder menu. Click elsewhere in the demo or press Esc to close it.", "Expand the circular button toward the top left from its bottom-right anchor. Rotate and fade the plus while the four placeholder rows slide in from the right."],
  ["accordion", disclosure, "Click Appearance to expand three rows of two-column placeholder content. Click again to close it.", "Keep the heading fixed. Open or close the panel in 250 ms, fade and blur the content in sync, and flip the arrow vertically."],
  ["avatar-group-hover", pointerEffects, "Move the pointer over the avatars or focus them one at a time. Watch the lift on neighboring avatars decrease with distance.", "Scale the active avatar up slightly and lift its neighbors without scaling them. Spring back into place on exit."],
  ["card-stack-hover", pointerEffects, "Hover over the stack to spread the cards, then hover over a single photo to enlarge it a little. Tap or press Enter while focused to toggle the stack.", "Slide the outer photos outward and rotate them with a spring motion. Keep the middle photo centered and restack the cards when hover leaves."],
  ["3d-tilt", pointerEffects, "Move the pointer across the card, or touch and drag it, to see how the tilt direction and glare position respond.", "Read pointer position against a fixed area, tilt the card on both axes, and move the glare with the pointer. Return the card to level and fade the glare on exit or release."],
  ["image-open-tilt", pointerEffects, "Click the thumbnail to enlarge it, then click again to shrink it. Look for the brief tilt while it scales.", "Scale the image from its center with a brief 3D tilt, then return it to level at both the enlarged and original sizes."],
  ["confetti-burst", feedbackAndLoading, "Click Play to see confetti fall from above and bounce off the button or the bottom of the stage.", "Fade the confetti after a short pause and clear the previous run before replaying."],
  ["success-check", feedbackAndLoading, "Click Play animation below to show the green badge, then click again to fade it out in place.", "Bring the badge up from below, rotate it back, and bring it into focus within 500 ms. Start drawing the white checkmark after 80 ms. Dismiss it in place with a fade and slight blur."],
  ["toast-open-close", feedbackAndLoading, "Click Toggle toast below the demo to show or hide the toast with a circular and horizontal placeholder.", "Bring the toast up 16 px, from 97% to full size, while fading and unblurring it in 350 ms. Reverse the transition in 250 ms when dismissing."],
  ["matrix-dot-loader", feedbackAndLoading, "Compare the horizontal sweep, staggered blinking, perimeter loop, and alternating inner and outer pulses as they play together.", "Use the same cycle duration for all four rhythms and show a still dot grid when reduced motion is requested."],
  ["image-gen-placeholder", feedbackAndLoading, "Click Play, Show image, and Reset in sequence to watch the placeholder hand off to the result.", "Keep the dot grid moving until the image is shown manually. Bring the image into focus in place and restore the still dot grid on reset."],
  ["get-pro-button", feedbackAndLoading, "Watch soft pink, blue, and purple light drift along the Get Pro button's inner edge.", "Fade the colored light toward the center, keeping the middle light enough for a readable label. Keep the soft color effect still when reduced motion is requested."],
]);

const contentTools = "Content Tools";
const dataAndFiltering = "Data and Filtering";
const inputAndSelection = "Input and Selection";
const commandsAndWorkflows = "Commands and Workflows";
const spaceAndLayout = "Space and Layout";

const shadcn = copyByCase([
  ["attachment", contentTools, "Use the official shadcn/ui attachment component to browse images, a PDF uploading, and a code attachment. Scroll the image group horizontally on narrow screens.", "Keep the component, sample data, and styles from the official preview at the top of the page. Cancel and Remove are disabled controls in this static example."],
  ["message-scroller", contentTools, "Send a preset question to start a streamed reply. Send the next question, scroll up to read earlier messages, then use the down arrow to return to the end.", "Anchor the new exchange after a question is sent. Follow the stream automatically only when the reader is at the end, and preserve their reading position after they scroll away."],
  ["code-block", contentTools, "Terminal output wraps by default. Use the toolbar buttons to toggle wrapping, download the log, or copy the raw output.", "Apply wrapping only to the presentation. Keep the original text and line breaks in downloads and copied output, and briefly show a confirmation icon after copying."],
  ["trace", contentTools, "Expand reasoning, command output, the failure reason, or sources. Click Replay to see the entire sequence again.", "During replay, reveal reasoning, execution, failure, sources, and the answer in order. Make each record independently expandable and show Replay again when finished."],
  ["data-table", dataAndFiltering, "Filter payments by email, then try sorting, selecting rows, and toggling visible columns. Use a row's menu to copy the payment ID.", "Use the five sample payments from the official example. Update filtering, sorting, column visibility, and selection independently. Disable footer pagination according to the amount of data.", "The selected-row count is based on the current email filter results."],
  ["chart", dataAndFiltering, "Switch between desktop and mobile visits. Hover or press Left and Right Arrow to inspect the data for a day.", "Show only the selected device series and keep the official example's dates, totals, and daily visits."],
  ["slider-range", inputAndSelection, "Drag a thumb or focus it and use the arrow keys. The upper slider has two thumbs, and the lower one has three.", "Keep the starting values and step sizes of the two official examples. Start the two-thumb slider at 25 and 50 with a step of 5, and the three-thumb slider at 10, 20, and 70 with a step of 10."],
  ["combobox", inputAndSelection, "Next.js is selected initially. Type a framework name to filter, press Enter to select the highlighted option, or use the X beside a selection to remove it.", "Show multiple selections inside the input. Automatically highlight the first result while filtering and add a tag when selected.", "The search text can change at any time. Selections are maintained independently."],
  ["date-picker", inputAndSelection, "Open the selected date range to see two calendars side by side, then click dates to adjust the range. Use the previous and next month controls to browse.", "Set the initial range to January 20 through February 9 of the current year. Highlight the range across both consecutive months and show the selection in the trigger.", "Keep the start date visible when moving across months so users can confirm the start of their selection."],
  ["input-otp", inputAndSelection, "Type or paste a six-digit code. Use the arrow keys and Backspace to make corrections.", "Use one native input for all three pairs. Show separators for visual grouping and retain standard text selection, copying, and pasting.", "Treating the code as a single input value preserves the browser's native paste and editing behavior."],
  ["toast-promise", commandsAndWorkflows, "Click Create Event and watch the same notification change from in progress to success.", "Use the official example's simulated two-second request. Show Creating event… followed by Event created. in a single toast."],
  ["dropdown-menu", commandsAndWorkflows, "Open both menus. Try checking display options and changing the mutually exclusive selection.", "Keep Status Bar checked by default and Activity Bar disabled. Verify that the radio menu selects one option at a time."],
  ["command", commandsAndWorkflows, "Search for Calendar or Billing, then use the arrow keys to browse results. Calculator is disabled in this example.", "Keep the suggestions and settings groups, disabled items, shortcut hints, and empty results state. Keep input focus in the search field.", "Focus remains in the input while `aria-activedescendant` tracks the highlighted option."],
  ["questionnaire", commandsAndWorkflows, "Select or enter a feature direction, fill in progress details or skip them, then pick a start time and save the plan.", "Preserve the three steps and their single-select and custom input, multi-select, skip and back options, letter shortcuts, and save feedback.", "Preserving answers when users go back makes it easier to review or revise their choices."],
  ["context-menu", commandsAndWorkflows, "Right-click or long-press inside the example, open More Tools, and try checking Show Full URLs.", "Preserve the original items, the disabled Forward action, submenus, and checked states. Make submenus browsable by hover and arrow keys."],
  ["sidebar", spaceAndLayout, "On a wide screen, choose a collapse mode and click the sidebar button or press Cmd+B or Ctrl+B inside the demo. On narrow screens, the sidebar opens as a drawer.", "Use the official sidebar example. Verify the icon-only, collapsed, and narrow-screen drawer states. Confirm that both the trigger and the shortcut toggle the sidebar."],
  ["resizable", spaceAndLayout, "Drag a panel divider or focus it and use the arrow keys. Resize the left panel horizontally and the two right-hand panels vertically.", "Start the left-right split at 50/50 and the top-bottom split on the right at 25/75. Each divider should respond independently to dragging and arrow keys along its axis.", "Nested dividers resize the layout along the horizontal and vertical axes independently."],
]);

export const caseCopyUiEn = {
  "ui-skills": playbook,
  "kill-ai-slop": killSlop,
  "loading-dev": loading,
  "transitions-dev": transitions,
  "shadcn-ui": shadcn,
};
