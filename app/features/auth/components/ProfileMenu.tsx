import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router';
import { User, Settings, LogOut, Trophy, Crown, Mail } from 'lucide-react';
import { createPortal } from 'react-dom';

export const ProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  if (!user) return null;

  const GOLD_COLOR = "#D4AF37";
  const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=${GOLD_COLOR.replace('#', '')}&color=1a1a1a`;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          padding: '4px',
          borderRadius: '50%',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <img
          src={avatarUrl}
          alt={user.username}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: `2px solid ${GOLD_COLOR}`,
            transition: 'border-color 0.2s',
            boxShadow: `0 0 12px ${GOLD_COLOR}40`
          }}
        />
      </button>

      {isOpen && mounted && createPortal(
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100000,
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)'
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: '60px',
              right: '40px',
              backgroundColor: '#2b2d31',
              border: `1px solid rgba(212, 175, 55, 0.3)`,
              borderRadius: '12px',
              padding: '8px',
              minWidth: '220px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              zIndex: 100001,
              fontFamily: "'JetBrains Mono', monospace"
            }}
          >
            {/* Header с профилем */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              marginBottom: '8px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, transparent 100%)',
              borderRadius: '8px'
            }}>
              <img
                src={avatarUrl}
                alt={user.username}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: `2px solid ${GOLD_COLOR}`,
                  boxShadow: `0 0 16px ${GOLD_COLOR}50`
                }}
              />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{
                  fontSize: '0.8rem',
                  color: '#e0e0e0',
                  fontWeight: 600,
                  marginBottom: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>{user.username}</p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.65rem',
                  color: 'rgba(224,224,224,0.4)'
                }}>
                  <Mail size={11} />
                  <span style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{user.email}</span>
                </div>
              </div>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'rgba(212, 175, 55, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Crown size={14} color={GOLD_COLOR} />
              </div>
            </div>

            {/* Пункты меню */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => { navigate('/profile'); setIsOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid rgba(212, 175, 55, 0.2)`
                }}>
                  <User size={16} color={GOLD_COLOR} />
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'rgba(224,224,224,0.7)',
                  fontWeight: 500,
                  letterSpacing: '0.03em'
                }}>
                  Профиль
                </span>
              </button>

              <button
                onClick={() => { navigate('/profile'); setIsOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid rgba(212, 175, 55, 0.2)`
                }}>
                  <Trophy size={16} color={GOLD_COLOR} />
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'rgba(224,224,224,0.7)',
                  fontWeight: 500,
                  letterSpacing: '0.03em'
                }}>
                  Достижения
                </span>
              </button>

              <button
                onClick={() => { navigate('/settings'); setIsOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid rgba(212, 175, 55, 0.2)`
                }}>
                  <Settings size={16} color={GOLD_COLOR} />
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  color: 'rgba(224,224,224,0.7)',
                  fontWeight: 500,
                  letterSpacing: '0.03em'
                }}>
                  Настройки
                </span>
              </button>
            </div>

            {/* Кнопка выхода */}
            <div style={{
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255,255,255,0.06)'
            }}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                  <LogOut size={16} color="#ef4444" />
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#ef4444',
                  fontWeight: 500,
                  letterSpacing: '0.03em'
                }}>
                  Выйти
                </span>
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};
