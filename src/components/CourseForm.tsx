'use client';
import { useEffect, useState } from 'react';

type Props = {
  onNext: (courseId: string) => void;
};

const CourseForm = ({ onNext }: Props) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty: '',
    duration: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  type Tag = {
    id: string;
    name: string;
  };

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
      fetch('/api/tags')
        .then(res => res.json())
        .then((data: Tag[]) => setAvailableTags(data));
    }, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('difficulty', form.difficulty);
    formData.append('duration', form.duration);
    formData.append('tags', JSON.stringify(selectedTags));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await fetch('/api/courses/create', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Ошибка при создании курса:', text);
        return;
      }

      const data = await res.json();
      onNext(data.id);
    } catch (error) {
      console.error('Ошибка сети или сервера:', error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 space-y-6 bg-white p-8 rounded-2xl shadow-lg border"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Создание курса</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Название курса
        </label>
        <input
          name="title"
          placeholder="Название"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring focus:ring-gray-300 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Описание
        </label>
        <textarea
          name="description"
          placeholder="Описание"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm resize-none min-h-[100px] focus:ring focus:ring-gray-300 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Сложность
        </label>
        <input
          name="difficulty"
          placeholder="например: начинающий, средний, эксперт"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring focus:ring-gray-300 focus:outline-none"
        />
      </div>
       <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Количество часов
  </label>
  <input
    type="number"
    name="duration"
    placeholder="Например: 12"
    min="1"
    onChange={handleChange}
    value={form.duration}
    className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring focus:ring-gray-300 focus:outline-none"
    required
  />
</div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Изображение курса
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
            file:rounded-xl file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700
            hover:file:bg-green-100 cursor-pointer"
        />
      </div>
      
     <div>
      <div className="flex items-center justify-between mb-1">
        <p className="font-medium">Теги</p>
        <button
          type="button"
          onClick={() => setSelectedTags([])}
          className="text-sm text-red-500 hover:underline"
        >
          Очистить
        </button>
 

      </div>
      <p className="text-sm text-gray-500 mb-2">
        Выберите до 7 тегов
      </p>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag.name);
          const isDisabled =
            !isSelected && selectedTags.length >= 7;

          return (
            <label
              key={tag.id}
              className={`cursor-pointer px-3 py-1 rounded-full border text-sm font-medium transition 
                ${isSelected
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-green-100 hover:border-green-400'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input
                type="checkbox"
                value={tag.name}
                checked={isSelected}
                disabled={isDisabled}
                onChange={(e) => {
                  const tagValue = e.target.value;
                  setSelectedTags((prev) =>
                    prev.includes(tagValue)
                      ? prev.filter((t) => t !== tagValue)
                      : [...prev, tagValue]
                  );
                }}
                className="hidden"
              />
              #{tag.name}
            </label>
          );
        })}
      </div>
    </div>

      <button
        type="submit"
        className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition duration-200"
      >
        Создать курс
      </button>
    </form>
  );
};

export default CourseForm;
