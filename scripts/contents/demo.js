(async function updateCount() {

    const result = await chrome.storage.local.get("count");
    let value = result.count || 0;  // Access count from result object
    console.log(value);
    value++;
    await chrome.storage.local.set({ count: value });
})();