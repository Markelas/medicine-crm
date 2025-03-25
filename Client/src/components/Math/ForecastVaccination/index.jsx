import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import styles from './ForecastVaccination.module.scss';

export const ForecastChart = () => {
   const [forecastData, setForecastData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchForecast = async () => {
         try {
            const response = await axios.get('http://localhost:5000/forecast'); // Запрос на сервер
            setForecastData(response.data);
         } catch (err) {
            setError('Ошибка загрузки данных');
         } finally {
            setLoading(false);
         }
      };
      fetchForecast();
   }, []);

   if (loading) return <p>Загрузка...</p>;
   if (error) return <p style={{ color: 'red' }}>{error}</p>;

   // Берем ТОП-5 болезней с наибольшим прогнозируемым значением
   const sortedForecast = [...forecastData]
      .sort(
         (a, b) =>
            b.forecast.reduce((sum, val) => sum + val, 0) -
            a.forecast.reduce((sum, val) => sum + val, 0),
      )
      .slice(0, 5);

   // Генерируем метки оси X: 6 месяцев истории + 6 месяцев прогноза
   const last6Months = ['Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
   const forecastMonths = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'];
   const labels = [...last6Months, ...forecastMonths];

   const chartData = {
      labels,
      datasets: sortedForecast.map((disease, index) => ({
         label: disease.diseaseName, // Отображаем название болезни
         data: [...disease.historicalData.slice(-6), ...disease.forecast], // Берем последние 6 месяцев истории + прогноз
         borderColor: `hsl(${index * 70}, 70%, 50%)`,
         backgroundColor: `hsl(${index * 70}, 70%, 70%)`,
         fill: false,
      })),
   };

   return (
      <div className={styles.root}>
         <h2 className={styles.title}>
            Прогноз заболеваемости (ТОП-5 болезней)
         </h2>
         <Line data={chartData} />
      </div>
   );
};
