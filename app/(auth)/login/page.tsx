"use client";
import { motion } from "framer-motion";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, LoginSchemaType } from "@/lib/schemas";
import { loginAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
    const res = await loginAction(data);
    if (res?.status == "error") {
      setError("root", { message: res.message });
      return router.replace("/login");
    }
    toast.success("Login Successfully!!",{
      richColors: true
    })
    return router.push("/");
  };

  return (
    <HeroGeometric>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full p-8 space-y-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-purple-300">
            IRIS
          </h1>
          <p className="mt-2 text-gray-400">Your AI Financial Analyst</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              {...register("email")}
              placeholder="Your email address"
              className="w-full px-4 py-3 bg-black/30 rounded-lg border border-white/10 
             focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all 
             text-white placeholder-gray-400"
            />
            <p className="text-left mt-2 text-red-500 text-sm">
              {errors.email?.message}
            </p>
          </div>
          <div>
            <input
              type="password"
              {...register("password")}
              placeholder="Enter Password"
              className="w-full px-4 py-3 bg-black/30 rounded-lg border border-white/10 
             focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all 
             text-white placeholder-gray-400"
            />
            <p className="text-left mt-2 text-red-500 text-sm">
             {errors.password?.message}
            </p>
          </div>
          <p className="text-left text-sm font-medium text-red-500">
            {errors.root?.message}
          </p>
          <div>
            <button className="w-full py-3 font-bold text-white bg-gradient-to-r bg-[#15151C] rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/20 focus:ring-purple-500 disabled:opacity-50 transition-all">
              Submit
            </button>
          </div>
        </form>
      </motion.div>
    </HeroGeometric>
  );
}
