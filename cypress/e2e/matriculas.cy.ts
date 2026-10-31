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
  const typeField = (selector: string, value: string, retriesLeft = 3) => {
    cy.get(selector).clear().type(value, { delay: 50 });
    cy.get(selector).then(($el) => {
      const current = ($el.val() as string) || "";
      if (current !== value && retriesLeft > 0) {
        cy.wait(300);
        typeField(selector, value, retriesLeft - 1);
      }
    });
  };

  const attempt = (retriesLeft: number) => {
    cy.visit("/login");
    cy.get("#senha", { timeout: 15000 }).should("be.visible");
    cy.wait(3000);

    typeField("#email", email);
    typeField("#senha", senha);

    cy.get("#email").should("have.value", email);
    cy.get("#senha").should("have.value", senha);

    cy.contains("button", "Entrar").click();

    // dá tempo real pro login + redirect terminarem antes de checar a URL,
    // pra não disparar uma tentativa extra enquanto o redirect ainda está em andamento
    cy.wait(3000);

    cy.url().then((url) => {
      if (!url.includes("/dashboard") && retriesLeft > 0) {
        attempt(retriesLeft - 1);
      }
    });
  };

  attempt(3);

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