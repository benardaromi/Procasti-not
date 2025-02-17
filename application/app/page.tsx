import BeginTask from "@/components/beginTask";
import CompleteTask from "@/components/completeTask";
import { HeatMap } from "@/components/heatMap";
import { HourlyActivity } from "@/components/hourlyActivity";
import { NewTask } from "@/components/newTaskForm";
import TaskActions from "@/components/taskActions";
import { TaskBarChart } from "@/components/taskBarChart";
import { TimeSpent } from "@/components/timeSpent";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getAverageTimeSpentOnTasks, getCompletedTaskCount, getPeakProductivityHours, getTasks, getYearOptions } from "@/lib/data";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { differenceInDays, formatDistanceToNowStrict } from "date-fns";

export default async function Home() {
  const [
    user, tasks, 
    completedTaskCount, 
    data,
    years,
    hourlyActivities 
  ] = await Promise.all([
    currentUser(),
    getTasks(),
    getCompletedTaskCount(),
    getAverageTimeSpentOnTasks(),
    getYearOptions(),
    getPeakProductivityHours()
  ])

  return (
    <div className="flex flex-col p-4 w-dvw md:max-w-4xl mx-auto  space-y-6">
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
      <div className="flex min-w-full items-center space-x-2"> 
          <h1 className="font-semibold text-xs">Tasks</h1>
          <div className="bg-blue-500 h-1 w-1 rounded-full drop-shadow-md"></div>
          <p className="text-xs">{tasks?.length}</p>
        <span className="bg-gray-400 w-full h-[0.10rem]" ></span>
      </div>
      <div className="flex flex-col space-y-3">
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
      <div className="flex min-w-full items-center space-x-3"> 
        <div className="h-[0.10rem] bg-gray-400 w-full "></div>
          <h1 className="font-semibold text-xs">Activity</h1>
        <span className="bg-gray-400 w-full h-[0.10rem]" ></span>
      </div>
      <HeatMap />
      <div className="p-2 flex flex-col md:flex-row space-y-3 md:justify-evenly">
        <TimeSpent data={data ? data : 0 } />
        <TaskBarChart years={years ? years : []}/>
      </div>
      <div className="flex min-w-full items-center space-x-3"> 
        <div className="h-[0.10rem] bg-gray-400 w-full "></div>
          <h1 className="font-semibold text-xs">Insights</h1>
        <span className="bg-gray-400 w-full h-[0.10rem]" ></span>
      </div>
      <div className="p-2 flex flex-col md:flex-row space-y-3 md:justify-evenly">
        <HourlyActivity data={hourlyActivities ?? []}/>
      </div>
    </div>
  );
}
