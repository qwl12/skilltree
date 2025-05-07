import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const VerifyEmailButton = ({ email }: { email: string }) => {
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/send-verification', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Ошибка при отправке письма');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={sendVerification} disabled={loading}>
        {loading ? 'Отправка...' : 'Подтвердить электронную почту'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyEmailButton;
