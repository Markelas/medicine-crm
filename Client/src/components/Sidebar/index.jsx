import React from 'react';
import {
   Drawer,
   List,
   ListItem,
   ListItemButton,
   ListItemIcon,
   ListItemText,
   Avatar,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FolderIcon from '@mui/icons-material/Folder';
import BookIcon from '@mui/icons-material/MenuBook';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import styles from './Sidebar.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
   logout,
   selectFullName,
   selectIsAdmin,
   selectIsAuth,
} from '../../redux/slices/auth';
import { HospitalImg } from './icon/hospital';
import { Key, Person } from '@mui/icons-material';

const menuItems = [
   { text: 'Главная', icon: <DashboardIcon />, path: '/' },
   { text: 'Карты пациентов', icon: <PeopleIcon />, path: '/patient-cards' },
   {
      text: 'Экстренные извещения',
      icon: <NotificationsIcon />,
      path: '/notifications',
   },
   { text: 'Расследования', icon: <FolderIcon />, path: '/investigations' },
   { text: 'МКБ10', icon: <BookIcon />, path: '/diseases' },
   { text: 'Список вакцин', icon: <VaccinesIcon />, path: '/vaccines' },
   {
      text: 'Проведение вакцинации',
      icon: <AddCircleIcon />,
      path: '/add-patient-vaccine',
   },
   {
      text: 'Посещение пациента',
      icon: <Person />,
      path: '/patient-disease-record',
   },
];

export const Sidebar = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const location = useLocation();
   const isAuth = useSelector(selectIsAuth);
   const isAdmin = useSelector(selectIsAdmin);
   const fullName = useSelector(selectFullName);

   const user = {
      fullName: fullName,
      role: isAdmin ? 'Администратор' : 'Диспетчер',
   };

   const onClickLogout = () => {
      if (window.confirm('Вы действительно хотите выйти?')) {
         dispatch(logout());
         window.localStorage.removeItem('token');
         navigate('/login');
      }
   };

   const getInitials = (fullName) => {
      const [name, surname] = fullName.split(' ');
      return `${name[0]}${surname[0]}`.toUpperCase();
   };

   if (!isAuth) return null;

   return (
      <Drawer variant='permanent' className={styles.drawer}>
         <div className={styles.logo}>
            <HospitalImg />
            <h2>Клиника №1</h2>
         </div>

         <List>
            {menuItems.map((item) => (
               <ListItem key={item.text} disablePadding>
                  <ListItemButton
                     component={Link}
                     to={item.path}
                     sx={{
                        padding: '16px',
                        margin: '2px 5px',
                        borderRadius: '16px',
                        backgroundColor:
                           location.pathname === item.path
                              ? '#3761f3'
                              : 'transparent',
                        color:
                           location.pathname === item.path
                              ? '#fff'
                              : 'rgba(0, 0, 0, 0.54)',
                        '&:hover': {
                           background: 'rgba(55, 97, 243, 0.1)',
                        },
                     }}
                  >
                     <span className={styles.listItemIcon}>{item.icon}</span>
                     <h4 className={styles.listItemText}>{item.text}</h4>
                  </ListItemButton>
               </ListItem>
            ))}
            {isAdmin && (
               <ListItem disablePadding>
                  <ListItemButton
                     component={Link}
                     to={'/change-user-role'}
                     sx={{
                        padding: '16px',
                        margin: '2px 5px',
                        borderRadius: '16px',
                        backgroundColor:
                           location.pathname === '/change-user-role'
                              ? '#3761f3'
                              : 'transparent',
                        color:
                           location.pathname === '/change-user-role'
                              ? '#fff'
                              : 'rgba(0, 0, 0, 0.54)',
                        '&:hover': {
                           background: 'rgba(55, 97, 243, 0.1)',
                        },
                     }}
                  >
                     <span className={styles.listItemIcon}>
                        <Key />
                     </span>
                     <h4 className={styles.listItemText}>Доступы</h4>
                  </ListItemButton>
               </ListItem>
            )}
         </List>

         <div className={styles.bottomButtons}>
            {user && (
               <div className={styles.userInfo}>
                  <Avatar className={styles.avatar}>
                     {getInitials(fullName)}
                  </Avatar>
                  <div className={styles.userDetails}>
                     <span className={styles.userName}>{fullName}</span>
                     <span className={styles.userRole}>{user.role}</span>
                  </div>
               </div>
            )}

            <ListItem disablePadding className={styles.logout}>
               <ListItemButton onClick={onClickLogout}>
                  <ListItemIcon>
                     <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary='Выйти' />
               </ListItemButton>
            </ListItem>
         </div>
      </Drawer>
   );
};
