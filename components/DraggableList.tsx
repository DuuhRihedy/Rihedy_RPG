"use client";

import { useState, useRef, useCallback } from "react";

interface DraggableItem {
  id: string;
  [key: string]: unknown;
}

interface DraggableListProps<T extends DraggableItem> {
  items: T[];
  onReorder: (reordered: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function DraggableList<T extends DraggableItem>({
  items,
  onReorder,
  renderItem,
  className,
}: DraggableListProps<T>) {
  const [orderedItems, setOrderedItems] = useState(items);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragRef = useRef<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    dragRef.current = index;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Required for Firefox
    e.dataTransfer.setData("text/plain", String(index));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = dragRef.current;
    if (dragIndex === null || dragIndex === dropIndex) return;

    const newItems = [...orderedItems];
    const [removed] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, removed);
    setOrderedItems(newItems);
    onReorder(newItems);
    setDraggedIndex(null);
    setOverIndex(null);
    dragRef.current = null;
  }, [orderedItems, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setOverIndex(null);
    dragRef.current = null;
  }, []);

  // Sync if parent changes items
  if (items.length !== orderedItems.length || items.some((item, i) => item.id !== orderedItems[i]?.id)) {
    setOrderedItems(items);
  }

  return (
    <div className={`draggable-list ${className || ""}`}>
      {orderedItems.map((item, index) => (
        <div
          key={item.id}
          className={`draggable-item ${draggedIndex === index ? "dragging" : ""} ${overIndex === index ? "drag-over" : ""}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
        >
          <span className="drag-handle" title="Arrastar para reordenar">⠿</span>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
