const GOOGLE_DOCS_URL = "https://docs.google.com/document/";

const APP_STATES = {
  OFF: { iconSet: "default" },
  LIGHT: { iconSet: "light", requiredCss: ["css/default.css"] },
  DARK: { iconSet: "dark", requiredCss: ["css/default.css", "css/dark.css"] },
};

const allCssFiles = Array.from(Object.values(APP_STATES).reduce((files, state) => {
  state.requiredCss && state.requiredCss.forEach((file) => files.add(file));
  return files;
}, new Set()));

const ORDERED_STATES = [APP_STATES.OFF, APP_STATES.LIGHT, APP_STATES.DARK];

let currentState = APP_STATES.OFF;

const setIcon = async (state) => {
  await chrome.action.setIcon({
    path: {
      16: `images/icons/${state.iconSet}/icon-16.png`,
      48: `images/icons/${state.iconSet}/icon-48.png`,
      128: `images/icons/${state.iconSet}/icon-128.png`,
    },
  });
};

// set the initial icon
chrome.runtime.onInstalled.addListener(() => {
  setIcon(currentState);
});

chrome.action.onClicked.addListener(async (tab) => {
  // If the current tab is not a Google Docs tab, return
  if (!tab.url.startsWith(GOOGLE_DOCS_URL)) {
    return;
  }
  // cycle through the states to the next state
  const nextState =
    ORDERED_STATES[
      (ORDERED_STATES.indexOf(currentState) + 1) % ORDERED_STATES.length
    ];

  // update the current state
  currentState = nextState;

  // update the icon
  await setIcon(currentState);
  const target = { tabId: tab.id };

  // apply the corresponding CSS file
  await chrome.scripting.removeCSS({ target, files: allCssFiles });
  nextState.requiredCss &&
    (await chrome.scripting.insertCSS({ target, files: nextState.requiredCss }));
});
