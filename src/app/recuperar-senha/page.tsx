'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white shadow-md mb-4">
            <Sparkles className="w-7 h-7" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Agenda<span className="text-brand-600">Max</span>
          </h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
          {!sent ? (
            <>
              <h2 className="text-lg font-extrabold text-slate-900 mb-1">Recuperar Senha</h2>
              <p className="text-xs text-slate-500 font-medium mb-6">
                Informe o seu e-mail cadastrado e enviaremos o link para redefinição.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">E-mail corporativo</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@empresa.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-extrabold shadow-md transition-all"
                >
                  Enviar Instruções
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">E-mail Enviado!</h3>
              <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                Enviamos o link de redefinição de senha para <strong className="text-slate-800">{email}</strong>.
              </p>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para o Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
