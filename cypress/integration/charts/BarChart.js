describe('Bar Chart', () => {
  it('should show bar chart', () => {
    const width = 1000;
    const height = 900;
    cy.visit('localhost:8080');
    cy.viewport(width, height);
    cy.get('[data-test-id = "bar-chart"]')
      .should('be.visible')
      .and((chart) => {
        expect(chart.width()).to.eql(width);
        expect(chart.height()).to.eql(height);
      });
    cy.get('[data-test-id = "bar-chart-legend"]').should('be.visible');
    cy.get('[data-test-id = "rectangle-1"]').trigger('mouseover');
    cy.get('[data-test-id = "tooltip-bar-chart"]').should('be.visible');
  });
});
