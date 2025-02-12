import { useEffect, useState } from "react";
import { Menu, Calendar, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Tasks } from "@/types";

interface Props {
  data: Tasks;
}

/* 화살표 함수 표기 방법 */
/* const DashboardCard: React.FC<Props> = ({ data }) => { */
/* 일반 함수 표기 방법 */
function DashboardCard({ data }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentDate = new Date().getDate();

  useEffect(() => {
    const timer = setTimeout(
      () => setProgress(Number(data.progress_rate)),
      300
    );
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="w-full px-6 py-3 mb-5 bg-white overflow-hidden shadow rounded-lg">
      {/* <div className="w-full p-4 bg-white rounded-2xl shadow-lg border relative"> */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-600">{data.title}</h2>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <p className="my-3 text-sm text-gray-600">
        {data.progress_status} • 마감일 D-
        {data.deadline ? data.deadline.split("-")[2] - currentDate : 0}
      </p>
      <p className="text-gray-700 my-4 text-sm">{data.description}</p>

      {/* 멤버 아바타 리스트 */}
      <div className="flex items-center my-4">
        <div className="flex -space-x-2">
          {/* 처음 3명의 이미지만 표시 */}
          {data.member_avatar.slice(0, 3).map((member, index) => (
            <Avatar key={index} className="w-8 h-8 border-2 border-white">
              <AvatarImage src={member} alt={`member-${index}`} />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          ))}
        </div>
        {/* {data.members.length > 3 && (
          <span className="ml-2 text-sm text-gray-600">
            +{data.members.length - 3}명
          </span>
        )} */}
        {data.member_count > 3 && (
          <span className="ml-2 text-sm text-gray-600">
            +{data.member_count - 3}명
          </span>
        )}
      </div>

      {/* 진행률 표시 */}
      <div className="flex items-center mt-3 mb-2 gap-2">
        <Calendar className="w-5 h-5 text-gray-500" />
        <span className="w-[100px] text-sm">
          {data.created_at.toString().split("T")[0]}
        </span>
        <div className="mr-2 flex gap-2">
          <Users className="w-5 h-5 text-gray-500" />
          <span className="text-sm">{data.member_count}</span>
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
