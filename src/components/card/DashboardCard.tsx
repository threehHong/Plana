// Hooks
import { useEffect, useState } from "react";

// Shadcn UI
import { Calendar, Users, Edit, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Tasks } from "@/types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

// Images
import default_avatar from "@/assets/images/default_avatar.png";

interface Props {
  data: Tasks;
  loggedInUserId: string | undefined | null;
  deleteTask: (taskId: number, loggedInUserId: string) => void;
  handleOpenEditDialog: (data: Tasks) => void;
}

/* 화살표 함수 표기 방법 */
/* const DashboardCard: React.FC<Props> = ({ data }) => { */
/* 일반 함수 표기 방법 */
function DashboardCard({
  data,
  loggedInUserId,
  deleteTask,
  handleOpenEditDialog,
}: Props) {
  /* const [menuOpen, setMenuOpen] = useState(false); */
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const currentDate = new Date().getDate();

  // console.log("card", data);
  // console.log("loggedInUserId - DashboardCard", loggedInUserId);

  useEffect(() => {
    const timer = setTimeout(
      () => setProgress(Number(data.progress_rate)),
      300
    );
    return () => clearTimeout(timer);
  });
  return (
    <div className="w-full px-6 py-3 mb-5 bg-white overflow-hidden shadow rounded-lg">
      {/* <div className="w-full p-4 bg-white rounded-2xl shadow-lg border relative"> */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-600">{data.title}</h2>

        {/* 
        로그인한 유저 정보와 게시물의 유저 정보가 일치하면 수정 및 삭제 아이콘 표시(그렇지 않을 경우 아무것도 표시되지 않음)
        */}
        {data.user_id == loggedInUserId && (
          <div className="flex gap-2">
            <Edit
              size={17}
              className="cursor-pointer"
              onClick={() => handleOpenEditDialog(data)}
            />
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                {/* <Button variant="destructive">삭제</Button> */}
                <Trash2 size={17} className="text-red-600 cursor-pointer" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    취소
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteTask(data.id, loggedInUserId)}
                  >
                    삭제
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
          <Menu className="w-5 h-5 text-gray-400" />
        </button> */}
      </div>
      <p className="my-3 text-sm text-gray-600">
        {data.progress_status} • 마감일 D-
        {data.deadline ? new Date(data.deadline).getDate() - currentDate : 0}
      </p>
      <p className="text-gray-700 my-4 text-sm">{data.description}</p>

      {/* 멤버 아바타 리스트 */}
      <div className="flex items-center my-4">
        <div className="flex -space-x-2">
          {/* 처음 3명의 이미지만 표시 */}
          {data?.member_names?.length
            ? /* 멤버 이름 표시 */
              data?.member_names.slice(0, 3).map((member, index) => (
                <Avatar key={index} className="w-10 h-10 border-2 border-white">
                  <AvatarImage />
                  <AvatarFallback className="text-[11px]">
                    {member.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ))
            : /* 멤버 아바타 표시 */
              Array.from({ length: data.member_count })
                .slice(0, 3)
                .map((_, index) => (
                  <Avatar
                    key={index}
                    className="w-10 h-10 border-2 border-white"
                  >
                    <AvatarImage src={default_avatar} alt={`member-${index}`} />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                ))}
        </div>

        {data?.member_names?.length
          ? data.member_names.length > 3 && (
              <span className="ml-2 text-sm text-gray-600">
                +{data.member_names.length - 3}명
              </span>
            )
          : data.member_count > 3 && (
              <span className="ml-2 text-sm text-gray-600">
                +{data.member_count - 3}명
              </span>
            )}
      </div>

      {/* 진행률 표시 */}
      <div className="flex items-center mt-3 mb-2 gap-2">
        <Calendar className="w-5 h-5 text-gray-500" />
        <span className="w-[100px] md:text-sm text-[12px]">
          {data.created_at.toString().split("T")[0]}
        </span>
        <div className="mr-2 flex gap-2">
          <Users className="w-5 h-5 text-gray-500" />
          <span className="text-sm">
            {data?.member_names?.length
              ? data.member_names.length
              : data.member_count}
          </span>
        </div>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="w-full">
              <div className="relative w-full">
                <Progress
                  value={progress}
                  className="w-full h-4"
                  indicatorColor="bg-emerald-500"
                />
                <div className="absolute inset-0 flex items-center text-[12px] font-bold justify-center text-black">
                  {data.progress_rate}%
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="font-bold">
              {data.progress_rate}%
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default DashboardCard;
