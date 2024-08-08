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

  getPermissions() {
    const Permissions = [];
    for (
      let i = 0;
      i <
      this.role.parentPermissions[this.parentPermissionsIndex].permissions
        .length;
      i++
    ) {
      Permissions.push(
        this.role.parentPermissions[this.parentPermissionsIndex].permissions[i]
      );
    }
    return Permissions;
  }
}

module.exports = RoleIterator;
