import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupComponent = () => {
  const navigate = useNavigate();
  const REGISTER_URL = 'http://127.0.0.1:8000/register/'

  const [user, setUser] = useState({
    username: '',
    password: '',
    email: ''
  });

  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(REGISTER_URL, user, {
        headers: { 'Content-Type': 'application/json' }
      });
      navigate('/login'); // 登録後にログインページへリダイレクト
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="container">
      {error && 
      <div className="message">
        <p className="message__error">登録失敗</p>
      </div>
      }
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form__item">
          <label className="auth-form__label">ユーザー名</label>
          <input
            className="auth-form__input"
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
          />
        </div>
        <div className="auth-form__item">
          <label className="auth-form__label">パスワード</label>
          <input
            className="auth-form__input"
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </div>
        <div className="auth-form__item">
          <label className="auth-form__label">メールアドレス</label>
          <input
          className="auth-form__input"
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <button className="btn auth-form__btn" type="submit">登録</button>
      </form>
    </div>
  );
};

export default SignupComponent;
