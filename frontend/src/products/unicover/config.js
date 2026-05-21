const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

export const SETTINGS = {
    requireAccessCode: false,
    accessCode: "KTL" + today,

    paymentEnabled: false,
    price: 1000, // Base price in paise (₹10)

    enableDiscount: false, // Disabled if PAYMENT_ENABLED is false
    discountCodes: {
        // "KTLOFF": { type: "percent", value: 10 },   // 10% off
        "SAVE5": { type: "flat", value: 500 },     // ₹5 off (500 paise)
        // "FORFREE": { type: "percent", value: 100 }    // Free
    },

    saveToDB: true,
    saveToDBFromLocalhost: false,

    debugMode: false
};

if (SETTINGS.requireAccessCode) {
    console.log("Today's Access Code:", SETTINGS.accessCode);
}

window.SETTINGS = SETTINGS;

// NEW FEATURE
if (SETTINGS.debugMode) {
    console.log("Configuration Loaded", SETTINGS)
}
