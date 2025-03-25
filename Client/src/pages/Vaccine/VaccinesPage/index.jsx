import React, { useState, useEffect } from 'react';
import { Button, Pagination, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
   fetchVaccines,
   fetchRemoveVaccine,
} from '../../../redux/slices/vaccines';
import VaccinesTable from './VaccinesTable';
import SearchField from '../../../components/SearchField';
import styles from './VaccinesPage.module.scss';
import { selectIsAdmin } from '../../../redux/slices/auth';

export const VaccinesPage = () => {
   const dispatch = useDispatch();
   const { vaccines } = useSelector((state) => state.vaccines);
   const isAdmin = useSelector(selectIsAdmin);

   const [searchQuery, setSearchQuery] = useState('');
   const [page, setPage] = useState(1);
   const [limit] = useState(10);
   const [isSearching, setIsSearching] = useState(false);

   useEffect(() => {
      if (isSearching) {
         dispatch(fetchVaccines({ search: searchQuery, page, limit }));
         setIsSearching(false);
      } else if (!searchQuery) {
         dispatch(fetchVaccines({ search: '', page, limit }));
      }
   }, [dispatch, searchQuery, page, limit, isSearching]);

   const handleDelete = (id) => {
      if (window.confirm('Вы действительно хотите удалить эту вакцину?')) {
         dispatch(fetchRemoveVaccine(id));
      }
   };

   const handleSearchChange = (query) => {
      setSearchQuery(query);
   };

   const handleSearchClick = () => {
      setPage(1);
      setIsSearching(true);
   };

   if (vaccines.status === 'loading') {
      return <div>Загрузка...</div>;
   }

   if (vaccines.status === 'error') {
      return <div>Произошла ошибка при загрузке данных</div>;
   }

   const vaccineItems = Array.isArray(vaccines.items) ? vaccines.items : [];

   return (
      <div className={styles.container}>
         <div className={styles.header}>
            <h1>Список вакцин</h1>
            <div className={styles.searchContainer}>
               <SearchField
                  label={'Поиск вакцины'}
                  onSearchChange={handleSearchChange}
                  className={styles.searchInput}
               />

               <button
                  onClick={handleSearchClick}
                  className={styles.searchButton}
               >
                  Найти
               </button>
               {isAdmin && (
                  <button color='primary' className={styles.addVaccineButton}>
                     <a href='/vaccines/create'>Добавить вакцину</a>
                  </button>
               )}
            </div>
         </div>

         <Paper className={styles.tableContainer}>
            <VaccinesTable
               vaccines={vaccineItems}
               handleDelete={handleDelete}
               isAdmin={isAdmin}
            />
         </Paper>

         <div className={styles.paginationContainer}>
            <Pagination
               count={vaccines.totalPages}
               page={page}
               onChange={(e, value) => setPage(value)}
               color='primary'
               shape='rounded'
               size='large'
            />
         </div>
      </div>
   );
};
