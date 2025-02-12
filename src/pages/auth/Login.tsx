import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import type { AuthInputs } from "./types";

export interface AuthInputs {
  username: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AuthInputs>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 로그인 로직 구현
    console.log("Login attempt:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle
            className="text-2xl text-center text-emerald-500 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            Plana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="아이디를 입력하세요"
                value={formData.username}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-500"
            >
              로그인
            </Button>
            <div className="text-center text-sm">
              계정이 없으신가요?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:underline"
              >
                회원가입
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
