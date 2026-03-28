const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

window.SETTINGS = {
    REQUIRE_ACCESS_CODE: false,
    ACCESS_CODE: "KTL" + today,
    
    PAYMENT_ENABLED: false,
    PRICE: 1000, // Base price in paise (₹10)
    
    ENABLE_DISCOUNT: false, // Disabled if PAYMENT_ENABLED is false
    DISCOUNT_CODES: {
        // "KTLOFF": { type: "percent", value: 10 },   // 10% off
        "SAVE5": { type: "flat", value: 500 },     // ₹5 off (500 paise)
        // "FORFREE": { type: "percent", value: 100 }    // Free
    },

    SAVE_TO_DB: true // Set to false to disable saving cover generation data to Database
};

console.log("Today's Access Code:", SETTINGS.ACCESS_CODE);