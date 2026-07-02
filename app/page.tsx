import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona o usuário automaticamente para a tela de login
  redirect('/login');
}