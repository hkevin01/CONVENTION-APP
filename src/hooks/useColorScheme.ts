import { useColorScheme as _useColorScheme } from 'react-native';

export default function useColorScheme(): 'light' | 'dark' {
  const scheme = _useColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}
