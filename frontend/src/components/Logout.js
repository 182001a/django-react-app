import React from 'react';
import { useNavigate } from 'react-router-dom';
import { withCookies } from 'react-cookie';

const LogoutComponent = ({ cookies }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 認証トークンを削除し、ユーザーをホームページにリダイレクト
    cookies.remove('authToken');
    navigate('/');
  };

  return (
    <div className="container">
      <div className="auth-form">
        <div className="auth-form__item">
          <label className="auth-form__label">ログアウトしますか？</label>
        </div>
        <button className="btn auth-form__btn" onClick={handleLogout}>ログアウト</button>
      </div>
    </div>
  );
};

export default withCookies(LogoutComponent);