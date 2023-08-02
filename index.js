// Import the xlsx library
const XLSX = require("xlsx");

// Read the Excel file
const workbook = XLSX.readFile("./data.xlsx");

// Get the first sheet name
const sheetName = workbook.SheetNames[0];

// Get the worksheet
const worksheet = workbook.Sheets[sheetName];

// Convert the worksheet to JSON
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Access columns by index (starting from 0)
const columnA = jsonData.map((row) => row[0]);
// const columnB = jsonData.map((row) => row[1]);
// ...

// Print the data in the columns
// console.log("Column A:", columnA);
// console.log("Column B:", columnB);

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Go to the LinkedIn login page
  await page.goto(
    "https://www.linkedin.com/in/ACwAAAo3iesB9T8DIa38EbEK2W906q9gJcaWbq0"
  );
  await page.waitForNavigation();

  const signInBtn = await page.$(
    '[data-tracking-control-name="auth_wall_desktop_profile-login-toggle"]'
  );
  await signInBtn.click();

  await page.waitForNavigation();

  const inputMail = await page.$("input");
  await inputMail.type("arpit.jha@ucertify.com");

  // const inputPwd = await page.$("#session_password");
  // await inputPwd.type("arpit123");

  // Close the browser
  // await browser.close();
})();
