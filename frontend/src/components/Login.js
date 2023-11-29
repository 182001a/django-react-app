import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { withCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const LoginComponent = ({ cookies }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    email: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    // ログイン状態をチェックする
    const authToken = cookies.get('authToken');
    if (authToken) {
      navigate('/'); // ログイン済みの場合はホームページにリダイレクト
    }
  }, [navigate, cookies]); // navigateまたはcookiesが変わる度に効果が再実行される

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // フォームのデフォルトの送信動作を防ぐ
    try {
      const response = await axios.post('http://127.0.0.1:8000/login/', credentials, {
        headers: { 'Content-Type': 'application/json' }
      });
      cookies.set('authToken', response.data.token); // Cookieに認証トークンを保存
      alert('ログイン成功');
      navigate('/'); // ログイン成功後にホームページにリダイレクト
    } catch (error) {
      console.error('ログインエラー', error);
      alert('ログイン失敗');
    }
  };

  return (
    <div className="container">
      <form className="login" onSubmit={handleSubmit}>
        <div className="login__item">
          <label className="login__label">ユーザー名</label>
          <input
            className="login__input"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>
        <div className="login__item">
          <label className="login__label">パスワード</label>
          <input
            className="login__input"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <div className="login__item">
          <label className="login__label">メール</label>
          <input
            className="login__input"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>
        <button className="btn login__btn" type="submit">ログイン</button>
      </form>
    </div>
  );
};

export default withCookies(LoginComponent);
