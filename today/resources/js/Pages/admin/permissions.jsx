import Header from '@/Layouts/Header';
import Nav from '@/Layouts/Nav';
// import React,{useState} from 'react'
import { useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

const Permissions = ({ user, user_type, permissions,notif }) => {
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const { data, setData, post, errors } = useForm({
    role_name: '',
    permissions: [],
  });
  // Group permissions by entity when the component mounts or when the permissions prop changes
  useEffect(() => {
    groupPermissions(permissions);
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

      // Sort the permissions in each group based on the preferred order
      const sortedGrouped = Object.keys(grouped).reduce((sortedGroups, entity) => {
        sortedGroups[entity] = grouped[entity].sort((a, b) => {
          const order = ['view', 'create', 'edit', 'delete'];
          return order.indexOf(a.action) - order.indexOf(b.action);
        });
        return sortedGroups;
      }, {});

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
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    // Replace 'roles/store' with your actual route
    post('/roles-permission-store', {
      onSuccess: () => {
        console.log('Permissions saved successfully!');
        // Handle any additional actions on success
      },
      onError: () => {
        console.log('Error saving permissions.');
        // Handle error actions
      },
    });
  };
  return (
    <div className='w-[85.2%] ml-[12rem]'>
      <Header user={user} notif={notif}/>
      <Nav user_type={user_type} />

      <div className="px-[9rem] form mt-9">
        <div className="form-group">
          <input type="text" placeholder='Role Name' className='w-full rounded-md'   name="role_name"
        value={data.role_name}
        onChange={handleInputChange}/>
        {errors.role_name && <div className="invalid-feedback">{errors.role_name}</div>}
        </div>
      </div>

      <div className="px-[9rem] form-group">
        {Object.entries(groupedPermissions).map(([entity, permissions]) => (
          <div key={entity} className='flex space-x-2'>
            <h3 className='w-[7rem]'>{entity.charAt(0).toUpperCase() + entity.slice(1)}</h3> {/* Capitalize entity name */}
            <div style={{ marginLeft: '20px' }} className='flex space-x-[4rem]'>
              {permissions.map(permission => (
                <div key={permission.id} className='space-x-2'>
                  <input  type="checkbox" name="permissions[]"
                  value={permission.id}
                  checked={data.permissions.includes(permission.id)}
                  onChange={() => handleCheckboxChange(permission.id)} />
                  <label>{permission.action.charAt(0).toUpperCase() + permission.action.slice(1)}</label> {/* Capitalize action */}
                </div>
              ))}
            </div>
          </div>
        ))}

<button onClick={handleSubmit} type="submit" className="p-2 mt-4 text-white rounded btn bg-slate-900">Save Permissions</button>
      </div>
    </div>
  );
}

export default Permissions;
