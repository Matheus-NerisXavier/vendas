import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Função para validar se a URL é válida e não o placeholder
const isValidUrl = (url) => {
  try {
    return url && url.startsWith('http') && !url.includes('seu_projeto_url_aqui');
  } catch (e) {
    return false;
  }
}

const clientUrl = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder-url.supabase.co';
const clientKey = (supabaseAnonKey && supabaseAnonKey !== 'sua_chave_anon_aqui') ? supabaseAnonKey : 'placeholder';

export const supabase = createClient(clientUrl, clientKey);
