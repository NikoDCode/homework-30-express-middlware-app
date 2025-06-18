export const themeMiddleware = (req, res, next) => {
  // Получаем тему из cookie или используем значение по умолчанию
  const theme = req.cookies.theme || 'light';
  
  // Устанавливаем тему в res.locals для доступа в шаблонах
  res.locals.theme = theme;
  
  // Переопределяем метод render для автоматической передачи темы
  const originalRender = res.render;
  res.render = function(view, options = {}, callback) {
    // Добавляем тему в опции рендеринга
    const renderOptions = {
      ...options,
      theme: theme
    };
    
    // Вызываем оригинальный метод render с обновленными опциями
    return originalRender.call(this, view, renderOptions, callback);
  };
  
  next();
}; 