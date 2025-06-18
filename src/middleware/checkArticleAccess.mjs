export const checkArticleAccess = (req, res, next) => {
  // Разрешаем GET-запросы без проверки
  if (req.method === 'GET') {
    return next();
  }

  // Проверяем роль пользователя для других методов
  const userRole = req.headers['x-user-role'];
  
  if (!userRole || userRole !== 'admin') {
    return res.status(403).json({ 
      error: 'Доступ запрещен. Требуются права администратора.' 
    });
  }

  next();
}; 