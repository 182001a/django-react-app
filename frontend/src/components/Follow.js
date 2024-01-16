import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Follow = ({ userId }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // フォロワーの一覧を取得
    axios.get(`http://127.0.0.1:8000/follows/${userId}/list_followers/`)
      .then(response => {
        setFollowers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching followers", error);
        setError(error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading followers!</div>;

  return (
    <div>
      <h2>Followers</h2>
      <ul>
        {followers.map(follower => (
          <li key={follower.id}>{follower.follower.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default Follow;
