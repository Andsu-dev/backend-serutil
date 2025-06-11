const { config } = require("dotenv");

config();

const clickUpConfig = {
  apiKey: process.env.CLICKUP_API_TOKEN,
  listId: process.env.CLICKUP_LIST_ID,
  baseUrl: "https://api.clickup.com/api/v2",
};

if (!clickUpConfig.apiKey) {
  throw new Error("CLICKUP_API_KEY environment variable is required");
}

if (!clickUpConfig.listId) {
  throw new Error("CLICKUP_LIST_ID environment variable is required");
}

module.exports = { clickUpConfig };
