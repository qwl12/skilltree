'use client';
import { useState } from 'react';

type Props = {
  testId: string;
  onNext: (testId: string) => void;
};

type QuestionType = 'single' | 'multiple' | 'input';

const QuestionForm = ({ testId, onNext }: Props) => {
  const [questionText, setQuestionText] = useState('');
  const [answerOptions, setAnswerOptions] = useState<string[]>(['']); // Для multiple answer
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([false]); // Для правильных ответов
  const [questionType, setQuestionType] = useState<QuestionType>('single'); // Тип вопроса

  const handleAddAnswerOption = () => {
    setAnswerOptions([...answerOptions, '']);
    setCorrectAnswers([...correctAnswers, false]); // Для нового варианта добавляем флаг "неправильный"
  };

  const handleRemoveAnswerOption = (index: number) => {
    const newOptions = answerOptions.filter((_, i) => i !== index);
    const newCorrectAnswers = correctAnswers.filter((_, i) => i !== index);
    setAnswerOptions(newOptions);
    setCorrectAnswers(newCorrectAnswers);
  };

  const handleAnswerOptionChange = (index: number, value: string) => {
    const newOptions = [...answerOptions];
    newOptions[index] = value;
    setAnswerOptions(newOptions);
  };

  const handleCorrectAnswerChange = (index: number) => {
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[index] = !newCorrectAnswers[index]; // Меняем состояние для этой галочки
    setCorrectAnswers(newCorrectAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let formattedAnswers;
    if (questionType === 'single' || questionType === 'multiple') {
      formattedAnswers = answerOptions.map((option, index) => ({
        text: option,
        isCorrect: correctAnswers[index], // Используем значения из массива правильных ответов
      }));
    } else {
      formattedAnswers = [{ text: answerOptions[0], isCorrect: true }];
    }

 const res = await fetch('/api/questions/create', {
    method: 'POST',
    body: JSON.stringify({
      questionText,
      correctAnswer: formattedAnswers,
      testId,
      questionType,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Ошибка при создании вопроса');
      return;
    }

    // Передаем управление на следующий шаг, если необходимо
    onNext(testId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Создание вопроса</h2>

      <input
        type="text"
        placeholder="Вопрос"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <div className="space-x-4 mb-4">
        <label>
          <input
            type="radio"
            name="questionType"
            value="single"
            checked={questionType === 'single'}
            onChange={() => setQuestionType('single')}
          />
          Один правильный ответ
        </label>
        <label>
          <input
            type="radio"
            name="questionType"
            value="multiple"
            checked={questionType === 'multiple'}
            onChange={() => setQuestionType('multiple')}
          />
          Несколько правильных ответов
        </label>
        <label>
          <input
            type="radio"
            name="questionType"
            value="input"
            checked={questionType === 'input'}
            onChange={() => setQuestionType('input')}
          />
          Свободный ответ
        </label>
      </div>

      {questionType === 'single' || questionType === 'multiple' ? (
        <>
          <div className="space-y-2">
            {answerOptions.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Вариант ответа"
                  value={option}
                  onChange={(e) => handleAnswerOptionChange(index, e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <label>
                  <input
                    type="checkbox"
                    checked={correctAnswers[index]}
                    onChange={() => handleCorrectAnswerChange(index)}
                    className="w-5 h-5"
                  />
                  Правильный ответ
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveAnswerOption(index)}
                  className="text-red-500"
                >
                  Удалить
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAnswerOption}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Добавить вариант ответа
            </button>
          </div>
        </>
      ) : (
        <input
          type="text"
          placeholder="Правильный ответ"
          value={answerOptions[0]}
          onChange={(e) => handleAnswerOptionChange(0, e.target.value)}
          className="w-full p-2 border rounded"
        />
      )}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Добавить вопрос
      </button>
    </form>
  );
};

export default QuestionForm;
