/// <reference types="cypress" />

describe("Vendor management test", () => {
  beforeEach(() => {
    cy.loginViaSession();
    cy.visit("/");
  });
  const vendorName = `TEST_VENDOR-${Date.now()}`;
  const editedVendor = "edited_" + vendorName;
  const emailName = `testemail_${Date.now()}@test.com`;
  const editetEmail = "editet_" + emailName;
  it("Manages vendors", () => {
    cy.get('[id="Profile.btn"]').click();
    cy.get('[id="Profile.vendorsBtn"]').click();
    cy.get('[id="VendorPage.addBtn"]').click();
    cy.get('[id="addPage.value"]').type(vendorName);
    cy.get('[id="addPage.submitBtn"]').click();
    cy.contains(vendorName);
    cy.get(`[id="VendorPage.emailsBtn-${vendorName}"]`).click();
    cy.get(`[id="VendorPage.emailNameInput-${vendorName}"]`).type(emailName);
    cy.get(`[id="VendorPage.addEmailBtn-${vendorName}"]`).click();
    cy.contains(emailName);
    cy.get(`[id="VendorPage.editEmailBtn-${emailName}"]`).click();
    cy.get(`[id="VendorPage.editEmailInput-${emailName}"]`).clear();
    cy.get(`[id="VendorPage.editEmailInput-${emailName}"]`).type(editetEmail);
    cy.get(`[id="VendorPage.saveEmailBtn-${emailName}"]`).should("be.visible");
    cy.get(`[id="VendorPage.saveEmailBtn-${emailName}"]`).click();
    cy.contains(editetEmail);
    cy.get(`[id="VendorPage.changeEmailStatusBtn-${editetEmail}"]`).click();
    cy.contains(editetEmail).should("have.class", "line-through");
    cy.get(`[id="VendorPage.editBtn-${vendorName}"]`).click();
    cy.get(`[id="VendorPage.editInput-${vendorName}"]`).clear();
    cy.get(`[id="VendorPage.editInput-${vendorName}"]`).type(editedVendor);
    cy.get(`[id="VendorPage.saveVendor-${vendorName}"]`).click();
    cy.contains(editedVendor);
    cy.get(`[id="VendorPage.activenessBtn-${editedVendor}"]`).contains(
      /active/i,
    );
    cy.get(`[id="VendorPage.activenessBtn-${editedVendor}"]`).click();
    cy.get(`[id="VendorPage.activenessBtn-${editedVendor}"]`).contains(
      /inactive/i,
    );
    cy.get(`[id="VendorPage.activenessBtn-${editedVendor}"]`).click();
    cy.get(`[id="VendorPage.activenessBtn-${editedVendor}"]`).contains(
      /active/i,
    );
  });
});
