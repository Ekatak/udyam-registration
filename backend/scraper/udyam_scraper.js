import puppeteer from "puppeteer";

// Aadhaar OTP sending
export async function sendAadhaarOtp(aadhaar, name) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://udyamregistration.gov.in/aadhaar-verify");

  await page.type("#aadhaarInput", aadhaar);
  await page.type("#nameInput", name);
  await page.click("#sendOtpBtn");

  await page.waitForSelector("#otpSentMsg", { timeout: 10000 });

  await browser.close();

  return { requestId: Date.now().toString() };
}

// PAN verification
export async function verifyPanDetails(pan, panName) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://udyamregistration.gov.in/pan-verify");

  await page.type("#panInput", pan);
  await page.type("#nameInput", panName);
  await page.click("#verifyBtn");

  await page.waitForSelector("#verificationSuccess", { timeout: 10000 });

  await browser.close();

  return { isValid: true };
}
