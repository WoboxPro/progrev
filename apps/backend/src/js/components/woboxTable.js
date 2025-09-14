import { create, watch, _div } from "/src/js/components/woboxNew.js";
export function updateWatch(watch,data){
    watch.length = 0;

    data.forEach(item => {
        watch.push(item);
    });
}
class UI__TABLE{
    static modal(){
        const element = create("div", {
            style: `
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.3);
                display: flex; align-items: center; justify-content: center;
                z-index: 3000;
            `
        });
        return element;
    }
    static boxModal( option ){
        const element = create("div", {
            parent: option.parent,
            style: `
                background: white; padding: 24px 32px; border-radius: 10px; min-width: 350px; min-height: 200px;
                position: relative;
                box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            `
        });
        return element;
    }
}

class STYLE__TABLE{
    static showDataRowBtn(){
        const style = `
                    position: absolute;
                    right: 4px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 2;
                    background: inherit;
                    border: none;
                    border-radius: 4px;
                    padding: 2px 8px;
                    cursor: pointer;
                    font-size: 14px;
                    opacity: 0.7;
                    transition: opacity 0.2s;
                    display: grid;
                    align-items: center;
                `;
        return style;
    }
    static showDataRow(){
        const style = `
                        grid-column: 1 / -1;
                        border: 1px solid #ddd;
                        padding: 10px 20px 10px 10px;
                        font-size: 14px;
                        color: #333;
                        position: relative;
                `;
        return style;
    }

    static menuCont(){
        const style = `
                display: none;
                position: absolute;
                background: white;
                border: 1px solid #ccc;
                padding: 10px;
                z-index: 1000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        return style;
    }
    static btn(){
        const style = `
            padding: 5px 10px;
            cursor: pointer;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            font-weight: bold;
            background: #f8f9fa;
        `;
        return style;
    }
    static headerCell(){
        const style = `
            .$class{
                display: grid;
                align-items: center;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                user-select: none;
                position: relative;
                padding-right: 20px;
                padding-left: 10px;
            }
            .$class:hover {
                background-color: #ddd;
            }
            .$class::after {
                content: "⇅";
                position: absolute;
                right: 5px;
                opacity: 0.5;
            }
            .$class.asc::after {
                content: "↑";
                opacity: 1;
            }
            .$class.desc::after {
                content: "↓";
                opacity: 1;
            }
        `;
        return style;
    }
}
export class CreateTable{
    constructor( obj ){
        /* obj
            {
                label: "label", -- no required
                columns: [ ... ] // теперь не обязательно
                data: [ ... ]
                option: [...]
            }
        */
        // all property for table
        this.index = null;
        this.styleColumns = "";
        this.data = obj.data;
        this.callback = obj.callback;
        this.options = obj.options || {
            color: {
                bgColor: "#ffffff",
                textColor: "#222222",
                bgColorHeader: "#5880df",
                textColorHeader: "#ffffff"
            }
        };

        // --- АВТОГЕНЕРАЦИЯ КОЛОНОК ---
        this._autoColumns = false;
        let generatedColumns = [];
        if (!obj.columns || obj.columns.length === 0) {
            this._autoColumns = true; // Флаг, что колонки генерируются автоматически
            if (Array.isArray(this.data) && this.data.length > 0) {
                const first = this.data[0];
                // Если первый элемент - массив, генерируем columnN
                if (Array.isArray(first)) {
                    for (let i = 0; i < first.length; i++) {
                        generatedColumns.push({ name: `column${i+1}`, key: i, width: "1fr" });
                    }
                // Если первый элемент - объект (и не null), генерируем по ключам
                } else if (typeof first === 'object' && first !== null) {
                    Object.keys(first).forEach(key => {
                        generatedColumns.push({ name: key, key: key, width: "1fr" });
                    });
                }
            }
            // Присваиваем сгенерированные колонки, если они есть
            this.columns = generatedColumns;
        } else {
            this.columns = obj.columns;
        }

        // Сначала определяем видимые колонки
        this.visibleColumns = this.columns.filter(col => !col.hidden);
        this.styleColumns = this.visibleColumns.map(col => col.width).join(" ");
        //create table
        this.cont = create("div",{
            style: `
                box-sizing: border-box;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: auto;
            `
        });

        // --- ДОБАВЛЯЕМ ПОДПИСКУ НА ДАННЫЕ ДЛЯ АВТОКОЛОНОК ---
        if (this._autoColumns && Array.isArray(this.data) && this.data.length === 0 && this.data.callbacks) {
            this.data.callbacks.push(() => {
                // Перегенерируем колонки, если они еще не были созданы
                // и если появились данные
                if (this.columns.length === 0 && this.data.length > 0) {
                    const first = this.data[0];
                    let newColumns = [];
                    // Если первый элемент - массив
                    if (Array.isArray(first)) {
                        for (let i = 0; i < first.length; i++) {
                            newColumns.push({ name: `column${i+1}`, key: i, width: "1fr" });
                        }
                    // Если первый элемент - объект
                    } else if (typeof first === 'object' && first !== null) {
                        Object.keys(first).forEach(key => {
                            newColumns.push({ name: key, key: key, width: "1fr" });
                        });
                    }
                    this.columns = newColumns;
                    // Устанавливаем цвета для новых колонок
                    if(this._autoColumns){

                    }

                    this.updateVisibleColumns();
                }
            });
        }

        if( obj.label ){
            this.renderLabel( obj);
        };
        this.tableTitleCont = create("div",{
            parent: this.cont,
            style: `
                display: grid;
            `
        });
        this.visibleColumns.forEach( (column, index) =>{
            const headerCell = this.headerCell({column, index});
        });
        this.tableTitleCont.style.cssText = `
            display: grid;
            grid-template-columns: ${this.styleColumns};
            background-color: #f8f9fa;
            box-sizing: border-box;
            min-height: 40px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        `;
        this.rowCont = create("div",{
            parent: this.cont,
            style:`
                display: grid;
            `
        });

        // Текущее состояние сортировки
        this.sortState = {
            column: null,
            direction: 'asc' // 'asc' или 'desc'
        };

        // Создаем контейнер для фильтров и кнопок
        this.filterContainer = create("div", {
            parent: this.cont,
            style: `
                display: flex;
                gap: 10px;
                margin: 10px 0;
            `
        });

        // Поле поиска
        this.filterInput = create("input", {
            parent: this.filterContainer,
            style: `
                flex: 1;
                padding: 5px;
                box-sizing: border-box;
            `,
            events: {
                input: (e) => this.filterTable(e.target.value)
            },
            attr: {
                placeholder: "Поиск..."
            }
        });

        // Кнопка для выбора колонок поиска
        this.filterColumnsButton = create("button", {
            parent: this.filterContainer,
            text: "Поиск по колонкам",
            style: STYLE__TABLE.btn(),
            events: {
                click: () => this.toggleFilterMenu()
            }
        });

        // Кнопка для управления видимостью колонок
        this.visibilityButton = create("button", {
            parent: this.filterContainer,
            text: "Видимость колонок",
            style: STYLE__TABLE.btn(),
            events: {
                click: () => this.toggleVisibilityMenu()
            }
        });

        // Добавляем кнопку группировки
        this.groupButton = create("button", {
            parent: this.filterContainer,
            text: "Группировать",
            style: STYLE__TABLE.btn(),
            events: {
                click: () => {
                    this.renderGroupModal();
                }
            }
        });

        // Меню для фильтрации
        this.filterMenu = create("div", {
            parent: this.cont,
            style: STYLE__TABLE.menuCont()
        });

        // Меню для видимости
        this.visibilityMenu = create("div", {
            parent: this.cont,
            style: STYLE__TABLE.menuCont()
        });



        // Добавляем чекбоксы только для видимых колонок в меню фильтрации
        this.filterCheckboxes = {};

        // Сохраняем выбранные колонки только для видимых колонок
        this.selectedColumns = new Set(this.visibleColumns.map(col => col.name));

        // Сохраняем оригинальные данные
        this.originalData = obj.data;
        // Создаем отдельный массив для отображения
        this.displayData = watch([]);
        // Инициализируем отображаемые данные
        this.originalData.forEach(item => this.displayData.push(item));
        
        // Используем displayData вместо data для отображения
        this.data = this.displayData;

        // Добавляем callback для обновления displayData при изменении originalData
        this.originalData.callbacks.push(() => {
            this.displayData.length = 0;
            this.originalData.forEach(item => this.displayData.push(item));
        });

        // Добавляем чекбокс "Все колонки" для видимости
        const allVisibleCheckbox = create("div", {
            parent: this.visibilityMenu,
            style: `
                margin-bottom: 5px;
                padding: 5px;
                cursor: pointer;
            `,
            events: {
                click: () => this.toggleAllVisibility()
            }
        });

        // Добавляем чекбоксы для всех колонок
        this.visibilityCheckboxes = {};

        // Настройки таблицы
        this.settings = {
            pagination: {
                enabled: false,
                pageSize: 10,
                currentPage: 1
            }
            // Здесь можно добавить другие настройки в будущем
        };

        // Кнопка Settings
        this.settingsButton = create("button", {
            parent: this.filterContainer,
            text: "Settings",
            style: STYLE__TABLE.btn(),
            events: {
                click: () => this.openSettingsModal()
            }
        });

        this.expandedRows = new Set(); // Для хранения раскрытых строк

        this.render();
        this.displayData.callbacks.push(() => {
            this.render();
        });
        
        // Создаем объект с методами и контейнером
        const table = {
            container: this.cont,
            addRow: (rowData) => this.addRow(rowData),
            removeRow: (index) => this.removeRow(index),
            updateRow: (index, newData) => this.updateRow(index, newData),
            getData: () => this.getData(),
            clear: () => this.clear()
        };
        this.updateFilterMenu();
        this.updateVisibilityMenu();
        
        return table;
    }
    renderLabel( obj ){
        this.tableTitle = create("div",{
            parent: this.cont,
            text: obj.label,
            style: `
                font-size: 20px;
                font-weight: bold;
            `
        });
    }
    renderGroupModal(){
        // Создаем модальное окно выбора поля
        const selectModal = create("div", {
            style: `
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.3);
                display: flex; align-items: center; justify-content: center;
                z-index: 2000;
            `
        });
        const selectBox = create("div", {
            parent: selectModal,
            style: `
                background: white; padding: 20px; border-radius: 8px; min-width: 300px;
            `
        });
        create("div", {
            parent: selectBox,
            text: "Выберите поле для группировки:",
            style: "margin-bottom: 10px; font-weight: bold;"
        });
        const select = create("select", {
            parent: selectBox,
            style: "width: 100%; padding: 5px; margin-bottom: 15px;"
        });
        // Добавляем опции для всех видимых колонок с key
        this.columns.forEach(col => {
            if (!col.hidden && col.key) {
                const option = document.createElement("option");
                option.value = col.key;
                option.textContent = col.name;
                select.appendChild(option);
            }
        });
        // Кнопка OK
        create("button", {
            parent: selectBox,
            text: "Группировать",
            style: STYLE__TABLE.btn(),
            events: {
                click: () => {
                    const key = select.value;
                    document.body.removeChild(selectModal);
                    if (key) {
                        const groupedTable = new GroupedTable(this.data, this.columns, key);
                        groupedTable.show();
                    }
                }
            }
        });
        // Кнопка отмены
        create("button", {
            parent: selectBox,
            text: "Отмена",
            style: STYLE__TABLE.btn(),
            events: {
                click: () => document.body.removeChild(selectModal)
            }
        });
        document.body.appendChild(selectModal);
        
    }
    render(){
        this.rowCont.innerHTML = "";
        if (!this.data || this.data.length === 0) return;

        // --- Пагинация ---
        let renderData = this.data;
        let totalPages = 1;
        if (this.settings.pagination.enabled) {
            const pageSize = this.settings.pagination.pageSize;
            let currentPage = this.settings.pagination.currentPage;
            totalPages = Math.ceil(this.data.length / pageSize) || 1;
            if (currentPage > totalPages) currentPage = totalPages;
            if (currentPage < 1) currentPage = 1;
            this.settings.pagination.currentPage = currentPage;
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            renderData = this.data.slice(start, end);
        }
        // ---

        const self = this;
        // Проверяем тип данных на основе первого элемента
        const firstItem = renderData[0];
        const isObjectData = typeof firstItem === 'object' && !Array.isArray(firstItem) && firstItem !== null;

        renderData.forEach( (dataItem, index) =>{
            const rowDataObject = {};
            if (isObjectData) {
                Object.assign(rowDataObject, dataItem);
            } else {
                this.columns.forEach((column, colIndex) => {
                    rowDataObject[column.name] = dataItem[colIndex];
                });
            }

            // Контейнер строки (относительное позиционирование)
            const row = create("div",{
                parent: this.rowCont,
                css:`
                    {
                        display: grid;
                        grid-template-columns: ${this.styleColumns};
                        cursor: pointer;
                        position: relative;
                        min-height: 30px;
                        outline: 1px solid #eee;
                       
                    }
                `,
                events: {
                    mouseenter: () => { row.style.filter = "brightness(0.93)"; },
                    mouseleave: () => { row.style.filter = ""; },
                    click: () => {
                        if (this.callback) {
                            // Найти колонку с primary: true
                            let primaryCol = this.columns.find(col => col.primary);
                            let primaryKey = undefined;
                            if (primaryCol) {
                                if (isObjectData) {
                                    primaryKey = dataItem[primaryCol.key || primaryCol.name];
                                } else {
                                    const primaryIndex = this.columns.indexOf(primaryCol);
                                    primaryKey = dataItem[primaryIndex];
                                }
                            }
                            const option = {
                                primaryKey
                            };
                            this.callback(dataItem, index, rowDataObject, option);
                        }
                    }
                }
            });

            // Кнопка раскрытия справа (абсолютно)
            const expandBtn = create("button", {
                parent: row,
                text: self.expandedRows.has(index) ? "-" : "+",
                style: STYLE__TABLE.showDataRowBtn(),
                events: {
                    click: (e) => {
                        e.stopPropagation();
                        if (self.expandedRows.has(index)) self.expandedRows.delete(index);
                        else self.expandedRows.add(index);
                        self.render();
                    }
                }
            });

            // Отображаем только видимые колонки
            this.visibleColumns.forEach((column) => {
                let cellValue;
                if (isObjectData) {
                    cellValue = dataItem[column.key || column.name];
                } else {
                    const originalIndex = this.columns.findIndex(c => c.name === column.name);
                    cellValue = dataItem[originalIndex];
                }
                create("div",{
                    parent: row,
                    text: cellValue ?? '',
                    style: `
                        background: ${column.bgColor || this.options.color.bgColor}; 
                        color: ${column.textColor || this.options.color.textColor}; 
                        display: grid; 
                        align-items: center;
                        padding-left: 5px;
                        font-weight: ${column.bold ? 'bold' : 'normal'};
                        text-align: ${column.textAlign || 'left'};
                    `,
                    
                });
            });

            // Если строка раскрыта — показываем подробности под строкой
            if (self.expandedRows.has(index)) {
                // Блок с подробной информацией
                const details = create("div", {
                    parent: this.rowCont,
                    style: STYLE__TABLE.showDataRow()
                });

                // Добавляем заголовок секции с колонками
                create("div", {
                    parent: details,
                    text: "Колонки:",
                    style: "font-weight: bold; margin-bottom: 8px; color: #333;"
                });

                // Список всех колонок, включая скрытые
                this.columns.forEach(col => {
                    let value = isObjectData ? dataItem[col.key || col.name] : dataItem[this.columns.indexOf(col)];
                    create("div", {
                        parent: details,
                        text: `${col.name}: ${value ?? ''}`,
                        style: `margin-bottom: 2px; color: ${col.hidden ? '#aaa' : '#222'};`
                    });
                });

                // Добавляем разделитель
                create("div", {
                    parent: details,
                    style: `
                        height: 1px;
                        background: #ccc;
                        margin: 10px 0;
                    `
                });

                // Добавляем заголовок секции со всеми данными
                create("div", {
                    parent: details,
                    text: "Все данные:",
                    style: "font-weight: bold; margin-bottom: 8px; color: #333;"
                });

                // Выводим все данные объекта
                if (isObjectData) {
                    Object.entries(dataItem).forEach(([key, value]) => {
                        // Пропускаем те ключи, которые уже показаны в колонках
                        if (!this.columns.some(col => (col.key || col.name) === key)) {
                            create("div", {
                                parent: details,
                                text: `${key}: ${value ?? ''}`,
                                style: "margin-bottom: 2px; color: #666;"
                            });
                        }
                    });
                } else {
                    // Для массивов показываем все элементы с их индексами
                    dataItem.forEach((value, idx) => {
                        create("div", {
                            parent: details,
                            text: `[${idx}]: ${value ?? ''}`,
                            style: "margin-bottom: 2px; color: #666;"
                        });
                    });
                }
            }
        });

        // --- Навигация по страницам ---
        // Удаляем старую навигацию, если есть
        if (this.paginationNav && this.paginationNav.parentNode) {
            this.paginationNav.parentNode.removeChild(this.paginationNav);
            this.paginationNav = null;
        }
        if (this.settings.pagination.enabled && totalPages > 1) {
            this.paginationNav = create("div", {
                style: `
                    display: flex; gap: 8px; align-items: center;
                    justify-content: flex-end;
                    margin: 10px 0 0 0;
                `
            });
            // Кнопка назад
            const prevBtn = create("button", {
                parent: this.paginationNav,
                text: "<",
                events: {
                    click: () => {
                        if (this.settings.pagination.currentPage > 1) {
                            this.settings.pagination.currentPage--;
                            this.render();
                        }
                    }
                }
            });
            prevBtn.disabled = (this.settings.pagination.currentPage === 1);

            // Текст с номером страницы
            create("span", {
                parent: this.paginationNav,
                text: `Page ${this.settings.pagination.currentPage} of ${totalPages}`,
                style: "margin: 0 8px;"
            });

            // Кнопка вперед
            const nextBtn = create("button", {
                parent: this.paginationNav,
                text: ">",
                events: {
                    click: () => {
                        if (this.settings.pagination.currentPage < totalPages) {
                            this.settings.pagination.currentPage++;
                            this.render();
                        }
                    }
                }
            });
            nextBtn.disabled = (this.settings.pagination.currentPage === totalPages);

            // Вставляем навигацию после блока с таблицей
            this.rowCont.parentNode.insertBefore(this.paginationNav, this.rowCont.nextSibling);
        }
    }
    // Добавить новую строку
    addRow(rowData) {
        this.originalData.push(rowData);
        this.displayData.push(rowData);
    }

    // Удалить строку по индексу
    removeRow(index) {
        const itemToRemove = this.displayData[index];
        this.originalData.splice(this.originalData.indexOf(itemToRemove), 1);
        this.displayData.splice(index, 1);
    }

    // Обновить строку по индексу
    updateRow(index, newData) {
        const oldData = this.displayData[index];
        const originalIndex = this.originalData.indexOf(oldData);
        
        this.originalData[originalIndex] = newData;
        this.displayData[index] = newData;
    }

    // Получить все данные
    getData() {
        return this.data;
    }

    // Очистить таблицу
    clear() {
        this.originalData.length = 0;
        this.displayData.length = 0;
    }

    sortByColumn(columnIndex, column) {
        // Определяем направление сортировки
        if (this.sortState.column === columnIndex) {
            this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortState.column = columnIndex;
            this.sortState.direction = 'asc';
        }

        // Сортируем данные
        this.data.sort((a, b) => {
            const aValue = Array.isArray(a) ? a[columnIndex] : a[column.key || column.name];
            const bValue = Array.isArray(b) ? b[columnIndex] : b[column.key || column.name];

            // Для чисел
            if (!isNaN(aValue) && !isNaN(bValue)) {
                return this.sortState.direction === 'asc' 
                    ? aValue - bValue 
                    : bValue - aValue;
            }

            // Для строк
            return this.sortState.direction === 'asc'
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });

        // Обновляем UI (благодаря реактивности)
        this.render();

        // Обновляем индикаторы сортировки
        const headers = this.tableTitleCont.children;
        for (let i = 0; i < headers.length; i++) {
            headers[i].classList.remove('asc', 'desc');
            if (i === columnIndex) {
                headers[i].classList.add(this.sortState.direction);
            }
        }
    }

    toggleFilterMenu() {
        const isVisible = this.filterMenu.style.display === "block";
        this.filterMenu.style.display = isVisible ? "none" : "block";
        // Закрываем меню видимости, если оно открыто
        if (this.visibilityMenu.style.display === "block") {
            this.visibilityMenu.style.display = "none";
        }
    }

    toggleVisibilityMenu() {
        const isVisible = this.visibilityMenu.style.display === "block";
        this.visibilityMenu.style.display = isVisible ? "none" : "block";
        // Закрываем меню фильтрации, если оно открыто
        if (this.filterMenu.style.display === "block") {
            this.filterMenu.style.display = "none";
        }
    }

    toggleAllFilterColumns() {
        const allChecked = this.filterMenu.querySelector("input[type='checkbox']").checked;
        this.columns.forEach(column => {
            if (allChecked) {
                this.selectedColumns.add(column.name);
            } else {
                this.selectedColumns.delete(column.name);
            }
            if (this.filterCheckboxes[column.name]) {
                this.filterCheckboxes[column.name].checked = allChecked;
            }
        });
        this.filterTable(this.filterInput.value);
    }

    toggleAllVisibility() {
        const allChecked = this.visibilityMenu.querySelector("input[type='checkbox']").checked;
        this.columns.forEach(column => {
            column.hidden = !allChecked;
            if (this.visibilityCheckboxes[column.name]) {
                this.visibilityCheckboxes[column.name].checked = allChecked;
            }
        });
        this.updateVisibleColumns();
    }

    updateVisibleColumns() {
        // Обновляем список видимых колонок
        this.visibleColumns = this.columns.filter(col => !col.hidden);
        // Обновляем стили для сетки
        this.styleColumns = this.visibleColumns.map(col => col.width).join(" ");
        // Обновляем заголовки таблицы
        this.updateHeaders();
        // Обновляем меню фильтрации
        this.updateFilterMenu();
        // Обновляем меню видимости
        this.updateVisibilityMenu();
        // Перерисовываем таблицу
        this.render();
    }
    headerCell( options ) 
    {
        return create("div", {
                parent: this.tableTitleCont,
                text: options.column.name,
                events: {
                    mouseenter: (e) => { e.target.style.filter = "brightness(0.93)"; },
                    mouseleave: (e) => { e.target.style.filter = "";},
                    click: (e) => this.sortByColumn(options.index, options.column)
                },
                style: `
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    user-select: none;
                    position: relative;
                    padding-right: 20px;
                    padding-left: 10px;
                    background: ${options.column.bgColorHeader || this.options.color.bgColorHeader};
                    color: ${options.column.textColorHeader || this.options.color.textColorHeader};
                    transition: background 0.2s;
                    text-align: ${options.column.textAlign || 'left'};
                `,
                css: STYLE__TABLE.headerCell()
            });
    }

    

    updateHeaders() {
        // Очищаем контейнер заголовков
        this.tableTitleCont.innerHTML = "";
        
        // Создаем новые заголовки только для видимых колонок
        this.visibleColumns.forEach((column, index) => {
            const headerCell = this.headerCell({column, index});
        });

        // Обновляем стили контейнера заголовков
        this.tableTitleCont.style.cssText = `
            display: grid;
            grid-template-columns: ${this.styleColumns};
            background-color: #f8f9fa;
            gap: 0px;
            box-sizing: border-box;
            min-height: 40px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        `;
    }

    updateFilterMenu() {
        // Очищаем меню фильтрации
        this.filterMenu.innerHTML = "";
        
        // Добавляем чекбокс "Все колонки" заново
        const allFilterCheckbox = create("div", {
            parent: this.filterMenu,
            style: `
                margin-bottom: 5px;
                padding: 5px;
                cursor: pointer;
            `,
            events: {
                click: () => this.toggleAllFilterColumns()
            }
        });

        create("input", {
            parent: allFilterCheckbox,
            attr: {
                type: "checkbox",
                checked: true
            }
        });

        create("span", {
            parent: allFilterCheckbox,
            text: "Все колонки",
            style: `
                margin-left: 5px;
            `
        });

        // Добавляем чекбоксы только для видимых колонок
        this.filterCheckboxes = {};
        this.visibleColumns.forEach(column => {
            const checkboxContainer = create("div", {
                parent: this.filterMenu,
                style: `
                    margin: 5px 0;
                    padding: 5px;
                    cursor: pointer;
                `
            });

            const checkbox = create("input", {
                parent: checkboxContainer,
                attr: {
                    type: "checkbox",
                    checked: true
                },
                events: {
                    change: (e) => {
                        if (e.target.checked) {
                            this.selectedColumns.add(column.name);
                        } else {
                            this.selectedColumns.delete(column.name);
                        }
                        this.filterTable(this.filterInput.value);
                    }
                }
            });

            create("span", {
                parent: checkboxContainer,
                text: column.name,
                style: `
                    margin-left: 5px;
                `
            });

            this.filterCheckboxes[column.name] = checkbox;
        });

        // Обновляем выбранные колонки
        this.selectedColumns = new Set(this.visibleColumns.map(col => col.name));
    }

    filterTable(filterText) {
        this.displayData.length = 0;
        
        if (!filterText) {
            this.originalData.forEach(item => this.displayData.push(item));
            return;
        }

        this.originalData.forEach(row => {
            let match = false;
            
            if (Array.isArray(row)) {
                // Для массивов проверяем только выбранные колонки
                match = row.some((cell, index) => {
                    const columnName = this.visibleColumns[index].name;
                    return this.selectedColumns.has(columnName) && 
                           String(cell).toLowerCase().includes(filterText.toLowerCase());
                });
            } else {
                // Для объектов проверяем только выбранные колонки
                match = Object.entries(row).some(([key, value]) => {
                    const column = this.visibleColumns.find(col => col.key === key);
                    return column && this.selectedColumns.has(column.name) && 
                           String(value).toLowerCase().includes(filterText.toLowerCase());
                });
            }

            if (match) {
                this.displayData.push(row);
            }
        });
    }

    openSettingsModal() {
        // Модальное окно
        const modal = UI__TABLE.modal();
        const box = UI__TABLE.boxModal({parent: modal});
        // Заголовок
        create("div", {
            parent: box,
            text: "Table Settings",
            style: "font-size: 20px; font-weight: bold; margin-bottom: 18px;"
        });
        // --- Секция пагинации ---
        const pagSection = create("div", {
            parent: box,
            style: "margin-bottom: 24px;"
        });
        create("div", {
            parent: pagSection,
            text: "Pagination:",
            style: "font-weight: bold; margin-bottom: 6px;"
        });
        // Включить/выключить пагинацию
        const pagToggle = create("input", {
            parent: pagSection,
            attr: { type: "checkbox" },
            style: "margin-right: 8px;"
        });
        pagToggle.checked = !!this.settings.pagination.enabled;
        create("span", {
            parent: pagSection,
            text: "Enable pagination"
        });
        // Кол-во строк на странице
        const pageSizeLabel = create("label", {
            parent: pagSection,
            text: "Rows per page:",
            style: "margin-left: 20px; margin-right: 5px;"
        });
        const pageSizeInput = create("input", {
            parent: pagSection,
            attr: { type: "number", min: 1, value: this.settings.pagination.pageSize },
            style: "width: 60px;"
        });
        // --- Задел для других фичей ---
        create("div", {
            parent: box,
            text: "(Здесь появятся другие настройки в будущем)",
            style: "color: #888; font-size: 13px; margin-top: 20px;"
        });
        // --- Кнопки ---
        create("div", {
            parent: box,
            style: "margin-top: 24px; text-align: right;",
            append:[
                create("button", {
                    text: "OK",
                    style: "margin-right: 10px;",
                    events: {
                        click: () => {
                            this.settings.pagination.enabled = pagToggle.checked;
                            this.settings.pagination.pageSize = Math.max(1, parseInt(pageSizeInput.value) || 1);
                            this.settings.pagination.currentPage = 1;
                            document.body.removeChild(modal);
                            this.render();
                        }
                    }
                }),
                create("button", {
                    text: "Cancel",
                    events: {
                        click: () => document.body.removeChild(modal)
                    }
                })
            ]
        });

        document.body.appendChild(modal);
    }
    showColumnsCodeModal() {
        // Формируем JSON-конфиг
        const columnsConfig = this.columns.map(col => {
            const obj = {
                name: col.name,
                key: col.key,
                width: col.width,
                hidden: !!col.hidden
            };
            // Добавляем только те цвета, которые отличаются от общих
            if (col.bgColor && col.bgColor !== this.options.color.bgColor) obj.bgColor = col.bgColor;
            if (col.textColor && col.textColor !== this.options.color.textColor) obj.textColor = col.textColor;
            if (col.bgColorHeader && col.bgColorHeader !== this.options.color.bgColorHeader) obj.bgColorHeader = col.bgColorHeader;
            if (col.textColorHeader && col.textColorHeader !== this.options.color.textColorHeader) obj.textColorHeader = col.textColorHeader;
            // Добавляем новые настройки
            if (col.bold) obj.bold = true;
            if (col.textAlign && col.textAlign !== 'left') obj.textAlign = col.textAlign;
            return obj;
        });
        const code = JSON.stringify(columnsConfig, null, 2);

        // Модальное окно
        const modal = UI__TABLE.modal();
        const box = UI__TABLE.boxModal({parent: modal});
        create("div", {
            parent: box,
            text: "Вставьте этот код в поле columns при создании таблицы:",
            style: "font-size: 15px; margin-bottom: 10px; color: #333;"
        });
        const textarea = create("textarea", {
            parent: box,
            style: `
                width: 100%;
                min-height: 120px;
                font-family: monospace;
                font-size: 14px;
                margin-bottom: 12px;
                resize: vertical;
            `
        });
        textarea.value = code;
        // Кнопка копирования
        const copyBtn = create("button", {
            parent: box,
            text: "Скопировать",
            style: `margin-right: 10px; padding: 4px 12px; font-size: 14px; cursor: pointer;`
        });
        copyBtn.onclick = () => {
            textarea.select();
            document.execCommand('copy');
            copyBtn.textContent = 'Скопировано!';
            setTimeout(() => copyBtn.textContent = 'Скопировать', 1200);
        };
        // Кнопка закрытия
        create("button", {
            parent: box,
            text: "Закрыть",
            style: `padding: 4px 12px; font-size: 14px; cursor: pointer;` ,
            events: {
                click: () => document.body.removeChild(modal)
            }
        });
        document.body.appendChild(modal);
    }

    showOptionsCodeModal() {
        // Формируем JSON-конфиг для options
        const optionsConfig = {
            color: {
                bgColor: this.options.color.bgColor,
                textColor: this.options.color.textColor,
                bgColorHeader: this.options.color.bgColorHeader,
                textColorHeader: this.options.color.textColorHeader
            }
        };
        const code = JSON.stringify(optionsConfig, null, 2);

        // Модальное окно
        const modal = UI__TABLE.modal();
        const box = UI__TABLE.boxModal({parent: modal});
        create("div", {
            parent: box,
            text: "Вставьте этот код в поле options при создании таблицы:",
            style: "font-size: 15px; margin-bottom: 10px; color: #333;"
        });
        const textarea = create("textarea", {
            parent: box,
            style: `
                width: 100%;
                min-height: 120px;
                font-family: monospace;
                font-size: 14px;
                margin-bottom: 12px;
                resize: vertical;
            `
        });
        textarea.value = code;
        // Кнопка копирования
        const copyBtn = create("button", {
            parent: box,
            text: "Скопировать",
            style: `margin-right: 10px; padding: 4px 12px; font-size: 14px; cursor: pointer;`
        });
        copyBtn.onclick = () => {
            textarea.select();
            document.execCommand('copy');
            copyBtn.textContent = 'Скопировано!';
            setTimeout(() => copyBtn.textContent = 'Скопировать', 1200);
        };
        // Кнопка закрытия
        create("button", {
            parent: box,
            text: "Закрыть",
            style: `padding: 4px 12px; font-size: 14px; cursor: pointer;` ,
            events: {
                click: () => document.body.removeChild(modal)
            }
        });
        document.body.appendChild(modal);
    }

    updateVisibilityMenu() {
        // Очищаем меню
        this.visibilityMenu.innerHTML = "";

        // --- Настройки цветов по умолчанию ---
        const defaultColorsSection = create("div", {
            parent: this.visibilityMenu,
            style: `
                margin-bottom: 15px;
                padding: 10px;
                border: 1px dashed #ccc;
                border-radius: 4px;
                background: #f9f9f9;
            `
        });
        create("div", {
            parent: defaultColorsSection,
            text: "Цвета по умолчанию:",
            style: "font-weight: bold; margin-bottom: 8px; font-size: 14px; color: #333;"
        });

        const createColorSetting = (label, optionKey) => {
            const container = create("div", {
                parent: defaultColorsSection,
                style: "display: flex; align-items: center; margin-bottom: 4px; gap: 8px;"
            });
            create("label", {
                parent: container,
                text: label + ":",
                style: "width: 120px; font-size: 13px;"
            });
            const colorInput = create("input", {
                parent: container,
                style: `width: 32px; height: 24px; padding: 0; border: none; background: none; cursor: pointer;` ,
                attr: {
                    type: "color",
                    value: this.options.color?.[optionKey],
                    title: label
                },
                events: {
                    change: (e) => {
                        console.log(e.target.value);
                        console.log(optionKey);
                        console.log(this.options.color);
                        this.options.color[optionKey] = e.target.value;
                        this.updateHeaders();
                        this.render();

                    }
                }
            });
        };

        createColorSetting("Фон ячейки", "bgColor");
        createColorSetting("Текст ячейки", "textColor");
        createColorSetting("Фон заголовка", "bgColorHeader");
        createColorSetting("Текст заголовка", "textColorHeader");

        // Кнопка для показа кода options
        const showOptionsCodeBtn = create("button", {
            parent: defaultColorsSection,
            text: "Код для Options",
            style: `
                display: block;
                margin: 10px 0px 10px auto;
                padding: 4px 12px;
                font-size: 14px;
                cursor: pointer;
                border-radius: 10px;
                background: #4fa0a1;
                color: white;
                border: none;
                font-family: monospace;
            `,
            events: {
                click: () => this.showOptionsCodeModal()
            }
        });
        // --------------------------------------

        // Чекбокс "Все колонки"
        const allVisibleCheckbox = create("div", {
            parent: this.visibilityMenu,
            style: `
                margin-bottom: 5px;
                padding: 5px;
                cursor: pointer;
            `,
            events: {
                click: () => this.toggleAllVisibility()
            }
        });
        const hasHiddenColumns = this.columns.some(col => col.hidden);
        create("input", {
            parent: allVisibleCheckbox,
            attr: {
                type: "checkbox",
                checked: !hasHiddenColumns
            }
        });
        create("span", {
            parent: allVisibleCheckbox,
            text: "Все колонки",
            style: `margin-left: 5px;`
        });
        // Чекбоксы для всех колонок
        this.visibilityCheckboxes = {};
        this.columns.forEach((column, colIndex) => {
            const checkboxContainer = create("div", {
                parent: this.visibilityMenu,
                style: `
                    margin: 5px 0;
                    padding: 5px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                `
            });
            const checkbox = create("input", {
                parent: checkboxContainer,
                attr: {
                    type: "checkbox",
                    checked: false
                },
                events: {
                    change: (e) => {
                        column.hidden = !e.target.checked;
                        this.updateVisibleColumns();
                    }
                }
            });
            checkbox.checked = !column.hidden;
            // name
            const nameInput = create("input", {
                parent: checkboxContainer,
                style: `width: 100px; padding: 2px 5px; font-size: 14px;` ,
                attr: {
                    type: "text",
                    value: column.name,
                    placeholder: "Name"
                },
                events: {
                    change: (e) => {
                        column.name = e.target.value;
                        this.updateVisibleColumns();
                    }
                }
            });
            // key
            const keyInput = create("input", {
                parent: checkboxContainer,
                style: `width: 90px; padding: 2px 5px; font-size: 14px; background: #f7f7f7; color: #888;` ,
                attr: {
                    type: "text",
                    value: column.key || "",
                    placeholder: "key",
                    readonly: true
                }
            });
            // width
            const widthInput = create("input", {
                parent: checkboxContainer,
                style: `width: 60px; padding: 2px 5px;` ,
                attr: {
                    type: "text",
                    value: column.width || "1fr",
                    placeholder: "1fr"
                },
                events: {
                    change: (e) => {
                        const newWidth = e.target.value.trim();
                        if (newWidth) {
                            column.width = newWidth;
                            this.updateVisibleColumns();
                        }
                    }
                }
            });
            // bgColor
            const colorInputStyle = `width: 32px; height: 24px; padding: 0; border: none; background: none;`;
            const bgColorInput = create("input", {
                parent: checkboxContainer,
                style: colorInputStyle,
                attr: {
                    type: "color",
                    value: (!column.bgColor || !/^#[0-9a-fA-F]{6}$/.test(column.bgColor)) ? "#ffffff" : column.bgColor,
                    title: "Цвет фона"
                },
                events: {
                    change: (e) => {
                        column.bgColor = e.target.value;
                        this.updateHeaders();
                        this.render();
                    }
                }
            });
            // textColor
            const textColorInput = create("input", {
                parent: checkboxContainer,
                style: colorInputStyle,
                attr: {
                    type: "color",
                    value: (!column.textColor || !/^#[0-9a-fA-F]{6}$/.test(column.textColor)) ? "#222222" : column.textColor,
                    title: "Цвет текста"
                },
                events: {
                    change: (e) => {
                        column.textColor = e.target.value;
                        this.updateHeaders();
                        this.render();
                    }
                }
            });
            // Добавляем поле для цвета фона заголовка
            const bgColorHeaderInput = create("input", {
                parent: checkboxContainer,
                style: colorInputStyle,
                attr: {
                    type: "color",
                    value: (!column.bgColorHeader || !/^#[0-9a-fA-F]{6}$/.test(column.bgColorHeader)) ? "#f8f9fa" : column.bgColorHeader,
                    title: "Цвет фона заголовка"
                },
                events: {
                    change: (e) => {
                        column.bgColorHeader = e.target.value;
                        this.updateHeaders();
                        this.render();
                    }
                }
            });
            // Добавляем поле для цвета текста заголовка
            const textColorHeaderInput = create("input", {
                parent: checkboxContainer,
                style: colorInputStyle,
                attr: {
                    type: "color",
                    value: (!column.textColorHeader || !/^#[0-9a-fA-F]{6}$/.test(column.textColorHeader)) ? "#222222" : column.textColorHeader,
                    title: "Цвет текста заголовка"
                },
                events: {
                    change: (e) => {
                        column.textColorHeader = e.target.value;
                        this.updateHeaders();
                        this.render();
                    }
                }
            });
            // Добавляем чекбокс для жирного шрифта
            const boldCheckbox = create("input", {
                parent: checkboxContainer,
                style: "width: 16px; height: 16px;",
                attr: {
                    type: "checkbox",
                    checked: false,
                    title: "Жирный шрифт"
                },
                events: {
                    change: (e) => {
                        column.bold = e.target.checked;
                        this.updateHeaders();
                        this.render();
                    }
                }
            });
            // Устанавливаем начальное состояние чекбокса
            boldCheckbox.checked = column.bold || false;

            // Добавляем селект для выравнивания текста
            const textAlignSelect = create("select", {
                parent: checkboxContainer,
                style: "width: 80px; padding: 2px 5px; font-size: 14px;",
                attr: {
                    value: column.textAlign || "left"
                },
                events: {
                    change: (e) => {
                        column.textAlign = e.target.value;
                        this.updateHeaders();
                        this.render();
                    }
                }
            });

            // Добавляем опции для выравнивания
            ["left", "center", "right"].forEach(align => {
                create("option", {
                    parent: textAlignSelect,
                    text: align,
                    attr: {
                        value: align
                    }
                });
            });
            // Устанавливаем начальное значение селекта
            textAlignSelect.value = column.textAlign || "left";

            // Кнопка вверх
            const upBtn = create("button", {
                parent: checkboxContainer,
                text: "▲",
                style: "width: 24px; height: 24px; padding: 0; font-size: 16px; cursor: pointer;",
                events: {
                    click: (e) => {
                        e.stopPropagation();
                        if (colIndex > 0) {
                            const temp = this.columns[colIndex - 1];
                            this.columns[colIndex - 1] = this.columns[colIndex];
                            this.columns[colIndex] = temp;
                            this.updateVisibleColumns();
                        }
                    }
                }
            });
            if (colIndex === 0) upBtn.disabled = true;

            // Кнопка вниз
            const downBtn = create("button", {
                parent: checkboxContainer,
                text: "▼",
                style: "width: 24px; height: 24px; padding: 0; font-size: 16px; cursor: pointer;",
                events: {
                    click: (e) => {
                        e.stopPropagation();
                        if (colIndex < this.columns.length - 1) {
                            const temp = this.columns[colIndex + 1];
                            this.columns[colIndex + 1] = this.columns[colIndex];
                            this.columns[colIndex] = temp;
                            this.updateVisibleColumns();
                        }
                    }
                }
            });
            if (colIndex === this.columns.length - 1) downBtn.disabled = true;

            this.visibilityCheckboxes[column.name] = checkbox;
        });
                    // Кнопка "Показать код"
        const showCodeBtn = create("button", {
            parent: this.visibilityMenu,
            text: "Код для Columns",
            style: `
                display: block;
                margin: 10px 0px 10px auto;
                padding: 4px 12px;
                font-size: 14px;
                cursor: pointer;
                border-radius: 10px;
                background: #4fa0a1;
                color: white;
                border: none;
                font-family: monospace;
            `,
            events: {
                click: () => this.showColumnsCodeModal()
            }
        });
    }
}

class GroupedTable {
    constructor(data, columns, groupField) {
        console.log("Creating GroupedTable with:", { data, columns, groupField });
        this.data = data;
        this.columns = columns;
        this.groupField = groupField;
        this.groups = {};
        
        // Создаем модальное окно
        this.modal = create("div", {
            style: `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            `
        });

        // Создаем контейнер для контента
        this.content = create("div", {
            parent: this.modal,
            style: `
                background: white;
                padding: 20px;
                border-radius: 5px;
                max-width: 90%;
                max-height: 90%;
                overflow: auto;
            `
        });

        // Создаем заголовок
        create("div", {
            parent: this.content,
            text: `Группировка по полю: ${groupField}`,
            style: `
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 20px;
            `
        });

        // Создаем кнопку закрытия
        this.closeButton = create("button", {
            parent: this.content,
            text: "Закрыть",
            style: `
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 5px 10px;
                cursor: pointer;
            `,
            events: {
                click: () => this.close()
            }
        });

        // Группируем данные
        this.groupData();
        
        // Создаем таблицы для каждой группы
        this.createGroupedTables();
    }

    groupData() {
        console.log("Grouping data by field:", this.groupField);
        this.data.forEach(item => {
            const groupValue = item[this.groupField];
            console.log("Item:", item, "Group value:", groupValue);
            if (!this.groups[groupValue]) {
                this.groups[groupValue] = [];
            }
            this.groups[groupValue].push(item);
        });
        console.log("Groups created:", this.groups);
    }

    createGroupedTables() {
        console.log("Creating tables for groups:", this.groups);
        Object.entries(this.groups).forEach(([groupValue, items]) => {
            console.log("Creating table for group:", groupValue, "with items:", items);
            // Создаем заголовок группы
            create("div", {
                parent: this.content,
                text: `${this.getColName(this.groupField)}: ${groupValue} (${items.length} элементов)`,
                style: `
                    font-size: 16px;
                    font-weight: bold;
                    margin: 20px 0 10px 0;
                    padding: 10px;
                    background: #f0f0f0;
                    border-radius: 5px;
                `
            });

            // Создаем реактивный массив для группы
            const groupData = watch([]);
            items.forEach(item => groupData.push(item));

            // Создаем таблицу для группы
            const table = new CreateTable({
                columns: this.columns,
                data: groupData,
                callback: (rowData, index, rowDataObject) => {
                    console.log("Grouped row clicked:", rowData);
                }
            });

            this.content.appendChild(table.container);
        });
    }

    show() {
        console.log("Showing modal");
        document.body.appendChild(this.modal);
    }

    close() {
        console.log("Closing modal");
        document.body.removeChild(this.modal);
    }

    getColName(key) {
        const col = this.columns.find(c => c.key === key);
        return col ? col.name : key;
    }
}