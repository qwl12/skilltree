'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Токен не найден. Повторите запрос на сброс пароля.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return setError('Пароли не совпадают')
    }

    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/auth/reset-password', {
        token,
        password,
      })

      if (res.status === 200) {
        setSuccess('Пароль успешно обновлён. Сейчас вы будете перенаправлены...')
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        setError(res.data.error || 'Ошибка сброса пароля')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка при сбросе пароля')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center">Сброс пароля</h1>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Новый пароль</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Повторите пароль</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Обновление...' : 'Сбросить пароль'}
        </button>
      </form>
    </div>
  )
}
