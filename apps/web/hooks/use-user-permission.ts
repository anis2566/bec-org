// apps/web/src/hooks/usePermissions.ts
// React hook for checking permissions in the frontend

import { useMemo, useCallback } from "react";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

export function usePermissions() {
  const trpc = useTRPC();

  // React Query automatically caches these queries
  // staleTime keeps data fresh for 5 minutes without refetching
  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    ...trpc.rbac.getMyPermissions.queryOptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  const { data: roles, isLoading: rolesLoading } = useQuery({
    ...trpc.rbac.getMyRoles.queryOptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const isLoading = permissionsLoading || rolesLoading;

  // Memoize the permission map
  const permissionMap = useMemo(() => {
    if (!permissions) return new Map<string, boolean>();

    const map = new Map<string, boolean>();
    permissions.forEach((permission) => {
      const key = `${permission.module}:${permission.action}`;
      map.set(key, true);
    });
    return map;
  }, [permissions]);

  // Memoize the role map
  const roleMap = useMemo(() => {
    if (!roles) return new Map<string, boolean>();

    const map = new Map<string, boolean>();
    roles.forEach((role) => {
      map.set(role.name, true);
    });
    return map;
  }, [roles]);

  // Memoize the check functions to prevent unnecessary re-renders
  const hasPermission = useCallback(
    (module: string, action: string) => {
      return permissionMap.has(`${module}:${action}`);
    },
    [permissionMap]
  );

  const hasAnyPermission = useCallback(
    (checks: Array<{ module: string; action: string }>) => {
      return checks.some(({ module, action }) =>
        permissionMap.has(`${module}:${action}`)
      );
    },
    [permissionMap]
  );

  const hasAllPermissions = useCallback(
    (checks: Array<{ module: string; action: string }>) => {
      return checks.every(({ module, action }) =>
        permissionMap.has(`${module}:${action}`)
      );
    },
    [permissionMap]
  );

  const hasRole = useCallback(
    (roleName: string) => {
      return roleMap.has(roleName);
    },
    [roleMap]
  );

  const hasAnyRole = useCallback(
    (roleNames: string[]) => {
      return roleNames.some((name) => roleMap.has(name));
    },
    [roleMap]
  );

  // Return memoized object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      permissions: permissions || [],
      roles: roles || [],
      isLoading,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      hasRole,
      hasAnyRole,
    }),
    [
      permissions,
      roles,
      isLoading,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      hasRole,
      hasAnyRole,
    ]
  );
}
