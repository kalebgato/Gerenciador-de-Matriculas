describe("Turmas", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/turmas");
    cy.get(".turma-card", { timeout: 15000 }).should("have.length.greaterThan", 0);
    cy.wait(2000);
  });

  it("lista as turmas existentes", () => {
    cy.get(".turma-card").should("have.length.greaterThan", 0);
  });

  it("filtra turmas por professor", () => {
    cy.get(".turma-card").then(($cards) => {
      const totalAntes = $cards.length;
      cy.get("select.select").first().select(1);
      cy.get(".turma-card").should("have.length.lessThan", totalAntes + 1);
    });
  });

  it("abre o painel de detalhes ao clicar em uma turma", () => {
    cy.get(".turma-card").first().click();
    cy.contains("button", "Entrar", { timeout: 10000 }).should("be.visible");
    cy.contains("button", "Fechar").click();
  });

  it("cria uma nova turma", () => {
    const nomeTurma = `Turma Cypress ${Date.now()}`;

    cy.clickAndWaitForUrl("Nova turma", "/turmas/nova");
    cy.url({ timeout: 10000 }).should("include", "/turmas/nova");
    cy.get("#titulo", { timeout: 10000 }).should("be.visible");
    cy.wait(2000);

    cy.get("#titulo").type(nomeTurma);
    cy.get("#curso").find("option").then((options) => {
      expect(options.length).to.be.greaterThan(1);
    });
    cy.get("#curso").select(1);
    cy.get("#professor").type("Professor Cypress");
    cy.get("#dias").type("Segunda,Quarta");
    cy.get("#horario").type("10:00-12:00");
    cy.get("#preco").type("150");

    cy.contains("button", "Criar turma").click();

    cy.url({ timeout: 10000 }).should("include", "/turmas");
    cy.contains(nomeTurma, { timeout: 10000 }).should("be.visible");
  });

  it("edita o professor de uma turma existente", () => {
    cy.contains(".turma-card", "Turma Cypress").first().click();
    cy.clickAndWaitForUrl("Entrar", "/turmas/");
    cy.url({ timeout: 10000 }).should("match", /\/turmas\/[^/]+$/);
    cy.wait(2000);

    cy.contains("button", "Editar").click();
    cy.get("#editProfessor").clear().type("Professor Editado Cypress");
    cy.contains("button", "Salvar").click();

    cy.contains("strong", "Professor:", { timeout: 10000 })
      .parent()
      .should("contain.text", "Professor Editado Cypress");
  });

  it("exclui uma turma sem alunos matriculados", () => {
    cy.contains(".turma-card", "Turma Cypress").first().click();
    cy.clickAndWaitForUrl("Entrar", "/turmas/");
    cy.url({ timeout: 10000 }).should("match", /\/turmas\/[^/]+$/);
    cy.wait(2000);

    cy.on("window:confirm", () => true);
    cy.contains("button", "Excluir turma").click();

    cy.url({ timeout: 10000 }).should("eq", `${Cypress.config().baseUrl}/turmas`);
  });
});