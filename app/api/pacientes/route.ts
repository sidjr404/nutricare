import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Usamos a chave secreta (service_role) para ter poderes de admin e não deslogar quem está usando o sistema
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; 

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: Request) {
  try {
    const { nome, email, password } = await request.json();

    // 1. Cria o usuário diretamente no Auth do Supabase (passando o NOME nos metadados)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: { nome: nome } // O nosso Trigger do SQL vai capturar isso!
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}