import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import SpinWheel from './SpinWheel';

const SpinWheelTrigger: React.FC = () => {
  const { user } = useAuth();
  const [showWheel, setShowWheel] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (hasChecked) return;

    // Show wheel for non-authenticated users
    if (!user) {
      // Clear old sessionStorage key if it exists (for migration)
      if (sessionStorage.getItem('spin_wheel_shown')) {
        sessionStorage.removeItem('spin_wheel_shown');
      }
      
      // Always show for non-authenticated users (once per page load)
      // Check if they've closed it in this session
      const hasClosedWheel = sessionStorage.getItem('spin_wheel_closed');
      
      if (!hasClosedWheel) {
        // Show after a short delay for better UX
        const timer = setTimeout(() => {
          setShowWheel(true);
        }, 2000);

        return () => clearTimeout(timer);
      } else {
        setHasChecked(true);
      }
    } else {
      // For authenticated users, only show if they haven't spun
      const hasSpun = localStorage.getItem(`spin_wheel_${user.id}`);
      if (!hasSpun) {
        const timer = setTimeout(() => {
          setShowWheel(true);
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        setHasChecked(true);
      }
    }
  }, [user, hasChecked]);

  const handleClose = () => {
    setShowWheel(false);
    setHasChecked(true);
    // Mark as closed for non-authenticated users (session-based)
    if (!user) {
      sessionStorage.setItem('spin_wheel_closed', 'true');
    }
  };

  if (!showWheel) return null;

  return <SpinWheel onClose={handleClose} />;
};

export default SpinWheelTrigger;

