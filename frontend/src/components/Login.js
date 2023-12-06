import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { withCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../AppContext";

const LoginComponent = ({ cookies }) => {
  const navigate = useNavigate();
  const LOGIN_URL = 'http://localhost:8000/login/'
  
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    email: ''
  });


  const [error, setError] = useState(false);

  const { setUser } = useAppContext();

  useEffect(() => {
    // ログイン状態をチェックする
    const authToken = cookies.get('authToken');
    if (authToken) {
      navigate('/');
    }
  }, [navigate, cookies]); // navigateまたはcookiesが変わる度に効果が再実行される

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // フォームのデフォルトの送信動作を防ぐ
    try {
      const response = await axios.post(LOGIN_URL, credentials, {
        headers: { 'Content-Type': 'application/json' }
      });
      cookies.set('authToken', response.data.token);
      console.log(response);
      setUser({ username: credentials.username})
      navigate('/');
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div className="container">
      { error && 
      <div className="message">
        <p className="message__error">ログイン失敗</p>
      </div>
      }
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form__item">
          <label className="auth-form__label">ユーザー名</label>
          <input
            className="auth-form__input"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>
        <div className="auth-form__item">
          <label className="auth-form__label">パスワード</label>
          <input
            className="auth-form__input"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <div className="auth-form__item">
          <label className="auth-form__label">メールアドレス</label>
          <input
            className="auth-form__input"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>
        <button className="btn auth-form__btn" type="submit">ログイン</button>
      </form>
    </div>
  );
};

export default withCookies(LoginComponent);
