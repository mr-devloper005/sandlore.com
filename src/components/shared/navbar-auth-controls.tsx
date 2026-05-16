'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, LayoutGrid, LogOut, Plus, User, FileText, Building2, Tag, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth-context'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'

const taskIcons: Record<TaskKey, any> = {
  article: FileText,
  listing: Building2,
  sbm: LayoutGrid,
  classified: Tag,
  image: ImageIcon,
  profile: User,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

export function NavbarAuthControls() {
  const router = useRouter()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="hidden h-10 gap-1 rounded-full bg-[#2FA084] px-4 text-[#EEEEEE] shadow-[0_16px_30px_rgba(47,160,132,0.22)] hover:bg-[#1F6F5F] sm:flex">
            <Plus className="h-4 w-4" />
            Create
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-[#6FCF97] bg-[rgba(255,244,234,0.98)]">
          {SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => {
            const Icon = taskIcons[task.key] || LayoutGrid
            return (
              <DropdownMenuItem key={task.key} asChild>
                <Link href={`/create/${task.key}`}>
                  <Icon className="mr-2 h-4 w-4" />
                  Create {task.label}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-full border border-[#6FCF97] bg-white px-4 text-[#1F6F5F] hover:bg-[#EEEEEE] hover:text-[#2FA084]">
            {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Account'}
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 border-[#6FCF97] bg-[rgba(255,244,234,0.98)]">
          <div className="flex flex-col gap-1 p-3">
            <span className="text-sm font-semibold text-[#2FA084]">{user?.name}</span>
            <span className="text-xs text-[#1F6F5F]">{user?.email}</span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleLogout} className="text-[#2FA084] focus:text-[#2FA084]">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  )
}
