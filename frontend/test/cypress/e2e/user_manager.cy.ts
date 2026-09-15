/// <reference types="cypress" />

describe("User management test", () => {
  beforeEach(() => {
    cy.loginViaSession();
    cy.visit("/");
  });
  const uniqueEmail = `User-${Date.now()}@email.com`;
  const role = `ROLE-${Date.now()}`;

  it("Manages roles", () => {
    cy.get('[id="Profile.btn"]').click();
    cy.get('[id="Profile.rolesBtn"]').click();
    cy.get('[id="RolePage.addRoleBtn"]').click();
    cy.get('[id="CreateModal.input"]').type(role);
    cy.get('[id="CreateModal.submit"]').click();
    cy.get('[id="RolePage.filterInput"]').type(role);
    cy.contains(role);
    cy.get(`[id="RolePage.editBtn-${role}"]`).should("be.visible");
    cy.get(`[id="RolePage.editBtn-${role}"]`).click();
    cy.get(`[id="RoleEdit.input"]`).type("22233");
    const updatedRole = role + "22233";
    cy.get(`[id="RoleEdit.submit"]`).click();
    cy.get('[id="RolePage.filterInput"]').clear();
    cy.get('[id="RolePage.filterInput"]').type(updatedRole);
    cy.contains(updatedRole);
    cy.get(`[id="RolePage.statusBtn-${updatedRole}"]`).click();
    cy.get(`[id="RoleStatusConfirm.submit"]`).click();
    cy.get('[id="RolePage.filterInput"]').clear();
    cy.get('[id="RolePage.filterInput"]').type(updatedRole);
    cy.get(`[id="RolePage.statusBtn-${updatedRole}"]`).click();
    cy.get(`[id="RoleStatusConfirm.submit"]`).click();
  });
  it("Adds new admin", () => {
    cy.get('[id="Profile.addStaffBtn"]').click();
    cy.get('[id="AddStaffPage.firstName"]').type("Kovacs");
    cy.get('[id="AddStaffPage.lastName"]').type("Janos");
    cy.get('[id="AddStaffPage.email"]').type(uniqueEmail);
    cy.get('[id="AddStaffPage.password"').type(
      Cypress.env("new_user_password"),
    );
    cy.get('[id="AddStaffPage.selectRole"]').select("ADMIN");
    cy.get('[id="AddStaffPage.submitBtn"]').click();

    cy.contains(uniqueEmail);
  });

  it("Adds role to new admin", () => {
    cy.get('[id="Profile.btn"]').click();
    cy.get('[id="Profile.usersBtn"]').click();
    cy.get('[id="UserPage.filterInput"]').type(uniqueEmail);
    cy.get(`[id="UserPage.toggleStatusBtn-${uniqueEmail}"]`).should(
      "be.visible",
    );
    cy.get(`[id="UserPage.toggleMenuBtn-${uniqueEmail}"]`).click();
    cy.get(`[id="UserPage.changeRoleBtn-${uniqueEmail}"]`).click();
    cy.get(`[id="RoleManagement.addRoleBtn-${role}"]`).click();
    cy.get(`[id="RoleManagement.removeRoleBtn-${role}"]`).should("be.visible");
    cy.get(`[id="RoleManagement.removeRoleBtn-${role}"]`).click();
    cy.get(`[id="RoleManagement.addRoleBtn-${role}"]`).should("be.visible");
    cy.get(`[id="RoleManagement.addRoleBtn-${role}"]`).click();
    cy.get('[id="RoleManagement.close"]').click();
    cy.contains(role);
  });
});
