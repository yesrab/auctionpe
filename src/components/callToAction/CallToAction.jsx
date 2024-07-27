"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useContext, useEffect, useState } from "react";
import Session from "@/app/context/sessionContext";
export function CallToAction() {
  const { isActive, dispatch } = useContext(Session);
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [toggle, setToggle] = useState(false);
  useEffect(() => {
    if (!isActive) {
      setIsOpen(false);
    }
  }, [isActive]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={!isActive} variant='outline'>
          Call To Action
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Actions</DialogTitle>
          <DialogDescription>Make changes here as long as your Session is active</DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex items-center gap-4'>
            <Label className='text-right'>Sample Toggle :</Label>
            <ToggleGroup
              defaultValue={toggle.toString()}
              onValueChange={(value) => setToggle(value === "true" ? true : false)}
              value={toggle.toString()}
              type='single'
            >
              <ToggleGroupItem value='true'>True</ToggleGroupItem>
              <ToggleGroupItem value='false'>false</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className='flex flex-col gap-3'>
            <Label>Sample Counter :</Label>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Button
                className='flex items-center justify-center'
                onClick={() => setCount(count + 1)}
              >
                +
              </Button>
              <span className='border rounded-md flex items-center justify-center h-full'>
                {count}
              </span>
              <Button
                className='flex items-center justify-center'
                onClick={() => setCount(count - 1)}
              >
                -
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
