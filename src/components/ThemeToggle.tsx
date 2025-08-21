'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Switch, Label } from '@/components/ui';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="theme-toggle"
        checked={theme === 'dark'}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
      />
      <Label htmlFor="theme-toggle" className="text-sm">
        Dark mode
      </Label>
    </div>
  );
}
