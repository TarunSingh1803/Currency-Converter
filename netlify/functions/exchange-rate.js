export async function handler(event, context) {
  const API_KEY = process.env.EXCHANGE_API_KEY;  // Loaded from Netlify environment variables
  const baseCurrency = event.queryStringParameters.base || "USD";

  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch exchange rates" }),
    };
  }
}
