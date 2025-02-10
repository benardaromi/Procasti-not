import BeginTask from "@/components/beginTask";
import CompleteTask from "@/components/completeTask";
import { NewTask } from "@/components/newTaskForm";
import TaskActions from "@/components/taskActions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getCompletedTaskCount, getTasks } from "@/lib/data";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { differenceInDays, formatDistanceToNowStrict } from "date-fns";

export default async function Home() {
  const [user, tasks, completedTaskCount ] = await Promise.all([
    currentUser(),
    getTasks(),
    getCompletedTaskCount()
  ])

  return (
    <div className="flex flex-col p-4 w-dvw md:max-w-4xl mx-auto bg-slate-50 space-y-3">
      <div className="flex p-2 px-3 justify-between items-center">
        <p>Jambo <span className="bg-gradient-to-r font-semibold bg-clip-text from-blue-600 to-gray-600 text-transparent drop-shadow">{user?.firstName ?? ''}</span></p>
        <UserButton />
      </div>
      <div className="p-2 flex space-x-2 items-center">
        <NewTask />
        <Card className="p-2 flex items-center space-x-2">
          <CardTitle className="text-gray-800">Completed Tasks</CardTitle>
          <span className="h-1 w-1 rounded-full bg-blue-500"></span>
          <CardTitle className="text-gray-800">{completedTaskCount}</CardTitle>
        </Card>
      </div>
      <div className="h-[0.10rem] bg-slate-200 shadow"></div>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className=" space-x-2 font-semibold text-gray-600 flex items-center">
            <h1>To-dos</h1> 
            <span className="h-1 w-1 rounded-full bg-blue-500"></span>
            <span>{tasks!.length}</span>
          </div>
          <div className="flex space-x-2 items-center">
            <h2 className="text-center">Priority </h2>
            <div className="bg-blue-500 h-1 w-1 rounded-full drop-shadow-md"></div>
            <div className="flex items-center text-xs space-x-1">
              <span>low</span>
              <div className="h-2 w-20 rounded grid grid-cols-3">
                <div className="bg-blue-500 rounded"></div>
                <div className="bg-orange-500 rounded"></div>
                <div className="bg-rose-500 rounded"></div>
              </div>
              <span>high</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tasks!.map((task) => {
            const now = new Date()
            const dueDate = task.dueDate ? new Date(task.dueDate) : null
            const daysLeft = dueDate ? differenceInDays(dueDate, now) : null

            return (
              <Card key={task.id} 
                className={`
                  ${ daysLeft !== null && daysLeft < 1 ? 'bg-gray-500':
                  daysLeft !== null && daysLeft == 1 ? 'bg-rose-500' :
                  daysLeft !== null && daysLeft > 1 && daysLeft < 5 ? 'bg-orange-500' :
                  'bg-blue-500'}
                `}
              >
                <CardHeader>
                  <CardDescription className="flex items-center text-white text-xs justify-between">
                    {task.startedAt ? `Started ${formatDistanceToNowStrict(task.startedAt)} ago` : `Queued`}
                    <TaskActions taskID={task.id} />
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col space-y-2">
                  <CardTitle className="text-gray-800">{task.name}</CardTitle>
                  <div className="flex space-x-3">
                    <BeginTask taskID={task.id} />
                    <CompleteTask taskID={task.id} />
                  </div>
                </CardContent>
                <CardFooter>
                  <CardDescription className="text-white/75">
                    {dueDate && daysLeft !== null && daysLeft > 0.1 ? (
                      `Due in ${daysLeft} ${daysLeft && daysLeft > 1 ? 'days' : 'day'}`
                    ) : (
                      'Overdue'
                    )}
                  </CardDescription>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
      <div className="h-[0.10rem] bg-slate-200 shadow"></div>
    </div>
  );
}
