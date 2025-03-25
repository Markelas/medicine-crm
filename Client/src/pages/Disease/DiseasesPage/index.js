import React, { useState, useEffect } from 'react';
import { Button, Pagination, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
   fetchDiseases,
   fetchRemoveDisease,
} from '../../../redux/slices/diseases';
import DiseasesTable from './DiseasesTable';
import SearchField from '../../../components/SearchField';
import styles from './DiseasesPage.module.scss';
import { selectIsAdmin } from '../../../redux/slices/auth';

export const DiseasesPage = () => {
   const dispatch = useDispatch();
   const { diseases } = useSelector((state) => state.diseases);
   const isAdmin = useSelector(selectIsAdmin);

   // Состояние для поиска и пагинации
   const [searchQuery, setSearchQuery] = useState('');
   const [page, setPage] = useState(1);
   const [limit] = useState(10); // Количество элементов на странице
   const [isSearching, setIsSearching] = useState(false); // Состояние для отслеживания поиска

   // Эффект, который срабатывает, когда мы ищем заболевания
   useEffect(() => {
      if (isSearching) {
         dispatch(fetchDiseases({ search: searchQuery, page, limit }));
         setIsSearching(false);
      } else if (!searchQuery) {
         dispatch(fetchDiseases({ search: '', page, limit }));
      }
   }, [dispatch, searchQuery, page, limit, isSearching]);

   const handleDelete = (code) => {
      if (window.confirm('Вы действительно хотите удалить это заболевание?')) {
         dispatch(fetchRemoveDisease(code));
      }
   };

   const handleSearchChange = (query) => {
      setSearchQuery(query); // Обновляем поисковый запрос
   };

   const handleSearchClick = () => {
      setPage(1); // Сбрасываем на первую страницу
      setIsSearching(true); // Активируем состояние поиска
   };

   if (diseases.status === 'loading') {
      return <div>Загрузка...</div>;
   }

   if (diseases.status === 'error') {
      return <div>Произошла ошибка при загрузке данных</div>;
   }

   const diseaseItems = Array.isArray(diseases.items) ? diseases.items : [];

   return (
      <div className={styles.container}>
         <div className={styles.header}>
            <h1>Список заболеваний МКБ10</h1>
            <div className={styles.searchContainer}>
               <SearchField
                  label={'Поиск болезни'}
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
                  <button color='primary' className={styles.addDiseaseButton}>
                     <a href='/diseases/create'>Добавить заболевание</a>
                  </button>
               )}
            </div>
         </div>

         <Paper className={styles.tableContainer}>
            <DiseasesTable
               diseases={diseaseItems}
               handleDelete={handleDelete}
               isAdmin={isAdmin}
            />
         </Paper>

         <div className={styles.paginationContainer}>
            <Pagination
               count={diseases.totalPages} // Общее количество страниц
               page={page} // Текущая страница
               onChange={(e, value) => setPage(value)} // Обработчик изменения страницы
               color='primary' // Цвет пагинации
               shape='rounded' // Округлые кнопки
               size='large' // Размер пагинации
            />
         </div>
      </div>
   );
};
