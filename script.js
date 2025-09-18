// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const resultInput = document.getElementById('result');
const swapBtn = document.getElementById('swap');
const convertBtn = document.getElementById('convert-btn');
const rateInfo = document.getElementById('rate-info');
const errorDiv = document.getElementById('error');
const fromFlagImg = document.getElementById('from-flag');
const toFlagImg = document.getElementById('to-flag');

// Populate currency dropdowns
function populateCurrencyDropdowns() {
    const currencies = Object.keys(countryCurrencyList).sort();
    
    // Clear existing options
    fromCurrency.innerHTML = '';
    toCurrency.innerHTML = '';
    
    // Add options to both dropdowns
    currencies.forEach(currency => {
        const displayName = `${currency} - ${countryCurrencyList[currency] || currencyNames[currency] || currency}`;
        
        // For 'from' dropdown
        const fromOption = document.createElement('option');
        fromOption.value = currency;
        fromOption.textContent = displayName;
        if (currency === 'USD') fromOption.selected = true;
        fromCurrency.appendChild(fromOption);
        
        // For 'to' dropdown
        const toOption = document.createElement('option');
        toOption.value = currency;
        toOption.textContent = displayName;
        if (currency === 'INR') toOption.selected = true;
        toCurrency.appendChild(toOption);
    });
}

// API Configuration
const API_KEY = '59b8b37fc326e0c5ee0a6a60';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

// Exchange rate data
let exchangeRates = {};
let lastUpdated = null;
let baseCurrencyCache = null; // track which base the current exchangeRates belong to

function getFlagUrl(currency) {
    const country = (typeof currencyToCountry !== 'undefined' && currencyToCountry[currency]) ? currencyToCountry[currency] : currency.slice(0, 2);
    // Ensure 2-letter country code and build FlagsAPI URL
    return `https://flagsapi.com/${country}/flat/64.png`;
}

function updateFlags() {
    if (fromFlagImg && fromCurrency?.value) {
        fromFlagImg.src = getFlagUrl(fromCurrency.value);
        fromFlagImg.alt = `${fromCurrency.value} flag`;
        fromFlagImg.loading = 'lazy';
        fromFlagImg.referrerPolicy = 'no-referrer';
    }
    if (toFlagImg && toCurrency?.value) {
        toFlagImg.src = getFlagUrl(toCurrency.value);
        toFlagImg.alt = `${toCurrency.value} flag`;
        toFlagImg.loading = 'lazy';
        toFlagImg.referrerPolicy = 'no-referrer';
    }
}

// Fetch exchange rates from API
async function fetchExchangeRates(baseCurrency) {
    try {
        const response = await fetch(`${API_URL}${baseCurrency}`);
        const data = await response.json();
        
        if (data.result === 'success') {
            exchangeRates = data.conversion_rates;
            lastUpdated = new Date(data.time_last_update_unix * 1000);
            baseCurrencyCache = baseCurrency;
            return true;
        } else {
            throw new Error(data['error-type'] || 'Failed to fetch exchange rates');
        }
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        showError('Failed to fetch exchange rates. Please try again later.');
        return false;
    }
}

// Convert currency
async function convertCurrency() {
    // Reset error
    clearError();
    
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;
    
    // Validate input
    if (isNaN(amount) || amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }
    
    // Check if we need to fetch new rates
    if (!baseCurrencyCache || baseCurrencyCache !== from || isCacheExpired()) {
        const success = await fetchExchangeRates(from);
        if (!success) return;
    }
    
    // Perform conversion
    const rate = exchangeRates[to];
    if (!rate) {
        showError('Unable to find exchange rate for the selected currencies');
        return;
    }
    
    const result = (amount * rate).toFixed(4);
    resultInput.value = result;
    
    // Update rate info
    rateInfo.textContent = `1 ${from} = ${rate.toFixed(6)} ${to}`;
    updateFlags();
    
    if (lastUpdated) {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        rateInfo.textContent += ` • Updated: ${lastUpdated.toLocaleDateString('en-US', options)}`;
    }
}

// Swap currencies
function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    
    // If we already have an amount, convert immediately
    if (amountInput.value) {
        convertCurrency();
    }
    updateFlags();
}

// Check if cache is expired (10 minutes)
function isCacheExpired() {
    if (!lastUpdated) return true;
    const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
    return (new Date() - lastUpdated) > tenMinutes;
}

// Error helpers
function showError(message) {
    if (!message) return clearError();
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function clearError() {
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
}

// Initialize the app
function init() {
    populateCurrencyDropdowns();
    
    // Set default values
    amountInput.value = '1';
    clearError();
    
    // Initial conversion
    convertCurrency();
    updateFlags();
}

// Event Listeners
convertBtn.addEventListener('click', convertCurrency);
swapBtn.addEventListener('click', swapCurrencies);

// Initialize the app when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Convert when amount changes
amountInput.addEventListener('input', () => {
    if (amountInput.value) {
        convertCurrency();
    } else {
        resultInput.value = '';
        rateInfo.textContent = '';
    }
});

// Convert when currency changes
fromCurrency.addEventListener('change', () => {
    if (amountInput.value) {
        convertCurrency();
    }
    updateFlags();
});

toCurrency.addEventListener('change', () => {
    if (amountInput.value) {
        convertCurrency();
    }
    updateFlags();
});
