import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ChannelList() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/channels');
        setChannels(response.data);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };

    fetchChannels();
  }, []);

  return (
    <div>
      <h2>Channels</h2>
      <ul>
        {channels.map(channel => (
          <li key={channel.id}>{channel.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ChannelList;