import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Follow = ({ userId, following }) => {
  const [isFollowing, setIsFollowing] = useState(following);

  useEffect(() => {
    setIsFollowing(following);
  }, [following]);

  const handleFollow = () => {
    const url = isFollowing ? `http://127.0.0.1:8000/post//${userId}` : `http://127.0.0.1:8000/post/w/${userId}`;
    axios.post(url)
      .then(response => {
          setIsFollowing(!isFollowing);
      })
      .catch(error => {
          console.error("Error following/unfollowing user", error);
      });
  };

  console.log(isFollowing)

  return (
      <button onClick={handleFollow}>
          {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
  );
};

export default Follow;