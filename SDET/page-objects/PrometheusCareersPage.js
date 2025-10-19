class PrometheusCareersPage {
  constructor(page) {
    this.page = page;
    this.accordionItems = '.accordion-item, .faq-item, [data-toggle="collapse"], .collapse-toggle';
    this.viewAllJobsLink = 'a[href*="jobs"], a[href*="careers"], text=/View All Jobs/i';
  }

  async getAccordionCount() {
    return await this.page.locator(this.accordionItems).count();
  }

  async getAccordionText(index) {
    return await this.page.locator(this.accordionItems).nth(index).textContent();
  }

  async toggleAccordion(index) {
    const accordion = this.page.locator(this.accordionItems).nth(index);
    const isExpanded = await accordion.getAttribute('aria-expanded');
    await accordion.click();
    return isExpanded === 'false';
  }

  async clickViewAllJobs() {
    await this.page.locator(this.viewAllJobsLink).first().click();
  }

  async verifyAccordionsHaveText() {
    const count = await this.getAccordionCount();
    for (let i = 0; i < count; i++) {
      const text = await this.getAccordionText(i);
      if (!text || text.trim() === '') {
        return false;
      }
    }
    return true;
  }

  async verifyAccordionsCanOpenClose() {
    const count = await this.getAccordionCount();
    for (let i = 0; i < count; i++) {
      const wasClosed = await this.toggleAccordion(i);
      // Wait a bit for animation
      await this.page.waitForTimeout(500);
      const isNowOpen = await this.page.locator(this.accordionItems).nth(i).getAttribute('aria-expanded');
      if (wasClosed && isNowOpen !== 'true') {
        return false;
      }
      // Close it again
      await this.toggleAccordion(i);
      await this.page.waitForTimeout(500);
      const isNowClosed = await this.page.locator(this.accordionItems).nth(i).getAttribute('aria-expanded');
      if (isNowClosed !== 'false') {
        return false;
      }
    }
    return true;
  }
}

module.exports = PrometheusCareersPage;