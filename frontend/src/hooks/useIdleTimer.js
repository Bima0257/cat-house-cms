import { useState, useEffect, useRef, useCallback } from 'react';

export function useIdleTimer({ timeout, gracePeriod, onExpired }) {
  const lastActivity = useRef(Date.now());
  const onExpiredRef = useRef(onExpired);
  const [showWarning, setShowWarning] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const showWarningRef = useRef(false);

  useEffect(() => {
    onExpiredRef.current = onExpired;
  }, [onExpired]);

  useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  const resetTimer = useCallback(() => {
    lastActivity.current = Date.now();
    setShowWarning(false);
    setRemaining(0);
  }, []);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'click', 'keydown', 'scroll', 'touchstart', 'wheel'];
    const handleActivity = () => {
      lastActivity.current = Date.now();
      if (showWarningRef.current) {
        setShowWarning(false);
        setRemaining(0);
      }
    };
    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, handleActivity));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivity.current;

      if (!showWarningRef.current) {
        if (elapsed >= timeout) {
          setShowWarning(true);
          setRemaining(Math.ceil(gracePeriod / 1000));
        }
      } else {
        const remainingMs = Math.max(0, timeout + gracePeriod - elapsed);
        const remainingSecs = Math.ceil(remainingMs / 1000);
        setRemaining(remainingSecs);
        if (remainingMs <= 0) {
          onExpiredRef.current();
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeout, gracePeriod]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - lastActivity.current;
        if (elapsed >= timeout + gracePeriod) {
          onExpiredRef.current();
        } else if (elapsed >= timeout && !showWarningRef.current) {
          setShowWarning(true);
          setRemaining(Math.ceil((timeout + gracePeriod - elapsed) / 1000));
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [timeout, gracePeriod]);

  return { showWarning, remaining, resetTimer };
}
