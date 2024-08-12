class RoleIterator {
  constructor(role) {
    this.role = role;
    this.parentPermissionsIndex = 0;
    this.permissionsIndex = 0;
  }

  getParentPermissions() {
    const ParentPermissions = [];
    for (let i = 0; i < this.role.parentPermissions.length; i++) {
      ParentPermissions.push(this.role.parentPermissions[i]);
    }
    return ParentPermissions;
  }
}

module.exports = RoleIterator;
