import React, { useEffect, useState } from 'react'
import { withCookies } from 'react-cookie';
import axios from "axios"

import './style.scss';
import { useAppContext } from '../AppContext';
import PostModal from './PostModal';

function Home({ cookies }) {
  const POST_URL = 'http://127.0.0.1:8000/post/'

  const { posts, setPosts } = useAppContext();
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
  }, [setPosts, cookies])

  const handleNewPost = async ({ content, file }) => {
    const authToken = cookies.get('authToken');
    if (authToken) {
      try {
        const formData = new FormData();
        formData.append('content', content);
        if (file) formData.append('file', file);
        await axios.post(POST_URL, formData, {
          headers: { Authorization: `Token ${authToken}`,
          'Content-Type': 'multipart/form-data' }
        });
        setShowModal(false);
      } catch (error) {
        console.log('error');
      }
    }
  };
  
  return (
    <div className="container">
      <button onClick={() => setShowModal(true)}>新しい投稿</button>
      {showModal && (
        <PostModal onClose={() => setShowModal(false)} onSubmit={handleNewPost} />
      )}
      {posts.map(post => (
        <div className="post" key={post.id}>
          <p className="post__username">{post.author.username}</p>
          <p className="post__content">{post.content}</p>
          <p className="post__created-at">{post.created_at}</p>
        </div>
      ))}
    </div>
  );
}

export default withCookies(Home);