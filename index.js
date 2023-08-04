// Import the xlsx library
const XLSX = require("xlsx");
const fs = require("fs");


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
console.log(typeof columnA);
// console.log("Column B:", columnB);

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Go to the LinkedIn login page
  await page.goto(
    "https://www.linkedin.com/in/ACwAAAo3iesB9T8DIa38EbEK2W906q9gJcaWbq0"
  );

  // console.log('Delaying for 30 seconds...');
  // await new Promise((resolve) => setTimeout(resolve, 30000)); // 3000 milliseconds (3 seconds) delay

  console.log('page loading...');
  page.waitForNavigation();
  console.log('page loaded');
  let clicked = false;
  try{
    const linkedInSignInLink = await page.waitForSelector('a[data-test-id="page-not-found__tertiary-cta-join"]',{timeout:5000})  
    linkedInSignInLink.click();
    clicked = true;
    console.log("Clicked on 'Already on LinkedIn? Sign in'"); 
    console.log('inputing the details...')

    await page.waitForSelector('#username',{timeout:5000});
    const emailField = await page.$('#username');
    await emailField.click();
    await page.type('#username', 'arpit.jha@ucertify.com');

    await page.waitForSelector('#password',{timeout:5000});
    const passwordField = await page.$('#password');
    await passwordField.click();
    await page.type('#password', 'arp12345');

    console.log('details filled')
    try {
      const signInButton = await page.$('button[data-litms-control-urn="login-submit"]');
      await signInButton.click();
      console.log("Clicked on the 'Sign In' button.");
    } catch (error) {
      console.error("Error while clicking the 'Sign In' button:", error);
    }
  }catch(error){
    console.log("Anchor tag not found: Already on LinkedIn? Sign in");
  }
  // console.log('Delaying for 30 seconds...');
  await new Promise((resolve) => setTimeout(resolve, 3000)); // 3000 milliseconds (3 seconds) delay

  if (!clicked) {
      await page.waitForSelector('button[data-tracking-control-name="auth_wall_desktop_profile-login-toggle"]',{timeout:5000});
      const signInButton = await page.$('button[data-tracking-control-name="auth_wall_desktop_profile-login-toggle"]');
      await signInButton.click();
      console.log("Clicked on 'Sign in'");
      console.log('inputing the details...')
  
      await page.waitForSelector('#session_key',{timeout:5000});
      const emailField = await page.$('#session_key');
      await emailField.click();
      await page.type('#session_key', 'arpit.jha@ucertify.com');
      
      // Find the password input field by ID and click on it to focus
      await page.waitForSelector('#session_password',{timeout:5000});
      const passwordField = await page.$('#session_password');
      await passwordField.click();
      await page.type('#session_password', 'arp12345');
    
      console.log('details filled')
      try {
        const signInButton = await page.$('button[data-id="sign-in-form__submit-btn"]');
        await signInButton.click();
        console.log("Clicked on the 'Sign In' button.");
      } catch (error) {
        console.error("Error while clicking the 'Sign In' button:", error);
      }
  }


  console.log('Delaying for 5 seconds...');
  await new Promise((resolve) => setTimeout(resolve, 5000)); // 3000 milliseconds (3 seconds) delay
  
  //change the index here
  for (let index = 75; index < columnA.length; index++) {
    await page.goto(
      columnA[index]
    );
    console.log('page loading...');
    page.waitForNavigation();
    console.log('Delaying for 10 seconds...');
    await new Promise((resolve) => setTimeout(resolve, 10000)); // 3000 milliseconds (3 seconds) delay
    const currentURL = await page.url();
    console.log('Current URL:', currentURL);
    if(currentURL){
      const csvData = `"${currentURL}"\n`;
      fs.appendFileSync("profile_urls.csv", csvData, "utf8");
      console.log("data saved to o/p file , this row index : ",index);
    }else{
      const err = "not found"
      const csvData = `"${err}"\n`;
      fs.appendFileSync("profile_urls.csv", csvData, "utf8");
    }
  }

  // Close the browser
  console.log("data is collected successfully")
  await browser.close();
})();
