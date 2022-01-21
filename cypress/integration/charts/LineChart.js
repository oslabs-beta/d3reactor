describe('Line Chart', () => {
  it('should display line chart', () => {
    const width = 600;
    const height = 500;
    cy.visit('localhost:8080');
    cy.viewport(width, height);
    cy.get('[data-testid = line-chart]')
      .should('be.visible')
      .and((chart) => {
        expect(chart.height()).to.eql(500);
        expect(chart.width()).to.eql(600);
      });
  });
});
