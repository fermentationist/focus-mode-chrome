const GOOGLE_DOCS_URL = "https://docs.google.com/document/";
const BADGE_LABELS = {
  ON: "ON",
  OFF: "",
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: BADGE_LABELS.OFF,
  });
});


chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(GOOGLE_DOCS_URL)) {
    // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === BADGE_LABELS.ON ? BADGE_LABELS.OFF : BADGE_LABELS.ON;
    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    const options = {
      files: ["index.css"],
      target: { tabId: tab.id },
    }

    if (nextState === BADGE_LABELS.ON) {
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS(options);
    } else if (nextState === BADGE_LABELS.OFF) {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS(options);
    }
  }
});
