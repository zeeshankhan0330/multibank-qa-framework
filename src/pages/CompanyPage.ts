import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CompanyPage extends BasePage {
  readonly url = '/en/company';

  readonly companyLogo = this.page.getByRole('img', { name: /a tradition of global/i }).nth(1);

  constructor(page: Page) {
    super(page);
  }

  async assertAllComponentsLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/company|about/i);

    const expectedSections = [
      {
        heading: 'Why MultiBank Group?',
        bodyText: [
          'For nearly two decades, MultiBank has built a reputation as one of the world’s most trusted financial institutions.',
          'With a foundation rooted in regulation, transparency, and technological excellence',
          'millions of clients across the globe',
        ],
      },
      {
        heading: 'A tradition of global leadership',
        bodyText: [
          'Founded in 2005, MultiBank has grown into one of the largest financial groups worldwide',
          'Our global presence reflects the confidence customers, partners, and institutions place in us.',
        ],
      },
      {
        heading: 'Innovation with purpose',
        bodyText: [
          'We believe technology should simplify finance.',
          'Everything we build is designed to empower users with clarity, security, and accessibility',
        ],
      },
      {
        heading: 'Integrity built into every decision',
        bodyText: [
          'Trust is earned through consistent action.',
          'Through rigorous risk management and transparent communication',
        ],
      },
      {
        heading: 'The strength behind MultiBank Group',
        bodyText: [
          'Regulation at our core',
          'Proven track record',
          'Secure & trusted',
        ],
      },
      {
        heading: 'Community & Media',
        bodyText: ['The latest news and discussions about MultiBank Group.'],
      },
    ];

    for (const section of expectedSections) {
      await expect(
        this.page.getByRole('heading', { name: new RegExp(section.heading, 'i') }),
        `Company page should render heading: ${section.heading}`
      ).toBeVisible();

      for (const text of section.bodyText) {
        await expect(
          this.page.getByText(text, { exact: false }),
          `Company page should include section text for: ${section.heading}`
        ).toBeVisible();
      }
    }

    await expect(this.companyLogo, 'Company page should render logo content').toBeVisible();
  }
}
