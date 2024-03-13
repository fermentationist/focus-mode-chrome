const GOOGLE_DOCS_URL = "https://docs.google.com/document/";
const BADGE_LABELS = {
  LIGHT: "☉",
  DARK: "☽",
  OFF: "", // Empty string to remove the badge
}

// Set the badge to 'OFF' when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: BADGE_LABELS.OFF,
  });
});


chrome.action.onClicked.addListener(async (tab) => {
  // Check if the current tab is a Google Docs tab
  if (tab.url.startsWith(GOOGLE_DOCS_URL)) {
    // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Set the next state based on the previous state
    const nextState = prevState === BADGE_LABELS.LIGHT ? BADGE_LABELS.DARK : prevState === BADGE_LABELS.DARK ? BADGE_LABELS.OFF : BADGE_LABELS.LIGHT;
    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    const target = { tabId: tab.id };

    switch (nextState) {
      case BADGE_LABELS.LIGHT:
        await chrome.scripting.insertCSS({ target, files: ["index.css"] });
        break;
      case BADGE_LABELS.DARK:
        await chrome.scripting.insertCSS({ target, files: ["dark.css"] });
        break;
      case BADGE_LABELS.OFF:
        await chrome.scripting.removeCSS({ target, files: ["index.css", "dark.css"] });
        break;
      default:
        throw new Error("Invalid state");
    }
  }
});
