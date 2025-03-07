// Supabse
import supabase from "@/utils/supabase";

// Hooks
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [isMyPosts, setIsMyPosts] = useState<boolean>(false);

  const [tasks, setTasks] = useState<Tasks[] | undefined | null>([]);

  // const token = useAuthStore((state) => state.token);
  const { token } = useAuthStore();

  /* 프로젝트 생성 */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progressStatus, setProgressStatus] = useState<ProgressStatus>(
    ProgressStatus.BEFORE
  );
  const [progressRate, setProgressRate] = useState<number>(0);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);

  const [usernameList, setUsernameList] = useState<{ username: string }[]>([]);
  const [username, setUsername] = useState("");
  const [selectedUsernames, setSelectedUsernames] = useState<string[]>([]);

  const [loggedInUserId, setLoggedInUserId] = useState<
    string | undefined | null
  >(null);

  const [selectedTask, setSelectedTask] = useState<Tasks | null>(null);

  const [searcValue, setSearchValue] = useState<string>("");

  const resetDialogFields = () => {
    getTasks();
    setOpen(false);
    setTitle("");
    setDescription("");
    setProgressStatus(ProgressStatus.BEFORE);
    setProgressRate(0);
    setMemberCount(0);
    setDeadline(undefined);
  };

  const handleOpenEditDialog = (task: Tasks) => {
    console.log("task", task.member_names);
    setSelectedTask(task);

    setTitle(task.title);
    setDescription(task.description);
    setProgressStatus(task.progress_status as ProgressStatus);
    setUsername(task.member_names[0]);
    setSelectedUsernames(task.member_names);
    setProgressRate(Number(task.progress_rate));
    setMemberCount(task.member_count);
    setDeadline(task.deadline);

    setOpen(true);
  };

  const createTask = async () => {
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
          user_id: userId,

          member_names: selectedUsernames,
        },
      ]);

      if (error) {
        console.log(error);
      }

      if (status === 201) {
        // console.log("생성 완료");
        resetDialogFields();
      }
    }
  };

  const getTasks = async (myPost = false) => {
    const { data: user } = await supabase.auth.getUser();

    setLoggedInUserId(user.user?.id);

    try {
      let query = supabase.from("tasks").select("*");

      if (myPost && user && user.user) {
        query = query.eq("user_id", user.user.id);
      }

      // 검색어가 있는 경우 제목으로 필터링 추가
      if (searcValue) {
        query = query.ilike("title", `%${searcValue}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("게시물 조회 오류:", error);
      } else {
        console.log(myPost ? "나의 게시물:" : "전체 게시물:", data);
        setTasks(data);
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }

    const { data } = await supabase.from("users").select("username");
    setUsernameList(data || []);
  };

  const deleteTask = async (taskId: number, loggedInUserId: string) => {
    try {
      let query = supabase.from("tasks").delete();

      if (loggedInUserId) {
        query = query.match({ id: taskId, user_id: loggedInUserId });
      } else {
        query = query.eq("id", taskId);
      }
      const { status, error } = await query;

      if (error) {
        console.log("게시물 삭제 오류:", error);
      } else {
        console.log("게시물 삭제 완료:", status);
        getTasks();
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  const updateTask = async (tasks: Tasks) => {
    try {
      const { status, error } = await supabase
        .from("tasks")
        .update({
          title: title,
          description: description,
          progress_status: progressStatus,
          member_names: selectedUsernames,
          progress_rate: progressRate,
          member_count: memberCount,
          deadline: deadline,

          updated_at: new Date(),
          // user_id: userId,
        })
        .eq("id", tasks.id);

      if (error) {
        console.log("게시물 수정 오류:", error);
      } else {
        console.log("게시물 수정정 완료:", status);
        resetDialogFields();
      }
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    console.log("1");
    getTasks();
  }, [token]);

  // 검색어가 변경될 때 실행 (디바운싱)
  // 디바운스 : 빠른 입력에 반응하여 불필요한 연속 작업을 방지하고, 입력이 끝난 후 일정 시간이 지나면 작업을 실행하는 프로그래밍 기술(setTimeout을 사용하여 디바운스 처리)
  useEffect(() => {
    const timer = setTimeout(() => {
      getTasks(isMyPosts);
    }, 300);

    return () => clearTimeout(timer);
  }, [searcValue /* isMyPosts */]);

  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          {/* type="search를 생성해야 텍스트 작성시 x 표시 생성" */}
          <Input
            type="search"
            className="rounded-md"
            placeholder="프로젝트 검색"
            value={searcValue}
            onChange={handleSearch}
          />

          <Button
            className={`${
              !isMyPosts
                ? "bg-teal-500 hover:bg-teal-500"
                : "bg-teal-600 hover:bg-teal-600"
            } mr-3 font-bold w-28 h-9`}
            onClick={() => {
              if (token) {
                getTasks(!isMyPosts);
                setIsMyPosts(!isMyPosts);
              } else {
                navigate("/login");
              }
            }}
          >
            {!isMyPosts ? "나의 프로젝트" : "전체 프로젝트"}
          </Button>

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
            createTask={createTask}
            usernameList={usernameList}
            username={username}
            setUsername={setUsername}
            selectedUsernames={selectedUsernames}
            setSelectedUsernames={setSelectedUsernames}
            token={token}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            updateTask={updateTask}
          />
        </div>

        <div>
          {tasks?.map((task: Tasks) => {
            return (
              <DashboardCard
                key={task.id}
                data={task}
                loggedInUserId={loggedInUserId}
                deleteTask={deleteTask}
                handleOpenEditDialog={handleOpenEditDialog}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
