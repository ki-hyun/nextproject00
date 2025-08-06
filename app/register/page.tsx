"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import Link from "next/link";
import { useActionState } from "react";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
  const [state, dispatch] = useActionState(createAccount, null);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          {/* Header Card */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">N</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">회원가입</h1>
              <p className="text-gray-600 dark:text-gray-300">NextProject에 가입하여 더 많은 기능을 이용해보세요</p>
            </div>

            {/* Registration Form */}
            <form action={dispatch} className="space-y-6">
              <FormInput
                name="username"
                type="text"
                placeholder="사용자명"
                required
                errors={state?.fieldErrors.username}
                minLength={3}
                maxLength={10}
              />
              <FormInput
                name="email"
                type="email"
                placeholder="이메일"
                required
                errors={state?.fieldErrors.email}
              />
              <FormInput
                name="password"
                type="password"
                placeholder="비밀번호"
                required
                errors={state?.fieldErrors.password}
                minLength={PASSWORD_MIN_LENGTH}
              />
              <FormInput
                name="confirm_password"
                type="password"
                placeholder="비밀번호 확인"
                required
                errors={state?.fieldErrors.confirm_password}
                minLength={PASSWORD_MIN_LENGTH}
              />
              
              <FormButton text="회원가입" />
            </form>

            {/* Divider */}
            <div className="mt-6 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/70 dark:bg-gray-800/70 text-gray-500 dark:text-gray-400">또는</span>
                </div>
              </div>
            </div>

            {/* Social Login Placeholder */}
            {/* <div className="space-y-3">
              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 계속하기
              </button>
              
              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub로 계속하기
              </button>
            </div> */}

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                이미 계정이 있으신가요?{' '}
                <Link 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-500 font-medium hover:underline transition-colors"
                >
                  로그인하기
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>
              회원가입을 진행함으로써{' '}
              <a href="#" className="text-blue-600 hover:underline">이용약관</a> 및{' '}
              <a href="#" className="text-blue-600 hover:underline">개인정보처리방침</a>에 동의합니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}