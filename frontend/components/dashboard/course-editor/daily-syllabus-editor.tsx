"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, BookOpen, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Topic {
  name: string;
  objectives: string;
  resources: string;
}

interface DayPlan {
  day: number;
  title: string;
  topics: Topic[];
  assignment: string;
}

const initialDays: DayPlan[] = [
  {
    day: 1, title: "Day Title",
    topics: [
      { name: "Topic Name", objectives: "Learning objective", resources: "Resource link" },
      { name: "Topic Name", objectives: "Learning objective", resources: "" },
    ],
    assignment: "Assignment description",
  },
  {
    day: 2, title: "Day Title",
    topics: [{ name: "Topic Name", objectives: "Learning objective", resources: "" }],
    assignment: "Assignment description",
  },
  {
    day: 3, title: "Day Title",
    topics: [{ name: "Topic Name", objectives: "", resources: "" }],
    assignment: "",
  },
];

export function DailySyllabusEditor() {
  const [days, setDays] = useState<DayPlan[]>(initialDays);
  const [addDayOpen, setAddDayOpen] = useState(false);
  const [newDayTitle, setNewDayTitle] = useState("");
  const [addTopicDay, setAddTopicDay] = useState<number | null>(null);
  const [newTopicName, setNewTopicName] = useState("");

  const addDay = () => {
    const nextDay = days.length + 1;
    setDays([...days, { day: nextDay, title: newDayTitle || `Day ${nextDay}`, topics: [], assignment: "" }]);
    setNewDayTitle("");
    setAddDayOpen(false);
  };

  const removeDay = (dayNum: number) => {
    setDays(days.filter((d) => d.day !== dayNum).map((d, i) => ({ ...d, day: i + 1 })));
  };

  const addTopicToDay = (dayNum: number) => {
    setDays(days.map((d) =>
      d.day === dayNum
        ? { ...d, topics: [...d.topics, { name: newTopicName || "New Topic", objectives: "", resources: "" }] }
        : d
    ));
    setNewTopicName("");
    setAddTopicDay(null);
  };

  const removeTopic = (dayNum: number, topicIdx: number) => {
    setDays(days.map((d) =>
      d.day === dayNum ? { ...d, topics: d.topics.filter((_, i) => i !== topicIdx) } : d
    ));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">6 — Daily Syllabus Plan</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">DAY-WISE</Badge>
          <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/20">{days.length} days</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
          Define what students learn each day. Day 1 starts from their enrollment start date.
        </p>

        <Accordion defaultValue={[0]} className="space-y-2">
          {days.map((day, idx) => (
            <AccordionItem key={day.day} value={`day-${idx}`} className="border rounded-lg">
              <AccordionTrigger className="px-4 text-sm">
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <Badge variant="outline" className="text-[10px] font-mono">Day {day.day}</Badge>
                  <span className="font-semibold">{day.title}</span>
                  <span className="text-xs text-muted-foreground ml-auto mr-4">
                    {day.topics.length} topics
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                {/* Day Title */}
                <div className="space-y-2">
                  <Label className="text-xs">Day Title</Label>
                  <Input
                    value={day.title}
                    onChange={(e) => setDays(days.map((d) => d.day === day.day ? { ...d, title: e.target.value } : d))}
                    placeholder="e.g. Introduction to React"
                  />
                </div>

                {/* Topics */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> Topics
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => { setAddTopicDay(day.day); setNewTopicName(""); }}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Topic
                    </Button>
                  </div>

                  {day.topics.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-3 text-center border border-dashed rounded-lg">
                      No topics added yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {day.topics.map((topic, ti) => (
                        <div key={ti} className="border rounded-lg p-3 bg-muted/30">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-2">
                              <Input
                                value={topic.name}
                                onChange={(e) => {
                                  const updated = [...days];
                                  const d = updated.find((dd) => dd.day === day.day);
                                  if (d) d.topics[ti].name = e.target.value;
                                  setDays(updated);
                                }}
                                placeholder="Topic name"
                                className="text-sm h-8"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <Input
                                  value={topic.objectives}
                                  onChange={(e) => {
                                    const updated = [...days];
                                    const d = updated.find((dd) => dd.day === day.day);
                                    if (d) d.topics[ti].objectives = e.target.value;
                                    setDays(updated);
                                  }}
                                  placeholder="Learning objectives"
                                  className="text-xs h-7"
                                />
                                <Input
                                  value={topic.resources}
                                  onChange={(e) => {
                                    const updated = [...days];
                                    const d = updated.find((dd) => dd.day === day.day);
                                    if (d) d.topics[ti].resources = e.target.value;
                                    setDays(updated);
                                  }}
                                  placeholder="Resources (optional)"
                                  className="text-xs h-7"
                                />
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeTopic(day.day, ti)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Assignment */}
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-1">
                    <ClipboardList className="h-3.5 w-3.5" /> Assignment
                  </Label>
                  <Input
                    value={day.assignment}
                    onChange={(e) => setDays(days.map((d) => d.day === day.day ? { ...d, assignment: e.target.value } : d))}
                    placeholder="Assignment for this day (optional)"
                  />
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => removeDay(day.day)}>
                    <Trash2 className="h-3 w-3 mr-1" /> Remove Day {day.day}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Button variant="outline" className="mt-3 w-full" onClick={() => setAddDayOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Day {days.length + 1}
        </Button>

        {/* Add Day Dialog */}
        <Dialog open={addDayOpen} onOpenChange={setAddDayOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Day {days.length + 1}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Day Title</Label>
                <Input value={newDayTitle} onChange={(e) => setNewDayTitle(e.target.value)} placeholder="e.g. Variables & Data Types" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setAddDayOpen(false)}>Cancel</Button>
              <Button onClick={addDay}>Add Day</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Topic Dialog */}
        <Dialog open={addTopicDay !== null} onOpenChange={(open) => { if (!open) setAddTopicDay(null); }}>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Topic to Day {addTopicDay}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Topic Name</Label>
                <Input value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} placeholder="e.g. React Components & Props" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setAddTopicDay(null)}>Cancel</Button>
              <Button onClick={() => addTopicDay && addTopicToDay(addTopicDay)}>Add Topic</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
