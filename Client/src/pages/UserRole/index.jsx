import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../redux/slices/auth';
import styles from './UserRole.module.scss';

const ChangeUserRole = () => {
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const isAdmin = useSelector(selectIsAdmin);

   useEffect(() => {
      axios
         .get('http://localhost:5000/users')
         .then((response) => {
            setUsers(response.data);
            setLoading(false);
         })
         .catch((error) => {
            console.error('Ошибка при загрузке пользователей', error);
            setLoading(false);
         });
   }, []);

   const handleRoleChange = (userId, isAdmin) => {
      axios
         .patch(
            'http://localhost:5000/update-role',
            { userId, isAdmin },
            {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
               },
            },
         )
         .then((response) => {
            setUsers((prevUsers) =>
               prevUsers.map((user) =>
                  user._id === userId
                     ? { ...user, isAdmin: response.data.user.isAdmin }
                     : user,
               ),
            );
         })
         .catch((error) => {
            console.error('Ошибка при обновлении роли', error);
         });
   };

   if (!isAdmin)
      return (
         <div className={styles.noAccess}>
            У вас нет прав для просмотра этого раздела
         </div>
      );

   return (
      <div className={styles.userManagement}>
         <h1 className={styles.title}>Управление пользователями</h1>
         {loading ? (
            <p>Загрузка...</p>
         ) : (
            <div className={styles.userCards}>
               {users.map((user) => (
                  <div className={styles.userCard} key={user._id}>
                     <div className={styles.userInfo}>
                        <h3 className={styles.userName}>{user.fullName}</h3>
                        <p className={styles.userEmail}>{user.email}</p>
                        <p className={styles.userRole}>
                           {user.isAdmin ? 'Администратор' : 'Диспетчер'}
                        </p>
                     </div>
                     <button
                        className={`${styles.roleBtn} ${user.isAdmin ? styles.remove : styles.assign}`}
                        onClick={() =>
                           handleRoleChange(user._id, !user.isAdmin)
                        }
                     >
                        {user.isAdmin
                           ? 'Снять права администратора'
                           : 'Назначить администратором'}
                     </button>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export default ChangeUserRole;
