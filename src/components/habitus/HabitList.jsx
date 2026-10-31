import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import HabitRow from "@/components/habitus/HabitRow";
import { todayStr } from "@/lib/habitus";
import { useAppSettings } from "@/lib/AppSettings";

export default function HabitList({ habits, logs, onCheck, onReorder }) {
  const { t } = useAppSettings();

  const onDragEnd = (res) => {
    if (!res.destination || res.destination.index === res.source.index) return;
    const reordered = Array.from(habits);
    const [moved] = reordered.splice(res.source.index, 1);
    reordered.splice(res.destination.index, 0, moved);
    onReorder(reordered);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="habits">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2.5">
            {habits.map((h, i) => (
              <Draggable key={h.id} draggableId={h.id} index={i}>
                {(prov) => (
                  <div ref={prov.innerRef} {...prov.draggableProps} className="flex items-stretch gap-1">
                    <div
                      {...prov.dragHandleProps}
                      aria-label={t("drag_handle")}
                      className="flex items-center cursor-grab active:cursor-grabbing text-muted-foreground/40 px-1"
                    >
                      <GripVertical size={16} />
                    </div>
                    <div className="flex-1">
                      <HabitRow
                        habit={h}
                        done={logs.some((l) => l.habit_id === h.id && l.completed_date === todayStr())}
                        onCheck={() => onCheck(h)}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}