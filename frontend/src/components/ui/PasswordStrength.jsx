import { useMemo } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';

const rules = [
  { label: 'Minimal 8 karakter', regex: /.{8,}/ },
  { label: '1 huruf besar (A-Z)', regex: /[A-Z]/ },
  { label: '1 huruf kecil (a-z)', regex: /[a-z]/ },
  { label: '1 angka (0-9)', regex: /\d/ },
  { label: '1 karakter khusus (!@#$%^&*)', regex: /[!@#$%^&*]/ },
];  

const PasswordStrength = ({ password = '' }) => {
  const checks = useMemo(() => rules.map((r) => r.regex.test(password)), [password]);
  const fulfilled = checks.filter(Boolean).length;
  const percent = (fulfilled / rules.length) * 100;

  if (!password) return null;

  const barColor =
    percent === 100 ? 'bg-green-500' :
    percent >= 60 ? 'bg-yellow-500' :
    'bg-red-500';

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs font-medium text-text-muted min-w-[2ch] text-right">
          {fulfilled}/{rules.length}
        </span>
      </div>
      <ul className="space-y-1">
        {rules.map((rule, i) => (
          <li key={i} className="flex items-center gap-1.5 text-xs">
            {checks[i] ? (
              <IconCheck size={14} className="text-green-500 shrink-0" />
            ) : (
              <IconX size={14} className="text-red-400 shrink-0" />
            )}
            <span className={checks[i] ? 'text-green-700' : 'text-text-muted'}>
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrength;
