describe("Pie Chart", () => {
  it("should show pie chart", () => {
    cy.visit("localhost:8080");
    cy.get('[data-test-id = "pie-chart"]')
      .should("be.visible")
      .and((chart) => {
        expect(chart.height()).to.be.greaterThan(480);
      });
  });
});
