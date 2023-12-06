import React, { useState } from 'react';

function PostModal({ onClose, onSubmit }) {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ content, file });
  };

  return (
    <div className="modal">
      <button onClick={onClose}>閉じる</button>
      <form onSubmit={handleSubmit}>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">投稿</button>
      </form>
    </div>
  );
}

export default PostModal;