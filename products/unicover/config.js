const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

window.SETTINGS = {
    REQUIRE_ACCESS_CODE: false, // Toggle here
    
    ACCESS_CODE: "KTL" + today,
    
    PRICE: 1000, // Base price in paise (₹10)
    
    ENABLE_DISCOUNT: true,
    
    DISCOUNT_CODES: {
        // "KTLOFF": { type: "percent", value: 10 },   // 10% off
        "SAVE5": { type: "flat", value: 500 },     // ₹5 off (500 paise)
        // "FORFREE": { type: "percent", value: 100 }    // Free
    }
};

console.log("Today's Access Code:", ACCESS_CODE);