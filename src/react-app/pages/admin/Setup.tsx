import React from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { Rocket, Lock, Loader2, AlertCircle, User } from "lucide-react";

const Setup: React.FC = () => {
  const actionData = useActionData() as { error?: string } | undefined;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 text-white mb-6 shadow-lg">
              <Rocket className="size-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome to Luna Tech
            </h1>
            <p className="text-slate-400 text-sm">
              System Initialization & Admin Creation
            </p>
          </div>

          {actionData?.error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm animate-shake">
              <AlertCircle className="size-4 shrink-0" />
              <span>{actionData.error}</span>
            </div>
          )}

          <Form method="post" className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                Admin User
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <User className="size-5" />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  placeholder="admin@lunatech.it"
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock className="size-5" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock className="size-5" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 mt-4 flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin size-5" /> Creating...
                </>
              ) : (
                "Create Admin Account"
              )}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Setup;
