// cypress/opprstu / index.d.ts;

declare global {
  namespace Cypress {
    interface Chainable {
      loginViaSession(): Chainable<void>;
    }
  }
}

export {};
