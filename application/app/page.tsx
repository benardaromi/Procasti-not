import NewTaskForm from "@/components/newTaskForm";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { getTags, getTasks } from "@/lib/data";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { differenceInDays } from "date-fns";
import { AlarmClockCheck } from "lucide-react";

export default async function Home() {
  const [user, tags, tasks] = await Promise.all([
    currentUser(),
    getTags(),
    getTasks()
  ])

  return (
    <div className="flex flex-col p-4 w-dvw md:max-w-4xl mx-auto bg-slate-50 space-y-3">
      <div className="flex p-2 px-3 justify-between items-center">
        <p>Jambo <span className="bg-gradient-to-r font-semibold bg-clip-text from-blue-600 to-gray-600 text-transparent drop-shadow">{user?.firstName ?? ''}</span></p>
        <UserButton />
      </div>
      <div className="p-2 flex ">
        <Drawer>
          <DrawerTrigger asChild>
            <div className="p-3 px-4 bg-mild border border-mild flex items-center space-x-1 shadow-md rounded cursor-pointer">
              <p>New Task</p>
              <AlarmClockCheck/>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Create</DrawerTitle>
            </DrawerHeader>
            <NewTaskForm tags={tags} />
          </DrawerContent>
        </Drawer>
      </div>
      <div className="h-[0.10rem] bg-slate-200 shadow"></div>
      <div className="flex flex-col space-y-3">
        <h1 className="font-semibold text-gray-600">To-dos</h1>
        <div className="grid grid-flow-col grid-cols-3 md:grid-cols-4 gap-2">
          {tasks.map((task) => {
            const now = new Date()
            const dueDate = task.dueDate ? new Date(task.dueDate) : null
            const daysLeft = dueDate ? differenceInDays(dueDate, now) : null

            return (
              <Card key={task.id} 
                className={`
                  ${daysLeft !== null && daysLeft <= 1 ? 'bg-red-500' :
                  daysLeft !== null && daysLeft > 1 && daysLeft < 5 ? 'bg-orange-400' :
                  'bg-green-600'}
                `}
              >
                <CardHeader></CardHeader>
                <CardContent>
                  {task.name}
                </CardContent>
                <CardFooter>
                  <CardDescription>
                    {dueDate ? (
                      `due in ${daysLeft} ${daysLeft && daysLeft > 1 ? 'days' : 'day'}`
                    ) : (
                      'No due date'
                    )}
                  </CardDescription>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}
