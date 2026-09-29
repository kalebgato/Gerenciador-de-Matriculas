describe("Alunos", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/alunos");
    cy.get("table tbody tr", { timeout: 15000 }).should("have.length.greaterThan", 0);
    cy.wait(2000);
  });

  it("lista os alunos cadastrados", () => {
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
  });

  it("busca aluno por nome", () => {
    cy.get('input[placeholder*="Buscar"]').type("Maria Silva");
    cy.contains("table tbody tr", "Maria Silva").should("be.visible");
  });

  it("busca aluno por email", () => {
    cy.get('input[placeholder*="Buscar"]').type("maria@example.com");
    cy.contains("table tbody tr", "Maria Silva").should("be.visible");
  });

  it("filtra por status", () => {
    cy.get("select.select").select("Somente ativos");
    cy.wait(500);
    cy.get("table tbody tr .status.inativo").should("not.exist");
  });

  it("cadastra um novo aluno", () => {
    const nome = `Aluno Cypress ${Date.now()}`;

    cy.clickAndWaitForUrl("Novo aluno", "/alunos/novo");
    cy.url({ timeout: 10000 }).should("include", "/alunos/novo");
    cy.get("#nome", { timeout: 10000 }).should("be.visible");
    cy.wait(2000);

    cy.get("#nome").type(nome);
    cy.get("#cpf").type(String(Date.now()).slice(-11));
    cy.get("#email").type("cypress.aluno@example.com");
    cy.get("#telefone").type("92999998888");

    cy.contains("button", "Cadastrar aluno").click();

    cy.url({ timeout: 10000 }).should("include", "/alunos");
    cy.contains(nome, { timeout: 10000 }).should("be.visible");
  });

  it("formata o CPF automaticamente ao digitar", () => {
    cy.visit("/alunos/novo");
    cy.get("#cpf", { timeout: 15000 }).should("be.visible");
    cy.wait(2000);

    cy.get("#cpf").type("11122233344");
    cy.get("#cpf").should("have.value", "111.222.333-44");
  });

  it("formata o telefone automaticamente ao digitar", () => {
    cy.visit("/alunos/novo");
    cy.get("#telefone", { timeout: 15000 }).should("be.visible");
    cy.wait(2000);

    cy.get("#telefone").type("92999998888");
    cy.get("#telefone").should("have.value", "(92) 99999-8888");
  });

  it("ativa e desativa um aluno pela listagem", () => {
    cy.get('input[placeholder*="Buscar"]').type("Maria Silva");

    cy.contains("table tbody tr", "Maria Silva").within(() => {
      cy.contains("button", "Desativar").click();
    });

    cy.contains("table tbody tr", "Maria Silva", { timeout: 10000 }).within(() => {
      cy.contains(".status", "Inativo").should("be.visible");
      cy.contains("button", "Ativar").click();
    });

    cy.contains("table tbody tr", "Maria Silva", { timeout: 10000 }).within(() => {
      cy.contains(".status", "Ativo").should("be.visible");
    });
  });

  it("edita os dados de um aluno", () => {
    cy.get('input[placeholder*="Buscar"]').type("Maria Silva");
    cy.contains("table tbody tr", "Maria Silva").contains("button", "Editar").click();

    cy.url({ timeout: 10000 }).should("match", /\/alunos\/[^/]+$/);
    cy.get("body", { timeout: 10000 }).should("be.visible");
    cy.wait(2000);

    cy.contains("button", "Editar").click();
    cy.get("#editTelefone").clear().type("92988887777");
    cy.contains("button", "Salvar").click();

    cy.contains("button", "Editar", { timeout: 10000 }).should("be.visible");
    cy.contains("strong", "Telefone:", { timeout: 10000 })
      .parent()
      .should("contain.text", "(92) 98888-7777");
  });
});