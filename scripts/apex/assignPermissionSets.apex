Id userId = UserInfo.getUserId();

List<Id> existingAssignedPermissionSetIds = new List<Id>();
for (PermissionSetAssignment psa : [
  SELECT PermissionSetId
  FROM PermissionSetAssignment
  WHERE AssigneeId = :userId
]) {
  existingAssignedPermissionSetIds.add(psa.PermissionSetId);
}

List<PermissionSetAssignment> assignments = new List<PermissionSetAssignment>();
for (PermissionSet ps : [
  SELECT Id
  FROM PermissionSet
  WHERE
    IsOwnedByProfile = FALSE
    AND NamespacePrefix != 'force'
    AND Type = 'Regular'
    AND Id NOT IN :existingAssignedPermissionSetIds
]) {
  PermissionSetAssignment assignment = new PermissionSetAssignment(
    PermissionSetId = ps.Id,
    AssigneeId = userId
  );
  assignments.add(assignment);
}

insert assignments;
