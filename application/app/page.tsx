import NewTaskForm from "@/components/newTaskForm";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { getTags } from "@/lib/data";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { AlarmClockCheck } from "lucide-react";

export default async function Home() {
  const [user, tags] = await Promise.all([
    currentUser(),
    getTags()
  ])

  return (
    <div className="flex flex-col p-4">
      <div className="flex p-2 px-3 justify-between items-center">
        <p>Jambo <span className="bg-gradient-to-r font-semibold bg-clip-text from-blue-600 to-gray-600 text-transparent drop-shadow">{user?.firstName ?? ''}</span></p>
        <UserButton />
      </div>
      <div className="p-2 flex ">
        <Drawer>
          <DrawerTrigger asChild>
            <div className="p-3 px-4 bg-main border border-main flex items-center space-x-1 shadow-md rounded cursor-pointer">
              <p>New Task</p>
              <AlarmClockCheck/>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <NewTaskForm tags={tags} />
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
