describe("Matrículas", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/matriculas");
    cy.get("table tbody tr", { timeout: 15000 }).should("have.length.greaterThan", 0);
    cy.wait(2000);
  });

  it("lista as matrículas existentes", () => {
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
  });

  it("filtra matrículas por turma", () => {
    cy.get("select.select").eq(1).find("option").then((options) => {
      expect(options.length).to.be.greaterThan(1);
    });
  });

  it("mostra aviso ao selecionar aluno já matriculado", () => {
    cy.clickAndWaitForUrl("Nova matrícula", "/matriculas/nova");
    cy.url({ timeout: 10000 }).should("include", "/matriculas/nova");
    cy.get("#aluno", { timeout: 10000 }).should("be.visible");
    cy.wait(2000);

    cy.get("#aluno option").should("have.length.greaterThan", 1);
    cy.get("#aluno").then(($el) => {
      const select = $el[0] as HTMLSelectElement;
      select.value = select.options[1].value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    cy.get(".info-panel").should("be.visible");
  });

  it("cria uma matrícula cadastrando um aluno novo", () => {
    const nome = `Matricula Cypress ${Date.now()}`;

    cy.clickAndWaitForUrl("Nova matrícula", "/matriculas/nova");
    cy.url({ timeout: 10000 }).should("include", "/matriculas/nova");
    cy.get("#aluno", { timeout: 10000 }).should("be.visible");
    cy.wait(2000);

    cy.contains("button", "Cadastrar novo aluno").click();
    cy.get("#novoNome", { timeout: 10000 }).should("be.visible");
    cy.wait(500);

    cy.get("#novoNome").type(nome);
    cy.get("#novoCpf").type(String(Date.now()).slice(-11));

    cy.get("#turma option").should("have.length.greaterThan", 1);
    cy.get("#turma").then(($el) => {
      const select = $el[0] as HTMLSelectElement;
      select.value = select.options[1].value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });

    cy.contains("button", "Matricular aluno").click();

    cy.url({ timeout: 10000 }).should("include", "/matriculas");
    cy.contains(nome, { timeout: 10000 }).should("be.visible");
  });

  it("cancela uma matrícula", () => {
    const nome = `MatriculaCancelTeste ${Date.now()}`;

    cy.clickAndWaitForUrl("Nova matrícula", "/matriculas/nova");
    cy.url({ timeout: 10000 }).should("include", "/matriculas/nova");
    cy.get("#aluno", { timeout: 10000 }).should("be.visible");
    cy.wait(2000);

    cy.contains("button", "Cadastrar novo aluno").click();
    cy.get("#novoNome", { timeout: 10000 }).should("be.visible");
    cy.wait(500);

    cy.get("#novoNome").type(nome);
    cy.get("#novoCpf").type(String(Date.now()).slice(-11));
    cy.get("#turma option").should("have.length.greaterThan", 1);
    cy.get("#turma").then(($el) => {
      const select = $el[0] as HTMLSelectElement;
      select.value = select.options[1].value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });

    cy.contains("button", "Matricular aluno").click();

    cy.url({ timeout: 10000 }).should("include", "/matriculas");
    cy.contains(nome, { timeout: 10000 }).should("be.visible");

    cy.on("window:confirm", () => true);

    cy.contains("table tbody tr", nome)
      .contains("button", "Cancelar matrícula")
      .click();

    cy.contains(nome, { timeout: 10000 }).should("not.exist");
  });
});