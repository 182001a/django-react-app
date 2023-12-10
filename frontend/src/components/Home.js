import React, { useEffect, useState } from 'react'
import { withCookies } from 'react-cookie';
import axios from "axios"

import './style.scss';
import { useAppContext } from '../AppContext';
import PostModal from './PostModal';

function Home({ cookies }) {
  const POST_URL = 'http://127.0.0.1:8000/post/'
  const LIKES_URL = 'http://127.0.0.1:8000/like/';

  const { user, posts, setPosts, likedPosts, setLikedPosts } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const authToken = cookies.get('authToken');
      if (authToken) {
        try {
          const response = await axios.get(POST_URL, {
            headers: { Authorization: `Token ${authToken}` }
          });
          setPosts(response.data);
        } catch (error) {
          console.log('error');
        }
      }
    }
    fetchPosts();

    // いいねした投稿を取得
    const fetchLikedPosts = async () => {
      const authToken = cookies.get('authToken');
      if (authToken) {
        try {
          const response = await axios.get(LIKES_URL, {
            headers: { Authorization: `Token ${authToken}` }
          });
          setLikedPosts(response.data);
        } catch (error) {
          console.error('Error fetching liked posts:', error);
        }
      }
    };
    fetchLikedPosts();
  }, [user, setPosts, setLikedPosts, cookies])

  const handleNewPost = async ({ content, file }) => {
    const authToken = cookies.get('authToken');
    if (authToken) {
      try {
        const formData = new FormData();
        formData.append('content', content);
        if (file) formData.append('file', file);
  
        const response = await axios.post(POST_URL, formData, {
          headers: {
            Authorization: `Token ${authToken}`,
            'Content-Type': 'multipart/form-data'
          }
        });
  
        // 新しい投稿をステートに追加
        if (response.data && response.status === 201) { // 201は作成成功のステータスコード
          setPosts(prevPosts => [response.data, ...prevPosts]);
        }
  
        setShowModal(false);
      } catch (error) {
        console.log('error');
      }
    }
  };

  console.log(posts)
  
  return (
    <div className="container">
      
      <div className="posts-container">
        <button className="btn" onClick={() => setShowModal(true)}>新しい投稿</button>
        {showModal && (
          <PostModal onClose={() => setShowModal(false)} onSubmit={handleNewPost} />
        )}
        <ul className="posts">
        {posts.map(post => (
          <li key={post.id}>
            <p className="post__username">{post.author.username}</p>
            <p className="post__content">{post.content}</p>
            {post.file && <img src={post.file} alt="Post" className="post__image" />}
            <p className="post__created-at">{post.created_at}</p>
          </li>
        ))}
        </ul>
      </div>

      <div className="posts-like-container">
        <div className="like">
          <p className="like__title">いいねした投稿</p>
          <ul className="like__list">
            {likedPosts.map((like) => (
              <React.Fragment key={like.id}>
                <li className="like__content">{like.post_detail.content}</li>
                <li className="like__file">{like.post_detail.file}</li>
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}

export default withCookies(Home);