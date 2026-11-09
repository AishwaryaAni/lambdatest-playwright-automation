// @ts-check
const { test, expect } = require('../fixtures');

test.describe('Contact us', () => {
  test('User can send an enquiry', async ({ page, contactPage }) => {
    await contactPage.open();
    await contactPage.send({
      name: 'Itachi Uchiha',
      email: 'itachi@yopmail.com',
      enquiry: 'Hello, this is an automated test enquiry message.',
    });

    await expect(page).toHaveURL(/route=information(%2F|\/)contact(\.|%2E)success/);
    await expect(contactPage.content).toContainText('Your enquiry has been successfully sent to the store owner!');
  });

  test('Contact form is validated', async ({ contactPage }) => {
    await contactPage.open();
    await contactPage.send({ name: 'A', email: 'not-an-email', enquiry: 'short' });

    await expect(contactPage.fieldErrors.filter({ hasText: 'Name must be between 3 and 32 characters!' })).toBeVisible();
    await expect(contactPage.fieldErrors.filter({ hasText: 'E-Mail Address does not appear to be valid!' })).toBeVisible();
    await expect(contactPage.fieldErrors.filter({ hasText: 'Enquiry must be between 10 and 3000 characters!' })).toBeVisible();
  });
});
