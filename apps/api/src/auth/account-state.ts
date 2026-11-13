// An account can sign in and use its sessions only while it is active and
// not deleted. Shared by login and SessionGuard so both apply the same rule.
export function isOpenAccount(account: {
  is_active: boolean;
  deleted_at: Date | null;
}): boolean {
  return account.is_active && account.deleted_at === null;
}
