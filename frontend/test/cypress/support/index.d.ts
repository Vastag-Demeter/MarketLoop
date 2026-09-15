// cypress/opprstu / index.d.ts;

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Bejelentkezik a superadmin adatokkal a cy.session használatával.
       * @example cy.loginViaSession()
       */
      loginViaSession(): Chainable<void>;
    }
  }
}

export {}; // Fontos, hogy modulként kezelje a TS
