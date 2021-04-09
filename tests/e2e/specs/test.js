// https://docs.cypress.io/api/introduction/api.html

describe("Home test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Welcome to Teeemwork");
    cy.contains("a", "Main App");
    cy.contains("a", "Teeemwork");
    cy.contains("a", "Sign Out");
  });
});
