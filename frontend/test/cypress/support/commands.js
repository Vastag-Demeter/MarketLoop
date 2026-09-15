// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("loginViaSession", () => {
  const email = Cypress.env("superadmin_email");
  const password = Cypress.env("superadmin_password");
  cy.session(email, () => {
    cy.visit("/");
    cy.get('[id="Profile.logInBtn"]').click();
    cy.get('[id="LoginPage.email"').type(email);
    cy.get('[id="LoginPage.password"').type(password);
    cy.get('[id="LoginPage.LoginBtn"]').click();
    cy.url().should("not.include", "/login");
  });
});
