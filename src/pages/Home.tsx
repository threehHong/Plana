// Hooks
import { useEffect, useState } from "react";

// Types
import { Tasks } from "@/types";

// Components
import DashboardCard from "@/components/card/DashboardCard";
import DashboardDialog from "@/components/dialog/DashboardDialog";

// Shadcn
import { Input } from "@/components/ui/input";

// Supabse
import supabase from "@/utils/supabase";

export enum ProgressStatus {
  // SELECT = "진행 상태 선택",
  BEFORE = "진행 전",
  IN_PROGRESS = "진행 중",
  COMPLETED = "완료",
}

function Home() {
  const [open, setOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Tasks[] | undefined | null>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progressStatus, setProgressStatus] = useState<ProgressStatus>(
    ProgressStatus.BEFORE
  );

  const [progressRate, setProgressRate] = useState<number>(0);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const onCreate = async () => {
    let memberAvatar = [];

    switch (true) {
      case memberCount >= 3:
        memberAvatar = [
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
          /* "https://randomuser.me/api/portraits/men/1.jpg",
          "https://randomuser.me/api/portraits/women/2.jpg",
          "https://randomuser.me/api/portraits/men/3.jpg", */
        ];
        break;
      case memberCount == 2:
        memberAvatar = [
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
        ];
        break;
      case memberCount == 1:
        memberAvatar = [
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp",
        ];
        break;
      default:
        memberAvatar = [""];
    }

    const { error, status } = await supabase.from("tasks").insert([
      {
        title: title,
        description: description,
        progress_status: progressStatus,
        progress_rate: progressRate,
        member_count: memberCount,
        deadline: deadline,

        created_at: new Date(),
        member_avatar: memberAvatar,
      },
    ]);

    if (error) {
      console.log(error);
    }

    if (status === 201) {
      // console.log("생성 완료");
      getDashboardTasks();
      setOpen(false);
      setTitle("");
      setDescription("");
      setProgressStatus(ProgressStatus.BEFORE);
      setProgressRate(0);
      setMemberCount(0);
      setDeadline(undefined);
    }
  };

  const getDashboardTasks = async () => {
    const { data, error, status } = await supabase.from("tasks").select("*");

    if (error) {
      console.log(error);
    }

    if (status === 200) {
      // console.log("data", data);
      setTasks(data);
    }
  };

  useEffect(() => {
    getDashboardTasks();
  }, []);

  return (
    <div className="w-full h-[93vh] bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          {/* type="search를 생성해야 텍스트 작성시 x 표시 생성" */}
          <Input
            type="search"
            className="rounded-md"
            placeholder="프로젝트 검색"
          />

          <DashboardDialog
            open={open}
            setOpen={setOpen}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            progressStatus={progressStatus}
            setProgressStatus={setProgressStatus}
            progressRate={progressRate}
            setProgressRate={setProgressRate}
            memberCount={memberCount}
            setMemberCount={setMemberCount}
            deadline={deadline}
            setDeadline={setDeadline}
            onCreate={onCreate}
          />
        </div>
        {tasks?.map((task: Tasks) => {
          return <DashboardCard key={task.id} data={task} />;
        })}
      </div>
    </div>
  );
}

export default Home;
