// Hooks
import { useState } from "react";

// Types
import { ProgressStatus } from "@/pages/Home";

// Shadcn
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon /* , X */ } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface DashboardDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  progressStatus: ProgressStatus;
  setProgressStatus: (status: ProgressStatus) => void;
  onCreate: () => void;

  progressRate: number;
  setProgressRate: (progressRate: number) => void;
  memberCount: number;
  setMemberCount: (count: number) => void;
  deadline: Date | undefined;
  setDeadline: (date?: Date) => void;
}

function DashboardDialog({
  open,
  setOpen,
  title,
  setTitle,
  description,
  setDescription,
  progressStatus,
  setProgressStatus,
  onCreate,

  progressRate,
  setProgressRate,
  memberCount,
  setMemberCount,
  deadline,
  setDeadline,
}: DashboardDialogProps) {
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger className="w-40 items-center py-2 border border-transparent text-sm font-bold rounded-md shadow-sm text-white bg-emerald-500 hover:bg-emerald-500">
        + 새 프로젝트
      </DialogTrigger>
      {/* <DialogContent className="max-w-fit"> */}
      {/* max-w-7xl mx-auto py-6 px-3 sm:px-6 lg:px-8" */}
      <DialogContent className="sm:max-w-[500px] max-w-[440px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-4">
            새 프로젝트 생성
          </DialogTitle>
        </DialogHeader>
        {/* <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">새 프로젝트 생성</h2>
          <DialogClose asChild>
            <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </div> */}

        <div className="grid gap-6 pb-4">
          <div className="grid gap-2">
            <Label htmlFor="title">프로젝트명</Label>
            <Input
              id="title"
              placeholder="프로젝트 이름을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">프로젝트 설명</Label>
            <Input
              id="description"
              placeholder="프로젝트 설명을 입력하세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">진행 상태</Label>
            <Select value={progressStatus} onValueChange={setProgressStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ProgressStatus.BEFORE}>진행 전</SelectItem>
                <SelectItem value={ProgressStatus.IN_PROGRESS}>
                  진행 중
                </SelectItem>
                <SelectItem value={ProgressStatus.COMPLETED}>완료</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="progressRate">진행률 (%)</Label>
            <Input
              id="progressRate"
              type="number"
              min="0"
              max="100"
              value={progressRate}
              onChange={(e) => setProgressRate(Number(e.target.value))}
              className="w-full"
              placeholder="0"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="memberCount">팀원 수</Label>
            <Input
              id="memberCount"
              type="number"
              min="1"
              value={memberCount}
              onChange={(e) => setMemberCount(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dueDate">마감일</Label>
            {/* <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full"
            /> */}
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full text-left justify-start"
                  id="dueDate" // 버튼에 id 추가
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? (
                    format(deadline, "yyyy-MM-dd")
                  ) : (
                    <span>날자를 선택하세요.</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={(day) => {
                    if (day) setDeadline(day); // undefined 체크 추가
                    setCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="font-normal border border-gray-400 text-gray-400 hover:bg-gray-50 hover:text-gray-500"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="font-normal border-orange-500 text-white hover:text-white bg-emerald-500 hover:bg-emerald-600"
            onClick={onCreate}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DashboardDialog;
