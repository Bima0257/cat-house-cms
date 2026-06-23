import { useState, useEffect } from 'react';
import { IconShield } from '@tabler/icons-react';
import { resolveIcon } from '../../lib/iconMap';

const DynamicIcon = ({ name, size = 20, className }) => {
  const [Icon, setIcon] = useState(null);

  useEffect(() => {
    resolveIcon(name).then(setIcon);
  }, [name]);

  if (!Icon) return <IconShield size={size} className={className} />;

  return <Icon size={size} className={className} />;
};

export default DynamicIcon;
