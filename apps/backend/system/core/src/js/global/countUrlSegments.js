export function countUrlSegments(url) {
    // Убираем ведущие и конечные слеши
    url = url.trim().replace(/^\/+|\/+$/g, '');
    
    // Если строка пустая, возвращаем 0
    if (!url) {
        return 0;
    }
    
    // Разбиваем URL на части по слэшу
    const segments = url.split('/');
    
    // Возвращаем количество частей
    return segments.length;
}