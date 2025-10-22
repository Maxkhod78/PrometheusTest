class GoogleSearchResultsPage {
  constructor(page) {
    this.page = page;
    this.results = 'h3';
    this.careersLink = 'a[href*="careers"]';
  }

  async getFirstResultText() {
    return await this.page.locator(this.results).first().textContent();
  }

  async clickCareersLink() {
    await this.page.locator(this.careersLink).first().click();
  }

  async verifySearchResultsContain(text) {
    const resultsText = await this.page.locator('body').textContent();
    return resultsText.includes(text);
  }
}

export default GoogleSearchResultsPage;