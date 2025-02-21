// Hooks
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Shadcn UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Components
import { AuthInputs } from "./Login";

// Supabse
import supabase from "@/utils/supabase";
// import type { RegisterInputs } from "./types";

interface RegisterInputs extends AuthInputs {
  username: string;
  passwordConfirm: string;
}

function Register() {
  const navigate = useNavigate();
  const [isSignedUp, setIsSignedUp] = useState(false); // 회원가입 상태 관리
  const [formData, setFormData] = useState<RegisterInputs>({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 에러 메시지 초기화
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 비밀번호 확인 검증
    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        // username을 raw_user_meta_data 안에 저장
        data: {
          username: formData.username,
        },
      },
    });

    if (error) {
      if (error.status == 422) {
        setError("🚨 이미 가입된 이메일입니다");
      }

      if ({ error }.error.message == "Database error saving new user") {
        setError("🚨 이미 등록된 이름입니다");
      }

      console.log("error", { error });
      return;
    }

    if (data) {
      console.log("회원가입 성공", data);

      setIsSignedUp(true);
      // navigate("/login");
      return;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-emerald-500">
            회원가입
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">아이디</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="아이디를 입력하세요"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">이름</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="이름을 입력하세요"
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
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
              <Input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                required
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.passwordConfirm}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-500"
            >
              회원가입
            </Button>
            <div className="text-center text-sm">
              이미 계정이 있으신가요?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline"
              >
                로그인
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isSignedUp && (
        <Dialog open={isSignedUp} onOpenChange={setIsSignedUp}>
          <DialogContent className="w-full max-w-md">
            <DialogTitle className="text-center">회원가입 성공</DialogTitle>
            <p className="text-center">
              이메일을 확인하고 인증 버튼을 클릭하세요.
            </p>
            <Button
              className=" bg-emerald-500 hover:bg-emerald-500"
              onClick={() => navigate("/login")}
            >
              로그인 페이지로 이동
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default Register;
