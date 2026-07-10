import { useEffect, useState } from "react";
import { Crown, User as UserIcon, Trash2 } from "lucide-react";
import { userService, roleService } from "@/services/adminServices";
import { authService } from "@/services/authService";
import { parseApiError } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { useAuthStore } from "@/store/authStore";

// El back a veces devuelve los roles de un usuario como array de strings
// (["Admin", "UserGratis"]) y a veces como array de objetos. El nombre de las
// propiedades puede variar según el DTO del back (name/Name, roleName/
// RoleName, id/Id, roleId/RoleId, etc.), así que estos helpers prueban varias
// variantes para que la detección de rol nunca falle silenciosamente por una
// diferencia de shape, casing, o nombre de propiedad.
function roleName(r) {
  if (typeof r === "string") return r;
  return (
    r?.name ??
    r?.Name ??
    r?.roleName ??
    r?.RoleName ??
    r?.nombre ??
    r?.Nombre
  );
}
function roleIdOf(r) {
  if (typeof r === "string") return undefined;
  return r?.id ?? r?.Id ?? r?.roleId ?? r?.RoleId ?? r?.ID;
}
function roleIdFor(r, allRoles) {
  if (typeof r === "string") {
    const found = allRoles?.find((x) => roleName(x) === r);
    return found ? roleIdOf(found) : undefined;
  }
  return roleIdOf(r);
}

export function AdminUsuariosTab() {
  const [users, setUsers] = useState(null);
  const [roles, setRoles] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const toast = useToast();
  const currentUserId = useAuthStore((s) => s.user?.id);

  // Un usuario es "intocable" (sin toggle ni delete) si tiene rol Admin
  // O si es la cuenta con la que estamos logueados en este momento. Esto
  // último es un resguardo extra: si por algún motivo el rol Admin no viene
  // bien seteado desde el back, igual no podés sacarte los permisos a vos
  // mismo ni eliminarte por accidente.
  function esIntocable(u) {
    const esAdmin = u.roles.some((r) => roleName(r) === "Admin");
    const esYoMismo = currentUserId != null && u.id === currentUserId;
    return esAdmin || esYoMismo;
  }

  async function reload() {
    try {
      const [u, r] = await Promise.all([
        userService.getAll(),
        roleService.getAll(),
      ]);
      // Ayuda para diagnosticar: si algún rol de usuario no matchea con
      // ningún nombre conocido, lo avisamos en consola con el objeto crudo.
      u?.forEach((user) => {
        user.roles?.forEach((r) => {
          if (typeof r !== "string" && roleName(r) === undefined) {
            console.warn(
              "[AdminUsuariosTab] No se pudo detectar el nombre del rol para este objeto, revisá el shape:",
              r,
            );
          }
        });
      });
      setUsers(u);
      setRoles(r);
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  const premiumRole = roles?.find((r) => roleName(r) === "UserPremium");
  const freeRole = roles?.find((r) => roleName(r) === "UserGratis");

  // Activa o desactiva Premium para un usuario. Si ya es premium, lo vuelve a
  // Gratis; si es gratis, lo pasa a Premium. Preserva otros roles (ej. Admin).
  async function togglePremium(user) {
    if (!premiumRole || !freeRole) {
      toast.error(
        "No se encontraron los roles UserGratis/UserPremium en el back.",
      );
      return;
    }
    const esPremium = user.roles.some((r) => roleName(r) === "UserPremium");
    const otrosRoles = user.roles.filter(
      (r) => roleName(r) !== "UserPremium" && roleName(r) !== "UserGratis",
    );
    const nuevosRoleIds = [
      ...otrosRoles
        .map((r) => roleIdFor(r, roles))
        .filter((id) => id !== undefined && id !== null),
      esPremium ? roleIdOf(freeRole) : roleIdOf(premiumRole),
    ];

    setBusyId(user.id);
    try {
      await authService.updateRolesToUser(user.id, nuevosRoleIds);
      toast.success(
        esPremium
          ? `${user.userName} vuelve a ser usuario Gratis.`
          : `${user.userName} ahora es usuario Premium.`,
      );
      reload();
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(user) {
    if (
      !confirm(
        `¿Seguro que querés eliminar a ${user.userName}? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    setDeletingId(user.id);
    try {
      await userService.deleteOneById(user.id);
      toast.success(`${user.userName} fue eliminado.`);
      reload();
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-6">
        {users ? `${users.length} usuarios registrados` : "Cargando..."}
      </p>

      {/* Desktop: tabla */}
      <div className="hidden md:block rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => {
              const esAdmin = u.roles.some((r) => roleName(r) === "Admin");
              const esPremium = u.roles.some(
                (r) => roleName(r) === "UserPremium",
              );
              const intocable = esIntocable(u);
              return (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3 text-foreground font-medium">
                    <div className="flex items-center gap-2">
                      <UserIcon
                        size={14}
                        className="text-muted-foreground shrink-0"
                      />
                      <span className="truncate max-w-[160px]">
                        {u.userName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[220px] truncate">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge esAdmin={esAdmin} esPremium={esPremium} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end items-center gap-3">
                      {!intocable && (
                        <PremiumToggle
                          esPremium={esPremium}
                          busy={busyId === u.id}
                          onToggle={() => togglePremium(u)}
                        />
                      )}
                      {!intocable && (
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={deletingId === u.id}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 shrink-0"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users && users.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">
            No hay usuarios registrados.
          </p>
        )}
      </div>

      {/* Mobile: cards */}
      <div className="md:hidden flex flex-col gap-3">
        {(users ?? []).map((u) => {
          const esAdmin = u.roles.some((r) => roleName(r) === "Admin");
          const esPremium = u.roles.some((r) => roleName(r) === "UserPremium");
          const intocable = esIntocable(u);
          return (
            <div key={u.id} className="rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-foreground font-medium">
                    <UserIcon
                      size={14}
                      className="text-muted-foreground shrink-0"
                    />
                    <span className="truncate">{u.userName}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {u.email}
                  </p>
                </div>
                {!intocable && (
                  <button
                    onClick={() => handleDelete(u)}
                    disabled={deletingId === u.id}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 shrink-0"
                    title="Eliminar usuario"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
                <RoleBadge esAdmin={esAdmin} esPremium={esPremium} />
                {!intocable && (
                  <PremiumToggle
                    esPremium={esPremium}
                    busy={busyId === u.id}
                    onToggle={() => togglePremium(u)}
                  />
                )}
              </div>
            </div>
          );
        })}
        {users && users.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">
            No hay usuarios registrados.
          </p>
        )}
      </div>
    </div>
  );
}

function RoleBadge({ esAdmin, esPremium }) {
  if (esAdmin) {
    return (
      <span className="px-2 py-0.5 rounded-md bg-destructive/10 text-destructive text-xs font-semibold whitespace-nowrap">
        Admin
      </span>
    );
  }
  if (esPremium) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold whitespace-nowrap">
        <Crown size={11} />
        Premium
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold whitespace-nowrap">
      Gratis
    </span>
  );
}

// Switch on/off: apagado = Gratis, encendido = Premium.
function PremiumToggle({ esPremium, busy, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={esPremium}
      disabled={busy}
      onClick={onToggle}
      title={esPremium ? "Pasar a Gratis" : "Pasar a Premium"}
      className={`relative inline-flex items-center h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
        esPremium ? "bg-primary" : "bg-muted border border-border"
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform rounded-full bg-white shadow transition-transform ${
          esPremium ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
