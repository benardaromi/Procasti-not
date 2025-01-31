import NewTaskForm from "@/components/newTaskForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { getTags, getTasks } from "@/lib/data";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { differenceInDays } from "date-fns";
import { AlarmClockCheck, ClipboardCheck, Pencil, Play } from "lucide-react";

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
        <div className="flex items-center justify-between">
          <div className=" space-x-2 font-semibold text-gray-600 flex items-center">
            <h1>To-dos</h1> 
            <span className="h-1 w-1 rounded-full bg-blue-500"></span>
            <span>{tasks.length}</span>
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
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {tasks.map((task) => {
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
                <CardHeader></CardHeader>
                <CardContent className="flex flex-col space-y-2">
                  <CardTitle className="text-gray-800">{task.name}</CardTitle>
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Pencil />
                      </DialogTrigger>
                      <DialogContent className="w-[380px]">
                        <DialogHeader>
                          <DialogTitle>Edit To-do</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                          Mark to-do as started or completed 
                        </DialogDescription>
                        <div className="flex justify-around">
                          <span className="flex items-center space-x-2 bg-blue-500 p-2 px-3 rounded shadow hover:shadow-lg cursor-pointer transition text-white/65 hover:text-white hover:opacity-95">
                            <h2 className="flex mx-auto items-center">Start task <Play className="size-5 ml-2"/></h2>
                          </span>
                          <span className="flex items-center space-x-2 bg-blue-500 p-2 px-3 rounded shadow hover:shadow-lg cursor-pointer transition text-white/65 hover:text-white hover:opacity-95">
                            <h2 className="flex mx-auto items-center">Complete task <ClipboardCheck className="size-5 ml-2"/></h2>
                          </span>
                        </div>
                      </DialogContent>
                    </Dialog>
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
