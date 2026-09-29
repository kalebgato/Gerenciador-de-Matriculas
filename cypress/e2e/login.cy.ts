describe("Login", () => {
  it("faz login com credenciais válidas e vai para o dashboard", () => {
    cy.login();
    cy.contains("h1", "Dashboard").should("be.visible");
  });

  it("mostra mensagem de erro com credenciais inválidas", () => {
    cy.visit("/login");
    cy.get("#senha", { timeout: 15000 }).should("be.visible");
    cy.wait(3000);

    cy.get("#email").clear().type("admin@admin.com", { delay: 50 });
    cy.get("#senha").clear().type("senha-errada-123", { delay: 50 });

    cy.get("#email").should("have.value", "admin@admin.com");
    cy.get("#senha").should("have.value", "senha-errada-123");

    cy.contains("button", "Entrar").click();

    cy.url({ timeout: 15000 }).should("include", "/login");
    cy.get(".message.error", { timeout: 10000 }).should("be.visible");
  });

  it("exige email e senha para habilitar o envio", () => {
    cy.visit("/login");
    cy.get("#email").should("have.attr", "required");
    cy.get("#senha").should("have.attr", "required");
  });
});