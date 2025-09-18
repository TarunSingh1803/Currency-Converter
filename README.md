# 🌍 Currency Converter

A simple, elegant, and responsive **Currency Converter Web App** that allows users to convert between different world currencies in real time using the [ExchangeRate API](https://www.exchangerate-api.com/).  
The app also displays country flags for selected currencies and provides up-to-date conversion rates.

---

## 🚀 Live Demo
🔗 [View on Netlify](https://tarunsingh1803-currency-converter.netlify.app/)

---

## 📂 Project Structure
Currency-Converter/
├── index.html # Main UI

├── script.js # App logic (conversion, API calls, flags)

├── styles.css # Styling & responsive design

├── codes.js # Currency codes + names
├── currencyToCountry.js # Currency → Country mapping for flags


└── netlify/

└── functions/

└── exchange-rate.js # Serverless function (hides API key)

---

## ✨ Features
- 🌐 **Real-time exchange rates** using ExchangeRate API  
- 🎌 **Country flags** displayed for selected currencies  
- 🔄 **Swap button** to quickly switch between currencies  
- ⚡ **Instant conversion** on input or selection change  
- 📱 **Responsive design** for mobile and desktop  

---

## 🛠️ Tech Stack
- **HTML5**, **CSS3**, **JavaScript (Vanilla JS)**
- **ExchangeRate API** for currency rates
- **FlagsAPI** for country flags
- **Netlify** for deployment

---

## ⚡ How to Run Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/TarunSingh1803/currency-converter.git
   cd Currency-Converter

2. Run Locally
Open index.html in your browser.
(No backend needed for basic usage)

3. Secure API Key with Netlify (Recommended)
-Add your API key in Netlify environment variables (EXCHANGE_API_KEY).

-Use the provided Netlify function (exchange-rate.js) to fetch rates securely.

-Update script.js to call:

   ```bash
   const API_URL = '/.netlify/functions/exchange-rate?base=';
