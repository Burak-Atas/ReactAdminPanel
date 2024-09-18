import React from 'react'

const UserRow = ({ user, onApprove, onDelete }) => {
  return (
    <tr key={user.id}>
      <td className="border px-4 py-2">{user.name}</td>
      <td className="border px-4 py-2">{user.user_name}</td>
      <td className="border px-4 py-2">{user.phone_number}</td>
      <td className="border px-4 py-2">{user.level}</td>
      <td className="border px-4 py-2">{user.teacher_name}</td>
      <td
        className={`border px-4 py-2 ${
          user.activate === true ? 'text-red-500' : 'text-green-500'
        }`}
      >
        {user.activate}
      </td>
      <td className="border px-4 py-2">{user.user_type}</td>
      <td className="border px-4 py-2">{user.kayit_tarihi}</td>
      <td className="border px-4 py-2 flex gap-2">
        {user.activate === false && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => onApprove(user.user_name)}
          >
            Onayla
          </button>
        )}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => onDelete(user.user_name)}
        >
          Sil
        </button>
      </td>
    </tr>
  )
}

export default UserRow
