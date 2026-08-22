import React from 'react';
import { User } from 'lucide-react';

const UserAvatar = ({ src, name = '', size = 40, style = {} }) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

  if (src && src.trim() !== '') {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid var(--primary-500)',
          flexShrink: 0,
          ...style
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = 'flex';
          }
        }}
      />
    );
  }

  // Neutral default fallback avatar
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        border: '2px solid var(--primary-500)',
        color: 'var(--primary-600)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: `${size * 0.4}px`,
        userSelect: 'none',
        flexShrink: 0,
        ...style
      }}
      title={name}
    >
      {initials || <User size={size * 0.5} />}
    </div>
  );
};

export default UserAvatar;
