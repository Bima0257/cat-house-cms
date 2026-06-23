import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoles, getRolePermissions, updateRolePermissions } from '../../services/roles';
import { getPermissions } from '../../services/permissions';
import alert from '../../lib/alert';
import DataTable from '../../components/ui/DataTable';
import {
  IconLock,
  IconShield,
  IconStar,
  IconUsers,
  IconShieldCheck,
  IconX,
  IconCheck,
} from '@tabler/icons-react';
import { Button } from '../../components/ui/button';

const roleConfig = {
  super_admin: { icon: IconStar, color: 'bg-amber-100 text-amber-700' },
  admin: { icon: IconShield, color: 'bg-primary-fixed text-primary' },
  staff: { icon: IconUsers, color: 'bg-tertiary-fixed text-tertiary' },
  user: { icon: IconLock, color: 'bg-secondary-fixed text-secondary' },
};



const AdminRoles = () => {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState(null);

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: async () => {
      const res = await getRoles();
      return res.data;
    },
  });

  const { data: permData } = useQuery({
    queryKey: ['admin-all-permissions'],
    queryFn: async () => {
      const res = await getPermissions({ per_page: 200 });
      return res.data;
    },
  });

  const { data: rolePermData, isLoading: rolePermLoading } = useQuery({
    queryKey: ['admin-role-permissions', selectedRole?.id],
    queryFn: async () => {
      if (!selectedRole) return null;
      const res = await getRolePermissions(selectedRole.id);
      return res.data;
    },
    enabled: !!selectedRole,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, permission_ids }) => updateRolePermissions(id, { permission_ids }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-role-permissions'] });
      alert.success('Permission role berhasil diperbarui');
    },
    onError: (err) => {
      alert.error(err.response?.data?.message || 'Gagal memperbarui permission');
    },
  });

  const roles = rolesData?.data || [];
  const allPermissions = permData?.data || [];

  const assignedIds = useMemo(() => {
    if (!rolePermData?.data?.permissions) return [];
    return rolePermData.data.permissions
      .filter((p) => p && p.assigned)
      .map((p) => p.id);
  }, [rolePermData]);

  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (selectedRole && assignedIds.length > 0) {
      setSelectedIds(assignedIds);
    }
  }, [assignedIds, selectedRole]);

  useEffect(() => {
    if (!selectedRole) {
      setSelectedIds([]);
    }
  }, [selectedRole]);

  const openModal = (role) => {
    if (!role || !role.id) return;
    setSelectedRole(role);
  };

  const closeModal = () => {
    setSelectedRole(null);
    setSelectedIds([]);
  };

  const handleSave = () => {
    if (!selectedRole) return;
    updateMutation.mutate({ id: selectedRole.id, permission_ids: selectedIds });
  };

  const togglePermission = (permId) => {
    setSelectedIds((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const columns = useMemo(
    () => [
      {
        key: 'name',
        accessor: 'name',
        header: 'Role',
        enableSorting: true,
        render: (role) => {
          if (!role) return null;
          const config = roleConfig[role.name] || roleConfig.user;
          const IconComponent = config.icon;
          return (
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                <IconComponent size={20} />
              </div>
              <div>
                <p className="font-semibold text-text-dark capitalize">
                  {role.name.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-text-muted">{role.guard_name}</p>
              </div>
            </div>
          );
        },
      },
      {
        key: 'users_count',
        accessor: 'users_count',
        header: 'Jumlah User',
        enableSorting: true,
        render: (role) => (
          <span className="font-semibold text-text-dark">
            {role ? role.users_count : 0} users
          </span>
        ),
      },
      {
        key: 'actions',
        header: 'Aksi',
        enableSorting: false,
        render: (role) => (
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openModal(role);
            }}
            className="bg-primary-fixed/30 text-primary hover:bg-primary-fixed/50 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
          >
            <IconShieldCheck size={16} />
            Atur Permission
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-h2-section text-2xl text-text-dark">Kelola Roles</h1>
        <p className="text-text-muted mt-1">Atur permission untuk setiap role pengguna</p>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        loading={rolesLoading}
        searchPlaceholder="Cari role..."
        showPagination={false}
      />

      {selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light shrink-0">
              <div>
                <h3 className="font-semibold text-lg text-text-dark capitalize">
                  Atur Permission — {selectedRole.name}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Pilih permission yang dimiliki role ini
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 text-text-muted hover:text-text-dark transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
              {rolePermLoading ? (
                <div className="text-center py-8 text-text-muted text-sm">Memuat permissions...</div>
              ) : !Array.isArray(allPermissions) || allPermissions.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm">
                  Belum ada permission. Buat permission terlebih dahulu.
                </div>
              ) : (
                allPermissions.filter(Boolean).map((perm) => {
                  if (!perm || !perm.id) return null;
                  const checked = selectedIds.includes(perm.id);
                  return (
                    <label
                      key={perm.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        checked ? 'bg-primary-fixed/20' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                          checked
                            ? 'bg-primary border-primary text-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {checked && <IconCheck size={14} stroke={3} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-dark font-mono">{perm.name}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePermission(perm.id)}
                        className="sr-only"
                      />
                    </label>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border-light shrink-0">
              <Button
                type="button"
                onClick={closeModal}
                className="bg-gray-100 hover:bg-gray-200 text-text-dark"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {updateMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoles;
