import React from 'react';
import { Link } from 'react-router-dom';
import { withCookies } from 'react-cookie'; // HOC(Higher-Oder Component)

import './style.scss';

const Navbar = ({ cookies }) => { // 末尾の ~ withCookies(Navbar)によりcookiesプロップスを受け取る
  const authToken = cookies.get('authToken');

  return (
    <nav className="nav">
    {authToken ? (
      <ul className="nav__list nav__list--authenticated">
        <li className="nav__item"><Link className="nav__link" to="/logout">ログアウト</Link></li>
      </ul>
    ) : (
      <ul className="nav__list">
        <li className="nav__item"><Link className="nav__link" to="/signup">ユーザー登録</Link></li>
        <li className="nav__item"><Link className="nav__link" to="/login">ログイン</Link></li>
      </ul>
    )}
    </nav>
  );
};

export default withCookies(Navbar);
