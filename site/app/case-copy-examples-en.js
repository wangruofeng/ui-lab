function motion(scene, tip, additionalChecks, before = "") {
  return {
    scene,
    tip,
    criterion: additionalChecks ? `${tip} ${additionalChecks}` : tip,
    notes: [before, before ? tip : ""],
  };
}

export const caseCopyExamplesEn = {
  "motion-primitives": {
    accordion: motion("Frequently asked questions", "Select a heading to expand its content and move the items below it.", "Allow only one open item in the group. Keep aria-expanded and content accessibility in sync, and test rapid switching.", "Select a heading. Its content and the items below jump into place."),
    disclosure: motion("Shipping information", "Select the button to reveal or collapse the content below it.", "Keep the trigger in place and remove links and buttons inside collapsed content from keyboard focus order.", "Select the button. All of the extra information appears or disappears at once."),
    dialog: motion("Notification settings", "Open the dialog to see the scrim fade in and the form move up a short distance.", "Use a native dialog or equivalent modal semantics. Support Escape and return focus to the trigger. Skip the animation when reduced motion is enabled.", "Open the dialog. The scrim and the form appear at the same instant."),
    "morphing-dialog": motion("Route details", "Share position, size, or imagery between the card and the detail view. Verify Escape to close, focus restoration, and reduced motion."),
    "morphing-popover": motion("Trip notes", "Expand and collapse the editor from its trigger. Check narrow-screen boundaries, Escape to close, and input focus."),
    "animated-background": motion("Traffic trends", "Slide one shared background between options. During rapid switching, update the semantic selection and content immediately and keep the background aligned with the latest selection."),
    "animated-group": motion("Import history", "Select Show records to reveal three entries in reading order.", "Limit the delay between entries so the whole group becomes readable quickly. Allow clearing and replay while preserving the original DOM order.", "Select Show records. All three entries appear at once."),
    carousel: motion("Weekend destinations", "Choose a destination to slide the old image out and the new one in from the matching direction.", "Use opposite directions for previous and next. Keep direct selection, a clear selected state, and keyboard controls. Avoid autoplay.", "Choose a destination. The entire image and caption change instantly."),
    "transition-panel": motion("Create a project", "Move forward and backward to see the panels travel in opposite directions.", "Disable interaction with the outgoing form, preserve entered values, and keep step navigation and focus stable.", "Switch steps. The entire form changes instantly."),
    "toolbar-dynamic": motion("Canvas tools", "Switch tools to see contextual actions move a short distance into or out of the shared toolbar.", "Keep persistent tools and their selection states stable. Animate only the contextual area and make actions available immediately.", "Switch tools. The action list underneath changes instantly."),
    "toolbar-expandable": motion("Sharing actions", "Select More actions to expand Export and Copy from the same toolbar.", "Keep the trigger in place. Expose secondary actions promptly when expanded and remove them from the focus order when collapsed.", "Select More actions. The entire row of buttons appears at once."),
    "animated-number": motion("Fundraising progress", "Select Update to count continuously to the exact amount.", "Keep thousands separators and tabular digits. On another update, resume from the current value. Announce only the final value to screen readers.", "Select Update. The amount jumps from one value to the other."),
    "sliding-number": motion("Minutes until departure", "Select Refresh to see only the changed digits roll while the other positions stay still.", "Clip each digit separately and reverse direction for increases and decreases. Keep units and separators stable.", "Select Refresh. Several digits change at once."),
    "spinning-text": motion("Studio wordmark", "Select Play to spin the ring of text around a stationary mark.", "Space the letters evenly around the circle and rotate only the outer ring. Provide a pause control and a readable static version without autoplay.", "Select Play. The wordmark changes color and stays in place."),
    "text-effect": motion("Exhibition opening", "Select Replay to fade in the phrase in reading order.", "Use a short movement and staggered word fades, limit the total duration, and expose the full sentence to assistive technology.", "Select Replay. The whole sentence appears at once."),
    "text-loop": motion("Ticket status", "Select Switch to move the old status up and bring the new status in from below.", "Alternate status labels in a clipped window of fixed height. Keep statuses distinguishable without motion, and prevent overlaps during rapid changes.", "Select Switch. The status label changes instantly."),
    "text-morph": motion("View names", "Select Switch to slide shared letters to their new positions and animate the other characters in or out.", "Match characters by identity and animate shared letters from their measured positions. Always expose the complete new word to assistive technology.", "Select Switch. The whole word changes at once."),
    "text-roll": motion("List sorting", "Select Switch to roll the sort label to the next option one character at a time.", "Reserve this effect for short labels. Roll out the old character before showing the new one. Keep an accessible label and switch instantly under reduced motion.", "Select Switch. The entire sort label changes at once."),
    "text-scramble": motion("Pickup code", "Select Generate to scramble characters briefly before they resolve from left to right.", "Limit the scramble duration and character set. Make the final characters match exactly. Keep intermediate frames out of screen reader output and prevent them from being copied as a code.", "Select Generate. The new passcode appears all at once."),
    "text-shimmer": motion("Document export", "Select Start to sweep a highlight across the status text once.", "Keep the highlight inside the glyphs. Maintain a readable status label and avoid repeated sweeps or low contrast.", "Select Start. A static loading message appears."),
    "text-shimmer-wave": motion("File sync", "Select Replay to send a wave of highlights through the characters.", "Apply a per-character delay to decorative characters, keep the status readable throughout, and stop after one sweep.", "Select Replay. The entire line lights up at once."),
    "image-comparison": motion("Photo color comparison", "Drag the slider to compare warm and cool colors at the same boundary.", "Align images with identical dimensions and cropping. Map the native slider value to the clipping boundary and preserve keyboard operation.", "Drag the slider. The entire image switches between warm and cool at the midpoint."),
    "in-view": motion("Exhibition guide", "Scroll inside the box to see the guide move up, fade in, and sharpen.", "Use the demo's scroll container as the observation root and leave room near the bottom to trigger the effect. Allow replay by scrolling back to the top and respect the system's reduced-motion setting.", "Scroll down inside the panel. The guide text appears without a transition."),
    "infinite-slider": motion("Gallery labels", "Select Play to scroll the labels at a steady speed and wrap the end back to the start.", "Duplicate the decorative sequence and match spacing at the seam. Drive the loop with transform, provide a pause control, and hide repeated content from screen readers.", "Select Play. After the last card, the whole row jumps back to the start."),
    "progressive-blur": motion("Saved places", "Scroll the list to see content soften near the edge.", "Overlay a limited band of static layered blur along the scroll edge. Remove the edge cue at the end of the list and keep the overlay from blocking interaction.", "Scroll the list. A hard edge clips the content at the bottom."),
    "scroll-progress": motion("Reading progress", "Scroll the article to watch the progress bar advance with your reading position.", "Normalize the scroll range to 0–1 and show progress with horizontal scaling. Handle content without overflow, zoom, and keyboard scrolling.", "Scroll the article and gauge your progress from a percentage that updates in steps."),
    "border-trail": motion("File import", "Trigger the effect to send a short highlight once around the control.", "Keep the border thickness fixed while the highlight moves along it. Support replay from the keyboard and reduced motion.", "Trigger the effect. The entire border lights up at once."),
    cursor: motion("Canvas sampling", "Move the pointer to follow the sampling marker and read its coordinates.", "Keep the native pointer, align the marker to local coordinates, and reset on exit. Provide a designated sample position for touch and keyboard input.", "Move the pointer. The sample marker stays in the center of the canvas."),
    dock: motion("Workspace shortcuts", "Hover or focus a shortcut to lift and enlarge it while adjacent icons respond slightly.", "Scale with transform so the hit area and layout stay fixed. Give keyboard focus equivalent feedback and preserve click-to-select behavior.", "Hover or focus an icon. Only the color changes."),
    "glow-effect": motion("Ambient lighting", "Trigger the effect to reveal a soft, localized colored glow.", "Use a pre-rendered radial gradient and animate opacity and a small amount of scale. Keep the glow clear of the label and turn it off when the state changes.", "Trigger the effect. A flat color replaces the original background."),
    magnetic: motion("Save shortcut", "Move the pointer over the button to draw its contents toward it, then move away to re-center them.", "Keep the hit target fixed and cap movement of its contents. Preserve the action on touch and keyboard and with reduced motion.", "Move the pointer. Only the button background changes."),
    spotlight: motion("Night display", "Move the pointer to illuminate the details beneath the spotlight.", "Track the pointer within the card and let clicks pass through the decoration. Provide a fixed keyboard preview and keep the text legible.", "Move the pointer. The spotlight stays in the center."),
    tilt: motion("Material sample", "Move the pointer to tilt the card on two axes.", "Limit rotation on both axes and keep the hit area stable. Reset on pointer exit and provide a fixed-angle keyboard preview.", "Move the pointer. The sample card stays flat."),
  },
  "break-ui": {
    "team-member-row": {
      tip: "Switch to edge-case data to compare the same member row's layout and wording before and after the fixes.",
      criterion: "Use one data entry point for regular and edge-case records. Cover at least a long name, an email address without spaces, and a count of one project. At narrow widths, verify the full email is readable, the avatar and badge retain their sizes, and the count reads “1 project.” Check missing fields, empty lists, and large counts separately.",
      outline: [
        "Set min-width: 0 on the text column so a long email address can wrap when needed.",
        "Keep the avatar and role badge at fixed sizes and top-aligned after the text wraps.",
        "Use singular or plural according to the project count, with a thousands separator for large counts.",
      ],
    },
    "missing-member-fields": {
      tip: "Switch to a record with a missing name and avatar to see the email address become the primary identifier.",
      criterion: "Test actual missing values and blank strings for name, avatar, and role. Use the email address when a name is missing, show a recognizable avatar placeholder, and omit the empty badge.",
    },
    "multilingual-names": {
      tip: "Switch to names with emoji and Arabic script to compare avatar initials and name punctuation.",
      criterion: "Test initials with emoji containing skin-tone modifiers and zero-width joiners. Keep the full grapheme intact. Use automatic text direction for Arabic names and check punctuation such as parentheses.",
    },
    "project-counts": {
      tip: "Compare 0 projects, 1 project, and 1,284 projects to check plurals and thousands separators. Select Edge cases again to switch back.",
      criterion: "Use the target locale's plural rules and number formatter. Verify 0 projects, 1 project, and 1,284 projects, and check that counts remain legible on narrow screens.",
    },
    "empty-member-list": {
      tip: "Switch the member data to an empty array and compare a blank area with an explicit empty state.",
      criterion: "Test an empty array and a populated list through the same data entry point. Keep the list region and show a clear message when empty. Restore the member rows when data returns.",
    },
    "pagination-boundary": {
      tip: "The edge-case data exactly fills a page of three records. Try Next on the left, then switch back to four regular records and check that both sides paginate.",
      criterion: "With a page size of three, test totals of three and four. Disable Next when the records exactly fill the page. When a fourth record exists, show it on page two and allow navigation back.",
    },
    "date-time-zone": {
      tip: "The same publication time falls on December 31 in Los Angeles and January 1 in Taipei. The right side uses the scheduled Taipei time zone.",
      criterion: "Keep a single timestamp with time zone and format the date in the zone required by the task. Confirm Los Angeles and Taipei produce different calendar dates at New Year and label the zones clearly.",
    },
    "out-of-range-progress": {
      tip: "Compare the progress bars when they receive 142% and −3%. The revised bars display 100% and 0%.",
      criterion: "Use the same 0–100 range for the label, fill, and accessible value. Test inputs of 142, −3, and the normal value of 68.",
    },
    "long-file-name": {
      tip: "End truncation on the left hides the .pdf extension. The right side preserves it and offers a control to reveal the full name in place.",
      criterion: "Test a long file name in a narrow container. Keep the extension visible and let touch and keyboard users reveal the complete name.",
    },
    "tag-overflow": {
      tip: "Compare all 12 tags with a layout that initially shows the first three. Open the remaining tags on the right to see the full list.",
      criterion: "Test a card with many tags and with one unusually long tag. Limit the visible tags by default, show the exact hidden count on the expansion control, and allow long tags to wrap once expanded.",
    },
    "request-retry": {
      tip: "Both sides simulate a failed request. Select Retry on the right to restore the project list.",
      criterion: "Simulate a list request failure and show a clear explanation with an inline retry action. After a successful retry, restore the list and move keyboard focus to the result.",
    },
  },
  "make-interfaces-feel-better": {
    "responsive-text-wrap": {
      tip: "Drag the width slider to compare headline line lengths and lone words at the end of the body copy.",
      criterion: "Use identical content and width on both sides. Compare default wrapping with balanced headlines and pretty body text. Confirm there is no horizontal overflow at narrow widths.",
    },
    "optical-button-padding": {
      tip: "The right side moves 6 px of space from the icon side to the other side to balance the play icon visually. Turn off the padding guides and compare again.",
      criterion: "Keep button width, icon size, and copy the same. Compare equal padding with optical compensation. Check the visual center of the icon and text, the touch target, and keyboard focus.",
    },
    "concentric-radius": {
      tip: "Both inner radii are 12 px. Change the padding to compare a fixed 20 px outer radius with one that adjusts to the padding.",
      criterion: "Use the same inner radius and padding on both sides. The fixed version should match the calculated version at 8 px of padding. After a change, the calculated outer radius should still equal inner radius plus padding.",
    },
    "staggered-entrance": {
      tip: "Switch between three entrances and replay each. The word-by-word version splits only the heading and keeps the body copy together.",
      criterion: "Use the same content to compare a single-block entrance, a staggered group entrance, and a word-by-word heading entrance. Cancel the previous effect on replay and show content immediately with reduced motion.",
    },
    "interruptible-motion": {
      tip: "Toggle the panel rapidly to reverse it mid-motion. The left side jumps to a preset start and the right side reverses from its current position.",
      criterion: "Use one toggle for both panels. Compare fixed-start keyframes with a CSS transition that can change targets. Check the final state after rapid reversals and with reduced motion.",
    },
    "subtle-drawer-exit": {
      tip: "Close the drawer to compare a full slide on the left and a short movement with a fade on the right. Both entrances are the same when reopened.",
      criterion: "Keep drawer content, entrance path, and duration identical. Compare a full slide with a shortened exit and fade. Check the final state after rapid toggling.",
    },
    "contextual-copy-icon": {
      tip: "Copy the sample text to compare an instant icon swap, a crossfade, and a crossfade with scale and blur. Check that the icon eventually switches back.",
      criterion: "Show confirmation only after the copy succeeds. Use the same duration for both animations and keep the icon container the same size. Swap immediately with reduced motion and retain text feedback.",
    },
    "shadow-on-backgrounds": {
      tip: "Switch between light, dark, and photo backgrounds. Compare the solid border and translucent shadow on each. Hover to see the shadow deepen.",
      criterion: "Keep button size, color, and position the same. Check edge definition for both treatments across backgrounds and verify hover and keyboard focus.",
    },
  },
  stageshow: {
    "static-card": {
      tip: "Compare desktop and phone widths to see how the selected customer, amount, and side card guide your attention.",
      criterion: "Switch between desktop and phone previews. Check that the primary information and supporting card are still distinguishable and that cropping preserves meaning.",
    },
    "payout-flow": {
      tip: "Play the payout scene and watch when the steps, connecting lines, and completion state appear. Slow down or step through frames to inspect the timing.",
      criterion: "Reveal steps in reading order and leave time to recognize each piece of information. Hold the completed result on screen.",
    },
    "hero-demo": {
      tip: "Follow the cursor as it opens the toolbar, selects an area, adds a text annotation, and hands content off to the terminal.",
      criterion: "Connect the sequence with clear action cues. Position the cursor before each state change and leave enough time to read the final result.",
    },
    "panel-annotation": {
      tip: "Change the settings palette and follow the connector to the payout button that changes color in the main window.",
      criterion: "Locate the settings panel in open space around the main content and use a connector to tie the setting to its result. Keep the important content visible.",
    },
    "device-pair": {
      tip: "Compare desktop and phone widths and match the payout amount in the dashboard with the lock-screen notification.",
      criterion: "Show enough of the amount and name on both screens to identify the same event. Overlay the phone where there is room.",
    },
    "close-up": {
      tip: "Watch the cursor enable two-factor authentication and see how the enlarged window frame keeps the setting in context.",
      criterion: "Enlarge the full window and keep the settings row, label, and toggle visible. Crop only secondary content and scale the cursor to match.",
    },
    "opposite-corners": {
      tip: "Watch messages appear in the upper right. Compare the space between them and the lower-left copy at desktop and phone widths.",
      criterion: "Place the product view and heading in opposite corners. Verify that arriving messages do not cover the copy and that cropping leaves message text readable.",
    },
    "window-row": {
      tip: "Watch the middle conversation move into review while the side windows use the same row structure to preserve the context of the work.",
      criterion: "Keep window heights and gaps consistent. Put the main window in front and crop only secondary content from the side windows.",
    },
    "fade-crop": {
      tip: "Switch between desktop and phone previews to see how the bottom of the list fades while the deployment records above stay readable.",
      criterion: "Fade only secondary rows. Keep the key records and the window-edge shadow visible and check the crop at different widths.",
    },
    "many-of-one": {
      tip: "Switch between desktop and phone widths and find the only card in the grid that keeps all of its information.",
      criterion: "Use repetition to establish scale and keep the focus card's text visible on a distinct layer. Check that edge cropping does not cut off its information.",
    },
    "corner-chip": {
      tip: "Watch the support availability card appear after the window settles. Switch to phone width to check its relationship to the main content.",
      criterion: "Overlap the status card with a window corner at a distinct elevation. Verify it does not cover primary text.",
    },
    "stacked-cards": {
      tip: "Compare the usage bar and the chart below it to see how desktop and phone previews retain both the summary and the trend.",
      criterion: "Align the cards at equal widths. Show the entire usage summary above and keep the chart's subject identifiable after cropping below.",
    },
    "tilted-stack": {
      tip: "Switch between desktop and phone widths to see how slight rotation in the lower cards frames the top card.",
      criterion: "Expose enough of the lower cards' edges and outlines to establish the stack. Keep the top content clear and the stacking order readable on narrow screens.",
    },
    "chart-scrub": {
      tip: "Follow the pointer to see the reference line, data point, and headline value update together.",
      criterion: "Keep the pointer, reference line, data point, and headline value tied to the same record.",
    },
    "table-edit": {
      tip: "Play the cell edit and watch the total update after the amount is submitted.",
      criterion: "Show the edit and submission result in place, then update the total so the relationship between the two values is clear.",
    },
    presence: {
      tip: "Watch how a name label, cursor, selection, and typing all identify the same collaborator.",
      criterion: "Give each collaborator a consistent name and color. Align their cursor and selection with the actual editing position.",
    },
    "ai-cards": {
      tip: "Play the conversation from options to result and see how answered cards remain in the history.",
      criterion: "Retain submitted choices as a record and put further confirmation actions and results in the corresponding card.",
    },
    share: {
      tip: "Watch the email become a recipient chip, the role menu open, and the invited member appear in the list.",
      criterion: "Keep entry, role selection, and the result visually connected. After success, make the new member and role easy to verify in place.",
    },
    "ai-chat": {
      tip: "Watch the submitted question move into a waiting state, then a streamed answer, followed by sources.",
      criterion: "Present waiting, answer, and sources in reading order. Expand the answer area as content arrives, and keep existing text in the same reading order when sources appear.",
    },
    story: {
      tip: "Follow the connector between the invoice and pricing plan, then compare how the amount changes with usage and tier selection.",
      criterion: "Keep the invoice as the visual anchor and make it clear how usage and tier affect the amount. Confirm usage does not count backward visibly when the loop resets.",
    },
    annotations: {
      tip: "Use the Study menu to choose among eight demos, including chart annotation, measurement, flows, and target tracking. Replay to inspect when connectors appear and update.",
      criterion: "Check that each connector identifies the correct element and that its endpoints and labels follow the target when it moves or resizes.",
    },
    "form-error": {
      tip: "Submit an invalid email to see where the error appears and how it clears after correction.",
      criterion: "Associate the error with the field that caused it. Clear it when corrected and show the success confirmation at the original submit button position.",
    },
    loading: {
      tip: "Watch the skeleton turn into content row by row, then see it reappear on refresh.",
      criterion: "Keep row height, column width, and surrounding structure consistent from loading to loaded. Verify nearby content stays in place.",
    },
    subscriptions: {
      tip: "Follow the subscription chip from payment into the list, and notice when monthly recurring revenue (MRR) updates.",
      criterion: "Use continuous motion to show the chip's source and destination. Update the summary when the list receives it and make the loop reset understandable.",
    },
    choreography: {
      tip: "Switch markets and watch currency, price, payment method, and address fields update in sequence.",
      criterion: "Sequence changes by dependency so currency updates before price. Keep the frame and pay button in place throughout.",
    },
    "dark-hero": {
      tip: "Watch the new deployment row enter, report progress, and change the same status label from deploying to ready.",
      criterion: "Use different background depths for the sidebar and the content. Reserve accent color for the status change and keep the label in place.",
    },
    upload: {
      tip: "Play through the file drop, upload progress, completed entry, and keyboard undo.",
      criterion: "Mark the drop area, synchronize progress with the uploaded size, leave the file record in place on completion, and remove it after undo.",
    },
    reorder: {
      tip: "Pause or step through frames to see the handle grabbed, the row lift, neighboring rows make room, and the row settle.",
      criterion: "Use the same row throughout pickup, movement, and drop. Make the target position visible during the drag and keep the final order consistent with the target.",
    },
    swipe: {
      tip: "Step through frames to see the archive action revealed, the row continue after release, and adjacent rows fill the gap.",
      criterion: "Continue the archive motion in the release direction at a matching speed, then collapse the empty space once the row is removed.",
    },
    "cursor-resize": {
      tip: "Watch the cursor change at the bottom, side, and corners, and see the size readout update during drag.",
      criterion: "Match each handle's cursor direction to its available axis. Update dimensions while dragging and preserve the final size on release.",
    },
    calendar: {
      tip: "Watch the meeting move to the target slot, check each attendee, then undo the move.",
      criterion: "Mark the drop location during drag and align the meeting with the target time. Check attendee status after the drop and verify undo restores the original time and state.",
    },
    "phone-touch": {
      tip: "Watch the event card expand into details, show the running timer, and collapse to its original position.",
      criterion: "Expand the detail view from the original card and keep position and shape traceable in both directions. Check that the timer is readable after expansion.",
    },
    "cursor-morph": {
      tip: "Watch the cursor select four styles in sequence. Pause mid-morph and step through frames to inspect the changing outline.",
      criterion: "Connect movement, press, and shape change on the same cursor. Check position stays continuous across all four shapes and the loop returns to its starting state.",
    },
    "freeform-drag": {
      tip: "Step through the drag to see how the calendar card follows the pointer and when the dashed drop target moves to the next cell.",
      criterion: "Keep the card's offset from the pointer fixed throughout the drag. Snap the target outline to the grid and drop the card into the last indicated cell.",
    },
  },
};
