class GoogleSearchPage {
  constructor(page) {
    this.page = page;
    this.searchInput = 'textarea[name="q"]';
    this.searchButton = 'input[value="Google Search"]';
  }

  async navigate() {
    await this.page.goto('http://www.google.com/');
  }

  async search(query) {
    await this.page.fill(this.searchInput, query);
    await this.page.click(this.searchButton);
  }
}

module.exports = GoogleSearchPage;