import { useEffect, useState } from 'react';

function EffectFriendStatus(props) {

  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    handleStatusChange({ isOnline: true });
  }, []);

  if (isOnline === null) {
    return 'isLoading...';
  }

  return isOnline ? 'Online' : 'Offline';
}

export default EffectFriendStatus;
