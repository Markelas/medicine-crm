# Medicine CRM

## Описание проекта  
**Medicine CRM** – веб-приложение для учета и анализа эпидемиологической ситуации, управления картами пациентов, вакцинацией и правами пользователей. Проект состоит из:  
- **Program** – серверная часть на Node.js.  
- **Client** – клиентская часть на React.  

### Основные модули  
- **Авторизация** – вход и регистрация пользователей.  
- **Анализ эпидемиологической ситуации** – главная страница с графиками и статистикой.  
- **Карты пациентов** – управление данными о пациентах.  
- **Экстренные извещения** – автоматическая регистрация опасных инфекционных случаев.  
- **Расследования** – мониторинг эпидемиологических случаев.  
- **МКБ-10** – справочник Международной классификации болезней.  
- **Список вакцин** – каталог вакцин и их характеристик.  
- **Проведение вакцинации** – учет прививок.  
- **Посещение пациентов** – регистрация визитов и ведение историй болезней.  
- **Управление доступами** – настройка прав пользователей (Диспетчер, Администратор).  

## Технологии
- **Frontend:** React, Redux toolkit, MUI, SASS
- **Backend:** Node.js, Express, Mongoose 
- **База данных:**  MongoDB
- **Линтинг:** ESLint + Prettier

## Установка и запуск
```bash
# Клонирование репозитория
git clone https://github.com/Markelas/medicine-crm.git
cd medicine-crm

# Установка зависимостей
npm install

# Запуск локального сервера
npm start

Важно! Для корректного взаимодействия с базой данных необходимо в серверной
части указать переменную окружения MONGODB_URI, которая будет содержать ссылку на вашу MongoDB базу данных.
```

## Скриншоты и обзор страницы

### **Главная страница – "Анализ эпидемиологической ситуации"**  
![image](https://github.com/user-attachments/assets/78b0e7e4-8277-4361-82e7-b727d138266e)  
(продолжение страницы)  
![image](https://github.com/user-attachments/assets/7df8ef2b-d52c-427f-8f12-d296424531d5)

Главный экран отображает:  
✅ График заболеваемости по месяцам.  
📊 Диаграмму доли привитых пациентов.  
⚠️ Среднее число экстренных уведомлений на пациента.  
🔄 Коэффициент распространения заболеваний.  
🔮 Прогноз топ-5 распространенных болезней.

---

### **Карты пациентов**  
![image](https://github.com/user-attachments/assets/233ee824-d510-4e40-a03d-16cf40f2bfc6)

Вкладка с картами пациентов содержит таблицу с основными данными:  
👤 ФИО, пол, дату рождения, место работы и медицинскую информацию.  
✏️ Для каждой записи доступны кнопки просмотра, редактирования и, для администраторов, удаления.  
🔍 Поиск по ФИО упрощает навигацию, а кнопка добавления позволяет создать новую карту пациента.

![image](https://github.com/user-attachments/assets/d2293279-44ea-4689-8edc-ae2f8839643b)  
![image](https://github.com/user-attachments/assets/6a928c8a-a8e6-46db-beef-039fdcca923e)

**Страница пациента**  
📋 Содержит основные сведения (ФИО, дата рождения, пол, место работы и др.), историю болезней с диагнозами, датами, симптомами и лечением, а также список прививок с указанием дат и типов вакцин.  
⚡ Такая организация данных обеспечивает быстрый доступ к медицинскому анамнезу.  
✏️ Внизу страницы расположена кнопка «Редактировать» для внесения изменений.

---

### **Экстренные извещения**  
![image](https://github.com/user-attachments/assets/0ff1b3da-93ed-402e-b071-9de29e5cc3b4)

Вкладка «Экстренные извещения» содержит:  
🚨 Данные о случаях инфекционно опасных заболеваний, создаваемых автоматически на основе информации о пациенте.  
📅 В таблице отображаются ID извещения, дата, имя пациента, код заболевания и другие сведения, позволяя быстро отслеживать ситуацию.  
👁️ Для каждого извещения доступны кнопки просмотра и удаления (последняя – только для администраторов).  
📝 Администраторы могут вручную добавить новое извещение, если оно не было создано автоматически.

![image](https://github.com/user-attachments/assets/defe8bb0-e576-40a2-a2d7-9d556e04f2e9)  
![image](https://github.com/user-attachments/assets/96d7923a-768a-4418-8cba-7dab2a132e94)

---

### **Эпидемиологические расследования**  
![image](https://github.com/user-attachments/assets/ba4e4a70-a0bd-4099-9c9e-3a0c277e5e31)

Вкладка «Эпидемиологические расследования»:  
🔍 Предназначена для мониторинга инфекционных заболеваний.  
📊 Здесь отображаются ID расследования, ID извещения, ФИО пациента и код болезни, что помогает устанавливать связи между случаями. Для каждого расследования доступны кнопки просмотра и удаления (последняя — только для администраторов).  
🔄 Новые расследования создаются автоматически при превышении месячного порога зарегистрированных случаев.

![image](https://github.com/user-attachments/assets/0a196ff6-d556-4354-a9dd-f354338fef21)

✅ Страница «Детали расследования» содержит данные о пациенте и список других заболевших той же болезнью за месяц.  
🧪 Здесь можно внести информацию для расследования, включая лабораторные исследования и данные о контактных лицах.  
💾 После заполнения данные сохраняются с помощью кнопки внизу страницы.

---

### **Список заболеваний МКБ10**  
![image](https://github.com/user-attachments/assets/0c93f86a-a8fb-4cec-a565-5512120bb6fb)

Вкладка «Список заболеваний МКБ-10» содержит:  
🔢 Таблицу с кодами, названиями болезней, порогом случаев и отметкой об инфекционной опасности.  
🗑️ Доступны кнопки удаления и добавления заболевания (только для администраторов).  
🔍 В верхней части страницы предусмотрен поиск для быстрого нахождения нужного заболевания.

---

### **Список вакцин**  
![image](https://github.com/user-attachments/assets/41de3664-7da9-4bb5-8f8b-331a68acc156)

Вкладка «Список вакцин»:  
💉 Аналогична предыдущей, но включает данные о вакцинах: производитель, целевое заболевание, эффективность и рекомендуемый возраст.  
📝 Добавление и удаление записей доступны только администраторам.

---

### **Проведение вакцинации**  
![image](https://github.com/user-attachments/assets/cf3805a8-d27d-4f52-9077-d66f658a4c95)

Вкладка «Проведение вакцинации» предназначена:  
🔍 Для управления процессом вакцинации. Здесь можно найти пациента и вакцину, а также указать дату вакцинации, ревакцинации и медицинское учреждение.

---

### **Посещение пациента**  
![image](https://github.com/user-attachments/assets/7a3bd6c1-d340-4231-9048-f9a49f34ffe4)

Вкладка «Посещение пациента» используется:  
🗓️ Для регистрации визитов. Для быстрого заполнения, она включает поиск пациента и заболевания.  
✍️ А также содержит поля для даты диагноза, выздоровления, симптомов, лечения и дополнительных заметок.

---

### **Доступы**  
![image](https://github.com/user-attachments/assets/f363c35a-f5e2-45c4-8cec-55df3952c0e3)

Вкладка «Доступы»:  
🔑 Доступна только администраторам и предназначена для управления пользовательскими правами.  
👨‍💼 Здесь отображаются все администраторы и диспетчеры, а администратор может изменить права диспетчера, назначив его администратором. Это помогает контролировать роли и безопасность системы.

---

## **Разработчик [Марк Гирфанов](https://github.com/Markelas)**  
**Отказ от ответственности:**
Все совпадения с реальными людьми, событиями или организациями абсолютно случайны. Любые имена, изображения, персонажи или ситуации, упомянутые в данном проекте, не имеют отношения к реальным лицам и являются вымышленными. Этот проект был создан исключительно для образовательных и демонстрационных целей. Все совпадения — это просто случайности.

## **Лицензия**  
Этот проект распространяется под лицензией **Mozilla Public License Version 2.0**.


