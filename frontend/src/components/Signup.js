import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupComponent = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
    email: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/register/', user, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert('登録成功');
      navigate('/login'); // 登録後にログインページへリダイレクト
    } catch (error) {
      console.error('登録エラー', error);
      alert('登録失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>ユーザー名:</label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>パスワード:</label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>メールアドレス:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
      </div>
      <button type="submit">登録</button>
    </form>
  );
};

export default SignupComponent;
