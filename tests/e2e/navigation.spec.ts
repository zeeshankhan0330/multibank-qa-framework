import { test, expect } from '@fixtures/pageFixtures';
import { NavigationLabel } from '@pages/HomePage';
import navData from '../data/navLinks.json';

test.describe('Top Navigation @desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('navigation displays expected items at desktop viewport', async ({ homePage }) => {
    await homePage.assertNavigationLinksPresentAndEnabled(navData.labels, navData.count);
  });

  test('should navigate to Explore page successfully', async ({ homePage, explorePage }) => {
    await homePage.clickNavigationLink(NavigationLabel.Explore);
    await explorePage.assertLoaded();
  });

  test('should navigate to Features page successfully', async ({ homePage, featuresPage }) => {
    await homePage.clickNavigationLink(NavigationLabel.Features);
    await featuresPage.assertLoaded();
  });

  test('should navigate to OTC Desk page successfully', async ({ homePage, otcDeskPage }) => {
    await homePage.clickNavigationLink(NavigationLabel.OtcDesk);
    await otcDeskPage.assertLoaded();
  });

  test('should navigate to Company page successfully', async ({ homePage, companyPage }) => {
    await homePage.clickNavigationLink(NavigationLabel.Company);
    await companyPage.assertAllComponentsLoaded();
  });

  test('should navigate to Support page successfully', async ({ homePage, supportPage }) => {
    await homePage.clickNavigationLink(NavigationLabel.Support);
    await supportPage.assertLoaded();
  });

  test('should navigate to Blog page successfully', async ({ homePage, blogPage }) => {
    await homePage.clickNavigationLink(NavigationLabel.Blog);
    await blogPage.assertLoaded();
  });

  test('should navigate to $MBG page successfully', async ({ homePage, mbgPage }) => {
    const newTab = await homePage.clickNavigationLinkInNewTab(NavigationLabel.Mbg);
    await expect(newTab).toHaveURL(/token/i);
    await newTab.bringToFront();
    await mbgPage.assertLoaded(newTab);
  });
});
