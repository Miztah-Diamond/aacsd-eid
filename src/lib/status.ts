export const MemberStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type MemberStatusValue = (typeof MemberStatus)[keyof typeof MemberStatus];
