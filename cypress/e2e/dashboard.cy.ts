describe("Dashboard", () => {
  beforeEach(() => {
    cy.login();
  });

  it("mostra os cards de métricas financeiras", () => {
    cy.contains("Total de Alunos").should("be.visible");
    cy.contains("Pagos").should("be.visible");
    cy.contains("Pendentes").should("be.visible");
    cy.contains("% Inadimplência").should("be.visible");
  });

  it("navega para Turmas pelo card de acesso rápido", () => {
    cy.contains(".quick-card", "Turmas").click();
    cy.url().should("include", "/turmas");
  });

  it("navega para Alunos pelo card de acesso rápido", () => {
    cy.contains(".quick-card", "Alunos").click();
    cy.url().should("include", "/alunos");
  });

  it("navega para Matrículas pelo card de acesso rápido", () => {
    cy.contains(".quick-card", "Matrículas").click();
    cy.url().should("include", "/matriculas");
  });

  it("faz logout e retorna para o login", () => {
    cy.contains("button", "Sair").click();
    cy.url().should("include", "/login");
  });
});