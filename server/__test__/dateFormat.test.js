const { dateFormat } = require("../utils/dateFormat");

// converts epoch timestamp to YYYY-MM-DD, hh:mm:ss aa
test("return YYYY.MM.DD hh:mm.ss aa timestamp", () => {
  const timestamp = 1699568515165;
  const regex = /^\d{4}-\d{2}-\d{2},\s*\d{1,2}:\d{2}:\d{2}\s*(am|pm)$/i;
  
  // checks return string against regex pattern
  expect(dateFormat(timestamp)).toMatch(regex);
});
