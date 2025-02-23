const ALARM_NAME = 'whatsapp-job';
const WHATSAPP_URL = 'https://web.whatsapp.com/';
const INTERVAL_IN_MINUTES = 1; // Setting to 1 minute for testing, change to 5 later

// Setup the alarm
async function setupAlarm() {
    const existingAlarm = await chrome.alarms.get(ALARM_NAME);
    if (!existingAlarm) {
        chrome.alarms.create(ALARM_NAME, {
            periodInMinutes: INTERVAL_IN_MINUTES
        });
    }
}

// Execute the job
async function executeJob() {
    try {
        const tabs = await chrome.tabs.query({
            url: `${WHATSAPP_URL}*`
        });

        if (tabs.length > 0) {
            const tab = tabs[0];
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['scripts/contents/contact.js']
            });
        }
    } catch (error) {
        console.error('Error executing job:', error);
    }
}

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) executeJob();
});

// Listen for installation
chrome.runtime.onInstalled.addListener(setupAlarm);

// Initialize when service worker loads
setupAlarm();
