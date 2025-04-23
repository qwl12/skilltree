// Получить курсы
export const getCourses = async () => {
    const res = await fetch('/api/courses');
    if (!res.ok) throw new Error('Ошибка загрузки курсов');
    return res.json();
  };
  
  // Регистрация
  export const registerUser = async (data: { name: string; email: string; password: string }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  };
  