/// <reference types="cypress" />

Cypress.Commands.add("clickAndWaitForUrl", (buttonText: string, urlFragment: string, maxRetries = 8) => {
  const attempt = (retriesLeft: number) => {
    cy.contains("button", buttonText).click();
    cy.url().then((url) => {
      if (!url.includes(urlFragment) && retriesLeft > 0) {
        cy.wait(500);
        attempt(retriesLeft - 1);
      }
    });
  };
  attempt(maxRetries);
});

Cypress.Commands.add("login", (email = "admin@admin.com", senha = "123") => {
  cy.visit("/login");
  cy.get("#senha", { timeout: 15000 }).should("be.visible");
  cy.wait(3000);

  cy.get("#email").clear().type(email, { delay: 50 });
  cy.get("#senha").clear().type(senha, { delay: 50 });

  cy.get("#email").should("have.value", email);
  cy.get("#senha").should("have.value", senha);

  cy.contains("button", "Entrar").click();

  cy.url({ timeout: 15000 }).should("include", "/dashboard");
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, senha?: string): Chainable<void>;
      clickAndWaitForUrl(buttonText: string, urlFragment: string, maxRetries?: number): Chainable<void>;
    }
  }
}

export {};