import axios from 'axios';
import { TOKEN } from './consts';

const instance = axios.create(
   {
      baseURL: 'http://localhost:5000',
   },
   {
      headers: {
         Authorization: TOKEN,
      },
   },
);

// Добавляем middleware, для проверки, есть ли в localStorage токен
instance.interceptors.request.use((config) => {
   config.headers.Authorization = window.localStorage.getItem('token'); // Изменяем конфигурацию axios
   return config; // Возвращаем
});

export default instance;
