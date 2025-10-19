class PrometheusJobsPage {
  constructor(page) {
    this.page = page;
    this.seniorSDETJob = '.BambooHR-ATS-Jobs-Item:has-text("SDET")';
  }

  async isSeniorSDETJobPresent() {
    return await this.page.locator(this.seniorSDETJob).isVisible();
  }

  async getSeniorSDETJobText() {
    try {

      //await this.page.pause();

      let locator = this.page.locator(this.seniorSDETJob);
      let count =  await locator.count();
      console.log('Senior SDET Job Count inside try:', count);
      let text = await locator.textContent();
      console.log('Senior SDET Job Text inside try:', text);
    } catch (e) {
      return "NOT FOUND";
    }
  }
}

module.exports = PrometheusJobsPage;