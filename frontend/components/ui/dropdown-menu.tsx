import React from "react";

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => <div className="relative inline-block text-left">{children}</div>;
export const DropdownMenuTrigger = ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => <div className="inline-block cursor-pointer">{children}</div>;
export const DropdownMenuContent = ({ children, align }: { children: React.ReactNode, align?: string }) => <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 p-1">{children}</div>;
export const DropdownMenuItem = ({ children, className }: { children: React.ReactNode, className?: string }) => <div className={`text-gray-700 block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${className || ""}`}>{children}</div>;
export const DropdownMenuCheckboxItem = ({ children, checked, onCheckedChange, className }: { children: React.ReactNode, checked?: boolean, onCheckedChange?: (c: boolean) => void, className?: string }) => (
  <div className={`flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${className || ""}`} onClick={() => onCheckedChange?.(!checked)}>
    <input type="checkbox" checked={checked} readOnly className="mr-2" />
    {children}
  </div>
);
export const DropdownMenuLabel = ({ children }: { children: React.ReactNode }) => <div className="px-4 py-2 text-sm font-semibold text-gray-900">{children}</div>;
export const DropdownMenuSeparator = () => <div className="h-px bg-gray-200 my-1"></div>;
