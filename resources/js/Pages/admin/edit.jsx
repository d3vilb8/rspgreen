import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';

const Permissions = ({ user, user_type, role, permissions,notif }) => {
  // Log props for debugging
  console.log('Role:', role);
  console.log('Permissions:', permissions);

  const { data, setData, post, errors } = useForm({
    role_name: role ? role.name : '',
    permissions: role ? role.permissions.map(p => p.id) : [],
  });

  const [groupedPermissions, setGroupedPermissions] = useState({});

  useEffect(() => {
    if (permissions) {
      groupPermissions(permissions);
    }
  }, [permissions]);

  const groupPermissions = (permissions) => {
    if (permissions && permissions.length > 0) {
      const grouped = permissions.reduce((groups, permission) => {
        const parts = permission.name.split('_');
        const action = parts[0];
        const entity = parts.slice(1).join('_');

        if (!groups[entity]) groups[entity] = [];
        groups[entity].push({ id: permission.id, action });
        return groups;
      }, {});

      const sortedGrouped = Object.keys(grouped).reduce((sortedGroups, entity) => {
        sortedGroups[entity] = grouped[entity].sort((a, b) => {
          const order = ['view', 'create', 'edit', 'delete'];
          return order.indexOf(a.action) - order.indexOf(b.action);
        });
        return sortedGroups;
      }, {});

      console.log('Sorted Grouped Permissions:', sortedGrouped); // Log the grouped permissions
      setGroupedPermissions(sortedGrouped);
    }
  };

  const handleCheckboxChange = (permissionId) => {
    setData('permissions', data.permissions.includes(permissionId)
      ? data.permissions.filter((id) => id !== permissionId)
      : [...data.permissions, permissionId]
    );
  };

  const handleInputChange = (e) => {
    setData(e.target.name, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    post(`/roles-permission-update/${role.id}`, {
      onSuccess: () => {
        console.log('Role updated successfully!');
      },
      onError: () => {
        console.log('Error updating role.');
      },
    });
  };

  if (!role || !permissions) {
    return <div>Loading...</div>; // Render loading state if data is not yet available
  }

  return (
    <div className='w-[85.2%] ml-[12rem]'>
      <Header user={user} notif={notif}/>
      <Nav user_type={user_type} />

      <form onSubmit={handleSubmit} className='px-[9rem]'>
        <div className="form mt-9">
          <div className="form-group">
            <label htmlFor="role_name">Role Name</label>
            <input
              type="text"
              name="role_name"
              value={data.role_name}
              onChange={handleInputChange}
              className={`form-control ${errors.role_name ? 'is-invalid' : ' w-full'}`}
              required
            />
            {errors.role_name && <div className="invalid-feedback">{errors.role_name}</div>}
          </div>
        </div>

        <div className="form-group">
          {Object.entries(groupedPermissions).map(([entity, permissions]) => (
            <div key={entity} className='flex space-x-2'>
              <h3 className='w-[7rem]'>{entity.charAt(0).toUpperCase() + entity.slice(1)}</h3>
              <div style={{ marginLeft: '20px' }} className='flex space-x-[4rem]'>
                {permissions.map(permission => (
                  <div key={permission.id } className='space-x-2'>
                    <input
                      type="checkbox"
                      name="permissions[]"
                      value={permission.id}
                      checked={data.permissions.includes(permission.id)}
                      onChange={() => handleCheckboxChange(permission.id)}
                    />
                    <label>{permission.action.charAt(0).toUpperCase() + permission.action.slice(1)}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="p-2 mt-4 text-white rounded btn bg-slate-900">
          Update Role
        </button>
      </form>
    </div>
  );
};

export default Permissions;
