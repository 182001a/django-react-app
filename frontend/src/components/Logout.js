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
    <div>
      <h2>ログアウトしますか？</h2>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
};

export default withCookies(LogoutComponent);