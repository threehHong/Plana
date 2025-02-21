// Supabse
import supabase from "@/utils/supabase";

// Hooks
import { useEffect, useState } from "react";

// Types
import { Tasks } from "@/types";

// Shadcn UI
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Components
import DashboardCard from "@/components/card/DashboardCard";
import DashboardDialog from "@/components/dialog/DashboardDialog";

// Store
import { useAuthStore } from "@/store/authStore";

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

  // const token = useAuthStore((state) => state.token);
  const { token } = useAuthStore();
  const [isMyPosts, setIsMyPosts] = useState<boolean>(true);

  const [usernameList, setUsernameList] = useState<{ username: string }[]>([]);
  const [username, setUsername] = useState("");
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);

  const onCreate = async () => {
    let memberAvatar: string[] = [];

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

    const user = await supabase.auth.getUser();

    if (user.data.user) {
      insertData(user.data.user.id);
    } else {
      insertData();
    }

    async function insertData(userId: string | null = null) {
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
          user_id: userId,

          member_names: selectedUsernames,
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
    }
  };

  const getDashboardTasks = async (myPost = false) => {
    // const user = supabase.auth.getUser();
    const { data: user } = await supabase.auth.getUser();

    // console.log("user", user);

    try {
      let query = supabase.from("tasks").select("*");

      if (myPost && user && user.user) {
        query = query.eq("user_id", user.user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("게시물 조회 오류:", error);
      } else {
        console.log(myPost ? "나의 게시물:" : "전체 게시물:", data);
        setTasks(data);
      }
    } catch (err) {
      console.error("오류 발생:", err);
    }

    const { data } = await supabase.from("users").select("username");
    setUsernameList(data || []);
  };

  useEffect(() => {
    getDashboardTasks();
  }, [token]);

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

          {token && (
            <Button
              className={`${
                isMyPosts
                  ? "bg-teal-500 hover:bg-teal-500"
                  : "bg-teal-600 hover:bg-teal-600"
              } mr-3 font-bold`}
              onClick={() => {
                getDashboardTasks(isMyPosts);
                setIsMyPosts(!isMyPosts);
              }}
            >
              {isMyPosts ? "나의 프로젝트" : "전체 프로젝트"}
            </Button>
          )}

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
            usernameList={usernameList}
            username={username}
            setUsername={setUsername}
            selectedUsernames={selectedUsernames}
            setSelectedUsernames={setSelectedUsernames}
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
